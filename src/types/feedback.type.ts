import { Role } from "@prisma/client";

export interface FeedbackType {
    userType :Role
    overallRating:number,
    feedbackResponses: string,
    additionalComments:string,
    userId:string
  }

  