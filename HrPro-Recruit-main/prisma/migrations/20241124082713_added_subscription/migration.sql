-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "jobPostsRemaining" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subscriptionEndDate" TIMESTAMP(3),
ADD COLUMN     "subscriptionStartDate" TIMESTAMP(3),
ADD COLUMN     "subscriptionTierId" TEXT;

-- CreateTable
CREATE TABLE "SubscriptionTier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "jobPostLimit" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "features" TEXT[],

    CONSTRAINT "SubscriptionTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentIntentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionTierId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_subscriptionTierId_fkey" FOREIGN KEY ("subscriptionTierId") REFERENCES "SubscriptionTier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_subscriptionTierId_fkey" FOREIGN KEY ("subscriptionTierId") REFERENCES "SubscriptionTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
