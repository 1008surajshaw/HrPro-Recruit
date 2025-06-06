'use client'

import { addMessageToConversation } from "@/actions/message.action"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Send } from 'lucide-react'
import { useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"

interface Message {
  id: string
  content: string
  createdAt: Date
  isRead: boolean
  senderId: string
}

export default function MessageSection({ messages: initialMessages, conversationId, isHR }: { 
  messages: Message[], 
  conversationId: string, 
  isHR: boolean 
}) {
  const { data: session } = useSession()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const id = session?.user?.id

  if (!id) {
    return null
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Update local messages when prop changes
  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setIsSending(true)
    
    // Create a temporary message to show immediately
    const tempMessage: Message = {
      id: Date.now().toString(), // temporary ID
      content: newMessage,
      createdAt: new Date(),
      isRead: false,
      senderId: id
    }

    // Update UI immediately
    setMessages(prevMessages => [...prevMessages, tempMessage])
    setNewMessage("")
    scrollToBottom()

    try {
      const response = await addMessageToConversation(conversationId, id, newMessage)

      if (response) {
        // If the response includes the actual message, update it
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === tempMessage.id ? response : msg
            )
          )
        
      } else {
        // If sending failed, remove the temporary message
        setMessages(prevMessages => 
          prevMessages.filter(msg => msg.id !== tempMessage.id)
        )
        console.error('Failed to send message')
      }
    } catch (error) {
      // If there's an error, remove the temporary message
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== tempMessage.id)
      )
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isCurrentUser = message.senderId === session?.user?.id
          const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId

          return (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                isCurrentUser ? "justify-end" : "justify-start"
              )}
            >
              {!isCurrentUser && showAvatar && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "flex flex-col space-y-2 max-w-[70%]",
                  isCurrentUser ? "items-end" : "items-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm",
                    isCurrentUser
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  )}
                >
                  {message.content}
                </div>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(message.createdAt), "MMM d, h:mm a")}
                </span>
              </div>
              {isCurrentUser && showAvatar && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session?.user?.image || "/placeholder.svg"} />
                  <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
              )}
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            type="text"
            placeholder="Type a message..."
            className="flex-1 min-w-0"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending}
          />
          <Button type="submit" size="icon" disabled={isSending}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}