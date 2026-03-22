"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { Send, CheckCircle2, User, Mail, Phone, MessageSquare, Briefcase, Building2, Handshake, SmilePlus, AlertCircle, Loader2 } from "lucide-react";

interface FD { fullname: string; email: string; phone: string; subject: string; message: string }
interface FE { fullname?: string; email?: string; subject?: string; message?: string }

const subjects = [
  { value: "Freelance Project",     icon: Briefcase,  label: "Freelance Project"     },
  { value: "Full-time Opportunity", icon: Building2,  label: "Full-time Opportunity" },
  { value: "Collaboration",         icon: Handshake,  label: "Collaboration"         },
  { value: "Just Saying Hi",        icon: SmilePlus,  label: "Just Saying Hi"        },
]

export default function ContactForm() {
  const [fd, setFd]       = useState<FD>({ fullname:"", email:"", phone:"", subject:"", message:"" })
  const [err, setErr]     = useState<FE>({})
  const [busy, setBusy]   = useState(false)
  const [sent, setSent]   = useState(false)
  const [focus, setFocus] = useState<string|null>(null)

  const validate = (): boolean => {
    const e: FE = {}
    if (!fd.fullname.trim())              e.fullname = "Required"
    if (!fd.email.trim())                 e.email    = "Required"
    else if (!/\S+@\S+\.\S+/.test(fd.email)) e.email = "Invalid email"
    if (!fd.subject)                      e.subject  = "Please select one"
    if (!fd.message.trim())               e.message  = "Required"
    setErr(e); return !Object.keys(e).length
  }

  const onChange = (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
    const { name, value } = e.target
    setFd(p => ({ ...p, [name]: value }))
    if (err[name as keyof FE]) setErr(p => ({ ...p, [name]: "" }))
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); if (!validate()) return
    setBusy(true)
    await new Promise(r => setTimeout(r, 1200)) // replace with fetch("/api/contact", ...)
    setBusy(false); setSent(true)
    setFd({ fullname:"", email:"", phone:"", subject:"", message:"" })
    setTimeout(() => setSent(false), 5000)
  }

  const ring = (n: string) => err[n as keyof FE] ? "ring-red-500/40" : focus===n ? "ring-violet-500/40" : "ring-white/[0.06]"
  const ic   = (n: string) => err[n as keyof FE] ? "text-red-400" : focus===n ? "text-violet-400" : "text-slate-700"
  const base = "w-full bg-[#0a0a10] text-white text-sm placeholder:text-slate-700 rounded-lg pl-9 pr-3.5 py-2.5 outline-none ring-1 transition-all duration-150"

  if (sent) return (
    <div className="flex flex-col items-center gap-4 py-14 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
        <CheckCircle2 size={30} className="text-emerald-400" />
      </div>
      <div>
        <p className="text-white font-bold">Message sent!</p>
        <p className="text-slate-600 text-sm mt-0.5">I&apos;ll reply within 24 hours.</p>
      </div>
    </div>
  )

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>

      {/* Name */}
      <Field label="Full Name" required error={err.fullname}>
        <User size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${ic("fullname")}`} />
        <input type="text" name="fullname" value={fd.fullname} onChange={onChange}
          onFocus={()=>setFocus("fullname")} onBlur={()=>setFocus(null)}
          placeholder="Suraj Sharma" className={`${base} ${ring("fullname")}`} />
      </Field>

      {/* Email + Phone */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Email" required error={err.email}>
          <Mail size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${ic("email")}`} />
          <input type="email" name="email" value={fd.email} onChange={onChange}
            onFocus={()=>setFocus("email")} onBlur={()=>setFocus(null)}
            placeholder="you@example.com" className={`${base} ${ring("email")}`} />
        </Field>
        <Field label="Phone" hint="optional">
          <Phone size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${ic("phone")}`} />
          <input type="tel" name="phone" value={fd.phone} onChange={onChange}
            onFocus={()=>setFocus("phone")} onBlur={()=>setFocus(null)}
            placeholder="+91 98765 43210" className={`${base} ${ring("phone")}`} />
        </Field>
      </div>

      {/* Subject — select tag */}
      <Field label="Reaching out about" required error={err.subject}>
        <Briefcase size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${ic("subject")}`} />
        <select name="subject" value={fd.subject} onChange={onChange}
          onFocus={()=>setFocus("subject")} onBlur={()=>setFocus(null)}
          className={`${base} ${ring("subject")} cursor-pointer appearance-none`}
        >
          <option value="" disabled className="bg-[#0a0a10]">Select a reason...</option>
          {subjects.map(s => (
            <option key={s.value} value={s.value} className="bg-[#0a0a10]">{s.label}</option>
          ))}
        </select>
      </Field>

      {/* Message */}
      <Field label="Message" required error={err.message}>
        <MessageSquare size={13} className={`absolute left-3 top-3 ${ic("message")}`} />
        <textarea name="message" value={fd.message} onChange={onChange} rows={4}
          onFocus={()=>setFocus("message")} onBlur={()=>setFocus(null)}
          placeholder="Tell me about your project..."
          className={`${base} ${ring("message")} resize-none`} />
        <p className="text-right text-[10px] text-slate-700 font-mono mt-1">{fd.message.length}/500</p>
      </Field>

      <button type="submit" disabled={busy}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white mt-1 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        style={{ background:"linear-gradient(135deg,#6d28d9,#9333ea,#c026d3)", boxShadow:"0 0 24px rgba(139,92,246,0.25)" }}
      >
        {busy ? <><Loader2 size={14} className="animate-spin"/>Sending...</> : <><Send size={13}/>Send Message</>}
      </button>
    </form>
  )
}

function Field({ label, required, hint, error, children }: {
  label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-medium text-slate-600 flex items-center gap-1.5">
        {label}
        {required && <span className="text-violet-500 text-[10px]">*</span>}
        {hint && <span className="text-slate-700 font-normal">({hint})</span>}
      </label>
      <div className="relative">{children}</div>
      {error && <p className="text-red-400 text-[11px] flex items-center gap-1"><AlertCircle size={9}/>{error}</p>}
    </div>
  )
}