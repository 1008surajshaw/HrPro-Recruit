/*
  Warnings:

  - The primary key for the `Achievement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Achievement` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Certification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Certification` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Achievement" DROP CONSTRAINT "Achievement_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Certification" DROP CONSTRAINT "Certification_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Certification_pkey" PRIMARY KEY ("id");
