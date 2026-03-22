'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [active, setActive] = useState('')

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <nav
                className={`pointer-events-auto flex items-center gap-1 px-2 py-2 rounded-full border transition-all duration-500 ${scrolled
                        ? 'bg-black/60 border-violet-500/20 backdrop-blur-xl shadow-[0_0_24px_rgba(139,92,246,0.12)]'
                        : 'bg-white/5 border-white/10 backdrop-blur-md'
                    }`}
            >
                {navLinks.map((link) => (
                    <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setActive(link.label)}
                        className={`relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${active === link.label
                                ? 'text-white bg-violet-600/80 shadow-[0_0_12px_rgba(139,92,246,0.5)]'
                                : 'text-slate-400 hover:text-white hover:bg-white/8'
                            }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </header>
    )
}