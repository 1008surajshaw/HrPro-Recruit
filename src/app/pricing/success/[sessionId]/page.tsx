// app/pricing/success/[sessionId]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { verifySubscription } from '@/actions/subscription.action'
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function SuccessPage({ params: { sessionId } }: { params: { sessionId: string } }) {
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const validateSubscription = async () => {
      if (!sessionId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No session ID found",
        })
        setLoading(false)
        return
      }

      try {
        await verifySubscription(sessionId)
        toast({
          title: "Success!",
          description: "Your subscription has been activated.",
        })
      } catch (error) {
        console.error('Error verifying subscription:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to verify your subscription. Please contact support.",
        })
      } finally {
        setLoading(false)
      }
    }

    validateSubscription()
  }, [sessionId, toast])

  return (
    <div className="container mx-auto px-4 py-8 text-center min-h-screen">
      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Verifying your subscription...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Thank You for Your Purchase!</h1>
          <p className="text-lg text-gray-600">
            Your payment has been processed successfully.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <a href="/">Go to Home Page</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/pricing">View Plans</a>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}