'use server';
import prisma from '@/config/prisma.config';
import { withServerActionAsyncCatcher } from '@/lib/async-catch';
import { withSession } from '@/lib/session';
import { ErrorHandler } from '@/lib/error';
import { SuccessResponse } from '@/lib/success';
import {
  ApproveJobSchema,
  ApproveJobSchemaType,
  deleteJobByIdSchema,
  DeleteJobByIdSchemaType,
  JobByIdSchema,
  JobByIdSchemaType,
  JobPostSchema,
  JobPostSchemaType,
  JobQuerySchema,
  JobQuerySchemaType,
  RecommendedJobSchema,
  RecommendedJobSchemaType,
} from '@/lib/validators/jobs.validator';
 import { getJobFilters } from '@/lib/services/jobs.services';
import { ServerActionReturnType } from '@/types/api.types';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import JobCreatedEmail from "@/mailtemplate/JobCreatedEmail"

import {
  getAllJobsAdditonalType,
  getAllRecommendedJobs,
  getCompleteJobDetails,
  getJobType,
} from '@/types/jobs.types';
import { revalidatePath } from 'next/cache';
import { Status } from '@prisma/client';
import { withNonUserServerAction } from '@/lib/recruiter';
import { sendEmail } from '@/lib/sendEmail';
import ApplicationConfirmationEmail from '@/mailtemplate/ApplicationConfirmationEmail';
import NotificationUpdate from '@/mailtemplate/NotificationUpdate';

type additional = {
  isVerifiedJob: boolean;
};

type deletedJob = {
  deletedJobID: string;
}; //TODO: Convert it to generic type that returns JobID Only;

type ApprovedJobID = {
  jobId: string;
};


export const createJob = async (data:any) => {
  const auth = await getServerSession(authOptions);
  if(!auth?.user.id){
    return 
  }
  
  await prisma.job.create({
    data: {
      userId: auth.user.id,
      ...data,
      
    },
  });

  const message = 'Job created successfully, If any fraud detected will de block by admin';
  const additonal = { isVerifiedJob: true };
  
  try{
    await sendEmail(
      auth.user.email,
      "Job post Created Successfully",
      JobCreatedEmail(auth.user.name, data.title))
  }catch(error){
     console.log(error)
  }
  return new SuccessResponse(message, 201, additonal).serialize();

};

export const getAllJobs = withSession<
  JobQuerySchemaType,
  ServerActionReturnType<getAllJobsAdditonalType>
>(async (session, data) => {
  if (data?.workmode && !Array.isArray(data?.workmode)) {
    data.workmode = Array.of(data?.workmode);
  }
  if (data?.EmpType && !Array.isArray(data?.EmpType)) {
    data.EmpType = Array.of(data?.EmpType);
  }
  if (data?.salaryrange && !Array.isArray(data?.salaryrange)) {
    data.salaryrange = Array.of(data?.salaryrange);
  }
  if (data?.city && !Array.isArray(data?.city)) {
    data.city = Array.of(data?.city);
  }
  const result = JobQuerySchema.parse(data);
  const isAdmin = session.user.role === 'ADMIN';
  const { filterQueries, orderBy, pagination } = getJobFilters(result);
  const queryJobsPromise = prisma.job.findMany({
    ...pagination,
    orderBy: [orderBy],
    where: {
      ...(isAdmin
        ? { ...filterQueries }
        : {
            isVerifiedJob: true,
            deleted: false,
            ...filterQueries,
            expired: false,
          }),
    },
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      category: true,
      workMode: true,
      currency: true,
      application: true,
      skills: true,
      expired: true,
      hasExpiryDate: true,
      expiryDate: true,
      hasSalaryRange: true,
      minSalary: true,
      maxSalary: true,
      hasExperiencerange: true,
      minExperience: true,
      maxExperience: true,
      isVerifiedJob: true,
      deleted: true,
      deletedAt: true,
      postedAt: true,
      updatedAt: true,
      responsibilities: true,
      customQuestions: true,
      rejectionMessage: true,
      acceptanceMessage: true,
      company: {
        select: {
          id: true,
          companyName: true,
          companyLogo: true,
          companyEmail: true,
          companyBio: true,
          foundedYear: true,
          numberOfEmployees: true,
          CEOName: true,
          companyType: true,
          city: true,
          country: true,
          website: true,
          linkedinLink: true,
          twitterLink: true,
        },
      },
    },
  });
  const totalJobsPromise = prisma.job.count({
    where: {
      isVerifiedJob: true,
      ...filterQueries,
    },
  });

  const [jobs, totalJobs] = await Promise.all([
    queryJobsPromise,
    totalJobsPromise,
  ]);
  return new SuccessResponse('All jobs fetched successfully', 200, {
    jobs,
    totalJobs,
  }).serialize();
})

export const getRecommendedJobs = withServerActionAsyncCatcher<
  RecommendedJobSchemaType,
  ServerActionReturnType<getAllRecommendedJobs>
>(async (data) => {
  const result = RecommendedJobSchema.parse(data);
  const { id, category } = result;

  // fettching the latest three jobs excluding the current job and in the same category
  const jobs = await prisma.job.findMany({
    where: {
      category: category,
      id: { not: id },
      isVerifiedJob: true,
      expired: false,
      deleted: false,
    },
    orderBy: {
      postedAt: 'desc',
    },
    take: 3,
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      category: true,
      workMode: true,
      currency: true,
      application: true,
      skills: true,
      expired: true,
      hasExpiryDate: true,
      expiryDate: true,
      hasSalaryRange: true,
      minSalary: true,
      maxSalary: true,
      hasExperiencerange: true,
      minExperience: true,
      maxExperience: true,
      isVerifiedJob: true,
      deleted: true,
      deletedAt: true,
      postedAt: true,
      updatedAt: true,
      responsibilities: true,
      customQuestions: true,
      rejectionMessage: true,
      acceptanceMessage: true,
      company: {
        select: {
          id: true,
          companyName: true,
          companyLogo: true,
          companyEmail: true,
          companyBio: true,
          foundedYear: true,
          numberOfEmployees: true,
          CEOName: true,
          companyType: true,
          city: true,
          country: true,
          website: true,
          linkedinLink: true,
          twitterLink: true,
        },
      },
    },
  });

  if (jobs.length === 0) {
    const fallbackJobs = await prisma.job.findMany({
      where: {
        id: { not: id },
        expired: false,
        deleted: false,
      },
      orderBy: {
        postedAt: 'desc',
      },
      take: 3, // Fallback to showing latest 3 jobs from other categories
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        category: true,
        workMode: true,
        currency: true,
        application: true,
        skills: true,
        expired: true,
        hasExpiryDate: true,
        expiryDate: true,
        hasSalaryRange: true,
        minSalary: true,
        maxSalary: true,
        hasExperiencerange: true,
        minExperience: true,
        maxExperience: true,
        isVerifiedJob: true,
        deleted: true,
        deletedAt: true,
        postedAt: true,
        updatedAt: true,
        responsibilities: true,
        customQuestions: true,
        rejectionMessage: true,
        acceptanceMessage: true,
        company: {
          select: {
            id: true,
            companyName: true,
            companyLogo: true,
            companyEmail: true,
            companyBio: true,
            foundedYear: true,
            numberOfEmployees: true,
            CEOName: true,
            companyType: true,
            city: true,
            country: true,
            website: true,
            linkedinLink: true,
            twitterLink: true,
          },
        },
      },
    });

    return new SuccessResponse(
      'No jobs found in this category, here are some recent jobs',
      200,
      { jobs: fallbackJobs }
    ).serialize();
  }

  return new SuccessResponse('Recommended jobs fetched successfully', 200, {
    jobs,
  }).serialize();
});

export const getJobById = withServerActionAsyncCatcher<
  JobByIdSchemaType,
  ServerActionReturnType<getJobType>
>(async (data) => {
  const result = JobByIdSchema.parse(data);
  const { id } = result;
  const job = await prisma.job.findFirst({
    where: { id, expired: false, deleted: false },
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      category: true,
      workMode: true,
      currency: true,
      application: true,
      skills: true,
      expired: true,
      hasExpiryDate: true,
      expiryDate: true,
      hasSalaryRange: true,
      minSalary: true,
      maxSalary: true,
      hasExperiencerange: true,
      minExperience: true,
      maxExperience: true,
      isVerifiedJob: true,
      deleted: true,
      deletedAt: true,
      postedAt: true,
      updatedAt: true,
      responsibilities: true,
      customQuestions: true,
      rejectionMessage: true,
      acceptanceMessage: true,
      company: {
        select: {
          id: true,
          companyName: true,
          companyLogo: true,
          companyEmail: true,
          companyBio: true,
          foundedYear: true,
          numberOfEmployees: true,
          CEOName: true,
          companyType: true,
          city: true,
          country: true,
          website: true,
          linkedinLink: true,
          twitterLink: true,
        },
      },
    },
  });
  return new SuccessResponse(`${id} Job fetched successfully`, 200, {
    job,
  }).serialize();
});

export const getCityFilters = async () => {
  const response = await prisma.job.findMany({
    where: {
      isVerifiedJob: true,
      expired: false,
      deleted: false,
    },
    select: {
      company:{
        select:{
          city:true
        }
      }
    },
  });
  const cities = Array.from(new Set(response.map((res) => res.company.city)));
  return new SuccessResponse(`Cities fetched successfully`, 200, {
    cities,
  }).serialize();
};

export const getRecentJobs = async () => {
  try {
    const recentJobs = await prisma.job.findMany({
      where: {
        isVerifiedJob: true,
        deleted: false,
        expired: false,
      },
      orderBy: {
        postedAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        workMode: true,
        minSalary: true,
        maxSalary: true,
        category: true,
        minExperience: true,
        maxExperience: true,
        skills: true,
        expired: true,
        postedAt: true,
        type: true,
        application: true,
        company:{
          select:{
            companyName:true,
            companyLogo:true,
            companyBio:true,
            foundedYear:true,
            numberOfEmployees:true,
            CEOName:true,
            companyType:true,
            city:true,
            country:true,
            website:true,
            linkedinLink:true,
            twitterLink:true,
          }
        }
      },
      take: 6,
    });
    return new SuccessResponse('Recently added jobs fetch successfully', 200, {
      recentJobs,
    }).serialize();
  } catch (_) {
    return new ErrorHandler('Internal server error', 'DATABASE_ERROR');
  }
};

export const updateJob = withServerActionAsyncCatcher<
  JobPostSchemaType & { jobId: string },
  ServerActionReturnType<additional>
>(async (data) => {
  const auth = await getServerSession(authOptions);
  if (!auth || !auth?.user?.id)
    throw new ErrorHandler('Not Authorized', 'UNAUTHORIZED');

  const { jobId, ...updateData } = data;
  const parsedId = JobByIdSchema.parse({ id: jobId });

  const result = JobPostSchema.parse(updateData);

  let job = await prisma.job.findFirst({
    where: { id: parsedId.id, userId: auth.user.id },
  });

  if (!job)
    throw new ErrorHandler('Job not found or not authorized', 'NOT_FOUND');

  // Update the job
  job = await prisma.job.update({
    where: { id: parsedId.id },
    data: { ...result, isVerifiedJob: false },
  });

  const additonal = { isVerifiedJob: false, jobId: job.id };

  return new SuccessResponse(
    'Job updated successfully',
    200,
    additonal
  ).serialize();
});

export const toggleDeleteJobById = withServerActionAsyncCatcher<
  DeleteJobByIdSchemaType,
  ServerActionReturnType<deletedJob>
>(async (data) => {
  const result = deleteJobByIdSchema.parse(data);
  const { id } = result;

  // Fetch the current job's deleted status
  const job = await prisma.job.findUnique({
    where: {
      id: id,
    },
    select: {
      deleted: true,
      deletedAt: true,
    },
  });

  if (!job) {
    throw new Error('Job not found');
  }

  const isNowDeleted = !job.deleted;
  const deletedAt = isNowDeleted ? new Date() : null;

  const updatedJob = await prisma.job.update({
    where: {
      id: id,
    },
    data: {
      deleted: isNowDeleted,
      deletedAt: deletedAt,
    },
  });

  const action = updatedJob.deleted ? 'Deleted' : 'Undeleted';
  const deletedJobID = updatedJob.id;

  revalidatePath('/manage');

  return new SuccessResponse(`Job ${action} successfully`, 200, {
    deletedJobID,
  }).serialize();
});

export const toggleApproveJob = withNonUserServerAction<
  ApproveJobSchemaType,
  ServerActionReturnType<ApprovedJobID>
>(async (session, data) => {
  const result = ApproveJobSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors.toLocaleString());
  }

  const { id } = result.data;

  const job = await prisma.job.findUnique({
    where: { id: id },
    select: { isVerifiedJob: true },
  });

  if (!job) {
    throw new Error('Job not found');
  }

  await prisma.job.update({
    where: {
      id: id,
    },
    data: {
      isVerifiedJob: !job.isVerifiedJob,
    },
  });

  revalidatePath('/managejob');
  const message = job.isVerifiedJob ? 'Job Unapproved' : 'Job Approved';
  return new SuccessResponse(message, 200, { jobId: id }).serialize();
});

export async function updateExpiredJobs() {
  const currentDate = new Date();

  await prisma.job.updateMany({
    where: {
      hasExpiryDate: true,
      expiryDate: {
        lt: currentDate,
      },
    },
    data: {
      expired: true,
    },
  });
}

export const deleteOldDeltedJobs = async () => {
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  await prisma.job.deleteMany({
    where: {
      deleted: true,
      deletedAt: {
        lte: twoWeeksAgo,
      },
    },
  });
};

export async function toggleBookmarkAction(userId: string, jobId: string) {
  try {
    if (!userId || !jobId) throw new Error('User or Post is missing');

    const checkForUser = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!checkForUser)
      throw new ErrorHandler(
        'User with this email does not exist',
        'BAD_REQUEST'
      );

    const checkForBookmark = await prisma.bookmark.findFirst({
      where: {
        jobId: jobId,
        userId: userId,
      },
    });

    if (checkForBookmark) {
      const deletedBookmark = await prisma.bookmark.delete({
        where: {
          id: checkForBookmark.id,
        },
      });

      return {
        status: 201,
        message: 'Bookmark Deleted Successfully',
        data: deletedBookmark,
      };
    }

    const createNewBookmark = await prisma.bookmark.create({
      data: {
        jobId: jobId,
        userId: userId,
      },
    });

    return {
      status: 200,
      message: 'Bookmarked Successfully',
      data: createNewBookmark,
    };
  } catch (error) {
    return {
      status: 404,
      message: (error as Error).message,
      data: null,
    };
  }
}

export async function GetBookmarkByUserId() {
  try {
    const auth = await getServerSession(authOptions);

    if (!auth || !auth?.user?.id)
      throw new ErrorHandler('Not Authrised', 'UNAUTHORIZED');

    const userId = auth.user.id;

    const getUserBookmarks = await prisma.bookmark.findMany({
      where: {
        userId: userId,
      },

      select: {
        job: {
          select: {
            id: true,
            type: true,
            title: true,
            description: true,
            hasExperiencerange: true,
            minExperience: true,
            maxExperience: true,
            hasExpiryDate: true,
            expiryDate: true,
            skills: true,
            workMode: true,
            category: true,
            minSalary: true,
            maxSalary: true,
            postedAt: true,
            expired: true,
          },
        },
      },
    });

    if (!getUserBookmarks || getUserBookmarks.length === 0)
      throw new Error('No Bookmarked Job found');

    return {
      status: 200,
      message: 'Bookmarks fetched ',
      data: getUserBookmarks,
    };
  } catch (error) {
    return {
      status: 404,
      message: (error as Error).message,
      data: null,
    };
  }
}

export async function GetUserBookmarksId() {
  try {
    const auth = await getServerSession(authOptions);

    if (!auth || !auth?.user?.id)
      throw new ErrorHandler('Not Authrised', 'UNAUTHORIZED');

    const userId = auth.user.id;

    const getUserBookmarks = await prisma.user.findFirst({
      where: {
        id: userId,
      },

      select: {
        bookmark: {
          select: {
            jobId: true,
          },
        },
      },
    });

    if (!getUserBookmarks) throw new Error('No Bookmarked Job found');

    return {
      status: 200,
      message: 'Bookmarks fetched ',
      data: getUserBookmarks.bookmark,
    };
  } catch (error) {
    return {
      status: 404,
      message: (error as Error).message,
      data: null,
    };
  }
}


export async function submitJobApplication(formData: FormData,jobId:string ,role:string , company:string) {
  try {
    const auth = await getServerSession(authOptions);
    
    if (!auth || !auth?.user?.id)
      throw new ErrorHandler('Not Authrised', 'UNAUTHORIZED');

    const userId = auth.user.id;

    
    const answers = formData.get('answers') as string;
   

    const isPresent = await prisma.jobApplication.findFirst({
      where: {
        userId,
        jobId,
      },
    });

    if (isPresent) {
      throw new ErrorHandler('User has already applied for the job.',"UNPROCESSABLE_ENTITY");
    }
   
    // Start a transaction to create both the job application and notification
    
      // Create the job application
      const jobApplication = await prisma.jobApplication.create({
        data: {
          jobId,
          userId,
          status:'Review',
          answers: JSON.parse(answers),
        },
      });

      void handleBackgroundMails(auth.user.email,auth.user.name ,auth.user.id,role,company)

      return jobApplication;
     
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit job application',
    };
  }
}

async function handleBackgroundMails(
  email:string,
  name:string,
  userId:string,
  role:string,
  company:string,

) {
  try {
    // Send email
    
    await sendEmail(
      email, 
      `Job Application Successfully Submitted for role ${role} at ${company}`, 
      ApplicationConfirmationEmail(name,role,company)
    )

    // Create notification
    await prisma.notification.create({
      data: {
        userId: userId,
        type: 'JOB_APPLICATION',
        content: `Your application for ${role} at ${company} has been ${status.toLowerCase()}.`,
      },
    })

  } catch (error) {
    console.error(`Error in background tasks for application :`, error)
  }
}


export const getAllRecruiterJobs = withSession<
  JobQuerySchemaType,
  ServerActionReturnType<getAllJobsAdditonalType>
>(async (session, data) => {
  if (data?.workmode && !Array.isArray(data?.workmode)) {
    data.workmode = Array.of(data?.workmode);
  }
  if (data?.EmpType && !Array.isArray(data?.EmpType)) {
    data.EmpType = Array.of(data?.EmpType);
  }
  if (data?.salaryrange && !Array.isArray(data?.salaryrange)) {
    data.salaryrange = Array.of(data?.salaryrange);
  }
  if (data?.city && !Array.isArray(data?.city)) {
    data.city = Array.of(data?.city);
  }
  const result = JobQuerySchema.parse(data);
  const userID = session.user.id
  const { filterQueries, orderBy, pagination } = getJobFilters(result);
  const queryJobsPromise = prisma.job.findMany({
    ...pagination,
    orderBy: [orderBy],
    where: {
      userId:userID
    },
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      category: true,
      workMode: true,
      currency: true,
      application: true,
      skills: true,
      expired: true,
      hasExpiryDate: true,
      expiryDate: true,
      hasSalaryRange: true,
      minSalary: true,
      maxSalary: true,
      hasExperiencerange: true,
      minExperience: true,
      maxExperience: true,
      isVerifiedJob: true,
      deleted: true,
      deletedAt: true,
      postedAt: true,
      updatedAt: true,
      responsibilities: true,
      customQuestions: true,
      rejectionMessage: true,
      acceptanceMessage: true,
      company: {
        select: {
          id: true,
          companyName: true,
          companyLogo: true,
          companyEmail: true,
          companyBio: true,
          foundedYear: true,
          numberOfEmployees: true,
          CEOName: true,
          companyType: true,
          city: true,
          country: true,
          website: true,
          linkedinLink: true,
          twitterLink: true,
        },
      },
    },
  });
  const totalJobsPromise = prisma.job.count({
    where: {
      isVerifiedJob: true,
      ...filterQueries,
    },
  });

  const [jobs, totalJobs] = await Promise.all([
    queryJobsPromise,
    totalJobsPromise,
  ]);
  return new SuccessResponse('All jobs fetched successfully', 200, {
    jobs,
    totalJobs,
  }).serialize();
})


export const getCandidateByJobId = withServerActionAsyncCatcher<
  JobByIdSchemaType,
  ServerActionReturnType<getCompleteJobDetails>
>(async (data) => {
  const result = JobByIdSchema.parse(data);
  const { id } = result;
  const job = await prisma.job.findFirst({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      category: true,
      workMode: true,
      currency: true,
      application: true,
      skills: true,
      expired: true,
      hasExpiryDate: true,
      expiryDate: true,
      hasSalaryRange: true,
      minSalary: true,
      maxSalary: true,
      hasExperiencerange: true,
      minExperience: true,
      maxExperience: true,
      isVerifiedJob: true,
      deleted: true,
      deletedAt: true,
      postedAt: true,
      updatedAt: true,
      responsibilities: true,
      customQuestions: true,
      rejectionMessage: true,
      acceptanceMessage: true,
      userApplied:{
        select:{
          id:true,
          userId:true,
          status:true,
          answers:true,
          user:{
            select:{
              id:true,
              name:true,
              avatar:true,
              email:true,
              skills:true,
              experience:true
            }
          }
        }
      },
      company: {
        select: {
          id: true,
          companyName: true,
          companyLogo: true,
          companyEmail: true,
          companyBio: true,
          foundedYear: true,
          numberOfEmployees: true,
          CEOName: true,
          companyType: true,
          city: true,
          country: true,
          website: true,
          linkedinLink: true,
          twitterLink: true,
        },
      },
    },
  });
  return new SuccessResponse(`${id} Job fetched successfully`, 200, {
    job,
  }).serialize();
});


type UpdateApplicationResponse = {
  status: boolean;
  message: string;
};

export async function updateApplicationStatus(
  applicationId: number,
  userId:string,
  status: Status,
  email:string,
  name:string,
  company:string,
  title:string,
  acceptanceMessage:string,
  rejectionMessage:string,
): Promise<UpdateApplicationResponse> {
  try {

    const auth = await getServerSession(authOptions);
    
    if (!auth || !auth?.user?.id)
      throw new ErrorHandler('Not Authrised', 'UNAUTHORIZED');

    const senderId = auth.user.id;

    await prisma.jobApplication.update({
      where: {
        id: applicationId
      },
      data: {
        status: status,
      },
    });

      
    void handleBackgroundTasks(applicationId,userId,senderId, status, email, name, company, title, acceptanceMessage, rejectionMessage)

    
    return {
      status: true,
      message: `Application status successfully updated to ${status} and Message send to the Candidate`,
    };
  } catch (error) {
    console.error("Error updating application status:", error);
    return {
      status: false,
      message: "Failed to update application status",
    };
  }
}


async function handleBackgroundTasks(
  applicationId: number,
  userId:string,
  senderId:string,
  status: Status,
  email: string,
  name: string,
  company: string,
  title: string,
  acceptanceMessage: string,
  rejectionMessage: string,
) {
  try {
    // Send email
    const emailSubject = `An Update from ${company} regarding ${title} position`
    const emailContent = status === 'Accepted'
      ? NotificationUpdate(name, company, acceptanceMessage)
      : NotificationUpdate(name, company, rejectionMessage)
    await sendEmail(email, emailSubject, emailContent)

    // Create notification
    await prisma.notification.create({
      data: {
        userId: userId,
        type: status === 'Accepted' ? 'APPLICATION_ACCEPTED' : 'APPLICATION_REJECTED',
        content: `Your application for ${title} at ${company} has been ${status.toLowerCase()}.`,
      },
    })

    // create conversation 

    if (status === "Accepted") {
      let conversation ;
      // Check if a conversation already exists between sender and recipient
      conversation = await prisma.conversation.findFirst({
        where: {
          participants: {
            every: {
              id: { in: [userId, senderId] },
            },
          },
          jobApplicationId:applicationId
        },
        include: {
          participants: true,
        },
      });

      // Create a new conversation if it doesn't exist
      if (!conversation) {
         conversation = await prisma.conversation.create({
          data: {
            participants: {
              connect: [{ id: userId }, { id: senderId }],
            },
            jobApplicationId:applicationId
          },
          include: {
            participants: true, // Include the participants in the returned conversation object
          },
        });
      }

      // Send a message in the conversation
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: senderId,
          content: acceptanceMessage,
        },
      });

    }

  } catch (error) {
    console.error(`Error in background tasks for application ${applicationId}:`, error)
  }
}


export async function getAllApplication() {
  try{
    const auth = await getServerSession(authOptions);
    
    if (!auth || !auth?.user?.id)
      throw new ErrorHandler('Not Authorized', 'UNAUTHORIZED');

    const res = await prisma.jobApplication.findMany({
      where:{
        userId:auth.user.id
      },
      select:{
        status:true,
        appliedAt:true,
        answers:true,
        job:{
          select:{
            title: true,
            description: true,
            type: true,
            category: true,
            workMode: true,
            currency: true,
            application: true,
            skills: true,
            expired: true,
            hasExpiryDate: true,
            expiryDate: true,
            hasSalaryRange: true,
            minSalary: true,
            maxSalary: true,
            hasExperiencerange: true,
            minExperience: true,
            maxExperience: true,
            isVerifiedJob: true,
            deleted: true,
            deletedAt: true,
            postedAt: true,
            updatedAt: true,
            responsibilities:true,
            company:{
              select:{
                companyName: true,
                companyLogo: true,
                companyEmail: true,
                companyBio: true,
                foundedYear: true,
                numberOfEmployees: true,
                CEOName: true,
                companyType: true,
                city: true,
                country: true,
                website: true,
                linkedinLink: true,
                twitterLink: true,
              }
            }
          }
        }
      }
    })

    return {
      status:200,
      result:res
    }
  }catch(error){
     console.log(error)
  }
}


