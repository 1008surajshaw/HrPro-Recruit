"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Building2, Calendar, MapPin, Briefcase, Clock, Video } from 'lucide-react'
import { AppliedJob } from "@/types/jobs.types"
import { ApplicationDetailsSheet } from "./ApplicatianDetails"
import { Separator } from "../ui/separator"
const statusColors = {
  "Review": "bg-yellow-500",
  "Rejected": "bg-red-500",
  "Accepted": "bg-green-500",
} as const

interface CandidateApplicationProps {
  application: AppliedJob["result"][0]
}

export function CandidateApplication({ application }: CandidateApplicationProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleViewDetails = () => {
    setIsSheetOpen(true)
  }

  const handleClose = () => {
    setIsSheetOpen(false)
  }

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }
  
  return (
    <>
      <Card onClick={handleViewDetails} className="cursor-pointer">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-xl">{application.job.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {application.job.company.companyName}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="w-fit">
              <span 
                className={`w-2 h-2 rounded-full mr-2 ${
                  statusColors[application.status as keyof typeof statusColors]
                }`} 
              />
              {application.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{application.job.company.city}, {application.job.company.country}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="w-4 h-4 shrink-0" />
              <span>{application.job.type} • {application.job.workMode}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 shrink-0" />
              <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 sm:justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleViewDetails}
              >
                View Details
              </Button>
            </div>
          </div>

          {application.zoomMeet && application.zoomMeet.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Zoom Meeting Details
                </h4>
                {application.zoomMeet.map((meeting, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Title:</span> {meeting.topic}
                    </div>
                    <div>
                      <span className="font-medium">Start:</span> {formatDateTime(meeting.startTime)}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> {meeting.duration} minutes
                    </div>
                    {meeting.password && (
                      <div>
                        <span className="font-medium">Password:</span> {meeting.password}
                      </div>
                    )}
                    <div className="sm:col-span-2">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => window.open(meeting.joinUrl , "_blank")}
                      >
                        <p>Join Meeting</p>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

       <ApplicationDetailsSheet
       isOpen={isSheetOpen}
       handleClose={handleClose}
       application={application}/>
    </>
  )
}