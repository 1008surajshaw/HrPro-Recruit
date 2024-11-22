/*
  Warnings:

  - You are about to drop the column `address` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Job` table. All the data in the column will be lost.
  - Made the column `description` on table `Job` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "address",
DROP COLUMN "city",
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "application" DROP NOT NULL;
