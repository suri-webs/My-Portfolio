'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projectsData } from '@/utils/data/Projectsdata'
import { ProjectRow } from './Projectrow'


gsap.registerPlugin(ScrollTrigger)

const INITIAL_COUNT = 4

export default function Projects() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const labelRef = useRef<HTMLParagraphElement>(null)
    const headingRef = useRef<HTMLHeadingElement>(null)
    const subRef = useRef<HTMLParagraphElement>(null)
    const btnRef = useRef<HTMLButtonElement>(null)
    const [showAll, setShowAll] = useState(false)

    const visible = showAll ? projectsData : projectsData.slice(0, INITIAL_COUNT)
    const hidden = projectsData.length - INITIAL_COUNT

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from([labelRef.current, headingRef.current, subRef.current], {
                y: -24, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', toggleActions: 'play none none reverse' },
            })
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    // Animate new rows in when Show More clicked
    const handleShowMore = () => {
        setShowAll(true)
        // slight delay so DOM renders first
        setTimeout(() => {
            const newRows = document.querySelectorAll('.project-extra-row')
            gsap.from(newRows, {
                y: 60, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
            })
            ScrollTrigger.refresh()
        }, 50)
    }

    const handleShowLess = () => {
        setShowAll(false)
        // Scroll back up to section top smoothly
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <section id="projects" ref={sectionRef} className="relative py-24 overflow-hidden">

            {/* Ambient bg */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-1/4 top-0 w-175 h-175 rounded-full bg-violet-900/6 blur-[160px]" />
                <div className="absolute right-1/4 bottom-0 w-125 h-125 rounded-full bg-fuchsia-900/6 blur-[130px]" />
            </div>

            <div className="w-[88%] mx-auto relative z-10">

                {/* Header */}
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

                <div className="h-px w-full bg-linear-to-r from-violet-500/25 via-white/5 to-transparent mb-2" />

                {/* Rows */}
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

                {/* Show More / Less */}
                <div className="flex flex-col items-center gap-3 mt-10">

                    <button
                        ref={btnRef}
                        onClick={showAll ? handleShowLess : handleShowMore}
                        className="group relative inline-flex items-center gap-3 px-8 py-3.5 text-sm font-bold text-white rounded-full border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 hover:border-violet-400/50 transition-all duration-300 hover:scale-105 active:scale-95"
                        style={{ boxShadow: '0 0 30px rgba(139,92,246,0.15)' }}
                    >
                        <span
                            className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"
                        />
                        {showAll
                            ? 'Show Less'
                            : `Show ${hidden} More Project${hidden > 1 ? 's' : ''}`
                        }
                        <svg
                            width="14" height="14" viewBox="0 0 14 14" fill="none"
                            className={`transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`}
                        >
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