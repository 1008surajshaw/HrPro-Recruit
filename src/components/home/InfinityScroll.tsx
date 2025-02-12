"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"


export const AnimatedStat = ({ end, label }: { end: number; label: string }) => {
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
    const duration = 2000
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

export const InfiniteScroll = ({ companies }: { companies: { icon: string; name: string }[] }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap my-8">
      <div className="inline-flex animate-scroll">
        {companies.concat(companies).map((company, i) => (
          <Image
            key={i}
            className="mx-4 w-24 h-20 md:w-28 md:h-24 object-contain"
            src={company.icon || "/placeholder.svg"}
            alt={`${company.name}-icon`}
            width={112}
            height={96}
          />
        ))}
      </div>
    </div>
  )
}
