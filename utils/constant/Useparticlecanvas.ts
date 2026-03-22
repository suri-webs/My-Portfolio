import { useEffect } from 'react'
import * as THREE from 'three'

export function useParticleCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  accent: string,
  active: boolean
) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.z = 4

    const color = new THREE.Color(accent)

    const COUNT = 120
    const geo   = new THREE.BufferGeometry()
    const pos   = new Float32Array(COUNT * 3)
    const sizes = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 8
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3
      sizes[i] = Math.random() * 3 + 1
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1))

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime:   { value: 0 },
        uColor:  { value: color },
        uActive: { value: active ? 1.0 : 0.0 },
      },
      vertexShader: `
        attribute float size;
        uniform float uTime;
        varying float vAlpha;
        void main(){
          vAlpha = 0.3 + 0.5 * abs(sin(uTime * 0.8 + position.x * 2.0));
          gl_PointSize = size * (1.0 + 0.3 * sin(uTime + position.y));
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uActive;
        varying float vAlpha;
        void main(){
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float c = 1.0 - smoothstep(0.3, 1.0, d);
          gl_FragColor = vec4(uColor, c * vAlpha * uActive);
        }
      `,
    })

    const points = new THREE.Points(geo, mat)
    scene.add(points)

    let animId: number
    let t = 0
    const animate = () => {
      animId = requestAnimationFrame(animate)
      t += 0.016
      mat.uniforms.uTime.value  = t
      mat.uniforms.uActive.value = active
        ? Math.min(mat.uniforms.uActive.value + 0.05, 1.0)
        : Math.max(mat.uniforms.uActive.value - 0.05, 0.0)
      points.rotation.y = t * 0.04
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      renderer.dispose()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accent, active])
}