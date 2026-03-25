'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ExternalLink, ArrowRight, Hash } from 'lucide-react'
import { projectsData } from '@/utils/data/Projectsdata'
import { useParticleCanvas } from '@/utils/constant/Useparticlecanvas'

gsap.registerPlugin(ScrollTrigger, SplitText)

export function ProjectRow({
  project,
  index,
}: {
  project: (typeof projectsData)[0]
  index: number
}) {
  const rowRef     = useRef<HTMLDivElement>(null)
  const imgRef     = useRef<HTMLDivElement>(null)
  const imgInner   = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const lineRef    = useRef<HTMLDivElement>(null)
  const titleRef   = useRef<HTMLHeadingElement>(null)
  const descRef    = useRef<HTMLParagraphElement>(null)
  const btnRef     = useRef<HTMLAnchorElement>(null)
  const glowRef    = useRef<HTMLDivElement>(null)
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

      // ── 1. Image clip reveal (slides in from side) ────────────────
      gsap.set(img, { clipPath: isEven ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)', opacity: 1 })
      gsap.to(img, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.1, ease: 'power4.inOut',
        scrollTrigger: { trigger: row, start: 'top 85%', toggleActions: 'play none none reverse' },
      })

      // ── 2. Image subtle scale on scroll (Ken Burns) ───────────────
      if (imgInner.current) {
        gsap.from(imgInner.current, {
          scale: 1.12,
          duration: 1.4, ease: 'power2.out',
          scrollTrigger: { trigger: row, start: 'top 85%', toggleActions: 'play none none reverse' },
        })
      }

      // ── 3. Content fade + slide ───────────────────────────────────
      gsap.set(content, { opacity: 0, x: isEven ? 30 : -30 })
      gsap.to(content, {
        opacity: 1, x: 0,
        duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: row, start: 'top 80%', toggleActions: 'play none none reverse' },
      })

      // ── 4. Accent line draws ──────────────────────────────────────
      gsap.set(line, { scaleX: 0, transformOrigin: 'left' })
      gsap.to(line, {
        scaleX: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: row, start: 'top 78%', toggleActions: 'play none none reverse' },
      })

      // ── 5. Title word-by-word reveal ──────────────────────────────
      if (titleRef.current) {
        const split = new SplitText(titleRef.current, { type: 'words', wordsClass: 'word-overflow' })
        split.words.forEach(w => {
          const wrap = document.createElement('span')
          wrap.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom'
          w.parentNode?.insertBefore(wrap, w)
          wrap.appendChild(w)
        })
        gsap.from(split.words, {
          yPercent: 110, opacity: 0,
          duration: 0.7, stagger: 0.06, ease: 'power4.out',
          scrollTrigger: { trigger: row, start: 'top 76%', toggleActions: 'play none none reverse' },
        })
      }

      // ── 6. Description line reveal ────────────────────────────────
      if (descRef.current) {
        const split = new SplitText(descRef.current, { type: 'lines' })
        split.lines.forEach(l => {
          const wrap = document.createElement('span')
          wrap.style.cssText = 'display:block;overflow:hidden'
          l.parentNode?.insertBefore(wrap, l)
          wrap.appendChild(l)
        })
        gsap.from(split.lines, {
          yPercent: 100, opacity: 0,
          duration: 0.55, stagger: 0.06, ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 72%', toggleActions: 'play none none reverse' },
        })
      }

      // ── 7. Tags stagger pop ───────────────────────────────────────
      const tags = content.querySelectorAll('.tag')
      gsap.set(tags, { y: 18, opacity: 0, scale: 0.85 })
      gsap.to(tags, {
        y: 0, opacity: 1, scale: 1,
        duration: 0.45, stagger: 0.055, ease: 'back.out(2)',
        scrollTrigger: { trigger: row, start: 'top 68%', toggleActions: 'play none none reverse' },
      })

      // ── 8. CTA button bounce in ───────────────────────────────────
      if (btnRef.current) {
        gsap.from(btnRef.current, {
          y: 20, opacity: 0, scale: 0.88,
          duration: 0.55, ease: 'back.out(2)',
          scrollTrigger: { trigger: row, start: 'top 65%', toggleActions: 'play none none reverse' },
        })
      }

      // ── 9. Image card magnetic hover + cursor glow ────────────────
      const imgCard = imgRef.current
      if (imgCard) {
        const onMove = (e: MouseEvent) => {
          const r  = imgCard.getBoundingClientRect()
          const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2)
          const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2)
          gsap.to(imgCard, {
            rotateY: dx * 5, rotateX: -dy * 3,
            transformPerspective: 900, duration: 0.4, ease: 'power2.out',
          })
          if (glowRef.current) {
            gsap.to(glowRef.current, {
              x: e.clientX - r.left - r.width  / 2,
              y: e.clientY - r.top  - r.height / 2,
              opacity: 1, duration: 0.3,
            })
          }
        }
        const onLeave = () => {
          gsap.to(imgCard, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })
          if (glowRef.current) gsap.to(glowRef.current, { opacity: 0, duration: 0.4 })
        }
        imgCard.addEventListener('mousemove', onMove)
        imgCard.addEventListener('mouseleave', onLeave)
        return () => {
          imgCard.removeEventListener('mousemove', onMove)
          imgCard.removeEventListener('mouseleave', onLeave)
        }
      }

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
      <div
        ref={imgRef}
        className="relative w-full md:w-[52%] group z-10"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Cursor follow glow */}
        <div
          ref={glowRef}
          className="absolute w-56 h-56 rounded-full pointer-events-none opacity-0 z-20"
          style={{
            background: `radial-gradient(circle, ${project.accent}22 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
            left: '50%', top: '50%',
          }}
        />

        <div
          className="absolute -inset-1.5 rounded-2xl blur-xl opacity-25 group-hover:opacity-50 transition-opacity duration-700"
          style={{ background: `linear-gradient(135deg, ${project.accent}, transparent 70%)` }}
        />
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ border: `1px solid ${project.accent}25` }}
        >
          <div
            className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black text-white"
            style={{ background: project.accent, boxShadow: `0 0 12px ${project.accent}60` }}
          >
            <Hash size={9} strokeWidth={3} />
            <span>{String(index + 1).padStart(2, '0')}</span>
          </div>


          <div ref={imgInner} className="relative" style={{ paddingBottom: '62.5%' }}>
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 52vw"
              className="object-fill object-top group-hover:scale-[1.03] transition-transform duration-700"
              priority={index < 2}
            />
          </div>

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
          ref={titleRef}
          className="text-3xl md:text-4xl font-black tracking-tight leading-none text-white"
          style={{ textShadow: `0 0 40px ${project.accent}35` }}
        >
          {project.title}
        </h3>

        <p ref={descRef} className="text-slate-400 text-[15px] leading-[1.75] max-w-sm">
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
            ref={btnRef}
            href={project.link} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3 text-sm font-bold text-white rounded-sm transition-colors duration-200 hover:scale-105 active:scale-95 group/btn"
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