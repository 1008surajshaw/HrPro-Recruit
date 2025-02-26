"use server";

import prisma from '@/config/prisma.config';
import { authOptions } from '@/lib/authOptions';
import { ErrorHandler } from '@/lib/error';
import { SuccessResponse } from '@/lib/success';
import {  CompleteConversationResponse, ReturnTypeConversation } from '@/types/jobs.types';
import { UserConversationResponse } from '@/types/message.type';
import { getServerSession } from 'next-auth';



export const getAllConversation = async (): Promise<UserConversationResponse[]> => {
    const auth = await getServerSession(authOptions);

    if (!auth?.user.id) {
        return [];
    }

    const userId = auth.user.id;

    const conversations = await prisma.conversation.findMany({
        where: {
            participants: {
                some: { id: userId },
            },
        },
        include: {
            participants: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
            messages: {
                take: 1,
                orderBy: { createdAt: 'desc' },
            },
            jobApplication: {
                select: {
                    id:true,
                    job: {
                        select: {
                            id: true,
                            title: true,
                            company: {
                                select: {
                                    companyName: true,
                                    companyLogo: true,
                                },
                            },
                        },
                    },
                },
            },
        },
        orderBy: {
            updatedAt: 'desc',
        },
        
    });

    // Map the results to format the response
    const formattedConversations: UserConversationResponse[] = conversations.map((conversation) => {
        const otherUser = conversation.participants.find(
            (participant) => participant.id !== userId
        );

        return {
            id: conversation.id,
            otherUsers: otherUser
                ? {
                    id: otherUser.id,
                    name: otherUser.name,
                    avatar: otherUser.avatar,
                }
                : null,
            lastMessage: conversation.messages[0]
                ? {
                    id: conversation.messages[0].id,
                    content: conversation.messages[0].content,
                    senderId: conversation.messages[0].senderId,
                    createdAt: conversation.messages[0].createdAt,
                    isRead: conversation.messages[0].isRead,
                }
                : null,
            jobApplication: conversation.jobApplication
                ? {
                    id: conversation.jobApplication.id, 
                    job: {
                        id: conversation.jobApplication.job.id,
                        title: conversation.jobApplication.job.title,
                        company: {
                            companyName: conversation.jobApplication.job.company.companyName,
                            companyLogo: conversation.jobApplication.job.company.companyLogo,
                        },
                    },
                }
                : undefined,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
        };
    });

    return formattedConversations;
};


export const getCompleteConversationById = async (conversationId:string): Promise<ReturnTypeConversation | undefined> =>{
    try{

        const auth = await getServerSession(authOptions);

        if (!auth?.user.id) {
            throw new ErrorHandler('Not Authorized', 'UNAUTHORIZED');
        }
        const response = await prisma.message.findMany({
            where: {
              conversationId: conversationId,
            },
            select:{
                id:true,
                senderId:true,
                content:true,
                isRead:true,
                createdAt:true
            }
          });
         
          if (!response) {
            throw new ErrorHandler('Conversation not found', 'NOT_FOUND');
          }
      
          return new SuccessResponse(
            'Conversation Retrieved Successfully',
            200,
            response
          ).serialize();      


    }catch(error){
        console.log(error)
    }
}

export const getResponseWithCompanyDetails = async (conversationId:string): Promise<CompleteConversationResponse | undefined> =>{
    try{

        const auth = await getServerSession(authOptions);

        if (!auth?.user.id) {
            throw new ErrorHandler('Not Authorized', 'UNAUTHORIZED');
        }
        
        const response = await prisma.conversation.findUnique({
            where: {
              id: conversationId,
            },
            select:{
              id:true,
              jobApplication:{
               select:{
                answers:true,
                status:true,
                appliedAt:true,
                job:{
                    select:{
                        id: true,
                        title: true,
                        description: true,
                        type: true,
                        category: true,
                        workMode: true,
                        currency: true,
                        skills: true,
                        expired: true,
                        hasExpiryDate: true,
                        expiryDate: true,
                        hasSalaryRange: true,
                        minSalary: true,
                        maxSalary: true,
                        hasExperiencerange: true,
                        minExperience: true,
                        maxExperience: true,
                        isVerifiedJob: true,
                        deleted: true,
                        deletedAt: true,
                        postedAt: true,
                        updatedAt: true,
                        responsibilities: true,
                        company:{
                            select:{
                                id: true,
                                companyName: true,
                                companyLogo: true,
                                companyEmail: true,
                                companyBio: true,
                                foundedYear: true,
                                numberOfEmployees: true,
                                CEOName: true,
                                companyType: true,
                                city: true,
                                country: true,
                                website: true,
                                linkedinLink: true,
                                twitterLink: true, 
                            }
                        } 
                    }
                }
               }
              } 
            }
          });
      
          if (!response) {
            throw new ErrorHandler('Conversation not found', 'NOT_FOUND');
          }
      
          return new SuccessResponse(
            'Conversation Retrieved Successfully',
            200,
            response
          ).serialize();      


    }catch(error){
        console.log(error)
    }
}

export async function addMessageToConversation(
    conversationId: string,
    senderId: string,
    content: string
  ) {
    try {
      // Check if the conversation exists
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { participants: true }
      })
  
      if (!conversation) {
        throw new Error('Conversation not found')
      }
  
      // Check if the sender is a participant in the conversation
      if (!conversation.participants.some(participant => participant.id === senderId)) {
        throw new Error('Sender is not a participant in this conversation')
      }
  
      // Create and add the message to the conversation
      const newMessage = await prisma.message.create({
        data: {
          conversationId,
          senderId,
          content,
        },
      })
  
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      })
  
      return newMessage
    } catch (error) {
      console.error('Error adding message to conversation:', error)
      throw error
    }
  }
  