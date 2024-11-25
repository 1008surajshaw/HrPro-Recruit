import { MeetingStatus } from "@prisma/client";
import { z } from "zod";

// Base schema for creating a Zoom meeting
export const createZoomMeetingSchema = z.object({
  recruiterId: z.string().min(1, "Recruiter ID cannot be empty"),
  candidateId: z.string().min(1, "Candidate ID cannot be empty"),
  jobApplicationId: z.number().int().positive("Job Application ID must be a positive number"),
  topic: z.string().min(3, "Topic must be at least 3 characters").max(200, "Topic cannot exceed 200 characters"),
  startTime: z.date().refine((date) => date > new Date(), "Meeting time must be in the future"),
  duration: z.number().int().min(15, "Duration must be at least 15 minutes").max(180, "Duration cannot exceed 180 minutes"),
  password: z.string().min(6, "Password must be at least 6 characters").max(10, "Password cannot exceed 10 characters").optional(),
});

export type CreateZoomMeetingInput = z.infer<typeof createZoomMeetingSchema>;

export const zoomMeetingResponseSchema = z.object({
  id: z.string().uuid(),
  recruiterId: z.string(),
  candidateId: z.string(),
  jobApplicationId: z.number().int(),
  meetingId: z.string(),
  topic: z.string(),
  startTime: z.date(),
  duration: z.number().int(),
  joinUrl: z.string().url(),
  hostJoinUrl: z.string().url(),
  password: z.string().optional().nullable(),
  status: z.nativeEnum(MeetingStatus),
  feedback: z.string().optional().nullable(),
  candidateAttended: z.boolean(),
  recruiterAttended: z.boolean(),
  actualStartTime: z.date().optional().nullable(),
  actualEndTime: z.date().optional().nullable(),
  cancelReason: z.string().optional().nullable(),
  cancelledBy: z.string().optional().nullable(),
  reminderSent: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ZoomMeetingResponse = z.infer<typeof zoomMeetingResponseSchema>;


// Type for updating a meeting
export const updateZoomMeetingSchema = createZoomMeetingSchema.partial().extend({
  id: z.string().uuid({
    message: "Invalid meeting ID format",
  }),
  status: z.nativeEnum(MeetingStatus).optional(),
  feedback: z.string()
    .min(10, "Feedback must be at least 10 characters")
    .max(2000, "Feedback cannot exceed 2000 characters")
    .optional(),
  cancelReason: z.string()
    .min(10, "Cancel reason must be at least 10 characters")
    .max(500, "Cancel reason cannot exceed 500 characters")
    .optional(),
});

export type UpdateZoomMeetingInput = z.infer<typeof updateZoomMeetingSchema>;

// Type for querying meetings
export const queryZoomMeetingSchema = z.object({
  recruiterId: z.string().optional(),
  candidateId: z.string().optional(),
  jobApplicationId: z.number().optional(),
  status: z.nativeEnum(MeetingStatus).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type QueryZoomMeetingInput = z.infer<typeof queryZoomMeetingSchema>;