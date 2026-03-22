'use client'

import { useState, useEffect } from 'react'

export default function Loader({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        // Lock scroll while loading
        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflow = 'hidden'

        const duration = 2200
        const interval = 16
        const steps = duration / interval
        let current = 0

        const timer = setInterval(() => {
            current++
            const t = current / steps
            const eased = 1 - Math.pow(1 - t, 3)
            setProgress(Math.min(Math.round(eased * 100), 100))

            if (current >= steps) {
                clearInterval(timer)
                setTimeout(() => {
                    // Unlock scroll when done
                    document.body.style.overflow = ''
                    document.documentElement.style.overflow = ''
                    onComplete()
                }, 400)
            }
        }, interval)

        return () => {
            clearInterval(timer)
            document.body.style.overflow = ''
            document.documentElement.style.overflow = ''
        }
    }, [onComplete])

    return (
        <div
            className="fixed inset-0 flex items-center justify-center"
            style={{
                zIndex: 9999,
                background: 'radial-gradient(ellipse at 60% 40%, #1a1a1a 0%, #0d0d0d 60%, #000 100%)',
                // Fix for mobile: use 100dvh (dynamic viewport height)
                height: '100dvh',
                width: '100dvw',
                top: 0,
                left: 0,
                position: 'fixed',
                // Prevent iOS bounce scroll from showing page behind
                touchAction: 'none',
                overscrollBehavior: 'none',
            }}
        >
            <div className="flex flex-col items-center gap-3.5">

                {/* Label */}
                <span
                    style={{
                        fontSize: '11px',
                        fontWeight: 300,
                        letterSpacing: '0.45em',
                        color: 'rgba(255,255,255,0.8)',
                        textTransform: 'uppercase',
                    }}
                >
                    Loading
                </span>

                {/* Progress Track */}
                <div
                    style={{
                        position: 'relative',
                        width: '176px',
                        height: '1px',
                        background: 'rgba(255,255,255,0.1)',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            height: '100%',
                            width: `${progress}%`,
                            background: 'rgba(255,255,255,0.75)',
                            transition: 'width 50ms linear',
                            boxShadow: '0 0 6px rgba(255,255,255,0.3)',
                        }}
                    />
                </div>

                {/* Percentage */}
                <span
                    style={{
                        fontSize: '11px',
                        fontWeight: 300,
                        letterSpacing: '0.25em',
                        color: 'rgba(255,255,255,0.5)',
                    }}
                >
                    {progress}%
                </span>

            </div>
        </div>
    )
}