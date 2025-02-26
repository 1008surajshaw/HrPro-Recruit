'use server'
import prisma from '@/config/prisma.config';
import { withNonUserServerAction } from '@/lib/recruiter';
import { sendEmail } from '@/lib/sendEmail';
import { SuccessResponse } from '@/lib/success';
import {
  CreateZoomMeetingInput,
  createZoomMeetingSchema,
  ZoomMeetingResponse
} from '@/lib/validators/zoom.validators';
import { ZoomAPI } from '@/lib/zoom';
import ZoomMeetingEmail from '@/mailtemplate/ZoomMeetingEmail';
import { ServerActionReturnType } from '@/types/api.types';


export const createZoomMeet = withNonUserServerAction<
  CreateZoomMeetingInput,
  { success: boolean; message: string; data?: any }
>(async (session, data) => {
  try {
    if (!data) {
      throw new Error("Data is required to create a Zoom meeting");
    }

    // Validate input data
    const result = createZoomMeetingSchema.safeParse(data);
    if (!result.success) {
      throw new Error(result.error.errors[0].message);
    }

    // Verify session
    const auth = session.user.id;
    if (!auth) {
      throw new Error("Unauthorized");
    }

    // Verify job application exists and fetch associated data
    const jobApplication = await prisma.jobApplication.findUnique({
      where: {
        id: data.jobApplicationId,
      },
      include: {
        job: {
          select: {
            title: true,
            type: true,
            category: true,
            workMode: true,
            company: {
              select: {
                companyName: true,
                city: true,
                country: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!jobApplication) {
      throw new Error("Job application not found");
    }

    // Create Zoom meeting
    const zoomApi = new ZoomAPI();
    const zoomMeeting = await zoomApi.createMeeting(data);

    const meeting = await prisma.zoomMeeting.create({
      data: {
        recruiterId: data.recruiterId,
        candidateId: data.candidateId,
        jobApplicationId: data.jobApplicationId,
        meetingId: zoomMeeting.id.toString(),
        topic: zoomMeeting.topic,
        startTime: new Date(zoomMeeting.start_time),
        duration: zoomMeeting.duration,
        joinUrl: zoomMeeting.join_url,
        hostJoinUrl: zoomMeeting.start_url,
        password: zoomMeeting.password,
        status: "SCHEDULED",
        reminderSent: false,
        candidateAttended: false,
        recruiterAttended: false,
      },
    });

    // Prepare email details
    const recruiterEmail = session.user.email;
    const recruiterName = session.user.name;
    const candidateEmail = jobApplication.user.email;
    const candidateName = jobApplication.user.name;
    const meetingDetails = {
      topic: meeting.topic,
      startTime: meeting.startTime,
      duration: meeting.duration,
      joinUrl: meeting.joinUrl,
      hostJoinUrl: meeting.hostJoinUrl,
      password: meeting.password,
      job: jobApplication.job,
    };

    // Send emails asynchronously
    void (async () => {
      try {
        await Promise.all([
          sendMeetingNotifications(
            recruiterEmail,
            "New Meeting Scheduled for Candidate",
            ZoomMeetingEmail(recruiterName, "HR", meetingDetails)
          ),
          sendMeetingNotifications(
            candidateEmail,
            "Your Interview Meeting Details",
            ZoomMeetingEmail(candidateName, "USER", meetingDetails)
          ),
        ]);
      } catch (error) {
        console.error("Failed to send meeting notification emails:", error);
      }
    })();

    // Return serializable data
    return {
      success: true,
      message: "Zoom meeting has been created successfully",
      data: {
        id: meeting.id,
        meetingId: meeting.meetingId,
        topic: meeting.topic,
        startTime: meeting.startTime.toISOString(),
        duration: meeting.duration,
        joinUrl: meeting.joinUrl,
        hostJoinUrl: meeting.hostJoinUrl,
        password: meeting.password,
        status: meeting.status,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to create zoom meeting: ${error.message}`,
    };
  }
});


// Function to send meeting notifications
async function sendMeetingNotifications(
  mail: string,
  emailSubject: string,
  emailContent: string
) {
  try {
    await sendEmail(mail, emailSubject, emailContent);
  } catch (error) {
    console.error(`Failed to send email to ${mail}: ${error}`);
  }
}


export const getZoomMeet = async (jobApplicationId: number) => {
  try {
    // Query the database for the Zoom meeting associated with the given job application ID
    const meeting = await prisma.zoomMeeting.findFirst({
      where: {
        jobApplicationId,
      },
      select: {
        id: true,
        recruiterId: true,
        candidateId: true,
        meetingId: true,
        topic: true,
        startTime: true,
        duration: true,
        joinUrl: true,
        hostJoinUrl: true,
        password: true,
        status: true,
        feedback: true,
        candidateAttended: true,
        recruiterAttended: true,
        actualStartTime: true,
        actualEndTime: true,
        cancelReason: true,
        cancelledBy: true,
        reminderSent: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!meeting) {
      throw new Error(`No Zoom meeting found for Job Application ID: ${jobApplicationId}`);
    }

    return meeting;
  } catch (error: any) {
    console.error(`Error fetching Zoom meeting: ${error.message}`);
    throw new Error('Failed to fetch Zoom meeting details');
  }
};
