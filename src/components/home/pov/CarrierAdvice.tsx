'use client'
import React from 'react'
import advice1 from "../../../../public/landingPage/advice1.png"
import advice2 from "../../../../public/landingPage/advice2.png"
import advice3 from "../../../../public/landingPage/advice3.png"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from 'lucide-react'
import Image from 'next/image'
import greatProfile from '../../../../public/landingPage/greatProfile.png'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { authOptions } from '@/lib/authOptions'
const CarrierAdvice = () => {
  const router = useRouter()
  const articles = [
    {
      category: "Do consectetur",
      title: "Aliqua Irure Tempor Lorem Occaecat Volup",
      date: "Dec 22, 2023",
      readTime: "5 mins read",
      image: advice1,
    },
    {
      category: "Consequat labore",
      title: "Commodo Deserunt Ipsum Occaecat Qui",
      date: "Dec 22, 2023",
      readTime: "15 mins read",
      image: advice2,
    },
    {
      category: "Do consectetur",
      title: "Eu labore ex nostrud fugiat sit non nulla",
      date: "Dec 22, 2023",
      readTime: "5 mins read",
      image: advice3,
    },
  ]

  const session = useSession();

  
  const handleProfile = ()=>{
    
    if(!session.data?.user ){
      return
    }
    router.push(`/profile/${session.data?.user.id }`)  
  }

  return (
    <div className="w-full">
    {/* Hero Section */}
    <section className=" overflow-hidden bg-red-50 dark:bg-red-950/20">
      <div className="flex flex-col lg:flex-row  px-4 py-8 md:py-10 justify-end items-center">
        <div className=" z-10 max-w-xl ">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-5xl">
            Build a great profile
          </h1>
          <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
            Do consectetur proident proident id eluimod deserunt consequat pariatur ad ex velit do Lorem reprehenderit.
          </p>
          <Button size="lg" className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800" onClick={() =>handleProfile()}>
            Create
          </Button>
        </div>
        <div className=" h-full w-1/2 flex items-center justify-center">
            <Image src={ greatProfile} alt='advice' className='h-96 w-96'/>
        </div>
      </div>
    </section>

    {/* Articles Section */}
    <section className="bg-white px-4 py-16 dark:bg-gray-950 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-4xl">
            Career advices from HR Insiders
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Exercitation dolore reprehenderit fugi
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="p-0">
                <Image
                  alt={article.title}
                  className="h-48 w-full object-cover"
                  src={article.image}
                />
              </CardHeader>
              <CardContent className="p-6">
                <Badge variant="secondary" className="mb-2">
                  {article.category}
                </Badge>
                <h3 className="mb-2 line-clamp-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {article.title}
                </h3>
              </CardContent>
              <CardFooter className="flex items-center gap-4 border-t p-6">
                <span className="text-sm text-gray-600 dark:text-gray-400">{article.date}</span>
                <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  {article.readTime}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-red-600 text-red-600 hover:bg-red-50 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-950"
          >
            See more articles
          </Button>
        </div>
      </div>
    </section>
  </div>
  )
}

export default CarrierAdvice