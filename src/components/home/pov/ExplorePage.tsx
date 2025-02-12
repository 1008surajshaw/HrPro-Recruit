"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { MoveDown } from "lucide-react"
import { trustedCompanies } from '@/lib/constant/app.constant';
import Image from "next/image";
import { InfiniteScroll } from "../InfinityScroll";

const AnimatedStat = ({ end, label }: { end: number; label: string }) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let start = 0
    const duration = 4000
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }, [end, isVisible])

  return (
    <div ref={ref} className="space-y-2">
      <h2 className="text-5xl font-bold text-red-600 dark:text-red-500 sm:text-6xl">{count.toLocaleString()}+</h2>
      <p className="text-lg text-muted-foreground">{label}</p>
    </div>
  )
}

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-zinc-950 pt-10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Where startups and job seekers connect
        </h1>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="min-w-[200px] bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
          >
            Find your next hire
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="min-w-[200px] border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700
                       dark:border-red-500 dark:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400"
          >
            Find your next job
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex justify-center">
          <MoveDown className="h-8 w-8 animate-bounce text-muted-foreground" />
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-1 gap-12 sm:grid-cols-3">
          <AnimatedStat end={80000} label="Matches Made" />
          <AnimatedStat end={16700} label="Tech Jobs" />
          <AnimatedStat end={1000000} label="Startup Ready Candidates" />
        </div>
      </div>
      <InfiniteScroll companies={trustedCompanies} />
    </div>
  )
}

