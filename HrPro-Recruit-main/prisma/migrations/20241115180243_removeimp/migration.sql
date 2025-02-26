/*
  Warnings:

  - Made the column `jobApplicationId` on table `Conversation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Conversation" ALTER COLUMN "jobApplicationId" SET NOT NULL;
