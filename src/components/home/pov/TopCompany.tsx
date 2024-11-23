import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

export default function TopCompanies() {
  const companies = [
    {
      logo: "/placeholder.svg?height=60&width=60",
      name: "ALIQ",
      jobs: "20",
      location: "New York",
    },
    {
      logo: "/placeholder.svg?height=60&width=60",
      name: "ESSE LOREM",
      jobs: "20",
      location: "New York",
    },
    {
      logo: "/placeholder.svg?height=60&width=60",
      name: "LABORIUM",
      jobs: "10",
      location: "New York",
    },
    {
      logo: "/placeholder.svg?height=60&width=60",
      name: "DESERUNT",
      jobs: "24",
      location: "New York",
    },
  ]

  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Top <span className="text-red-600 dark:text-red-500">IT companies</span>
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Exercitation dolore reprehenderit fugi
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 pt-12 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {companies.map((company, index) => (
            <Card
              key={index}
              className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow"
            >
              <Image
                alt={`${company.name} logo`}
                className="mb-4 rounded-lg"
                height="60"
                src={company.logo}
                width="60"
              />
              <h3 className="font-semibold uppercase">{company.name}</h3>
              <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-500">
                <span>{company.jobs} jobs</span>
                <span className="text-gray-400">|</span>
                <span>{company.location}</span>
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