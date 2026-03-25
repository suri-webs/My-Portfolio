'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

const experience = {
  company:     'SkillsYard Edutech Pvt. Ltd.',
  role:        'Frontend Developer Intern',
  period:      'April 2024',
  current:     true,
  description: 'Developing responsive web applications using React, JavaScript, and modern frameworks through comprehensive training and internship at SkillsYard Edutech, building scalable solutions for real-world digital challenges.',
}

export default function Experience() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const labelRef    = useRef<HTMLParagraphElement>(null)
  const headingRef  = useRef<HTMLHeadingElement>(null)
  const cardRef     = useRef<HTMLDivElement>(null)
  const lineRef     = useRef<HTMLDivElement>(null)
  const dotRef      = useRef<HTMLDivElement>(null)
  const roleRef     = useRef<HTMLHeadingElement>(null)
  const companyRef  = useRef<HTMLParagraphElement>(null)
  const descRef     = useRef<HTMLParagraphElement>(null)
  const badgeRef    = useRef<HTMLDivElement>(null)
  const glowRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {

      // ── 1. Label char-by-char reveal ──────────────────────────────
      if (labelRef.current) {
        const split = new SplitText(labelRef.current, { type: 'chars' })
        gsap.from(split.chars, {
          opacity: 0, y: 10, rotateX: -40,
          duration: 0.5, stagger: 0.025, ease: 'back.out(2)',
          scrollTrigger: { trigger: section, start: 'top 78%', toggleActions: 'play none none reverse' },
        })
      }

      // ── 2. Heading word-by-word with clip reveal ──────────────────
      if (headingRef.current) {
        const split = new SplitText(headingRef.current, { type: 'words', wordsClass: 'overflow-hidden inline-block' })
        gsap.from(split.words, {
          yPercent: 110, opacity: 0,
          duration: 0.75, stagger: 0.09, ease: 'power4.out',
          scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none reverse' },
        })
      }

      // ── 3. Timeline dot pulse-in ──────────────────────────────────
      gsap.from(dotRef.current, {
        scale: 0, opacity: 0, duration: 0.6, ease: 'elastic.out(1.4, 0.5)',
        scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none reverse' },
      })

      // Continuous dot pulse ring
      gsap.to(dotRef.current, {
        boxShadow: '0 0 0 8px rgba(139,92,246,0)', scale: 1.1,
        duration: 1.2, ease: 'power2.out', repeat: -1, yoyo: true,
      })

      // ── 4. Timeline line draws down ───────────────────────────────
      gsap.from(lineRef.current, {
        scaleY: 0, transformOrigin: 'top center',
        duration: 1.4, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 68%', toggleActions: 'play none none reverse' },
      })

      // ── 5. Card 3D tilt entry ─────────────────────────────────────
      gsap.from(cardRef.current, {
        y: 80, opacity: 0, rotateX: 8, transformPerspective: 800,
        duration: 1.0, ease: 'power4.out',
        scrollTrigger: { trigger: cardRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
      })

      // ── 6. Role text letter scramble reveal ───────────────────────
      if (roleRef.current) {
        const split = new SplitText(roleRef.current, { type: 'chars' })
        gsap.from(split.chars, {
          opacity: 0, x: () => (Math.random() - 0.5) * 20, y: () => (Math.random() - 0.5) * 20,
          rotateZ: () => (Math.random() - 0.5) * 15,
          duration: 0.6, stagger: { each: 0.03, from: 'random' }, ease: 'power3.out',
          scrollTrigger: { trigger: cardRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
        })
      }

      // ── 7. Company name slide up with fade ────────────────────────
      gsap.from(companyRef.current, {
        y: 20, opacity: 0, duration: 0.6, ease: 'power3.out', delay: 0.15,
        scrollTrigger: { trigger: cardRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
      })

      // ── 8. Badge pop in ───────────────────────────────────────────
      gsap.from(badgeRef.current?.children ?? [], {
        scale: 0.5, opacity: 0, duration: 0.5,
        stagger: 0.1, ease: 'back.out(2)',
        scrollTrigger: { trigger: cardRef.current, start: 'top 72%', toggleActions: 'play none none reverse' },
      })

      // ── 9. Description line-by-line reveal ───────────────────────
      if (descRef.current) {
        const split = new SplitText(descRef.current, { type: 'lines', linesClass: 'overflow-hidden' })
        gsap.from(split.lines, {
          yPercent: 100, opacity: 0,
          duration: 0.55, stagger: 0.07, ease: 'power3.out',
          scrollTrigger: { trigger: cardRef.current, start: 'top 65%', toggleActions: 'play none none reverse' },
        })
      }

      // ── 10. Card magnetic hover ───────────────────────────────────
      const card = cardRef.current
      if (card) {
        const onMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect()
          const cx   = rect.left + rect.width  / 2
          const cy   = rect.top  + rect.height / 2
          const dx   = (e.clientX - cx) / (rect.width  / 2)
          const dy   = (e.clientY - cy) / (rect.height / 2)
          gsap.to(card, {
            rotateY: dx * 4, rotateX: -dy * 4,
            transformPerspective: 1000,
            duration: 0.4, ease: 'power2.out',
          })
          if (glowRef.current) {
            gsap.to(glowRef.current, {
              x: (e.clientX - rect.left) - rect.width  / 2,
              y: (e.clientY - rect.top)  - rect.height / 2,
              opacity: 1, duration: 0.3,
            })
          }
        }
        const onLeave = () => {
          gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
          if (glowRef.current) gsap.to(glowRef.current, { opacity: 0, duration: 0.4 })
        }
        card.addEventListener('mousemove', onMove)
        card.addEventListener('mouseleave', onLeave)
        return () => {
          card.removeEventListener('mousemove', onMove)
          card.removeEventListener('mouseleave', onLeave)
        }
      }

    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center py-28 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute right-[-5%] top-1/3 w-[420px] h-[420px] rounded-full bg-violet-800/10 blur-[100px] pointer-events-none" />
      <div className="absolute left-[-5%] bottom-1/4 w-[300px] h-[300px] rounded-full bg-fuchsia-900/8 blur-[120px] pointer-events-none" />

      <div className="w-[88%] mx-auto">

        {/* ── Header ── */}
        <p ref={labelRef} className="text-xs font-mono tracking-[0.3em] text-violet-400/60 uppercase mb-3">
          03 / Experience
        </p>
        <h2 ref={headingRef} className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-16">
          Where I&apos;ve{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
            worked.
          </span>
        </h2>

        {/* ── Timeline ── */}
        <div className="flex gap-8 md:gap-14">

          {/* Dot + line */}
          <div className="flex flex-col items-center pt-1.5 flex-shrink-0">
            <div
              ref={dotRef}
              className="w-3 h-3 rounded-full bg-violet-500 flex-shrink-0"
              style={{ boxShadow: '0 0 10px rgba(139,92,246,0.8)' }}
            />
            <div ref={lineRef} className="w-px flex-1 mt-2 bg-gradient-to-b from-violet-500/50 via-violet-500/20 to-transparent" />
          </div>

          {/* Card */}
          <div ref={cardRef} className="flex-1 pb-16" style={{ transformStyle: 'preserve-3d' }}>
            <div className="relative border border-white/[0.07] rounded-2xl bg-white/[0.02] backdrop-blur-sm p-8 md:p-10 transition-colors duration-500 hover:border-violet-500/20 overflow-hidden">

              {/* Magnetic follow glow */}
              <div
                ref={glowRef}
                className="absolute w-64 h-64 rounded-full pointer-events-none opacity-0"
                style={{
                  background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
                  transform: 'translate(-50%, -50%)',
                  left: '50%', top: '50%',
                }}
              />

              {/* Top gradient shimmer */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/[0.04] to-transparent pointer-events-none" />

              {/* Top row */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 relative z-10">
                <div>
                  <h3 ref={roleRef} className="text-xl md:text-2xl font-bold text-white mb-1">
                    {experience.role}
                  </h3>
                  <p ref={companyRef} className="text-violet-400 font-medium text-sm tracking-wide">
                    {experience.company}
                  </p>
                </div>

                <div ref={badgeRef} className="flex items-center gap-2 flex-shrink-0">
                  <span className="px-4 py-1.5 text-xs font-mono font-semibold rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300">
                    {experience.period} – Present
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-white/5 mb-6 relative z-10" />

              {/* Description */}
              <p ref={descRef} className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 max-w-2xl relative z-10">
                {experience.description}
              </p>

            </div>
          </div>
        </div>

        {/* More hint */}
        <div className="flex items-center gap-4 ml-[calc(1.75rem+2rem)] md:ml-[calc(1.75rem+3.5rem)]">
          <div className="w-px h-8 bg-white/5" />
          <p className="text-xs text-slate-600 font-mono">More experiences coming soon...</p>
        </div>

      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-[6%] right-[6%] h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  )
}