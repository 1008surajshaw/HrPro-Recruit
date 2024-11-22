/*
  Warnings:

  - The `responsibilities` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "customQuestions" DROP NOT NULL,
ALTER COLUMN "perks" DROP NOT NULL,
DROP COLUMN "responsibilities",
ADD COLUMN     "responsibilities" TEXT[];
