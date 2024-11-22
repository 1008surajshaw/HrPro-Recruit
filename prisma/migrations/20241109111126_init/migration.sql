/*
  Warnings:

  - Added the required column `customQuestions` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `perks` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responsibilities` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "acceptanceMessage" TEXT,
ADD COLUMN     "customQuestions" JSONB NOT NULL,
ADD COLUMN     "perks" JSONB NOT NULL,
ADD COLUMN     "rejectionMessage" TEXT,
ADD COLUMN     "responsibilities" JSONB NOT NULL;
