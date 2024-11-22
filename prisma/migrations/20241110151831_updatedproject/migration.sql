/*
  Warnings:

  - You are about to drop the column `projectGithub` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `stack` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "projectGithub",
DROP COLUMN "stack";
