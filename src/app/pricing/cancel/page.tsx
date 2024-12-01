import React from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Link from 'next/link'

const page = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-destructive">Transaction Unsuccessful</CardTitle>
        <CardDescription>We're sorry, but your subscription process was not completed.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Payment Failed</AlertTitle>
          <AlertDescription>
            Your payment was not processed successfully. Please try again or contact support if the issue persists.
          </AlertDescription>
        </Alert>
        <p className="text-sm text-muted-foreground">
          If money was deducted from your account but the subscription was not activated, please contact our support team immediately.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/pricing">Return to Pricing</Link>
        </Button>
        <Button variant="default" asChild>
          <Link href="/contact">Contact Support</Link>
        </Button>
      </CardFooter>
    </Card>
  </div>
  )
}

export default page