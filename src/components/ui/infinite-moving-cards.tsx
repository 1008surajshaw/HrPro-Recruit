'use client'

import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Star } from 'lucide-react'

interface Testimonial {
  id: number
  name: string
  image: string
  rating: number
  content: string
}

export const InfiniteMovingCards = ({
  items,
  direction = 'left',
  speed = 'fast',
  pauseOnHover = true,
  className,
}: {
  items: Testimonial[]
  direction?: 'left' | 'right'
  speed?: 'fast' | 'normal' | 'slow'
  pauseOnHover?: boolean
  className?: string
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const scrollerRef = React.useRef<HTMLUListElement>(null)

  useEffect(() => {
    addAnimation()
  }, [])

  const [start, setStart] = useState(false)
  
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      getDirection()
      getSpeed()
      setStart(true)
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === 'left') {
        containerRef.current.style.setProperty('--animation-direction', 'forwards')
      } else {
        containerRef.current.style.setProperty('--animation-direction', 'reverse')
      }
    }
  }

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === 'fast') {
        containerRef.current.style.setProperty('--animation-duration', '20s')
      } else if (speed === 'normal') {
        containerRef.current.style.setProperty('--animation-duration', '40s')
      } else {
        containerRef.current.style.setProperty('--animation-duration', '80s')
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]',
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          'flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap',
          start && 'animate-scroll',
          pauseOnHover && 'hover:[animation-play-state:paused]'
        )}
      >
        {[...items, ...items].map((testimonial, idx) => (
          <li
            className="w-[350px] max-w-full relative rounded-2xl border border-border bg-card p-6 flex-shrink-0 md:w-[450px]"
            key={testimonial.id + idx}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative h-12 w-12">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-red-600 text-red-600" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-muted-foreground">{testimonial.content}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

