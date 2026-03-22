'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const experience = {
  company: 'SkillsYard Edutech Pvt. Ltd.',
  role: 'Frontend Developer Intern',
  period: 'April 2024',
  current: true,
  description:
    'Developing responsive web applications using React, JavaScript, and modern frameworks through comprehensive training and internship at SkillsYard Edutech, building scalable solutions for real-world digital challenges.',
 
}

export default function Experience() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const labelRef    = useRef<HTMLParagraphElement>(null)
  const headingRef  = useRef<HTMLHeadingElement>(null)
  const cardRef     = useRef<HTMLDivElement>(null)
  const lineRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {

      // Label + heading slide down
      gsap.from([labelRef.current, headingRef.current], {
        y: -30, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none reverse' },
      })

      // Timeline line grows
      gsap.from(lineRef.current, {
        scaleY: 0, transformOrigin: 'top center', duration: 1, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none reverse' },
      })

      // Card slides up
      gsap.from(cardRef.current, {
        y: 60, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 65%', toggleActions: 'play none none reverse' },
      })


      // Fade out when scrolling past
      gsap.to(section, {
        opacity: 0.12,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'bottom 55%', end: 'bottom 5%', scrub: true },
      })

      // Fade back in on scroll up
      gsap.to(section, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top 95%', end: 'top 55%', scrub: true },
      })

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

        {/* ── Timeline layout ── */}
        <div className="flex gap-8 md:gap-14">

          {/* Timeline line + dot */}
          <div className="flex flex-col items-center pt-1.5 flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.8)] flex-shrink-0" />
            <div ref={lineRef} className="w-px flex-1 mt-2 bg-gradient-to-b from-violet-500/50 via-violet-500/20 to-transparent" />
          </div>

          {/* Card */}
          <div ref={cardRef} className="flex-1 pb-16">
            <div className="relative border border-white/[0.07] rounded-2xl bg-white/[0.02] backdrop-blur-sm p-8 md:p-10 hover:border-violet-500/20 transition-colors duration-500">

              {/* Subtle inner glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/[0.04] to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Top row */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  {/* Role */}
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                    {experience.role}
                  </h3>
                  {/* Company */}
                  <p className="text-violet-400 font-medium text-sm tracking-wide">
                    {experience.company}
                  </p>
                </div>

                {/* Period badge */}
                <div className="flex items-center gap-2 flex-shrink-0">
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
              <div className="h-px w-full bg-white/5 mb-6" />

              {/* Description */}
              <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 max-w-2xl">
                {experience.description}
              </p>

            </div>
          </div>
        </div>

        {/* More experience hint */}
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