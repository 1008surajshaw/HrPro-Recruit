import { Currency, EmployementType, Status, WorkMode } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

type JobApplication = {
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
      application?: string | null;
      skills: string[];
      expired: boolean;
      hasExpiryDate: boolean;
      expiryDate: Date | null;
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
      };
    };
  };
  
export  type GetAllApplicationResponse = {
    status: number;
    result: JobApplication[];
  };