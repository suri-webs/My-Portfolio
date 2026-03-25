'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { projectsData } from '@/utils/data/Projectsdata'
import { ProjectRow } from './Projectrow'
import { lenisInstance } from '@/app/page'

gsap.registerPlugin(ScrollTrigger, SplitText)

const INITIAL_COUNT = 4

export default function Projects() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const labelRef   = useRef<HTMLParagraphElement>(null)
    const headingRef = useRef<HTMLHeadingElement>(null)
    const subRef     = useRef<HTMLParagraphElement>(null)
    const dividerRef = useRef<HTMLDivElement>(null)
    const btnRef     = useRef<HTMLButtonElement>(null)
    const [showAll, setShowAll] = useState(false)

    const visible = showAll ? projectsData : projectsData.slice(0, INITIAL_COUNT)
    const hidden  = projectsData.length - INITIAL_COUNT

    useEffect(() => {
        const ctx = gsap.context(() => {

            // ── 1. Label char-by-char flip in ────────────────────────
            if (labelRef.current) {
                const split = new SplitText(labelRef.current, { type: 'chars' })
                gsap.from(split.chars, {
                    opacity: 0, y: 12, rotateX: -50,
                    duration: 0.45, stagger: 0.025, ease: 'back.out(2)',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 82%',
                        toggleActions: 'play none none reverse',
                    },
                })
            }

            // ── 2. Heading word clip-mask slide up (Lenis-style) ──────
            if (headingRef.current) {
                const split = new SplitText(headingRef.current, {
                    type: 'words',
                    wordsClass: 'word-wrap',
                })
                // wrap each word in a clip container
                split.words.forEach(w => {
                    const wrapper = document.createElement('span')
                    wrapper.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom'
                    w.parentNode?.insertBefore(wrapper, w)
                    wrapper.appendChild(w)
                })
                gsap.from(split.words, {
                    yPercent: 115, opacity: 0,
                    duration: 0.8, stagger: 0.08, ease: 'power4.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                })
            }

            // ── 3. Subtitle line-by-line reveal ───────────────────────
            if (subRef.current) {
                const split = new SplitText(subRef.current, { type: 'lines', linesClass: 'line-overflow' })
                split.lines.forEach(l => {
                    const wrap = document.createElement('span')
                    wrap.style.cssText = 'display:block;overflow:hidden'
                    l.parentNode?.insertBefore(wrap, l)
                    wrap.appendChild(l)
                })
                gsap.from(split.lines, {
                    yPercent: 100, opacity: 0,
                    duration: 0.6, stagger: 0.08, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 76%',
                        toggleActions: 'play none none reverse',
                    },
                })
            }

            // ── 4. Divider line draws right ───────────────────────────
            gsap.from(dividerRef.current, {
                scaleX: 0, transformOrigin: 'left',
                duration: 1.2, ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 72%',
                    toggleActions: 'play none none reverse',
                },
            })

            // ── 5. Button entrance ────────────────────────────────────
            gsap.from(btnRef.current, {
                y: 20, opacity: 0, scale: 0.9,
                duration: 0.6, ease: 'back.out(2)',
                scrollTrigger: {
                    trigger: btnRef.current,
                    start: 'top 92%',
                    toggleActions: 'play none none reverse',
                },
            })

            // ── 6. Button magnetic hover ──────────────────────────────
            const btn = btnRef.current
            if (btn) {
                const onMove = (e: MouseEvent) => {
                    const r  = btn.getBoundingClientRect()
                    const dx = (e.clientX - (r.left + r.width  / 2)) * 0.25
                    const dy = (e.clientY - (r.top  + r.height / 2)) * 0.25
                    gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' })
                }
                const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' })
                btn.addEventListener('mousemove', onMove)
                btn.addEventListener('mouseleave', onLeave)
            }

        }, sectionRef)
        return () => ctx.revert()
    }, [])

    const handleShowMore = () => {
        setShowAll(true)
        setTimeout(() => {
            lenisInstance?.resize()
            ScrollTrigger.refresh()
            const newRows = document.querySelectorAll('.project-extra-row')
            gsap.from(newRows, {
                opacity: 0, y: 40, duration: 0.8, stagger: 0.15, ease: 'power3.out',
            })
        }, 100)
    }

    const handleShowLess = () => {
        setShowAll(false)
        setTimeout(() => {
            lenisInstance?.resize()
            ScrollTrigger.refresh()
            if (sectionRef.current) {
                const top = sectionRef.current.getBoundingClientRect().top + window.scrollY
                lenisInstance?.scrollTo(top, { duration: 1.2 })
            }
        }, 80)
    }

    return (
        <section id="projects" ref={sectionRef} className="relative py-24 overflow-hidden">

            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-1/4 top-0 w-175 h-175 rounded-full bg-violet-900/6 blur-[160px]" />
                <div className="absolute right-1/4 bottom-0 w-125 h-125 rounded-full bg-fuchsia-900/6 blur-[130px]" />
            </div>

            <div className="w-[88%] mx-auto relative z-10">

                <p ref={labelRef} className="text-xs font-mono tracking-[0.3em] text-violet-400/60 uppercase mb-3">
                    04 / Projects
                </p>
                <h2 ref={headingRef} className="text-5xl md:text-6xl font-black text-white tracking-tight mb-4 leading-none">
                    Things I&apos;ve{' '}
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 via-fuchsia-400 to-pink-400">
                        built.
                    </span>
                </h2>
                <p ref={subRef} className="text-slate-500 text-base max-w-lg mb-4 leading-relaxed">
                    A selection of real-world projects — from SaaS platforms to interactive web apps.
                </p>

                <div ref={dividerRef} className="h-px w-full bg-linear-to-r from-violet-500/25 via-white/5 to-transparent mb-2" />

                {visible.map((project, index) => (
                    <div
                        key={project.id}
                        className={index >= INITIAL_COUNT ? 'project-extra-row' : ''}
                    >
                        <ProjectRow project={project} index={index} />
                        {index < visible.length - 1 && (
                            <div className="h-px w-full bg-linear-to-r from-transparent via-white/4 to-transparent" />
                        )}
                    </div>
                ))}

                <div className="flex flex-col items-center gap-3 mt-10">
                    <button
                        ref={btnRef}
                        onClick={showAll ? handleShowLess : handleShowMore}
                        className="group relative inline-flex items-center gap-3 px-8 py-3.5 text-sm font-bold text-white rounded-full border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 hover:border-violet-400/50 transition-all duration-300 active:scale-95"
                        style={{ boxShadow: '0 0 30px rgba(139,92,246,0.15)' }}
                    >
                        <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                        {showAll ? 'Show Less' : `Show ${hidden} More Project${hidden > 1 ? 's' : ''}`}
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                            className={`transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`}>
                            <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    {!showAll && (
                        <p className="text-xs text-slate-600 font-mono">
                            {hidden} more project{hidden > 1 ? 's' : ''} hidden
                        </p>
                    )}
                </div>
            </div>

            <div className="absolute bottom-0 left-[6%] right-[6%] h-px bg-linear-to-r from-transparent via-white/5 to-transparent" />
        </section>
    )
}