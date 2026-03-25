'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const navLinks = [
    { label: 'About',      href: '#about'      },
    { label: 'Skills',     href: '#skills'     },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects',   href: '#projects'   },
    { label: 'Contact',    href: '#contact'    },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [active,   setActive]   = useState('')
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [menuOpen])

    const handleClick = (label: string) => {
        setActive(label)
        setMenuOpen(false)
    }

    return (
        <>
            {/* ── Desktop pill navbar ── */}
            <header className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
                <nav className={`pointer-events-auto hidden md:flex items-center gap-1 px-2 py-2 rounded-full border transition-all duration-500 ${
                    scrolled
                        ? 'bg-black/60 border-violet-500/20 backdrop-blur-xl shadow-[0_0_24px_rgba(139,92,246,0.12)]'
                        : 'bg-white/5 border-white/10 backdrop-blur-md'
                }`}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => handleClick(link.label)}
                            className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                                active === link.label
                                    ? 'text-white bg-violet-600/80 shadow-[0_0_12px_rgba(139,92,246,0.5)]'
                                    : 'text-slate-400 hover:text-white hover:bg-white/8'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* ── Hamburger button ── */}
                <button
                    onClick={() => setMenuOpen(v => !v)}
                    aria-label="Toggle menu"
                    style={{ zIndex: 60 }}
                    className={`pointer-events-auto md:hidden absolute right-4 top-0 w-11 h-11 rounded-full border flex flex-col items-center justify-center gap-[5px] transition-all duration-300 ${
                        scrolled || menuOpen
                            ? 'bg-black/70 border-violet-500/30 backdrop-blur-xl'
                            : 'bg-white/5 border-white/10 backdrop-blur-md'
                    }`}
                >
                    <span className={`w-[18px] h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
                    <span className={`w-[18px] h-[1.5px] bg-white rounded-full transition-all duration-200 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                    <span className={`w-[18px] h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
                </button>
            </header>

            {/* ── Mobile fullscreen overlay ── */}
            <div
                className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
                    menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                style={{ background: 'rgba(2,0,12,0.94)', backdropFilter: 'blur(24px)' }}
            >
                {/* Ambient glows */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-violet-800/15 blur-[90px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-fuchsia-900/10 blur-[80px]" />
                </div>

                <nav className="relative h-full flex flex-col items-center justify-center gap-1 px-8">
                    {navLinks.map((link, i) => (
                        // ✅ Fix: split shorthand 'transition' into individual properties
                        // so transitionDelay doesn't conflict with the transition shorthand
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => handleClick(link.label)}
                            className={`w-full max-w-xs flex items-center gap-4 px-6 py-4 rounded-2xl group ${
                                active === link.label
                                    ? 'bg-violet-600/20 border border-violet-500/35'
                                    : 'border border-transparent hover:bg-white/4 hover:border-white/8'
                            }`}
                            style={{
                                opacity:                 menuOpen ? 1 : 0,
                                transform:               menuOpen ? 'translateY(0px)' : 'translateY(16px)',
                                transitionProperty:      'opacity, transform',
                                transitionDuration:      '340ms',
                                transitionTimingFunction:'cubic-bezier(0.22, 1, 0.36, 1)',
                                transitionDelay:         `${i * 55}ms`,
                            }}
                        >
                            <span className="text-[11px] font-mono text-violet-500/60 w-5 shrink-0">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className={`text-xl font-bold tracking-tight transition-colors duration-200 ${
                                active === link.label ? 'text-white' : 'text-slate-300 group-hover:text-white'
                            }`}>
                                {link.label}
                            </span>
                            {active === link.label && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(139,92,246,0.8)]" />
                            )}
                        </Link>
                    ))}

                    <p className="absolute bottom-10 text-[11px] text-slate-700 font-mono tracking-widest uppercase">
                        suraj.dev
                    </p>
                </nav>
            </div>
        </>
    )
}