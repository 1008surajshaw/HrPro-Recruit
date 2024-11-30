'use client'

import React from 'react'
import { InfiniteMovingCards } from '../ui/infinite-moving-cards'
import user1 from '../../../public/user/user1.png'
import user2 from '../../../public/user/user2.png'
import user3 from '../../../public/user/user3.png'
import user4 from '../../../public/user/user4.png'
import user5 from '../../../public/user/user5.png'
import Image from 'next/image';
import { trustedCompanies } from '@/lib/constant/app.constant';

const testimonials = [
  {
    id: 1,
    name: "Joshua Davis",
    image: user1.src,
    rating: 5,
    content: "The platform completely transformed my job search. Found my dream position within weeks!"
  },
  {
    id: 2,
    name: "Sarah Walker",
    image: user2.src,
    rating: 5,
    content: "Incredible tool for both job seekers and employers. The matching algorithm is spot-on!"
  },
  {
    id: 3,
    name: "Ashley Gonzales",
    image: user3.src,
    rating: 5,
    content: "Best job platform I've ever used. The interface is intuitive and the results are amazing."
  },
  {
    id: 4,
    name: "Rafael Gomez",
    image: user4.src,
    rating: 5,
    content: "Found quality candidates quickly. The filtering options made it easy to find the right fit."
  },
  {
    id: 5,
    name: "John Hill",
    image: user5.src,
    rating: 5,
    content: "The platform's AI matching saved us so much time in the hiring process. Highly recommend!"
  }
]

export default function Testimonials() {
  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-gray-900 items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-6xl flex flex-col items-center justify-center space-y-4 px-4 md:px-6 py-8">
        <h2 className="font-bold text-3xl md:text-4xl text-center mb-2 text-foreground">
          Hear from our awesome users!
        </h2>
        <p className="text-sm md:text-base text-center mb-8 text-muted-foreground">
          Real Success Stories from Job Seekers and Employers
        </p>
        <div className="flex flex-col gap-6 w-full">
          <InfiniteMovingCards
            items={testimonials}
            direction="left"
            speed="slow"
          />
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-6 grid-cols-2 items-center gap-1 md:mt-0 mt-4 dark:bg-gray-900 my-8">
              {trustedCompanies.map((company, i) => (
                <Image
                  key={i}
                  className="mx-4 md:w-28 w-24 h-20 md:h-24"
                  src={company.icon}
                  alt={`${company.name}-icon`}
                />
              ))}
        </div>
    </div>
  )
}

