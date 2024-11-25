import { Currency, EmployementType, WorkMode ,Status, Experience } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
export interface JobType {
  id: string;
  title: string;
  description: string;
  type: EmployementType;
  category: string;
  workMode: WorkMode;
  currency: Currency;
  application?: string | null;
  skills: string[];
  expired: boolean;
  hasExpiryDate: boolean;
  expiryDate?: Date | null;
  hasSalaryRange: boolean;
  minSalary?: number | null;
  maxSalary?: number | null;
  hasExperiencerange: boolean;
  minExperience?: number | null;
  maxExperience?: number | null;
  isVerifiedJob: boolean;
  deleted: boolean;
  deletedAt?: Date | null;
  postedAt: Date;
  updatedAt: Date;
  responsibilities: string[];
  customQuestions?: unknown; // Or specify structure if known
  rejectionMessage?: string | null;
  acceptanceMessage?: string | null;
  company: CompanyType;
}

export interface CompanyType {
  id: string;
  companyName: string;
  companyLogo?: string | null;
  companyEmail: string;
  companyBio: string;
  foundedYear: string;
  numberOfEmployees: string;
  CEOName: string;
  companyType: string;
  city: string;
  country: string;
  website?: string | null;
  linkedinLink?: string | null;
  twitterLink?: string| null;
}

export type getAllJobsAdditonalType = {
  jobs: JobType[];
  totalJobs: number;
};
export type getAllRecommendedJobs = {
  jobs: JobType[] | null;
};
export type getJobType = {
  job: JobType | null;
};

export interface JobApplication {
  id:number;
  userId:string;
  status:Status;
  answers:any;
  user:User

}
export interface User {
    id:string;
    name:string;
    avatar:string | null;
    email:string;
    skills:string[];
    experience:Experience[];

}
export interface JobWithApplicant {
  id: string;
  title: string;
  description: string;
  type: EmployementType;
  category: string;
  workMode: WorkMode;
  currency: Currency;
  application?: string | null;
  skills: string[];
  expired: boolean;
  hasExpiryDate: boolean;
  expiryDate?: Date | null;
  hasSalaryRange: boolean;
  minSalary?: number | null;
  maxSalary?: number | null;
  hasExperiencerange: boolean;
  minExperience?: number | null;
  maxExperience?: number | null;
  isVerifiedJob: boolean;
  deleted: boolean;
  deletedAt?: Date | null;
  postedAt: Date;
  updatedAt: Date;
  responsibilities: string[];
  customQuestions?: unknown; // Or specify structure if known
  rejectionMessage?: string | null;
  acceptanceMessage?: string | null;
  company: CompanyType;
  userApplied : JobApplication[] 
}
export type getCompleteJobDetails = {
  job: JobWithApplicant | null;
}


export type CompleteConversationResponse = {
  status: boolean; 
  code: number; 
  message: string; 
  additional:{
    id: string
    jobApplication: {
      answers: JsonValue
      status: Status
      appliedAt: Date
      job: {
        id: string;
        title: string;
        description: string;
        type: EmployementType;
        category: string;
        workMode: WorkMode;
        currency: Currency;
        skills: string[];
        expired: boolean;
        hasExpiryDate: boolean;
        expiryDate?: Date | null;
        hasSalaryRange: boolean;
        minSalary?: number | null;
        maxSalary?: number | null;
        hasExperiencerange: boolean;
        minExperience?: number | null;
        maxExperience?: number | null;
        isVerifiedJob: boolean;
        deleted: boolean;
        deletedAt?: Date | null;
        postedAt: Date;
        updatedAt: Date;
        responsibilities: string[];
        company: CompanyType
      }
    }
  }
} 


export type ReturnTypeConversation ={
  status: boolean; 
  code: number; 
  message: string; 
  additional: {
    id:string
    content: string
    createdAt: Date
    isRead: boolean
    senderId:string
  }[]
}

export type AppliedJob = {
  result: {
    status: Status;
    appliedAt: Date;
    answers: JsonValue;
    job: {
      title: string;
      description: string;
      type: EmployementType;
      category: string;
      workMode: WorkMode;
      currency: Currency;
      skills: string[];
      expired: boolean;
      hasExpiryDate: boolean;
      expiryDate?: Date | null;
      hasSalaryRange: boolean;
      minSalary?: number | null;
      maxSalary?: number | null;
      hasExperiencerange: boolean;
      minExperience?: number | null;
      maxExperience?: number | null;
      isVerifiedJob: boolean;
      deleted: boolean;
      deletedAt?: Date | null;
      postedAt: Date;
      updatedAt: Date;
      responsibilities: string[];
      company: {
        companyName: string;
        companyLogo?: string | null;
        companyEmail: string;
        companyBio: string;
        foundedYear: string;
        numberOfEmployees: string;
        CEOName: string;
        companyType: string;
        city: string;
        country: string;
        website?: string | null;
        linkedinLink?: string | null;
        twitterLink?: string| null;
      }
    };
}[];
}