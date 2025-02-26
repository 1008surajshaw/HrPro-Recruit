-- CreateEnum
CREATE TYPE "OauthProvider" AS ENUM ('GOOGLE');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('EMAIL_VERIFICATION', 'RESET_PASSWORD');

-- CreateEnum
CREATE TYPE "ProjectStack" AS ENUM ('GO', 'PYTHON', 'MERN', 'NEXTJS', 'AI_GPT_APIS', 'SPRINGBOOT', 'OTHERS');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('INR', 'USD');

-- CreateEnum
CREATE TYPE "WorkMode" AS ENUM ('remote', 'hybrid', 'office');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'HR');

-- CreateEnum
CREATE TYPE "EmployementType" AS ENUM ('Full_time', 'Part_time', 'Internship', 'Contract');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "avatar" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "skills" TEXT[],
    "resume" TEXT,
    "oauthProvider" "OauthProvider",
    "oauthId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blockedByAdmin" TIMESTAMP(3),
    "onBoard" BOOLEAN NOT NULL DEFAULT false,
    "githubLink" TEXT,
    "portfolioLink" TEXT,
    "linkedinLink" TEXT,
    "twitterLink" TEXT,
    "discordLink" TEXT,
    "contactEmail" TEXT,
    "aboutMe" TEXT,
    "resumeUpdateDate" TIMESTAMP(3),
    "companyId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyLogo" TEXT,
    "companyEmail" TEXT NOT NULL,
    "companyBio" TEXT NOT NULL,
    "foundedYear" TEXT NOT NULL,
    "numberOfEmployees" TEXT NOT NULL,
    "CEOName" TEXT NOT NULL,
    "companyType" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "website" TEXT,
    "linkedinLink" TEXT,
    "twitterLink" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "token" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "TokenType" NOT NULL
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "type" "EmployementType" NOT NULL,
    "work_mode" "WorkMode" NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "application" TEXT NOT NULL,
    "skills" TEXT[],
    "expired" BOOLEAN NOT NULL DEFAULT false,
    "has_expiry_date" BOOLEAN NOT NULL DEFAULT false,
    "expiryDate" TIMESTAMP(3),
    "has_salary_range" BOOLEAN NOT NULL DEFAULT false,
    "minSalary" INTEGER,
    "maxSalary" INTEGER,
    "has_experience_range" BOOLEAN NOT NULL DEFAULT false,
    "minExperience" INTEGER,
    "maxExperience" INTEGER,
    "is_verified_job" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "compnayId" TEXT NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "EmploymentType" "EmployementType" NOT NULL,
    "address" TEXT NOT NULL,
    "workMode" "WorkMode" NOT NULL,
    "currentWorkStatus" BOOLEAN NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" SERIAL NOT NULL,
    "instituteName" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "fieldOfStudy" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "projectName" TEXT NOT NULL,
    "projectThumbnail" TEXT,
    "projectSummary" TEXT NOT NULL,
    "projectLiveLink" TEXT,
    "projectGithub" TEXT NOT NULL,
    "stack" "ProjectStack" NOT NULL DEFAULT 'OTHERS',
    "userId" TEXT NOT NULL,
    "isFeature" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3),

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuingOrganization" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expirationDate" TIMESTAMP(3),
    "credentialId" TEXT,
    "credentialUrl" TEXT,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_userId_key" ON "Company"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_identifier_key" ON "VerificationToken"("token", "identifier");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_compnayId_fkey" FOREIGN KEY ("compnayId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
