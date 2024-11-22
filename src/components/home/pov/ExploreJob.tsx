'use client'

import { Button } from "@/components/ui/button"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Code, DollarSign, GraduationCap, LineChart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Component() {
  const [location, setLocation] = useState("all")
  const router = useRouter()

  const categories = [
    { icon: DollarSign, name: "Finance", jobs: "1237" },
    { icon: GraduationCap, name: "Education", jobs: "3546" },
    { icon: Code, name: "IT", jobs: "5768" },
    { icon: LineChart, name: "Marketing", jobs: "2473" },
    { icon: DollarSign, name: "Sales", jobs: "1892" },
    { icon: GraduationCap, name: "Teaching", jobs: "982" },
  ]

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('categories-container')
    if (container) {
      const scrollAmount = 300
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="w-full px-4 py-12 md:px-6 lg:py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Explore more <span className="text-red-600 dark:text-red-500">jobs</span>
        </h2>

        <div className="flex gap-4 max-w-3xl mx-auto">
          <Input
            className="flex-1"
            placeholder="Search for jobs..."
            type="text"
          />
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="eu">Europe</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700" onClick={()=>router.push('/jobs')}>
            Search
          </Button>
        </div>

        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div
            id="categories-container"
            className="flex gap-4 overflow-x-auto snap-x scrollbar-hide px-1 py-4"
          >
            {categories.map((category, index) => (
              <Card
                key={index}
                className="flex-shrink-0 w-[200px] p-6 snap-start bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                onClick={()=>router.push('/jobs')}>
                <div className="space-y-4">
                  <div className="size-12 rounded-full bg-red-600 dark:bg-red-500 flex items-center justify-center text-white">
                    <category.icon className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.jobs} jobs</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}