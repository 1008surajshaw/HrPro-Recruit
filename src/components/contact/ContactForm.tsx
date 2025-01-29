'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import ContactFormAcknowledgmentEmail from '@/mailtemplate/ContactFormAcknowledgmentEmail'
import { sendContactEmailResponse } from '@/actions/contact.action'

export default function ContactForm() {
  const [email, setEmail] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [userType, setUserType] = useState('candidate')
  const [topic, setTopic] = useState<string>('')
  const [customTopic, setCustomTopic] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const finalTopic = topic === 'other' ? customTopic : topic
      const emailSubject = `Contact Form: ${finalTopic}`
      const emailContent = ContactFormAcknowledgmentEmail(name, email, finalTopic, message)

      await sendContactEmailResponse(email, emailSubject, emailContent)
      
      setSubmitMessage('Thank you for your message. We will get back to you soon!')
      setName('')
      setEmail('')
      setUserType('candidate')
      setTopic('')
      setCustomTopic('')
      setMessage('')
    } catch (error) {
      setSubmitMessage('There was an error submitting your message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Get in Touch</CardTitle>
        <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>I am a:</Label>
            <RadioGroup value={userType} onValueChange={setUserType} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="candidate" id="candidate" />
                <Label htmlFor="candidate">Candidate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recruiter" id="recruiter" />
                <Label htmlFor="recruiter">Recruiter</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger>
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="account">Account Issues</SelectItem>
                <SelectItem value="job-posting">Job Posting Problems</SelectItem>
                <SelectItem value="application">Application Process</SelectItem>
                <SelectItem value="technical">Technical Difficulties</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {topic === 'other' && (
            <div className="space-y-2">
              <Label htmlFor="customTopic">Specify Topic</Label>
              <Input
                id="customTopic"
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                required
                className="w-full"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full min-h-[100px]"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          onClick={handleSubmit}
          disabled={isSubmitting} 
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </CardFooter>
      {submitMessage && (
        <p className={`text-center p-4 ${submitMessage.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
          {submitMessage}
        </p>
      )}
    </Card>
  )
}

