'use client'

import { UserConversationResponse } from '@/types/message.type'
import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

import SheetWrapperForMessage from '../profile/sheets/SheetWrapperForMessage'
import UserCompleteConversation from './UserCompleteConversation'

interface ConversationCardProps {
  conversation: UserConversationResponse
  role: string
}

const ConversationCard: React.FC<ConversationCardProps> = ({ conversation, role }) => {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false)

  const isHR = role === "HR"
  const { otherUsers, lastMessage, jobApplication } = conversation
  const defaultLogo = "https://github.com/shadcn.png"

  const displayName = isHR 
    ? otherUsers?.name ?? "Unknown User"
    : jobApplication?.job.company.companyName ?? "Unknown Company"

  const avatarSrc = isHR
    ? otherUsers?.avatar ?? defaultLogo
    : jobApplication?.job.company.companyLogo ?? defaultLogo

  // Get initials for avatar fallback
  const initials = displayName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleClose = () => {
    setIsSheetOpen(false)
  }

  const handleOpen = () => {
    setIsSheetOpen(true)
  }

  

  return (
    <Card className="w-10/12 hover:bg-accent/50 transition-colors cursor-pointer" onClick={handleOpen} >
      <CardContent className="flex items-center p-4 py-10 gap-3">
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatarSrc} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {lastMessage && !lastMessage.isRead && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <h4 className="font-semibold text-foreground truncate">
                {displayName}
              </h4>
              
                <span className="text-sm text-muted-foreground">
                  {jobApplication?.job.title}
                </span>
              
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
              {lastMessage 
                ? new Date(lastMessage.createdAt).toLocaleDateString()
                : "No messages"
              }
            </span>
          </div>

          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-muted-foreground truncate">
              {lastMessage?.content ?? "No messages available"}
            </p>
            
          </div>
        </div>
      </CardContent>
        <SheetWrapperForMessage
            isOpen={isSheetOpen}
            handleClose={handleClose}
            title={jobApplication?.job.title}
            avatar={avatarSrc}
            name={displayName}
            lastMessage={lastMessage?.createdAt}
            otherUserId={otherUsers?.id}
        >
            <UserCompleteConversation conversationId={conversation.id} isHR={isHR}/>
        </SheetWrapperForMessage>
    </Card>
  )
}

export default ConversationCard