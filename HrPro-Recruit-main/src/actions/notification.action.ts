'use server'
import prisma from '@/config/prisma.config';

import { ErrorHandler } from '@/lib/error';
import { SuccessResponse } from '@/lib/success';


import { NotificationType } from '@prisma/client';

export async function createNotification( userId:string, type:NotificationType, content:string ){
   
    try{
       await prisma.notification.create({
        data: {
            userId,
            type,
            content,
          },
       })

       return new SuccessResponse(`Notification send Successfully`,200)
    }catch(_){
        return new ErrorHandler('Internal server error', 'DATABASE_ERROR');
    }
}

export async function getNotification(userId:string){
    try{
      const recentNotification = await prisma.notification.findMany({
        where:{
            userId:userId
        },
        orderBy:{
          createdAt:'desc'  
        },
        select:{
            type:true,
            content:true,
            createdAt:true
        },
        take:6

      })

      if (!recentNotification) throw new ErrorHandler('User Not Found', 'NOT_FOUND');

      return new SuccessResponse(
        'Recently Notification fetch successfully', 
        200, 
        recentNotification,
      ).serialize();
    }catch(_){
        return new ErrorHandler('Internal server error', 'DATABASE_ERROR');
    }
}