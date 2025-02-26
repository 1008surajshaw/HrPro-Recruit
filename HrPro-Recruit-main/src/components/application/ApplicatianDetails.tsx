"use client"

import { useState } from "react"
import { AppliedJob } from "@/types/jobs.types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Mail, FileText, X, LinkIcon, MapPin, Users, Calendar } from 'lucide-react'
import Link from "next/link"

interface ApplicationDetailsSheetProps {
  isOpen: boolean
  handleClose: () => void
  application: AppliedJob["result"][0]
}

export function ApplicationDetailsSheet({ isOpen, handleClose, application }: ApplicationDetailsSheetProps) {
  const [activeTab, setActiveTab] = useState("application")
  const { job, answers, appliedAt, status } = application
  const { company } = job

  // @ts-ignore
  const typedAnswers: { question: string; userAns: string }[] = answers as { question: string; userAns: string }[];

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-2xl p-0">
        <div className="flex flex-col h-[100dvh]">
          {/* Fixed Header */}
          <SheetHeader className="p-6 border-b">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={company.companyLogo || ""} alt={company.companyName} />
                <AvatarFallback>{company.companyName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <SheetTitle className="text-xl font-semibold">{company.companyName}</SheetTitle>
                <p className="text-sm text-muted-foreground mt-1">{job.title}</p>
                <p className="text-sm text-muted-foreground">Applied on {new Date(appliedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </SheetHeader>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
            <TabsList className="w-full justify-start rounded-none border-b px-6">
              <TabsTrigger value="application" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Application
              </TabsTrigger>
              <TabsTrigger value="job" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Job description
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Company info
              </TabsTrigger>
            </TabsList>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="application" className="p-6 mt-0">
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Application Status</h3>
                        <Badge variant="outline">{status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your application is being reviewed by {company.companyName}. We'll notify you when there's an update.
                      </p>
                    </CardContent>
                  </Card>

                  <div>
                    <h3 className="font-semibold mb-4">Your Application</h3>
                    {typedAnswers.length > 0 ? (
                      typedAnswers.map((item, index) => (
                        <div key={index} className="mb-6">
                          <h4 className="text-sm font-medium mb-2">{item.question}</h4>
                          <p className="text-sm text-muted-foreground">{item.userAns}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No application details available.</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="job" className="p-6 mt-0">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{job.type}</Badge>
                      <Badge variant="secondary">{job.workMode}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {company.city}, {company.country}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">{job.description}</p>
                  </div>

                  {job.responsibilities.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Responsibilities</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {job.responsibilities.map((item, index) => (
                          <li key={index} className="text-sm text-muted-foreground">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {job.skills.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {job.hasSalaryRange && (
                    <div>
                      <h3 className="font-semibold mb-2">Salary Range</h3>
                      <p className="text-sm text-muted-foreground">
                        {job.currency} {job.minSalary} - {job.maxSalary}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="company" className="p-6 mt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">About {company.companyName}</h3>
                    <p className="text-sm text-muted-foreground">{company.companyBio}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Founded</h4>
                      <p className="text-sm text-muted-foreground">{company.foundedYear}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Company Size</h4>
                      <p className="text-sm text-muted-foreground">{company.numberOfEmployees} employees</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">CEO</h4>
                      <p className="text-sm text-muted-foreground">{company.CEOName}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Company Type</h4>
                      <p className="text-sm text-muted-foreground">{company.companyType}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {company.website && (
                      <Link 
                        href={company.website}
                        target="_blank"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                      >
                        <LinkIcon className="h-4 w-4" />
                        Website
                      </Link>
                    )}
                    {company.linkedinLink && (
                      <Link 
                        href={company.linkedinLink}
                        target="_blank"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                      >
                        <LinkIcon className="h-4 w-4" />
                        LinkedIn
                      </Link>
                    )}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}