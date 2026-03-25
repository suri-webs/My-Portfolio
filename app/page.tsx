'use client'

import { useState, useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Header from '@/components/home/header'
import Loader from '@/components/home/Loader'
import Navbar from '@/components/home/Navbar'
import StarField from '@/components/home/Starfield'
import Skills from '@/components/home/skills'
import Experience from '@/components/home/Experience'
import Projects from '@/components/home/Projects'
import Contact from '@/components/home/Contact'
import PostLoader from '@/components/home/Postloader'

gsap.registerPlugin(ScrollTrigger)

export let lenisInstance: Lenis | null = null

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [showPostLoader, setShowPostLoader] = useState(false)
  const [mainVisible, setMainVisible] = useState(false)

  useEffect(() => {
    // ✅ Always start at top on mount
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
      infinite: false,
    })

    lenisInstance = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tickerFn = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenisInstance = null
      lenis.destroy()
      gsap.ticker.remove(tickerFn)
    }
  }, [])

  const handleLoaderComplete = () => {
    setLoading(false)
    setShowPostLoader(true)
  }

  const handleExplore = () => {
    setShowPostLoader(false)
    setMainVisible(true)

    // ✅ Scroll to top via Lenis so it's in sync, then refresh ScrollTrigger
    setTimeout(() => {
      lenisInstance?.scrollTo(0, { immediate: true })
      window.scrollTo(0, 0)
      ScrollTrigger.refresh()
    }, 50)
  }

  return (
    <>
      {loading && <Loader onComplete={handleLoaderComplete} />}

      <StarField />

      {showPostLoader && <PostLoader onExplore={handleExplore} />}

      <div
        style={{
          opacity: mainVisible ? 1 : 0,
          transition: 'opacity 0.8s ease',
          pointerEvents: mainVisible ? 'auto' : 'none',
        }}
      >
        <Navbar />
        <main className="min-h-screen flex items-center justify-center text-white">
          <Header />
        </main>
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </div>
    </>
  )
}