'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/home/header'
import Loader from '@/components/home/Loader'
import Navbar from '@/components/home/Navbar'
import StarField from '@/components/home/Starfield'
import Skills from '@/components/home/skills'
import Experience from '@/components/home/Experience'
import Projects from '@/components/home/Projects'
import Contact from '@/components/home/Contact'

export default function Home() {
  const [loading, setLoading] = useState(true)

  // Enable smooth scroll on mount
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => { document.documentElement.style.scrollBehavior = '' }
  }, [])

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}

      <StarField />

      <div className={`transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
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