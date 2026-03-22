'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function StarField() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ── Background: dark charcoal radial gradient ─────────────────────
    const bgGeo = new THREE.PlaneGeometry(2, 2)
    const bgMat = new THREE.ShaderMaterial({
      depthWrite: false,
      uniforms: {},
      vertexShader: `void main(){ gl_Position = vec4(position, 1.0); }`,
      fragmentShader: `
        void main(){
          vec2 uv = gl_FragCoord.xy / vec2(${window.innerWidth}.0, ${window.innerHeight}.0);
          vec2 c = uv - 0.5;
          float d = length(c) * 1.6;
          // Centre: #1c1c1c → edges: #080808
          vec3 center = vec3(0.11, 0.11, 0.11);
          vec3 edge   = vec3(0.03, 0.03, 0.03);
          vec3 col = mix(center, edge, clamp(d, 0.0, 1.0));
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    })
    const bgMesh = new THREE.Mesh(bgGeo, bgMat)
    bgMesh.renderOrder = -1
    scene.add(bgMesh)

    // ── Dense white/grey stars ────────────────────────────────────────
    const STAR_COUNT = 3000
    const starGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(STAR_COUNT * 3)
    const alphas    = new Float32Array(STAR_COUNT)
    const sizes     = new Float32Array(STAR_COUNT)
    const phases    = new Float32Array(STAR_COUNT)
    const speeds    = new Float32Array(STAR_COUNT)

    for (let i = 0; i < STAR_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 300
      positions[i * 3 + 1] = (Math.random() - 0.5) * 300
      positions[i * 3 + 2] = (Math.random() - 0.5) * 300
      alphas[i]  = Math.random() * 0.7 + 0.15
      sizes[i]   = Math.random() * 1.8 + 0.4
      phases[i]  = Math.random() * Math.PI * 2
      speeds[i]  = Math.random() * 0.006 + 0.001
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    starGeo.setAttribute('alpha',    new THREE.BufferAttribute(alphas,    1))
    starGeo.setAttribute('size',     new THREE.BufferAttribute(sizes,     1))
    starGeo.setAttribute('phase',    new THREE.BufferAttribute(phases,    1))
    starGeo.setAttribute('speed',    new THREE.BufferAttribute(speeds,    1))

    const starMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute float alpha;
        attribute float size;
        attribute float phase;
        attribute float speed;
        uniform float uTime;
        varying float vAlpha;
        void main(){
          vAlpha = alpha * (0.35 + 0.65 * abs(sin(uTime * speed + phase)));
          gl_PointSize = size;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main(){
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float circle = 1.0 - smoothstep(0.3, 1.0, d);
          // Pure white stars, no purple tint
          gl_FragColor = vec4(1.0, 1.0, 1.0, circle * vAlpha);
        }
      `,
    })

    const starMesh = new THREE.Points(starGeo, starMat)
    scene.add(starMesh)

    // ── Shooting stars ────────────────────────────────────────────────
    type Streak = {
      mesh: THREE.Line; mat: THREE.ShaderMaterial
      vel: THREE.Vector3; active: boolean; life: number
    }

    const makeStreak = (): Streak => {
      const geo = new THREE.BufferGeometry()
      const pts = new Float32Array(6)
      geo.setAttribute('position', new THREE.BufferAttribute(pts, 3))
      const tAttr = new Float32Array([0, 1])
      geo.setAttribute('aT', new THREE.BufferAttribute(tAttr, 1))
      const mat = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: { uAlpha: { value: 1.0 } },
        vertexShader: `
          attribute float aT; varying float vT;
          void main(){ vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `,
        fragmentShader: `
          uniform float uAlpha; varying float vT;
          void main(){ gl_FragColor = vec4(1.0,1.0,1.0,(1.0-vT)*uAlpha); }
        `,
      })
      const line = new THREE.Line(geo, mat)
      scene.add(line)
      return { mesh: line, mat, vel: new THREE.Vector3(), active: false, life: 0 }
    }

    const streaks: Streak[] = Array.from({ length: 5 }, makeStreak)

    const activateStreak = (s: Streak) => {
      const startX = (Math.random() - 0.2) * 60
      const startY = Math.random() * 20 + 10
      const angle  = -Math.PI / 6 + (Math.random() - 0.5) * 0.4
      s.vel.set(Math.cos(angle) * 0.9, Math.sin(angle) * 0.9, 0)
      const pos = s.mesh.geometry.attributes.position.array as Float32Array
      pos[0] = startX; pos[1] = startY; pos[2] = -10
      pos[3] = startX; pos[4] = startY; pos[5] = -10
      s.mesh.geometry.attributes.position.needsUpdate = true
      s.mat.uniforms.uAlpha.value = 1
      s.active = true; s.life = 0
    }

    streaks.forEach((s, i) => setTimeout(() => activateStreak(s), i * 1800 + Math.random() * 800))

    // ── Mouse parallax ────────────────────────────────────────────────
    let mouseX = 0, mouseY = 0
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    const TRAIL_LEN = 8
    let animId: number, t = 0

    const animate = () => {
      animId = requestAnimationFrame(animate)
      t += 0.016
      starMat.uniforms.uTime.value = t

      camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.02
      camera.position.y += (-mouseY * 1.2 - camera.position.y) * 0.02
      camera.lookAt(scene.position)

      starMesh.rotation.y = t * 0.01
      starMesh.rotation.x = t * 0.004

      streaks.forEach((s) => {
        if (!s.active) return
        s.life++
        const pos = s.mesh.geometry.attributes.position.array as Float32Array
        pos[0] += s.vel.x; pos[1] += s.vel.y
        pos[3] = pos[0] - s.vel.x * TRAIL_LEN
        pos[4] = pos[1] - s.vel.y * TRAIL_LEN
        s.mesh.geometry.attributes.position.needsUpdate = true
        s.mat.uniforms.uAlpha.value -= 0.014
        if (s.mat.uniforms.uAlpha.value <= 0 || pos[0] > 80 || pos[1] < -40) {
          s.active = false
          setTimeout(() => activateStreak(s), Math.random() * 3000 + 1000)
        }
      })

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 -z-10"
      style={{ background: '#0a0a0a' }}
    />
  )
}