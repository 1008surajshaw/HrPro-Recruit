'use client'

import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface PaymentFormProps {
  planName: string;
}

export default function PaymentForm({ planName }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    })

    if (error) {
      toast({
        title: "Payment failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Payment successful",
        description: `You have successfully subscribed to the ${planName} plan.`,
      })
    }

    setIsProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="mt-4 w-full"
      >
        {isProcessing ? "Processing..." : `Pay for ${planName} Plan`}
      </Button>
    </form>
  )
}

