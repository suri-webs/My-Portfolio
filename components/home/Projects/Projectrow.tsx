'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ExternalLink, ArrowRight, Hash } from 'lucide-react'
import { projectsData } from '@/utils/data/Projectsdata'
import { useParticleCanvas } from '@/utils/constant/Useparticlecanvas'

gsap.registerPlugin(ScrollTrigger)

export function ProjectRow({
  project,
  index,
}: {
  project: (typeof projectsData)[0]
  index: number
}) {
  const rowRef     = useRef<HTMLDivElement>(null)
  const imgRef     = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const lineRef    = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const isEven     = index % 2 === 0

  useParticleCanvas(canvasRef as React.RefObject<HTMLCanvasElement>, project.accent, true)

  useEffect(() => {
    const row     = rowRef.current
    const img     = imgRef.current
    const content = contentRef.current
    const line    = lineRef.current
    if (!row || !img || !content || !line) return

    const ctx = gsap.context(() => {
      gsap.set(img,     { x: isEven ? -60 : 60, opacity: 0 })
      gsap.set(content, { x: isEven ? 60 : -60, opacity: 0 })
      gsap.set(line,    { scaleX: 0, transformOrigin: 'left' })
      gsap.set(content.querySelectorAll('.tag'), { y: 16, opacity: 0 })

      gsap.to(img, {
        x: 0, opacity: 1, ease: 'power2.out',
        scrollTrigger: { trigger: row, start: 'top 90%', end: 'top 35%', scrub: 0.8 },
      })
      gsap.to(content, {
        x: 0, opacity: 1, ease: 'power2.out',
        scrollTrigger: { trigger: row, start: 'top 90%', end: 'top 30%', scrub: 0.8 },
      })
      gsap.to(line, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: row, start: 'top 80%', end: 'top 45%', scrub: 0.6 },
      })
      gsap.to(content.querySelectorAll('.tag'), {
        y: 0, opacity: 1, stagger: 0.04, ease: 'none',
        scrollTrigger: { trigger: row, start: 'top 75%', end: 'top 35%', scrub: 0.6 },
      })
      gsap.to(row, {
        opacity: 0.06, ease: 'none',
        scrollTrigger: { trigger: row, start: 'bottom 55%', end: 'bottom 0%', scrub: 1 },
      })
      gsap.to(row, {
        opacity: 1, ease: 'none',
        scrollTrigger: { trigger: row, start: 'top 100%', end: 'top 60%', scrub: 1 },
      })
    }, row)

    return () => ctx.revert()
  }, [isEven])

  return (
    <div
      ref={rowRef}
      className={`relative flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-14 py-12 md:py-16`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
        style={{ zIndex: 0 }}
      />

      {/* ── Image ── */}
      <div ref={imgRef} className="relative  w-full md:w-[52%] group z-10">
        {/* Glow halo */}
        <div
          className="absolute -inset-1.5 rounded-2xl blur-xl opacity-25 group-hover:opacity-50 transition-opacity duration-700"
          style={{ background: `linear-gradient(135deg, ${project.accent}, transparent 70%)` }}
        />

        {/* Card */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ border: `1px solid ${project.accent}25` }}
        >
          {/* Number badge */}
          <div
            className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black text-white"
            style={{ background: project.accent, boxShadow: `0 0 12px ${project.accent}60` }}
          >
            <Hash size={9} strokeWidth={3} />
            <span>{String(index + 1).padStart(2, '0')}</span>
          </div>

          {/* Hover overlay */}
          <div
            className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center"
            style={{ background: `${project.accent}18`, backdropFilter: 'blur(2px)' }}
          >
            <Link
              href={project.link} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-full border border-white/25 bg-black/60 hover:bg-black/80 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <ExternalLink size={14} strokeWidth={2.5} />
              View Live
            </Link>
          </div>

          {/* ── Image — fills container fully ── */}
          <div className="relative " style={{ paddingBottom: '62.5%' /* 16:10 ratio */ }}>
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 52vw"
              className="object-fill object-top group-hover:scale-[1.03] transition-transform duration-700"
              priority={index < 2}
            />
          </div>

          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-10"
            style={{ background: `linear-gradient(to top, ${project.accent}25, transparent)` }}
          />
        </div>
      </div>

      {/* ── Content ── */}
      <div ref={contentRef} className="relative w-full md:w-[48%] flex flex-col gap-4 z-10">

        <div
          ref={lineRef}
          className="h-0.5 w-16 rounded-full"
          style={{ background: `linear-gradient(to right, ${project.accent}, transparent)` }}
        />

        <p
          className="flex items-center gap-1.5 text-[11px] font-mono tracking-[0.35em] uppercase"
          style={{ color: `${project.accent}80` }}
        >
          <Hash size={9} />
          Project {String(index + 1).padStart(2, '0')}
        </p>

        <h3
          className="text-3xl md:text-4xl font-black tracking-tight leading-none text-white"
          style={{ textShadow: `0 0 40px ${project.accent}35` }}
        >
          {project.title}
        </h3>

        <p className="text-slate-400 text-[15px] leading-[1.75] max-w-sm">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="tag flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-mono font-semibold rounded-full border tracking-wide"
              style={{
                color: project.accent,
                borderColor: `${project.accent}30`,
                background: `${project.accent}0a`,
              }}
            >
              <Hash size={8} strokeWidth={2.5} />
              {tag}
            </span>
          ))}
        </div>

        <div className="pt-1">
          <Link
            href={project.link} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3 text-sm font-bold text-white rounded-full transition-all duration-300 hover:scale-105 active:scale-95 group/btn"
            style={{
              background: `linear-gradient(135deg, ${project.accent}28, ${project.accent}12)`,
              border: `1px solid ${project.accent}40`,
              boxShadow: `0 0 20px ${project.accent}18, inset 0 1px 0 ${project.accent}18`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = `0 0 36px ${project.accent}45, inset 0 1px 0 ${project.accent}28`
              e.currentTarget.style.background = `linear-gradient(135deg, ${project.accent}42, ${project.accent}22)`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = `0 0 20px ${project.accent}18, inset 0 1px 0 ${project.accent}18`
              e.currentTarget.style.background = `linear-gradient(135deg, ${project.accent}28, ${project.accent}12)`
            }}
          >
            Check Now
            <ArrowRight size={15} strokeWidth={2.5} className="transition-transform duration-200 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}