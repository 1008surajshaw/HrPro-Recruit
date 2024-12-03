// app/actions/subscription.action.ts
'use server'

import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth/next"
import Stripe from 'stripe'
import prisma from '@/config/prisma.config'
import { UserSubscription } from "@/types/subscription.types"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia', // Use the correct API version
})

export const createCheckOutSession = async (tierId: string, planDuration: string, duration: number , jobPostLimit:number) => {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user || session.user.role !== 'HR') {
    throw new Error("Unauthorized")
  }

  try {
    const subscriptionTier = await prisma.subscriptionTier.findUnique({
      where: { id: tierId },
    })

    if (!subscriptionTier) {
      throw new Error("Subscription tier not found")
    }

    const unitAmount = planDuration === 'monthly' 
      ? subscriptionTier.price * 100 
      : subscriptionTier.price * 12 * 0.8 * 100

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${subscriptionTier.name} - ${planDuration}`,
          },
          unit_amount: Math.round(unitAmount),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${baseUrl}/pricing/success/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing/cancel`,
      metadata: {
        tierId,
        planDuration,
        duration,
        userId: session.user.id,
        jobPostsRemaining: jobPostLimit
      },
    })

    return { sessionId: checkoutSession.id }
  } catch (err) {
    console.error('Error creating checkout session:', err)
    throw new Error('Failed to create checkout session')
  }
}

export const verifySubscription = async (sessionId: string) => {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    throw new Error("User not authenticated")
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId)
    
    if (checkoutSession.payment_status !== 'paid') {
      throw new Error('Payment not successful')
    }
    
    //@ts-ignore
    const { tierId, duration, jobPostsRemaining } = checkoutSession.metadata

    // Check if payment already exists
    const existingPayment = await prisma.payment.findFirst({
      where: {
        paymentIntentId: checkoutSession.payment_intent as string
      }
    })

    if (existingPayment) {
      return { success: true, message: 'Payment already processed' }
    }

    // Calculate subscription end date
    const subscriptionEndDate = new Date()
    subscriptionEndDate.setDate(subscriptionEndDate.getDate() + (parseInt(duration) * 30))

    // Create payment record
    const curr = checkoutSession.currency || "usd"
    await prisma.payment.create({
      data: {
        amount: checkoutSession.amount_total! / 100,
        currency: curr,
        status: 'SUCCEEDED',
        paymentMethod: 'card',
        paymentIntentId: checkoutSession.payment_intent as string,
        userId: session.user.id,
        subscriptionTierId: tierId,
      },
    })

    // Update user subscription
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        subscriptionTierId: tierId,
        subscriptionStartDate: new Date(),
        subscriptionEndDate: subscriptionEndDate,
        jobPostsRemaining: parseInt(jobPostsRemaining)
      },
    })

    return { success: true }
  } catch (err) {
    console.error('Error verifying subscription:', err)
    throw new Error('Error verifying subscription')
  }
}


export const getCurrentUserPlan = async (): Promise<UserSubscription | { message: string }> => {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user || session.user.role !== 'HR') {
    throw new Error("Unauthorized")
  }

  try {
    const subscriptionDetails = await prisma.user.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        subscriptionEndDate: true,
        subscriptionStartDate: true,
        subscriptionTier: {
          select: {
            name: true,
            price: true,
            jobPostLimit: true,
            duration: true,
            payments: {
              select: {
                id: true,
                amount: true,
                currency: true,
                status: true,
                paymentMethod: true,
                paymentIntentId: true,  
                createdAt: true
              }
            }
          }
        }
      }
    })
    
    if (!subscriptionDetails) {
      return { message: "No current subscription" }
    }
    return subscriptionDetails
  } catch (error) {
    console.error(error)
    throw new Error("Error fetching subscription details")
  }
}

