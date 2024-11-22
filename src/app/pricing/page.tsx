'use client'

import { useState } from 'react'
import { Check, X, CreditCard, Clock, Package, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function PricingDashboard() {
  const [isAnnual, setIsAnnual] = useState(false)

  const pricingPlans = [
    {
      name: 'Basic',
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        'Post 1 job',
        'Basic candidate filtering',
        '30-day listing',
        'Email support'
      ],
      notIncluded: [
        'Featured job listing',
        'Advanced analytics',
        'Candidate messaging'
      ]
    },
    {
      name: 'Pro',
      monthlyPrice: 79,
      annualPrice: 790,
      features: [
        'Post 5 jobs',
        'Advanced candidate filtering',
        '60-day listing',
        'Featured job listing',
        'Basic analytics',
        'Email and chat support'
      ],
      notIncluded: [
        'Unlimited job postings',
        'Advanced analytics',
        'Candidate messaging'
      ],
      isPopular: true
    },
    {
      name: 'Enterprise',
      monthlyPrice: 199,
      annualPrice: 1990,
      features: [
        'Unlimited job postings',
        'Advanced candidate filtering',
        '90-day listing',
        'Featured job listing',
        'Advanced analytics',
        'Candidate messaging',
        'Dedicated account manager'
      ],
      notIncluded: []
    }
  ]

  const paymentHistory = [
    { date: '2023-05-01', amount: 79, plan: 'Pro', status: 'Paid' },
    { date: '2023-04-01', amount: 79, plan: 'Pro', status: 'Paid' },
    { date: '2023-03-01', amount: 79, plan: 'Pro', status: 'Paid' },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
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
          <TabsTrigger value="billing" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Billing Information</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <h2 className="text-3xl font-bold text-center mb-8 text-red-600 dark:text-red-400">Choose Your Plan</h2>
          <div className="flex items-center justify-center mb-8">
            <span className="mr-3 text-sm font-medium">Monthly</span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              aria-label="Toggle annual pricing"
            />
            <span className="ml-3 text-sm font-medium">Annual (Save 20%)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className="flex flex-col relative overflow-hidden">
                {plan.isPopular && (
                  <Badge className="absolute top-0 right-0 m-2 bg-red-600 text-white">Popular</Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400">{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold">
                      ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    {isAnnual ? '/year' : '/month'}
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
                    {plan.notIncluded.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-400">
                        <X className="h-5 w-5 text-red-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Select {plan.name} Plan</Button>
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
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Plan:</span>
                  <span>Pro</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Billing Cycle:</span>
                  <span>Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Next Billing Date:</span>
                  <span>June 1, 2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Amount Due:</span>
                  <span>$79.00</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white">Change Plan</Button>
            </CardFooter>
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
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((payment, index) => (
                    <TableRow key={index}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{payment.plan}</TableCell>
                      <TableCell>{payment.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Billing Information</CardTitle>
              <CardDescription>Manage your billing details</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Main St" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="New York" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="NY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" placeholder="10001" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expDate">Expiration Date</Label>
                    <Input id="expDate" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Update Billing Information</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}