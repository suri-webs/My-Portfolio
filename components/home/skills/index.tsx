'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const skills = [
  { name: 'React.js', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'TypeScript', category: 'Frontend' },
  { name: 'TailwindCSS', category: 'Frontend' },
  { name: 'HTML5', category: 'Frontend' },
  { name: 'CSS3', category: 'Frontend' },
  { name: 'Three.js', category: 'Frontend' },
  { name: 'JavaScript', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express.js', category: 'Backend' },
  { name: 'MongoDB', category: 'Backend' },
  { name: 'REST API', category: 'Backend' },
  { name: 'Git', category: 'Tools' },
  { name: 'GitHub', category: 'Tools' },
  { name: 'Vercel', category: 'Tools' },
  { name: 'Postman', category: 'Tools' },
]

const categoryColor: Record<string, string> = {
  Frontend: '#a78bfa',
  Backend: '#f472b6',
  Tools: '#34d399',
}

const categories = [
  { label: 'Frontend', color: '#a78bfa', desc: 'UI & Interaction' },
  { label: 'Backend', color: '#f472b6', desc: 'Server & Data' },
  { label: 'Tools', color: '#34d399', desc: 'Dev Workflow' },
]

export default function Skills() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth
    const H = mount.clientHeight

    // ── Responsive scale factor ───────────────────────────────────────
    // sm = < 768px → scale 0.55, lg = >= 768px → scale 1.0
    const isMobile = window.innerWidth < 768
    const SCALE = isMobile ? 0.55 : 1.0

    const RADIUS = 9.5 * SCALE
    const PILL_W = 4.5 * SCALE
    const PILL_H = 1.15 * SCALE
    const CAM_Z = 26 * SCALE
    const FONT_SIZE = isMobile ? 52 : 46   // slightly larger on mobile so text stays readable

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.sortObjects = true
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 1000)
    camera.position.set(0, 0, CAM_Z)

    const makeTexture = (text: string, color: string) => {
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 128
      const ctx = canvas.getContext('2d')!
      const r = 64

      ctx.beginPath()
      ctx.moveTo(r, 0); ctx.lineTo(512 - r, 0)
      ctx.quadraticCurveTo(512, 0, 512, r)
      ctx.lineTo(512, 128 - r)
      ctx.quadraticCurveTo(512, 128, 512 - r, 128)
      ctx.lineTo(r, 128)
      ctx.quadraticCurveTo(0, 128, 0, 128 - r)
      ctx.lineTo(0, r)
      ctx.quadraticCurveTo(0, 0, r, 0)
      ctx.closePath()

      const grd = ctx.createLinearGradient(0, 0, 512, 128)
      grd.addColorStop(0, 'rgba(14, 6, 30, 0.97)')
      grd.addColorStop(1, 'rgba(24, 10, 50, 0.97)')
      ctx.fillStyle = grd
      ctx.fill()

      ctx.shadowColor = color
      ctx.shadowBlur = 20
      ctx.strokeStyle = color
      ctx.lineWidth = 4
      ctx.globalAlpha = 0.9
      ctx.stroke()
      ctx.shadowBlur = 0
      ctx.globalAlpha = 1

      ctx.beginPath()
      ctx.arc(38, 64, 9, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.shadowColor = color
      ctx.shadowBlur = 10
      ctx.fill()
      ctx.shadowBlur = 0

      ctx.font = `700 ${FONT_SIZE}px "Inter", "Segoe UI", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#f0e8ff'
      ctx.fillText(text, 265, 68)

      return new THREE.CanvasTexture(canvas)
    }

    const pills: THREE.Mesh[] = []
    const group = new THREE.Group()
    scene.add(group)

    // Wireframe sphere
    const wireMesh = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS + 0.2, 28, 28),
      new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true, transparent: true, opacity: 0.18, depthWrite: false })
    )
    wireMesh.renderOrder = 0
    group.add(wireMesh)

    // Equator ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(RADIUS + 0.15, 0.025 * SCALE, 8, 100),
      new THREE.MeshBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.22, depthWrite: false })
    )
    ring.renderOrder = 0
    ring.rotation.x = Math.PI / 2
    group.add(ring)

    // Tilted ring
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(RADIUS + 0.15, 0.018 * SCALE, 8, 100),
      new THREE.MeshBasicMaterial({ color: 0x999999, transparent: true, opacity: 0.14, depthWrite: false })
    )
    ring2.renderOrder = 0
    ring2.rotation.x = Math.PI / 3
    ring2.rotation.z = Math.PI / 5
    group.add(ring2)

    // Axis line
    const axisGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -(RADIUS + 1.2), 0),
      new THREE.Vector3(0, (RADIUS + 1.2), 0),
    ])
    group.add(new THREE.Line(axisGeo,
      new THREE.LineBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.2 })
    ))

    // Centre dot
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(0.15 * SCALE, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.5 })
    ))

    // Pills
    skills.forEach((skill, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / skills.length)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const x = RADIUS * Math.sin(phi) * Math.cos(theta)
      const y = RADIUS * Math.sin(phi) * Math.sin(theta)
      const z = RADIUS * Math.cos(phi)

      const tex = makeTexture(skill.name, categoryColor[skill.category])
      const mat = new THREE.MeshBasicMaterial({
        map: tex, transparent: true,
        depthTest: false, depthWrite: false, side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(PILL_W, PILL_H), mat)
      mesh.position.set(x, y, z)
      mesh.renderOrder = 1
      group.add(mesh)
      pills.push(mesh)
    })

    // Mouse
    let mouseX = 0, mouseY = 0
    const onMouse = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / W - 0.5) * 2
      mouseY = -((e.clientY - rect.top) / H - 0.5) * 2
    }
    mount.addEventListener('mousemove', onMouse)

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    let animId: number, t = 0
    const animate = () => {
      animId = requestAnimationFrame(animate)
      t += 0.004
      group.rotation.y = t + mouseX * 0.3
      group.rotation.x = mouseY * 0.18
      ring.rotation.z = t * 0.3
      ring2.rotation.y = -t * 0.2

      pills.forEach(mesh => {
        mesh.lookAt(camera.position)
        const worldPos = new THREE.Vector3()
        mesh.getWorldPosition(worldPos)
        const camPos = new THREE.Vector3()
        camera.getWorldPosition(camPos)
        const dot = worldPos.clone().normalize().dot(camPos.clone().normalize())
        mesh.scale.setScalar(THREE.MathUtils.mapLinear(dot, -1, 1, 0.6, 1.0))
          ; (mesh.material as THREE.MeshBasicMaterial).opacity =
            THREE.MathUtils.mapLinear(dot, -1, 1, 0.25, 1.0)
      })

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      mount.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <section id="skills" className="relative min-h-screen flex flex-col justify-center py-24 overflow-hidden">
      <div className="w-[90%] mx-auto mb-0 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs font-mono tracking-[0.3em] text-violet-400/60 uppercase mb-3">02 / Skills</p>
          <h2 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
            Tech I work{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-fuchsia-400">with.</span>
          </h2>
          <p className="text-slate-500 text-base mt-3 max-w-md leading-relaxed">
            A full-stack toolkit spanning modern frontend frameworks, backend runtimes,
            and developer tooling — built for shipping real products.
          </p>
        </div>
        <div className="flex gap-6 pb-1">
          {categories.map(c => (
            <div key={c.label} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
              <div>
                <p className="text-xs font-medium text-white/80">{c.label}</p>
                <p className="text-[10px] text-slate-600 leading-none mt-0.5">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Canvas: 45vh on mobile, 70vh on desktop */}
      <div
        ref={mountRef}
        className="w-full h-[45vh] md:h-[70vh]"
        style={{ cursor: 'grab' }}
      />

      <div className="w-[90%] mx-auto flex items-center gap-3 -mt-2">
        <div className="h-px flex-1 bg-linear-to-r from-violet-500/20 to-transparent" />
        <p className="text-xs font-mono text-slate-600">{skills.length} technologies</p>
      </div>
    </section>
  )
}