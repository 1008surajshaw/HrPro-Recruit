'use client';
import { JobType } from '@/types/jobs.types';
import Icon from '@/components/ui/icon';
import { formatSalary } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Briefcase, MapPin, Globe, Building2, LinkedinIcon, Twitter } from 'lucide-react';
import Link from 'next/link';
import Linkify from 'linkify-react';
import { ShareJobDialog } from './ShareJobDialog';
import { FaUserTie } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CustomQuestionAns from './CustomQuestionAns';
import { useSession } from 'next-auth/react';



const options = {
  defaultProtocol: 'https',
  target: '_blank',
};

export const Job = ({ job }: { job: JobType }) => {
  const { data: session } = useSession();


  return (
    <aside className="col-span-1 flex flex-col gap-6 lg:col-span-4">
      <section className="grid gap-5 border-2 shadow-sm p-6 w-full bg-gradient-to-b from-[#F1F5F9] to-white dark:from-darkBgSecondary dark:to-darkBgTertiary rounded-lg">
        {/* Header section with logo and title */}
        <div className="flex gap-4 items-center">
          <div className="w-[4rem] h-[4rem] rounded-md">
            {job.company.companyLogo && (
              <Image
                className="size-full object-cover"
                src={job.company.companyLogo}
                width={'500'}
                height={'500'}
                alt="company-logo"
              />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-2xl">{job.title}</h1>
              {job.isVerifiedJob && (
                <span className="text-green-500 bg-green-100 px-2 py-1 rounded-md text-xs">
                  Verified
                </span>
              )}
            </div>
            <div className="text-xs flex gap-1 font-medium items-center text-gray-500">
              <span>{job.company.companyName}</span>•
              <span>{'Posted on ' + job.postedAt.toDateString()}</span>
              {job.hasExpiryDate && job.expiryDate && (
                <>
                  •<span>Expires on {job.expiryDate.toDateString()}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Job details section */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="px-4 py-1 w-fit text-blue-500 bg-blue-500/20 rounded-lg flex items-center justify-center text-xs md:text-sm font-bold">
              {job.type && job.type.toUpperCase().replace('_', ' ')}
            </div>

            <span className="px-4 py-1 w-fit text-purple-500 bg-purple-500/20 rounded-lg flex items-center justify-center text-xs md:text-sm font-bold">
              {job.workMode}
            </span>

            <span className="flex bg-green-500/20 font-bold rounded-lg px-4 py-1 text-green-500 text-xs md:text-sm items-center gap-0.5">
              <Icon icon="currency" size={16} />
              {job.hasSalaryRange && job.minSalary && job.maxSalary
                ? `${formatSalary(job.minSalary)}-${formatSalary(job.maxSalary)} ${job.currency}`
                : 'Not disclosed'}
            </span>

            <span className="flex items-center gap-0.5">
              {job.hasExperiencerange && job.minExperience && job.maxExperience ? (
                <span className="flex justify-start items-center gap-1 flex-nowrap">
                  <Briefcase size={12} />
                  {`${job.minExperience}-${job.maxExperience} Yrs`}
                </span>
              ) : (
                'Ex: Not disclosed'
              )}
            </span>

            <span className="flex justify-center items-center gap-2">
              <MapPin size={16} />
              <p className="text-xs md:text-sm font-semibold">
                {job.company.city}, {job.company.country}
              </p>
            </span>
          </div>
        </div>

        {/* Skills section */}
        <div className="flex items-center gap-2">
          <div className="w-full md:max-w-[80%] flex-wrap flex justify-start items-center gap-2">
            {job.skills.map((skill, index) => (
              <span
                key={`job_skill_${index}`}
                className="bg-gray-700/20 text-gray-600 dark:bg-gray-500/20 font-bold rounded-lg px-4 py-1 dark:text-gray-300 text-xs items-center gap-0.5"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex gap-2">
      
          <Dialog>
            <DialogTrigger asChild>
              {
                session?.user.role == "USER" &&
              <Button
                variant="default"
                className="justify-self-start px-6 dark:text-white py-2 w-fit h-fit"
                disabled={job.expired}
              >
                {job.expired ? 'Position Filled' : 'Apply for Job'}
              </Button>
              }
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Apply for {job.title}</DialogTitle>
                <div className="text-sm text-gray-500">
                  {job.company.companyName} • {job.company.city}, {job.company.country}
                </div>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <div className="space-y-4">
                    <CustomQuestionAns jobData={job}  />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        
          <ShareJobDialog job={job} />
        </div>
      </section>

      {/* Job description */}
      <section className="border-2 bg-[#F1F5F9] dark:bg-[#0F172A] h-auto max-h-[20rem] overflow-y-auto p-6 rounded-xl">
        <h2 className="font-extrabold px-4 py-1 w-fit text-white bg-red-600 dark:bg-red-700 rounded-lg text-xl">
          Job Description
        </h2>
        <Linkify options={options}>
          <div
            className="my-4 dark:text-neutral-100"
            dangerouslySetInnerHTML={{ __html: job.description ?? '' }}
          />
        </Linkify>
      </section>

      {/* Responsibilities section */}
      {job.responsibilities.length > 0 && (
        <section className="border-2 bg-[#F1F5F9] dark:bg-[#0F172A] h-auto max-h-[15rem] overflow-y-auto p-6 rounded-xl">
          <h2 className="font-extrabold px-4 py-1 w-fit text-white bg-red-600 dark:bg-red-700 rounded-lg text-xl">
            Key Responsibilities
          </h2>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            {job.responsibilities.map((responsibility, index) => (
              <li key={index} className="dark:text-neutral-200">
                {responsibility}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* About company */}
      <section className="border-2 bg-[#F1F5F9] dark:bg-[#0F172A]  max-h-[15rem]  p-6 rounded-xl">
        <h2 className="font-extrabold px-4 py-1 w-fit text-white bg-red-600 dark:bg-red-700 rounded-lg text-xl">
          About {job.company.companyName}
        </h2>
        
        <div className="my-4 space-y-4">
          <div
            dangerouslySetInnerHTML={{ __html: job.company.companyBio ?? '' }}
            className="dark:text-neutral-200"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Building2 className="text-gray-500" size={16} />
              <span className="text-sm">Founded: {job.company.foundedYear}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="text-gray-500" size={16} />
              <span className="text-sm">Size: {job.company.numberOfEmployees} employees</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="text-gray-500" size={16} />
              <span className="text-sm">Type: {job.company.companyType}</span>
            </div>
            {job.company.CEOName && (
              <div className="flex items-center gap-2">
                 <FaUserTie size={16} className="text-gray-500"/>
                <span className="text-sm">CEO: {job.company.CEOName}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            {job.company.website && (
              <Link
                href={job.company.website}
                target="_blank"
                className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
              >
                <Globe size={16} />
                <span className="text-sm">Website</span>
              </Link>
            )}
            {job.company.linkedinLink && (
              <Link
                href={job.company.linkedinLink}
                target="_blank"
                className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
              >
                <LinkedinIcon size={16} />
                <span className="text-sm">LinkedIn</span>
              </Link>
            )}
            {job.company.twitterLink && (
              <Link
                href={job.company.twitterLink}
                target="_blank"
                className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
              >
                <Twitter size={16} />
                <span className="text-sm">Twitter</span>
              </Link>
            )}
          </div>
        </div>
      </section>
    </aside>
  );
};