"use server";
import prisma from "@/config/prisma.config";
import { authOptions } from "@/lib/authOptions";
import { ErrorHandler } from "@/lib/error";
import { sendEmail } from "@/lib/sendEmail";
import FeedbackAcknowledgmentEmail from "@/mailtemplate/FeedbackAcknowledgement";
import { FeedbackType } from "@/types/feedback.type";
import { getServerSession } from "next-auth";

export const saveUserResponse = async (feedbackData: FeedbackType) => {
  try {
    const auth = await getServerSession(authOptions);
    if (!auth || !auth?.user?.id)
      throw new ErrorHandler("Not Authrised", "UNAUTHORIZED");
    const mail = auth?.user.email;
    const username = auth?.user.name;
    const emailSubject = `Thank You for Your Feedback ${username}`;
    const emailContent = FeedbackAcknowledgmentEmail(username);
    const response = await prisma.feedback.create({
      data: {
        ...feedbackData,
      },
    });
    return {
      status: 200,
      response,
    };

    void handleBackgroundTask(mail, emailSubject, emailContent);
  } catch (error) {
    console.log(error);
  }
};

async function handleBackgroundTask(
  mail: string,
  emailSubject: string,
  emailContent: string
) {
  try {
    await sendEmail(mail, emailSubject, emailContent);
  } catch (error) {
    console.log(error);
  }
}
