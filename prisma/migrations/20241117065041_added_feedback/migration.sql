-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "userType" "Role" NOT NULL,
    "userId" TEXT NOT NULL,
    "overallRating" INTEGER NOT NULL,
    "feedbackResponses" JSONB NOT NULL,
    "additionalComments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);
