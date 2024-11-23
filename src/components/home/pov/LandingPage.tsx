'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className=" bg-red-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <section className="px-4 py-12 md:py-12 lg:py-32 mx-auto max-w-screen-xl">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="space-y-6 flex-1 text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              <span className="text-red-600 dark:text-red-500">19,670 Jobs</span> for you
            </h1>
            <p className="max-w-[600px] text-gray-700 dark:text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto lg:mx-0">
              Find your dream job from our vast selection of opportunities. We connect talented professionals with top companies across various industries.
            </p>
            <div>
              <Button size="lg" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white" onClick={()=>router.push('/jobs')}>
                Explore Now
              </Button>
            </div>
          </div>
          <div className="flex-1 w-full max-w-xl">
            <Image
              src="/landingPage/landingPage.png"
              alt="Job search illustration"
              width={500}
              height={500}
              className="w-full h-auto object-cover rounded-lg shadow-xl"
              priority
            />
          </div>
        </div>
      </section>
    </div>
  )
}