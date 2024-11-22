'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, Briefcase, Building2, CalendarDays } from 'lucide-react'
import { useEffect, useState } from "react"
import MessageSection from "./MessageSection"
import { getCompleteConversationById } from "@/actions/message.action"
import { CompleteConversationResponse } from "@/types/jobs.types"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LoadingSpinner } from "../loading-spinner"


const UserCompleteConversation = ({ conversationId, isHR }: { conversationId: string, isHR: boolean }) => {
    const [conversation, setConversation] = useState<CompleteConversationResponse>()
    const [isLoading, setIsLoading] = useState(true)
  
    useEffect(() => {
      const fetchConversation = async () => {
        setIsLoading(true)
        try {
          const response = await getCompleteConversationById(conversationId)
          if (response?.status) {
            setConversation(response.additional)
          }
        } catch (error) {
          console.error('Error fetching conversation:', error)
        } finally {
          setIsLoading(false)
        }
      }
  
      fetchConversation()
    }, [conversationId])

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <Tabs defaultValue="messages" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="job" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Job Description
          </TabsTrigger>
          <TabsTrigger value={isHR ? "meeting" : "company"} className="flex items-center gap-2">
            {isHR ? (
              <>
                <CalendarDays className="h-4 w-4" />
                Create Meeting
              </>
            ) : (
              <>
                <Building2 className="h-4 w-4" />
                Company
              </>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="flex-1 mt-0 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : conversation ? (
            <MessageSection 
              messages={conversation.messages} 
              conversationId={conversationId}
              isHR={isHR}
            />
          ) : (
            <p>No messages found.</p>
          )}
        </TabsContent>

        <TabsContent value="job" className="mt-0">
          {!isLoading && conversation?.jobApplication.job && (
            <div className="p-4 space-y-4">
              <h2 className="text-2xl font-bold">{conversation.jobApplication.job.title}</h2>
              <p className="text-muted-foreground">{conversation.jobApplication.job.description}</p>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Skills Required</h3>
                <div className="flex flex-wrap gap-2">
                  {conversation.jobApplication.job.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Responsibilities</h3>
                <ul className="list-disc list-inside space-y-1">
                  {conversation.jobApplication.job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="text-muted-foreground">{responsibility}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value={isHR ? "meeting" : "company"} className="mt-0">
          {!isLoading && conversation?.jobApplication.job.company && (
            <div className="p-4 space-y-4">
              {isHR ? (
                <div>Meeting scheduler component will go here</div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                        {
                            conversation.jobApplication.job.company.companyLogo && (
                            <Avatar>
                            <AvatarImage src={conversation.jobApplication.job.company.companyLogo}  />
                            <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            )
                        }
                    <div>
                      <h2 className="text-2xl font-bold">{conversation.jobApplication.job.company.companyName}</h2>
                      <p className="text-muted-foreground">{conversation.jobApplication.job.company.companyBio}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">Founded</h3>
                      <p className="text-muted-foreground">{conversation.jobApplication.job.company.foundedYear}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Company Size</h3>
                      <p className="text-muted-foreground">{conversation.jobApplication.job.company.numberOfEmployees} employees</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Location</h3>
                      <p className="text-muted-foreground">{conversation.jobApplication.job.company.city}, {conversation.jobApplication.job.company.country}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Company Type</h3>
                      <p className="text-muted-foreground">{conversation.jobApplication.job.company.companyType}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default UserCompleteConversation