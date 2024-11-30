'use client'

import { useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface PrivacyAndGDPRFormProps {
  onAccepted: () => void
}

export function PrivacyAndGDPRForm({ onAccepted }: PrivacyAndGDPRFormProps) {
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [gdprConsent, setGdprConsent] = useState(false)
  const { toast } = useToast()


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (privacyConsent && gdprConsent) {
      toast({
        title: "Consent given",
        description: "Thank you for accepting our privacy policy and GDPR compliance.",
      })
      onAccepted()
    } else {
      toast({
        title: "Consent required",
        description: "Please accept both the privacy policy and GDPR compliance to continue.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="prose dark:prose-invert max-w-none">
        <h2>Privacy Policy and GDPR Compliance</h2>
        <p>Please read and accept our privacy policy and GDPR compliance terms to continue.</p>
        
        <h3>Privacy Policy</h3>
        <div className="prose max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <h2>1. Introduction</h2>
        <p>Welcome to our Job Portal. We are committed to protecting your personal data and respecting your privacy rights.</p>
        
        <h2>2. Data We Collect</h2>
        <p>We collect and process the following data:</p>
        <ul>
          <li>Personal identification information (Name, email address, phone number)</li>
          <li>Professional information (CV, work history, education)</li>
          <li>Usage data (How you interact with our portal)</li>
        </ul>

        <h2>3. How We Use Your Data</h2>
        <p>We use your data to:</p>
        <ul>
          <li>Provide and maintain our service</li>
          <li>Match you with potential job opportunities</li>
          <li>Communicate with you about your account and job applications</li>
          <li>Improve our service</li>
        </ul>

        <h2>4. Your Data Protection Rights</h2>
        <p>Under GDPR, you have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Rectify your personal data</li>
          <li>Erase your personal data</li>
          <li>Restrict processing of your personal data</li>
          <li>Object to processing of your personal data</li>
          <li>Data portability</li>
        </ul>

        <h2>5. Data Retention</h2>
        <p>We will retain your personal data only for as long as necessary for the purposes set out in this policy.</p>

        <h2>6. Changes to This Policy</h2>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

        <h2>7. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at: hrproams@gmail.com</p>
      </div>
        
        <h3>GDPR Compliance</h3>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="privacyConsent" 
          checked={privacyConsent} 
          onCheckedChange={(checked) => setPrivacyConsent(checked as boolean)}
        />
        <label htmlFor="privacyConsent" className="text-sm font-medium leading-none">
          I have read and accept the privacy policy.
        </label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="gdprConsent" 
          checked={gdprConsent} 
          onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
        />
        <label htmlFor="gdprConsent" className="text-sm font-medium leading-none">
          I consent to the processing of my personal data as described in the GDPR compliance terms.
        </label>
      </div>
      
      <Button type="submit" disabled={!privacyConsent || !gdprConsent}>
        Accept and Continue
      </Button>
    </form>
  )
}

