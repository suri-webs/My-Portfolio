"use client";
import { Mail, Phone, MapPin, ArrowRight, Github, Linkedin, Twitter, CheckCircle2, Sparkles, Clock } from "lucide-react";
import Link from "next/link";

const info = [
  { icon: Mail, label: "Email", value: "shakyasuraj595@gmail.com", href: "mailto:shakyasuraj595@gmail.com" },
  { icon: Phone, label: "Phone", value: "+91 78277 72990", href: "tel:+917827772990" },
  { icon: MapPin, label: "Location", value: "Delhi, India", href: "#" },
]
const socials = [
  { icon: Github, label: "GitHub", href: "https://github.com/suri-webs" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/feed/" },
]
const chips = [
  { icon: CheckCircle2, text: "Available for freelance", cls: "text-emerald-400" },
  { icon: Sparkles, text: "Open to full-time roles", cls: "text-violet-400" },
  { icon: Clock, text: "Fast response turnaround", cls: "text-sky-400" },
]

export default function ContactInfo() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-[11px] font-mono tracking-[0.3em] text-violet-400/50 uppercase mb-4">05 / Contact</p>
        <h2 className="text-5xl md:text-[3.5rem] font-black text-white tracking-tight leading-[1.05] mb-4">
          Let&apos;s build{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-fuchsia-400">something.</span>
        </h2>
        <p className="text-slate-500 text-[15px] leading-relaxed max-w-sm">
          Whether you&apos;re a <span className="text-white/80">client</span> or a{" "}
          <span className="text-white/80">company hiring</span> — my inbox is always open.
        </p>
      </div>

      {/* Status chips */}
      <div className="flex flex-wrap gap-2">
        {chips.map(({ icon: Icon, text, cls }) => (
          <span key={text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.07] bg-white/3 text-xs text-slate-400">
            <Icon size={11} className={cls} /> {text}
          </span>
        ))}
      </div>

      {/* Contact rows */}
      <div className="flex flex-col gap-1.5">
        {info.map(({ icon: Icon, label, value, href }) => (
          <a key={label} href={href}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-transparent hover:border-white/[0.07] hover:bg-white/3 transition-all duration-200 group"
          >
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/15 flex items-center justify-center shrink-0">
              <Icon size={13} className="text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-slate-700 font-mono uppercase tracking-widest">{label}</p>
              <p className="text-white/80 text-sm font-medium truncate group-hover:text-white transition-colors">{value}</p>
            </div>
            <ArrowRight size={12} className="text-slate-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
          </a>
        ))}
      </div>

      <div className="h-px bg-white/5" />

      <div className="flex items-center gap-2.5">
        <span className="text-[10px] text-slate-200 font-mono uppercase tracking-widest">Find me on</span>
        {socials.map(({ icon: Icon, label, href }) => (
          <Link key={label} href={href} target="_blank" rel="noopener noreferrer" title={label}
            className="w-8 h-8 rounded-full border border-white/10 bg-white/2 flex items-center justify-center text-slate-200 hover:text-white hover:border-violet-500/30 hover:bg-violet-500/8 transition-all duration-200 hover:scale-110"
          >
            <Icon size={14} />
          </Link>
        ))}
      </div>
    </div>
  )
}