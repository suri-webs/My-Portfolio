"use client";
import { useState, useRef, useEffect } from "react";
import { Briefcase, Building2, Handshake, SmilePlus, ChevronDown, AlertCircle } from "lucide-react";

const FONT = "'Geist', 'Inter', system-ui, -apple-system, sans-serif"

const subjects = [
    { value: "Freelance Project",     icon: Briefcase,  label: "Freelance Project",     desc: "One-time or contract work",  color: "#a78bfa", glow: "rgba(167,139,250,0.15)" },
    { value: "Full-time Opportunity", icon: Building2,  label: "Full-time Opportunity", desc: "Looking to hire full-time",  color: "#38bdf8", glow: "rgba(56,189,248,0.15)"  },
    { value: "Collaboration",         icon: Handshake,  label: "Collaboration",         desc: "Build something together",   color: "#34d399", glow: "rgba(52,211,153,0.15)"  },
    { value: "Just Saying Hi",        icon: SmilePlus,  label: "Just Saying Hi",        desc: "No agenda, just vibes",      color: "#fb923c", glow: "rgba(251,146,60,0.15)"  },
]

interface Props { value: string; onChange: (v: string) => void; error?: string }

export default function SubjectSelector({ value, onChange, error }: Props) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const selected = subjects.find(s => s.value === value)

    useEffect(() => {
        const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
        document.addEventListener("mousedown", h)
        return () => document.removeEventListener("mousedown", h)
    }, [])

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>

            {/* Label */}
            <label style={{ fontSize: 11, fontWeight: 500, color: "#94a3b8", display: "flex", alignItems: "center", gap: 5, fontFamily: FONT }}>
                Reaching out about
                <span style={{ color: "#a78bfa", fontSize: 10 }}>*</span>
            </label>

            <div ref={ref} style={{ position: "relative" }}>

                {/* Trigger button */}
                <button
                    type="button"
                    onClick={() => setOpen(p => !p)}
                    style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 10,
                        padding: "10px 14px", borderRadius: 10, outline: "none",
                        background: "#0d0d16", cursor: "pointer",
                        border: error ? "1px solid rgba(239,68,68,0.55)" : open ? "1px solid rgba(139,92,246,0.65)" : "1px solid rgba(255,255,255,0.10)",
                        boxShadow: open ? "0 0 0 3px rgba(139,92,246,0.10), 0 8px 32px rgba(0,0,0,0.4)" : "none",
                        transition: "border 0.15s, box-shadow 0.15s",
                        fontFamily: FONT,
                    }}
                >
                    {selected ? (
                        <>
                            <span style={{ width: 22, height: 22, borderRadius: 6, background: selected.glow, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <selected.icon size={11} color={selected.color} />
                            </span>
                            <span style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 500 }}>{selected.label}</span>
                        </>
                    ) : (
                        <>
                            <Briefcase size={13} color="#475569" />
                            <span style={{ color: "#475569", fontSize: 13 }}>Select a reason...</span>
                        </>
                    )}
                    <ChevronDown size={13} color="#64748b" style={{ marginLeft: "auto", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
                </button>

                {/* Dropdown */}
                {open && (
                    <div style={{
                        position: "absolute", zIndex: 50, width: "100%", marginTop: 6,
                        borderRadius: 14, overflow: "hidden",
                        background: "#0d0d16",
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(139,92,246,0.08)",
                    }}>
                        <div style={{ padding: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                            {subjects.map(s => {
                                const active = value === s.value
                                return (
                                    <button
                                        key={s.value}
                                        type="button"
                                        onClick={() => { onChange(s.value); setOpen(false) }}
                                        style={{
                                            width: "100%", display: "flex", alignItems: "center", gap: 12,
                                            padding: "10px 12px", borderRadius: 10, border: "none",
                                            background: active ? s.glow : "transparent",
                                            cursor: "pointer", textAlign: "left",
                                            transition: "background 0.12s",
                                            fontFamily: FONT,
                                        }}
                                        onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)" }}
                                        onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent" }}
                                    >
                                        {/* Icon */}
                                        <span style={{
                                            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            background: active ? s.glow : "rgba(255,255,255,0.05)",
                                            border: `1px solid ${active ? s.color + "40" : "rgba(255,255,255,0.07)"}`,
                                        }}>
                                            <s.icon size={13} color={active ? s.color : "#64748b"} />
                                        </span>

                                        {/* Text */}
                                        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                                            <span style={{ fontSize: 13, fontWeight: 500, color: active ? s.color : "#e2e8f0", lineHeight: 1.2 }}>
                                                {s.label}
                                            </span>
                                            <span style={{ fontSize: 11, color: "#475569" }}>{s.desc}</span>
                                        </div>

                                        {/* Active dot */}
                                        {active && (
                                            <span style={{
                                                marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                                                background: s.color, boxShadow: `0 0 8px ${s.color}`,
                                            }} />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Error */}
            {error && (
                <p style={{ color: "#f87171", fontSize: 11, display: "flex", alignItems: "center", gap: 4, fontFamily: FONT }}>
                    <AlertCircle size={9} /> {error}
                </p>
            )}
        </div>
    )
}