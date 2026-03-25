'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function StarField() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = window.innerWidth
    const H = window.innerHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 3000)
    camera.position.z = 6

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 1)
    mount.appendChild(renderer.domElement)

    // ── Deep space background gradient ────────────────────────────────
    const bgMat = new THREE.ShaderMaterial({
      depthWrite: false,
      uniforms: { uRes: { value: new THREE.Vector2(W, H) } },
      vertexShader: `void main(){ gl_Position = vec4(position, 1.0); }`,
      fragmentShader: `
        uniform vec2 uRes;
        void main(){
          vec2 uv = gl_FragCoord.xy / uRes;
          vec2 c = uv - vec2(0.5, 0.5);
          float d = length(c);
          vec3 deep   = vec3(0.0, 0.0, 0.012);
          vec3 mid    = vec3(0.006, 0.006, 0.022);
          vec3 edge   = vec3(0.0, 0.0, 0.0);
          vec3 col = mix(mid, edge, smoothstep(0.0, 0.85, d));
          col = mix(deep, col, smoothstep(0.0, 0.3, d));
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    })
    const bgMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat)
    bgMesh.renderOrder = -2
    scene.add(bgMesh)

    // ── Nebula clouds ─────────────────────────────────────────────────
    const nebulaMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime:  { value: 0 },
        uColor: { value: new THREE.Color() },
        uSeed:  { value: 0.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3  uColor;
        uniform float uSeed;
        varying vec2  vUv;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1+uSeed, 311.7+uSeed)))*43758.5453); }
        float noise(vec2 p){
          vec2 i = floor(p); vec2 f = fract(p);
          vec2 u = f*f*(3.0-2.0*f);
          return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),
                     mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
        }
        float fbm(vec2 p){
          float v=0.0,a=0.5;
          for(int i=0;i<6;i++){ v+=a*noise(p); p*=2.1; a*=0.5; }
          return v;
        }
        void main(){
          vec2 uv = vUv - 0.5;
          float d = length(uv);
          vec2 q = vec2(fbm(uv*2.5 + vec2(uTime*0.012, uTime*0.008)),
                        fbm(uv*2.5 + vec2(1.7, 9.2)));
          float f = fbm(uv*3.0 + 1.8*q + vec2(uTime*0.005));
          float cloud = f * (1.0 - smoothstep(0.0, 0.52, d));
          cloud = pow(max(cloud - 0.18, 0.0), 1.4);
          gl_FragColor = vec4(uColor * (0.6 + f*0.4), cloud * 0.55);
        }
      `,
    })

    const nebulaDefs = [
      { pos: [-18,  8,  -80], scale: 55, color: new THREE.Color(0.08, 0.03, 0.28), seed: 1.1 },
      { pos: [22,  -6,  -90], scale: 60, color: new THREE.Color(0.25, 0.04, 0.18), seed: 2.7 },
      { pos: [-5,  -18, -70], scale: 45, color: new THREE.Color(0.02, 0.08, 0.30), seed: 4.3 },
      { pos: [10,   16, -85], scale: 50, color: new THREE.Color(0.05, 0.18, 0.20), seed: 6.9 },
      { pos: [-28,  -4, -95], scale: 65, color: new THREE.Color(0.14, 0.04, 0.24), seed: 8.2 },
    ]

    const nebulaMeshes: THREE.Mesh[] = []
    const nebulaMats: THREE.ShaderMaterial[] = []

    nebulaDefs.forEach(def => {
      const mat = nebulaMat.clone()
      mat.uniforms.uColor.value = def.color
      mat.uniforms.uSeed.value  = def.seed
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(def.scale, def.scale), mat)
      mesh.position.set(...(def.pos as [number, number, number]))
      mesh.renderOrder = -1
      nebulaMeshes.push(mesh)
      nebulaMats.push(mat)
      scene.add(mesh)
    })

    // ── Milky Way dust lane ───────────────────────────────────────────
    const dustMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `
        uniform float uTime;
        varying vec2  vUv;
        float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5); }
        float noise(vec2 p){ vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*(3.0-2.0*f); return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y); }
        float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<5;i++){v+=a*noise(p);p*=2.0;a*=0.5;} return v; }
        void main(){
          vec2 uv = vUv;
          float band = 1.0 - abs(uv.y - 0.5 - (uv.x-0.5)*0.3)*4.0;
          band = smoothstep(0.0, 1.0, band);
          float dust = fbm(uv*6.0 + uTime*0.003) * band;
          dust = pow(max(dust - 0.2, 0.0), 1.6);
          vec3 col = mix(vec3(0.18, 0.10, 0.28), vec3(0.30, 0.18, 0.10), fbm(uv*4.0));
          gl_FragColor = vec4(col, dust * 0.38);
        }
      `,
    })
    const dustMesh = new THREE.Mesh(new THREE.PlaneGeometry(220, 110), dustMat)
    dustMesh.position.set(0, 0, -100)
    dustMesh.renderOrder = -1
    scene.add(dustMesh)

    // ── Helper: create a star layer ───────────────────────────────────
    const makeStars = (count: number, spread: number, sizeRange: [number,number], colorFn: (i:number)=>THREE.Color) => {
      const geo    = new THREE.BufferGeometry()
      const pos    = new Float32Array(count * 3)
      const sizes  = new Float32Array(count)
      const alphas = new Float32Array(count)
      const phases = new Float32Array(count)
      const speeds = new Float32Array(count)
      const colors = new Float32Array(count * 3)

      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi   = Math.acos(2 * Math.random() - 1)
        const r     = spread * (0.3 + Math.random() * 0.7)
        pos[i*3]   = r * Math.sin(phi) * Math.cos(theta)
        pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta)
        pos[i*3+2] = r * Math.cos(phi)
        sizes[i]  = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0])
        alphas[i] = 0.3 + Math.random() * 0.7
        phases[i] = Math.random() * Math.PI * 2
        speeds[i] = 0.0008 + Math.random() * 0.003
        const c = colorFn(i)
        colors[i*3]   = c.r
        colors[i*3+1] = c.g
        colors[i*3+2] = c.b
      }

      geo.setAttribute('position', new THREE.BufferAttribute(pos,    3))
      geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes,  1))
      geo.setAttribute('aAlpha',   new THREE.BufferAttribute(alphas, 1))
      geo.setAttribute('aPhase',   new THREE.BufferAttribute(phases, 1))
      geo.setAttribute('aSpeed',   new THREE.BufferAttribute(speeds, 1))
      geo.setAttribute('aColor',   new THREE.BufferAttribute(colors, 3))

      const mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 } },
        vertexShader: `
          attribute float aSize;
          attribute float aAlpha;
          attribute float aPhase;
          attribute float aSpeed;
          attribute vec3  aColor;
          uniform float   uTime;
          varying float   vAlpha;
          varying vec3    vColor;
          void main(){
            float twinkle = 0.5 + 0.5 * sin(uTime * aSpeed * 60.0 + aPhase);
            vAlpha = aAlpha * (0.4 + 0.6 * twinkle);
            vColor = aColor;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aSize * (300.0 / -mv.z);
            gl_Position  = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          varying float vAlpha;
          varying vec3  vColor;
          void main(){
            vec2  d     = gl_PointCoord - 0.5;
            float dist  = length(d);
            float core  = exp(-dist * dist * 28.0);
            float spike = exp(-abs(d.x)*18.0) * exp(-abs(d.y)*18.0) * 0.25;
            float circle = core + spike;
            gl_FragColor = vec4(vColor * circle, circle * vAlpha);
          }
        `,
      })

      const points = new THREE.Points(geo, mat)
      scene.add(points)
      return { points, mat }
    }

    // ── Grey/white palette — no orange or red ─────────────────────────
    const spectralMix = (_i: number) => {
      const r = Math.random()
      if (r < 0.005) return new THREE.Color(0.70, 0.80, 1.00)  // rare blue-white
      if (r < 0.04)  return new THREE.Color(0.82, 0.88, 1.00)  // blue-grey
      if (r < 0.55)  return new THREE.Color(0.88, 0.90, 0.94)  // white (majority)
      if (r < 0.72)  return new THREE.Color(0.78, 0.80, 0.84)  // light grey
      if (r < 0.86)  return new THREE.Color(0.65, 0.67, 0.70)  // mid grey
      if (r < 0.95)  return new THREE.Color(0.52, 0.54, 0.58)  // dim grey
      return new THREE.Color(0.40, 0.42, 0.46)                 // faint grey
    }

    const bg1 = makeStars(4500, 220, [0.5, 1.2], spectralMix)
    const bg2 = makeStars(1800, 160, [0.8, 1.8], spectralMix)
    const bg3 = makeStars(400,   80, [1.5, 3.5], spectralMix)
    const bg4 = makeStars(18,    50, [4.0, 7.0], () => {
      const c = spectralMix(0)
      return new THREE.Color(c.r * 1.3, c.g * 1.3, c.b * 1.3)
    })

    // ── Star cluster — cool grey-white ────────────────────────────────
    const clusterGeo = new THREE.BufferGeometry()
    const CLUSTER    = 600
    const cPos   = new Float32Array(CLUSTER * 3)
    const cSize  = new Float32Array(CLUSTER)
    const cAlpha = new Float32Array(CLUSTER)
    const cCol   = new Float32Array(CLUSTER * 3)
    const cPhase = new Float32Array(CLUSTER)
    const cSpeed = new Float32Array(CLUSTER)

    for (let i = 0; i < CLUSTER; i++) {
      const r = Math.pow(Math.random(), 2.5) * 14
      const t = Math.random() * Math.PI * 2
      const p = Math.random() * Math.PI
      cPos[i*3]   = -25 + r * Math.sin(p) * Math.cos(t)
      cPos[i*3+1] =  12 + r * Math.sin(p) * Math.sin(t) * 0.5
      cPos[i*3+2] = -60 + r * Math.cos(p) * 0.3
      cSize[i]  = 0.6 + Math.random() * 1.8
      cAlpha[i] = 0.4 + Math.random() * 0.6
      cPhase[i] = Math.random() * Math.PI * 2
      cSpeed[i] = 0.001 + Math.random() * 0.002
      const v = 0.70 + Math.random() * 0.25
      cCol[i*3]   = v * 0.88
      cCol[i*3+1] = v * 0.90
      cCol[i*3+2] = v          // slightly cool blue-white
    }
    clusterGeo.setAttribute('position', new THREE.BufferAttribute(cPos,   3))
    clusterGeo.setAttribute('aSize',    new THREE.BufferAttribute(cSize,  1))
    clusterGeo.setAttribute('aAlpha',   new THREE.BufferAttribute(cAlpha, 1))
    clusterGeo.setAttribute('aPhase',   new THREE.BufferAttribute(cPhase, 1))
    clusterGeo.setAttribute('aSpeed',   new THREE.BufferAttribute(cSpeed, 1))
    clusterGeo.setAttribute('aColor',   new THREE.BufferAttribute(cCol,   3))

    const clusterMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 } },
      vertexShader: bg1.mat.vertexShader,
      fragmentShader: bg1.mat.fragmentShader,
    })
    scene.add(new THREE.Points(clusterGeo, clusterMat))

    // ── Shooting stars ────────────────────────────────────────────────
    type Streak = { mesh: THREE.Line; mat: THREE.ShaderMaterial; vel: THREE.Vector3; active: boolean; life: number }

    const makeStreak = (): Streak => {
      const geo = new THREE.BufferGeometry()
      const pts = new Float32Array(6)
      geo.setAttribute('position', new THREE.BufferAttribute(pts, 3))
      geo.setAttribute('aT', new THREE.BufferAttribute(new Float32Array([0, 1]), 1))
      const mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uAlpha: { value: 1.0 }, uColor: { value: new THREE.Color(1, 1, 1) } },
        vertexShader: `attribute float aT; varying float vT; void main(){ vT=aT; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
        fragmentShader: `uniform float uAlpha; uniform vec3 uColor; varying float vT; void main(){ gl_FragColor=vec4(uColor,(1.0-vT)*uAlpha); }`,
      })
      const line = new THREE.Line(geo, mat)
      scene.add(line)
      return { mesh: line, mat, vel: new THREE.Vector3(), active: false, life: 0 }
    }

    const streaks: Streak[] = Array.from({ length: 6 }, makeStreak)

    const activateStreak = (s: Streak) => {
      const startX = (Math.random() - 0.3) * 70
      const startY = Math.random() * 25 + 5
      const angle  = -Math.PI / 5 + (Math.random() - 0.5) * 0.5
      const speed  = 0.6 + Math.random() * 0.8
      s.vel.set(Math.cos(angle) * speed, Math.sin(angle) * speed, 0)
      const pos = s.mesh.geometry.attributes.position.array as Float32Array
      pos[0] = startX; pos[1] = startY; pos[2] = -8
      pos[3] = startX; pos[4] = startY; pos[5] = -8
      s.mesh.geometry.attributes.position.needsUpdate = true
      s.mat.uniforms.uAlpha.value = 1
      const v = 0.85 + Math.random() * 0.15
      s.mat.uniforms.uColor.value.set(v * 0.90, v * 0.93, v)
      s.active = true
      s.life   = 0
    }

    streaks.forEach((s, i) => setTimeout(() => activateStreak(s), i * 1600 + Math.random() * 1200))

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
      bgMat.uniforms.uRes.value.set(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    const TRAIL = 12
    let animId: number
    let t = 0
    const allMats = [bg1.mat, bg2.mat, bg3.mat, bg4.mat, clusterMat, ...nebulaMats, dustMat]

    const animate = () => {
      animId = requestAnimationFrame(animate)
      t += 0.016
      allMats.forEach(m => { m.uniforms.uTime.value = t })
      camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.015
      camera.position.y += (-mouseY * 0.8 - camera.position.y) * 0.015
      camera.lookAt(scene.position)
      bg1.points.rotation.y = t * 0.0015
      bg1.points.rotation.x = t * 0.0005
      bg2.points.rotation.y = t * 0.002
      bg3.points.rotation.y = t * 0.003
      nebulaMeshes.forEach((m, i) => { m.rotation.z = Math.sin(t * 0.03 + i) * 0.04 })
      streaks.forEach(s => {
        if (!s.active) return
        s.life++
        const pos = s.mesh.geometry.attributes.position.array as Float32Array
        pos[0] += s.vel.x; pos[1] += s.vel.y
        pos[3] = pos[0] - s.vel.x * TRAIL
        pos[4] = pos[1] - s.vel.y * TRAIL
        s.mesh.geometry.attributes.position.needsUpdate = true
        s.mat.uniforms.uAlpha.value -= 0.012
        if (s.mat.uniforms.uAlpha.value <= 0 || pos[0] > 90 || pos[1] < -50) {
          s.active = false
          setTimeout(() => activateStreak(s), Math.random() * 4000 + 1500)
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
      style={{ background: '#000005' }}
    />
  )
}