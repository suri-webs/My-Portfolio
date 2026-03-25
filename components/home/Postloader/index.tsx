'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ArrowDown, Minus } from 'lucide-react'

interface Props { onExplore: () => void }

export default function PostLoader({ onExplore }: Props) {
    const curtainRef = useRef<HTMLDivElement>(null)
    const nameRef    = useRef<HTMLHeadingElement>(null)
    const roleRef    = useRef<HTMLParagraphElement>(null)
    const btnRef     = useRef<HTMLButtonElement>(null)
    const lineRef    = useRef<HTMLDivElement>(null)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        const t = setTimeout(() => {
            setReady(true)
            requestAnimationFrame(() => {
                gsap.set([nameRef.current, roleRef.current, btnRef.current], { y: 30, opacity: 0 })
                gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'center' })
                const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
                tl.to(lineRef.current, { scaleX: 1, duration: 0.8, ease: 'expo.out' })
                tl.to(nameRef.current, { y: 0, opacity: 1, duration: 0.7 }, '-=0.5')
                tl.to(roleRef.current, { y: 0, opacity: 1, duration: 0.6 }, '-=0.45')
                tl.to(btnRef.current,  { y: 0, opacity: 1, duration: 0.55, ease: 'back.out(2)' }, '-=0.35')
            })
        }, 80)
        return () => { clearTimeout(t); document.body.style.overflow = '' }
    }, [])

    const handleExplore = () => {
        document.body.style.overflow = ''
        const tl = gsap.timeline({ onComplete: onExplore, defaults: { ease: 'power4.in' } })
        tl.to([nameRef.current, roleRef.current, btnRef.current], { y: -30, opacity: 0, duration: 0.3, stagger: 0.06 }, 0)
        tl.to(lineRef.current,    { scaleX: 0, duration: 0.35 }, 0.05)
        tl.to(curtainRef.current, { yPercent: -100, duration: 0.85, ease: 'power4.inOut' }, 0.2)
    }

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, pointerEvents: 'none' }}>
            <div ref={curtainRef} style={{
                position: 'absolute', inset: 0,
                backgroundColor: '#06060a',
                background: 'radial-gradient(ellipse at 50% 50%, #111118 0%, #06060a 60%, #000 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'auto', overflow: 'hidden',
            }}>
      
                <div style={{
                    position: 'absolute', width: '600px', height: '600px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(100,60,255,0.09) 0%, transparent 65%)',
                    pointerEvents: 'none', animation: 'pulse 4s ease-in-out infinite',
                }} />

                {ready && (
                    <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px' }}>

                        {/* Line — Lucide Minus icon as decorative divider */}
                        <div ref={lineRef} style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
                            <Minus size={32} strokeWidth={1} color="rgba(255,255,255,0.28)" />
                        </div>

                        {/* Name */}
                        <h1 ref={nameRef} style={{
                            fontSize: 'clamp(4rem, 12vw, 8rem)',
                            fontWeight: 800, letterSpacing: '-0.045em',
                            color: '#fff', lineHeight: 0.9,
                            fontStyle: 'italic', margin: '0 0 20px',
                        }}>
                            Suraj
                        </h1>

                        {/* Role */}
                        <p ref={roleRef} style={{
                            fontSize: '10px', fontWeight: 400,
                            letterSpacing: '0.5em', textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.3)', margin: '0 0 40px',
                        }}>
                            Frontend Developer
                        </p>

                        {/* Button with Lucide ArrowDown */}
                        <button
                            ref={btnRef}
                            onClick={handleExplore}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '10px',
                                padding: '13px 34px', fontSize: '10px', fontWeight: 500,
                                letterSpacing: '0.42em', textTransform: 'uppercase',
                                color: '#fff', background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.18)',
                                borderRadius: '9px', cursor: 'pointer', outline: 'none',
                                transition: 'all 0.25s',
                            }}
                            onMouseEnter={e => {
                                const b = e.currentTarget
                                b.style.borderColor = 'rgba(130,90,255,0.7)'
                                b.style.background  = 'rgba(100,60,255,0.1)'
                                b.style.boxShadow   = '0 0 32px rgba(100,60,255,0.25)'
                            }}
                            onMouseLeave={e => {
                                const b = e.currentTarget
                                b.style.borderColor = 'rgba(255,255,255,0.18)'
                                b.style.background  = 'transparent'
                                b.style.boxShadow   = 'none'
                            }}
                        >
                            Explore
                            <ArrowDown size={13} strokeWidth={1.8} />
                        </button>

                        {/* Hint */}
                        <p style={{
                            marginTop: '20px', fontSize: '9px', letterSpacing: '0.32em',
                            textTransform: 'uppercase', color: 'rgba(255,255,255,0.15)',
                            animation: 'blink 2.5s ease-in-out infinite',
                        }}>
                            click to enter
                        </p>

                    </div>
                )}
            </div>
        </div>
    )
}