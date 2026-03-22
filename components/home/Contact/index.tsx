"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ContactInfo from "./Contactinfo";
import ContactForm from "./Contactform";


gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const leftRef = useRef<HTMLDivElement>(null)
    const rightRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(leftRef.current, { x: -50, opacity: 0 })
            gsap.set(rightRef.current, { x: 50, opacity: 0 })

            gsap.to(leftRef.current, {
                x: 0, opacity: 1, ease: "power3.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 75%", end: "top 30%", scrub: 0.8 },
            })
            gsap.to(rightRef.current, {
                x: 0, opacity: 1, ease: "power3.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 75%", end: "top 25%", scrub: 0.8 },
            })
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    return (
        <section
            id="contact"
            ref={sectionRef}
            className="relative min-h-screen flex items-center py-28 overflow-hidden"
        >
            {/* Ambient glows */}
            <div className="absolute left-0 bottom-1/4 w-[600px] h-[600px] rounded-full bg-violet-900/8 blur-[140px] pointer-events-none -translate-x-1/2" />
            <div className="absolute right-0 top-1/4 w-[500px] h-[500px] rounded-full bg-fuchsia-900/6 blur-[120px] pointer-events-none translate-x-1/2" />

            <div className="w-[88%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">

                {/* Left */}
                <div ref={leftRef}>
                    <ContactInfo />
                </div>

                {/* Right — glass card */}
                <div ref={rightRef}>
                    <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.015] backdrop-blur-md p-8 md:p-10 overflow-hidden">
                        {/* Subtle top accent line */}
                        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
                        {/* Inner glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.035] via-transparent to-fuchsia-500/[0.02] pointer-events-none" />

                        <ContactForm />
                    </div>
                </div>

            </div>

            {/* Bottom divider */}
            <div className="absolute bottom-0 left-[6%] right-[6%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </section>
    )
}