'use server'

import { sendEmail } from "@/lib/sendEmail"

export const sendContactEmailResponse = async (
  email: string,
  emailSubject: string,
  emailContent: string
) => {
  try {
    await sendEmail(
      email,
      emailSubject,
      emailContent
    )
    return { success: true }
  } catch (error) {
    console.error('Email sending error:', error)
    throw new Error('Failed to send email. Please try again later.')
  }
}