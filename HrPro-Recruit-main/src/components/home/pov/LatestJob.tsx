'use client'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Building2, Clock } from 'lucide-react'
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function LatestJobs() {
  const jobs = [
    {
      logo: "/placeholder.svg?height=40&width=40",
      title: "UI / UX Designer",
      company: "Laborum",
      salary: "$95K - $120K",
      location: "Tucson, AZ",
      type: "Onsite",
      isHot: true,
    },
    {
      logo: "/placeholder.svg?height=40&width=40",
      title: "C# Developer",
      company: "Peratur",
      salary: "$110K - $130K",
      location: "Columbus, OH",
      type: "Hybrid",
    },
    {
      logo: "/placeholder.svg?height=40&width=40",
      title: "ReactJS Developer",
      company: "Aliq",
      salary: "$100K - $125K",
      location: "Tulsa, OK",
      type: "Remote",
    },
    {
      logo: "/placeholder.svg?height=40&width=40",
      title: "UI / UX Designer",
      company: "Deserunt",
      salary: "$95K - $120K",
      location: "Santa Ana, CA",
      type: "Onsite",
    },
    {
      logo: "/placeholder.svg?height=40&width=40",
      title: "IT Director",
      company: "Laboris",
      salary: "$130K - $140K",
      location: "Austin, TX",
      type: "Hybrid",
      isHot: true,
    },
    {
      logo: "/placeholder.svg?height=40&width=40",
      title: "Product Manager",
      company: "Esse Lorem",
      salary: "$100K - $120K",
      location: "Wichita, KS",
      type: "Remote",
    },
  ]
  const router = useRouter()
  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Latest<span className="text-red-600 dark:text-red-500 ml-4">jobs</span>
        </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Exercitation dolore reprehenderit fugi
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 pt-12 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {jobs.map((job, index) => (
            <Card key={index} className="flex flex-col overflow-hidden border border-gray-200 p-4 dark:border-gray-800" onClick={()=>router.push('/jobs')}>
              <div className="flex items-start gap-4">
                <Image
                  alt={`${job.company} logo`}
                  className="rounded-lg border border-gray-200 bg-white dark:border-gray-800"
                  height="40"
                  src={job.logo}
                  width="40"
                />
                <div className="grid gap-1">
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{job.salary}</p>
                </div>
                {job.isHot && (
                  <Badge variant="destructive" className="ml-auto">
                    Hot
                  </Badge>
                )}
              </div>
              <div className="mt-4 grid gap-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {job.company}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {job.type}
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Button className="bg-red-600 hover:bg-red-700 text-white">See more</Button>
        </div>
      </div>
    </section>
  )
}