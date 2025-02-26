'use client'

import { useState } from 'react'
import VerticalLinearStepper from '@/components/user-multistep-form/user-multistep-form'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useSession } from 'next-auth/react'
import { PrivacyAndGDPRForm } from './PrivacyAndGDPRForm'



export function OnboardingProcess() {
  const session = useSession()
  const [gdprAccepted, setGdprAccepted] = useState(false)
 
  if(!session.data?.user){
    return
  }

  const handleGDPRAccepted = () => {
    setGdprAccepted(true)
  }

  return (
    <div className="flex flex-col justify-center place-items-center w-full max-w-2xl mx-auto">
      <h1 className="text-xl font-bold md:text-3xl md:font-extrabold mb-8">
        Hey {session.data?.user.name}, let&apos;s get you set up and started!
      </h1>
      {!gdprAccepted ? (
        <Dialog open={!gdprAccepted} onOpenChange={() => {}}>
          <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col" >
            <div className="flex-grow overflow-y-auto px-6 pb-6">
              <PrivacyAndGDPRForm onAccepted={handleGDPRAccepted} />
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <VerticalLinearStepper />
      )}
    </div>
  )
}

