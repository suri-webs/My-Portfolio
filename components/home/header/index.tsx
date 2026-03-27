'use client'

import Link from "next/link"

export default function Header() {
    return (
        <section className="relative w-[90%] h-screen flex flex-col justify-center gap-7">

            {/* Code line */}
            <p className="font-mono text-sm">
                <span className="text-slate-500">const </span>
                <span className="text-violet-400">Suraj</span>
                <span className="text-slate-500"> = (name, passion) </span>
                <span className="text-rose-400">⇒</span>
            </p>

            {/* Heading */}
            <h1 className="text-4xl md:text-8xl font-extrabold leading-tight tracking-tight">
                <span className="text-transparent bg-clip-text bg-linear-to-br from-violet-300 via-fuchsia-300 to-indigo-400">
                    Hi, I&apos;m Suraj
                </span>
            </h1>

            {/* Description */}
            <p className="text-slate-400 text-base md:text-lg max-w-xl leading-relaxed">
                Creative Frontend Developer focused on building dynamic, responsive interfaces with React, dedicated to crafting seamless user experiences through modern web technologies.
            </p>

            {/* CTA Button */}
            <div>
                <Link href={'#projects'}>
                    <button className="flex items-center gap-2 bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 active:scale-95 transition-all duration-200 text-white font-semibold text-sm px-7 py-3.5 rounded-full cursor-pointer shadow-[0_0_24px_rgba(139,92,246,0.4)] hover:shadow-[0_0_32px_rgba(139,92,246,0.6)]">
                        <span className="text-fuchsia-200">✦</span>
                        Checkout my Projects
                    </button>
                </Link>
            </div>

        </section>
    )
}