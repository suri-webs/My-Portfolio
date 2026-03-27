"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { Send, CheckCircle2, User, Mail, Phone, MessageSquare, AlertCircle, Loader2 } from "lucide-react";
import SubjectSelector from "./Subjectselector";

const FONT = "'Geist', 'Inter', system-ui, -apple-system, sans-serif"
const MONO = "'Geist Mono', 'Fira Code', ui-monospace, monospace"

interface FD { fullname: string; email: string; phone: string; subject: string; message: string }
interface FE { fullname?: string; email?: string; subject?: string; message?: string }

export default function ContactForm() {
  const [fd, setFd]         = useState<FD>({ fullname:"", email:"", phone:"", subject:"", message:"" })
  const [err, setErr]       = useState<FE>({})
  const [busy, setBusy]     = useState(false)
  const [sent, setSent]     = useState(false)
  const [apiErr, setApiErr] = useState<string | null>(null)
  const [focus, setFocus]   = useState<string|null>(null)

  const validate = (): boolean => {
    const e: FE = {}
    if (!fd.fullname.trim())                  e.fullname = "Required"
    if (!fd.email.trim())                     e.email    = "Required"
    else if (!/\S+@\S+\.\S+/.test(fd.email)) e.email    = "Invalid email"
    if (!fd.subject)                          e.subject  = "Please select one"
    if (!fd.message.trim())                   e.message  = "Required"
    setErr(e); return !Object.keys(e).length
  }

  const onChange = (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFd(p => ({ ...p, [name]: value }))
    if (err[name as keyof FE]) setErr(p => ({ ...p, [name]: "" }))
    if (apiErr) setApiErr(null)
  }

  const onSubjectChange = (value: string) => {
    setFd(p => ({ ...p, subject: value }))
    if (err.subject) setErr(p => ({ ...p, subject: "" }))
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return

    setBusy(true)
    setApiErr(null)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fd),
      })

      const data = await res.json()

      if (!res.ok) {
        setApiErr(data?.error ?? "Something went wrong. Please try again.")
        return
      }

      setSent(true)
      setFd({ fullname:"", email:"", phone:"", subject:"", message:"" })
      setTimeout(() => setSent(false), 5000)
    } catch {
      setApiErr("Network error. Please check your connection and try again.")
    } finally {
      setBusy(false)
    }
  }

  const border = (n: string) =>
    err[n as keyof FE] ? "1px solid rgba(239,68,68,0.55)"  :
    focus === n         ? "1px solid rgba(139,92,246,0.65)" :
                          "1px solid rgba(255,255,255,0.10)"

  const iconClr = (n: string) =>
    err[n as keyof FE] ? "#f87171" : focus === n ? "#a78bfa" : "#475569"

  const input = (n: string): React.CSSProperties => ({
    width: "100%", background: "#0d0d16",
    color: "#e2e8f0", fontSize: "13px",
    fontFamily: FONT,
    padding: "10px 12px 10px 36px",
    border: border(n), borderRadius: "10px",
    outline: "none", transition: "border 0.15s",
  })

  const iconPos: React.CSSProperties    = { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }
  const iconPosTop: React.CSSProperties = { position: "absolute", left: 12, top: 11 }

  if (sent) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16, padding:"56px 0", textAlign:"center", fontFamily: FONT }}>
      <div style={{ width:60, height:60, borderRadius:"50%", background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <CheckCircle2 size={28} color="#34d399" />
      </div>
      <div>
        <p style={{ color:"#fff", fontWeight:600, fontSize:14, fontFamily: FONT }}>Message sent!</p>
        <p style={{ color:"#64748b", fontSize:12, marginTop:4, fontFamily: FONT }}>I&apos;ll reply within 24 hours.</p>
      </div>
    </div>
  )

  return (
    <form onSubmit={onSubmit} style={{ display:"flex", flexDirection:"column", gap:16, fontFamily: FONT }} noValidate>

      <Field label="Full Name" required error={err.fullname}>
        <User size={13} style={{ ...iconPos, color: iconClr("fullname") }} />
        <input type="text" name="fullname" value={fd.fullname} onChange={onChange}
          onFocus={()=>setFocus("fullname")} onBlur={()=>setFocus(null)}
          placeholder="FirstName LastName" style={input("fullname")} />
      </Field>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="Email" required error={err.email}>
          <Mail size={13} style={{ ...iconPos, color: iconClr("email") }} />
          <input type="email" name="email" value={fd.email} onChange={onChange}
            onFocus={()=>setFocus("email")} onBlur={()=>setFocus(null)}
            placeholder="you@example.com" style={input("email")} />
        </Field>
        <Field label="Phone" hint="optional">
          <Phone size={13} style={{ ...iconPos, color: iconClr("phone") }} />
          <input type="tel" name="phone" value={fd.phone} onChange={onChange}
            onFocus={()=>setFocus("phone")} onBlur={()=>setFocus(null)}
            placeholder="+91 888888 88888" style={input("phone")} />
        </Field>
      </div>

      <SubjectSelector value={fd.subject} onChange={onSubjectChange} error={err.subject} />

      <Field label="Message" required error={err.message}>
        <MessageSquare size={13} style={{ ...iconPosTop, color: iconClr("message") }} />
        <textarea name="message" value={fd.message} onChange={onChange} rows={4}
          onFocus={()=>setFocus("message")} onBlur={()=>setFocus(null)}
          placeholder="Tell me about your project..."
          style={{ ...input("message"), resize:"none", paddingTop:10 }} />
        <p style={{ textAlign:"right", fontSize:10, color:"#475569", fontFamily: MONO, marginTop:4 }}>
          {fd.message.length}/500
        </p>
      </Field>

      {/* API-level error banner */}
      {apiErr && (
        <div style={{
          display:"flex", alignItems:"center", gap:8,
          padding:"10px 12px", borderRadius:10,
          background:"rgba(239,68,68,0.08)",
          border:"1px solid rgba(239,68,68,0.25)",
          color:"#f87171", fontSize:12, fontFamily: FONT,
        }}>
          <AlertCircle size={13} style={{ flexShrink:0 }} />
          {apiErr}
        </div>
      )}

      <button type="submit" disabled={busy} style={{
        width:"100%", display:"flex", alignItems:"center", justifyContent:"center",
        gap:8, padding:"13px", fontSize:"13px", fontWeight:700,
        color:"#fff", fontFamily: FONT,
        border:"none", borderRadius:12, cursor: busy ? "not-allowed" : "pointer",
        background:"linear-gradient(135deg,#6d28d9,#9333ea,#c026d3)",
        boxShadow:"0 0 28px rgba(139,92,246,0.3)",
        opacity: busy ? 0.6 : 1, transition:"opacity 0.2s, transform 0.15s",
      }}>
        {busy
          ? <><Loader2 size={14} className="animate-spin" /> Sending...</>
          : <><Send size={13} /> Send Message</>
        }
      </button>
    </form>
  )
}

function Field({ label, required, hint, error, children }: {
  label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode
}) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <label style={{ fontSize:11, fontWeight:500, color:"#94a3b8", display:"flex", alignItems:"center", gap:5, fontFamily: FONT }}>
        {label}
        {required && <span style={{ color:"#a78bfa", fontSize:10 }}>*</span>}
        {hint     && <span style={{ color:"#475569", fontWeight:400 }}>({hint})</span>}
      </label>
      <div style={{ position:"relative" }}>{children}</div>
      {error && (
        <p style={{ color:"#f87171", fontSize:11, display:"flex", alignItems:"center", gap:4, fontFamily: FONT }}>
          <AlertCircle size={9} /> {error}
        </p>
      )}
    </div>
  )
}