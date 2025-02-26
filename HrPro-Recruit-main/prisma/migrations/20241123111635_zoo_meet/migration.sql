-- CreateEnum
CREATE TYPE "MeetingStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');

-- CreateTable
CREATE TABLE "ZoomMeeting" (
    "id" TEXT NOT NULL,
    "recruiterId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "jobApplicationId" INTEGER NOT NULL,
    "meetingId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "joinUrl" TEXT NOT NULL,
    "hostJoinUrl" TEXT NOT NULL,
    "password" TEXT,
    "status" "MeetingStatus" NOT NULL DEFAULT 'SCHEDULED',
    "feedback" TEXT,
    "candidateAttended" BOOLEAN NOT NULL DEFAULT false,
    "recruiterAttended" BOOLEAN NOT NULL DEFAULT false,
    "actualStartTime" TIMESTAMP(3),
    "actualEndTime" TIMESTAMP(3),
    "cancelReason" TEXT,
    "cancelledBy" TEXT,
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZoomMeeting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ZoomMeeting_meetingId_key" ON "ZoomMeeting"("meetingId");

-- CreateIndex
CREATE INDEX "ZoomMeeting_recruiterId_status_idx" ON "ZoomMeeting"("recruiterId", "status");

-- CreateIndex
CREATE INDEX "ZoomMeeting_candidateId_status_idx" ON "ZoomMeeting"("candidateId", "status");

-- AddForeignKey
ALTER TABLE "ZoomMeeting" ADD CONSTRAINT "ZoomMeeting_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoomMeeting" ADD CONSTRAINT "ZoomMeeting_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoomMeeting" ADD CONSTRAINT "ZoomMeeting_jobApplicationId_fkey" FOREIGN KEY ("jobApplicationId") REFERENCES "JobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
