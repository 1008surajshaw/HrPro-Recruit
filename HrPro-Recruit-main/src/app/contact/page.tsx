import ContactForm from '@/components/contact/ContactForm'
import Image from 'next/image'

export default function page() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">Contact Us</h1>
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/2">
          <ContactForm />
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/placeholder.svg?height=400&width=400"
            alt="Contact Us"
            width={400}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  )
}
