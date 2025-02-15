'use client'

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from "next/link";

import povImage from "../../../../public/Humaaans2.png";


export default function LandingPage() {

  return (
    <div className="w-full flex h-screen">
    <div className="w-1/2 grid gap-4  pt-24">
      <h1
        className={`font-satoshi text-center font-medium text-[5rem] leading-[4.5rem] tracking-normal`}
      >
        Job or Employee <br /> we search both <br /> for you!{" "}
      </h1>
      <p className="text-textLight font-light text-[18px] text-center -mt-5 px-12">
        Our portal serves as a dynamic hub, catering to both employers seeking
        talented candidates and individuals in pursuit of their ideal job
        opportunities.
      </p>
      <Link
        href="/signup"
        className="px-8 py-2 h-12 rounded-md border border-red-600 w-44 text-lg font-medium text-red-600 mx-auto hover:bg-primary hover:text-white "
      >
        Join now!
      </Link>
    </div>
    <div className="w-1/2">
      <Image src={povImage} width={700} height={700} alt="Pov image" />
    </div>
  </div>
  )
}