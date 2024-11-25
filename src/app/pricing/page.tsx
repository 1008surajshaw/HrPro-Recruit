'use client'

import { useState,useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, CreditCard, Clock, Package, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useSession } from 'next-auth/react'
import { loadStripe } from '@stripe/stripe-js'
import { createCheckOutSession, getCurrentUserPlan } from '@/actions/subscription.action'
import { toast } from "@/components/ui/use-toast"
import { dummyPricingPlans, paymentHistory } from '@/lib/dummyData'
import { SubscriptionTier, UserSubscription } from '@/types/subscription.types'

type Plans = {
  id:string,
  name:string,
  price:number,
  jobPostLimit:number,
  duration:number,
  features:string[]
}
export default function PricingDashboard() {
  const { data: session } = useSession()
  const [selectedDuration, setSelectedDuration] = useState('monthly')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [currentPlan, setCurrentPlan] = useState<UserSubscription | null>(null)


  useEffect(() => {
    const fetchCurrentPlan = async () => {
      try {
        const plan = await getCurrentUserPlan()
        if ('message' in plan) {
          toast({
            title: "No active subscription",
            description: plan.message,
            variant: "default",
          })
        } else {
          setCurrentPlan(plan)
        }
      } catch (error) {
        console.error('Error fetching current plan:', error)
        toast({
          title: "Error",
          description: "Failed to fetch current plan. Please try again.",
          variant: "destructive",
        })
      }
    }

    if (session) {
      fetchCurrentPlan()
    }
  }, [session])

  const handleSubscribe = async (plan:Plans) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe to a plan.",
        variant: "destructive",
      })
      return
    }

    if (session.user.role !== 'HR') {
      toast({
        title: "Access Denied",
        description: "Only HR users can subscribe to a plan.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    const duration = selectedDuration === 'monthly' ? 30 : 365

    try {
      const response = await createCheckOutSession(
        plan.id,
        selectedDuration,
        duration
      )
      
      if (!response || !response.sessionId) {
        throw new Error("Failed to create checkout session")
      }

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      if (!stripe) {
        throw new Error("Failed to load Stripe")
      }

      const { error } = await stripe.redirectToCheckout({ sessionId: response.sessionId })
      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Subscription error:', error)
      toast({
        title: "Subscription error",
        description: "An error occurred while processing your subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 h-screen">
      <h1 className="text-4xl font-bold mb-4 text-red-600 dark:text-red-400">TalentConnect Pro</h1>
      <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
        Empower your recruitment process with TalentConnect Pro. Our platform streamlines job postings, 
        candidate filtering, and hiring workflows, helping you find the perfect talent for your organization.
      </p>
      
      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList className="bg-red-100 dark:bg-red-900">
          <TabsTrigger value="plans" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Pricing Plans</TabsTrigger>
          <TabsTrigger value="current" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Current Plan</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <h2 className="text-3xl font-bold text-center mb-8 text-red-600 dark:text-red-400">Choose Your Plan</h2>
          <RadioGroup 
            defaultValue="monthly" 
            className="flex justify-center space-x-4 mb-8" 
            onValueChange={setSelectedDuration}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly">Monthly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="annual" id="annual" />
              <Label htmlFor="annual">Annual (Save 20%)</Label>
            </div>
          </RadioGroup>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dummyPricingPlans.map((plan, index) => (
              <Card key={index} className="flex flex-col relative overflow-hidden">
                {/* {plan.isPopular && (
                  <Badge className="absolute top-0 right-0 m-2 bg-red-600 text-white">Popular</Badge>
                )} */}
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400">{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold">
                      ${selectedDuration === 'annual' ? (plan.price * 12 * 0.8).toFixed(2) : plan.price}
                    </span>
                    /{selectedDuration === 'annual' ? 'year' : 'month'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {/* {plan.notIncluded?.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-400">
                        <X className="h-5 w-5 text-red-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))} */}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => handleSubscribe(plan)}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : `Select ${plan.name} Plan`}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-12 bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">Benefits After Purchase</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex items-start">
                <Zap className="h-6 w-6 text-red-600 mr-2 flex-shrink-0" />
                <span>Instant access to our powerful recruitment tools</span>
              </li>
              <li className="flex items-start">
                <Package className="h-6 w-6 text-red-600 mr-2 flex-shrink-0" />
                <span>Customizable job posting templates</span>
              </li>
              <li className="flex items-start">
                <CreditCard className="h-6 w-6 text-red-600 mr-2 flex-shrink-0" />
                <span>Flexible billing options</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-6 w-6 text-red-600 mr-2 flex-shrink-0" />
                <span>24/7 customer support</span>
              </li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Current Plan</CardTitle>
              <CardDescription>Your current subscription details</CardDescription>
            </CardHeader>
            <CardContent>
              {currentPlan && currentPlan.subscriptionTier ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Plan:</span>
                    <span>{currentPlan.subscriptionTier.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Price:</span>
                    <span>${currentPlan.subscriptionTier.price}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Job Post Limit:</span>
                    <span>{currentPlan.subscriptionTier.jobPostLimit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Start Date:</span>
                    <span>{currentPlan.subscriptionStartDate?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">End Date:</span>
                    <span>{currentPlan.subscriptionEndDate?.toLocaleDateString()}</span>
                  </div>
                </div>
              ) : (
                <p>No active subscription</p>
              )}
            </CardContent>
            {/* <CardFooter>
              <Button variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                Change Plan
              </Button>
            </CardFooter> */}
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Payment History</CardTitle>
              <CardDescription>Your recent payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPlan && currentPlan.subscriptionTier?.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell>{payment.amount} {payment.currency}</TableCell>
                      <TableCell>{payment.status}</TableCell>
                      <TableCell>{payment.paymentMethod}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// 'use client'

// import { useState } from 'react'
// import { Check, X, CreditCard, Clock, Package, Zap } from 'lucide-react'
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Switch } from "@/components/ui/switch"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { useSession } from 'next-auth/react'
// import {pricingPlans,paymentHistory} from '@/lib/dummyData'
// export default function PricingDashboard() {
//   const [isAnnual, setIsAnnual] = useState(false)
//   const session = useSession();




//   const handleSelectPlan = async (plan: PricingPlan) => {
//     if (!session) {
//       toast({
//         title: "Please sign in",
//         description: "You need to be signed in to select a plan.",
//         variant: "destructive",
//       })
//       return
//     }

//     setSelectedPlan(plan)

//     const response = await fetch('/api/create-payment-intent', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         planId: plan.id,
//         isAnnual: isAnnual,
//       }),
//     })

//     const data = await response.json()

//     if (data.clientSecret) {
//       setClientSecret(data.clientSecret)
//     } else {
//       toast({
//         title: "Error",
//         description: "Failed to initialize payment. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   return (
//     <div className="container mx-auto px-4 py-16">
//       <h1 className="text-4xl font-bold mb-4 text-red-600 dark:text-red-400">TalentConnect Pro</h1>
//       <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
//         Empower your recruitment process with TalentConnect Pro. Our platform streamlines job postings, 
//         candidate filtering, and hiring workflows, helping you find the perfect talent for your organization.
//       </p>
      
//       <Tabs defaultValue="plans" className="space-y-4">
//         <TabsList className="bg-red-100 dark:bg-red-900">
//           <TabsTrigger value="plans" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Pricing Plans</TabsTrigger>
//           <TabsTrigger value="current" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Current Plan</TabsTrigger>
//           <TabsTrigger value="history" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Payment History</TabsTrigger>
//           <TabsTrigger value="billing" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Billing Information</TabsTrigger>
//         </TabsList>

//         <TabsContent value="plans">
//           <h2 className="text-3xl font-bold text-center mb-8 text-red-600 dark:text-red-400">Choose Your Plan</h2>
//           <div className="flex items-center justify-center mb-8">
//             <span className="mr-3 text-sm font-medium">Monthly</span>
//             <Switch
//               checked={isAnnual}
//               onCheckedChange={setIsAnnual}
//               aria-label="Toggle annual pricing"
//             />
//             <span className="ml-3 text-sm font-medium">Annual (Save 20%)</span>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {pricingPlans.map((plan, index) => (
//               <Card key={index} className="flex flex-col relative overflow-hidden">
//                 {plan.isPopular && (
//                   <Badge className="absolute top-0 right-0 m-2 bg-red-600 text-white">Popular</Badge>
//                 )}
//                 <CardHeader>
//                   <CardTitle className="text-red-600 dark:text-red-400">{plan.name}</CardTitle>
//                   <CardDescription>
//                     <span className="text-3xl font-bold">
//                       ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
//                     </span>
//                     {isAnnual ? '/year' : '/month'}
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="flex-grow">
//                   <ul className="space-y-2">
//                     {plan.features.map((feature, idx) => (
//                       <li key={idx} className="flex items-center">
//                         <Check className="h-5 w-5 text-green-500 mr-2" />
//                         <span>{feature}</span>
//                       </li>
//                     ))}
//                     {plan.notIncluded.map((feature, idx) => (
//                       <li key={idx} className="flex items-center text-gray-400">
//                         <X className="h-5 w-5 text-red-500 mr-2" />
//                         <span>{feature}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </CardContent>
//                 <CardFooter>
//                   <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Select {plan.name} Plan</Button>
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>
//           <div className="mt-12 bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
//             <h3 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">Benefits After Purchase</h3>
//             <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <li className="flex items-start">
//                 <Zap className="h-6 w-6 text-red-600 mr-2 flex-shrink-0" />
//                 <span>Instant access to our powerful recruitment tools</span>
//               </li>
//               <li className="flex items-start">
//                 <Package className="h-6 w-6 text-red-600 mr-2 flex-shrink-0" />
//                 <span>Customizable job posting templates</span>
//               </li>
//               <li className="flex items-start">
//                 <CreditCard className="h-6 w-6 text-red-600 mr-2 flex-shrink-0" />
//                 <span>Flexible billing options</span>
//               </li>
//               <li className="flex items-start">
//                 <Clock className="h-6 w-6 text-red-600 mr-2 flex-shrink-0" />
//                 <span>24/7 customer support</span>
//               </li>
//             </ul>
//           </div>
//         </TabsContent>

//         <TabsContent value="current">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-red-600 dark:text-red-400">Current Plan</CardTitle>
//               <CardDescription>Your current subscription details</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="font-medium">Plan:</span>
//                   <span>Pro</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="font-medium">Billing Cycle:</span>
//                   <span>Monthly</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="font-medium">Next Billing Date:</span>
//                   <span>June 1, 2023</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="font-medium">Amount Due:</span>
//                   <span>$79.00</span>
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter>
//               <Button variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white">Change Plan</Button>
//             </CardFooter>
//           </Card>
//         </TabsContent>

//         <TabsContent value="history">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-red-600 dark:text-red-400">Payment History</CardTitle>
//               <CardDescription>Your recent payments</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Amount</TableHead>
//                     <TableHead>Plan</TableHead>
//                     <TableHead>Status</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {paymentHistory.map((payment, index) => (
//                     <TableRow key={index}>
//                       <TableCell>{payment.date}</TableCell>
//                       <TableCell>${payment.amount.toFixed(2)}</TableCell>
//                       <TableCell>{payment.plan}</TableCell>
//                       <TableCell>{payment.status}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="billing">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-red-600 dark:text-red-400">Billing Information</CardTitle>
//               <CardDescription>Manage your billing details</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="firstName">First Name</Label>
//                     <Input id="firstName" placeholder="John" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="lastName">Last Name</Label>
//                     <Input id="lastName" placeholder="Doe" />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email</Label>
//                   <Input id="email" type="email" placeholder="john@example.com" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="address">Address</Label>
//                   <Input id="address" placeholder="123 Main St" />
//                 </div>
//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="city">City</Label>
//                     <Input id="city" placeholder="New York" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="state">State</Label>
//                     <Input id="state" placeholder="NY" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="zip">ZIP Code</Label>
//                     <Input id="zip" placeholder="10001" />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="cardNumber">Card Number</Label>
//                   <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="expDate">Expiration Date</Label>
//                     <Input id="expDate" placeholder="MM/YY" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="cvv">CVV</Label>
//                     <Input id="cvv" placeholder="123" />
//                   </div>
//                 </div>
//               </form>
//             </CardContent>
//             <CardFooter>
//               <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Update Billing Information</Button>
//             </CardFooter>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }