import React from 'react';
import {  getAllRecruiterJobs } from '@/actions/job.action';
import { JobQuerySchemaType } from '@/lib/validators/jobs.validator';
import RecruiterJobManagementTable from './RecruiterJobManagementTable';

const RecruiterJob = async ({
  searchParams,
}: {
  searchParams: JobQuerySchemaType;
}) => {
  const jobs = await getAllRecruiterJobs(searchParams);
  if (!jobs.status) {
    return <div>Error {jobs.message}</div>;
  }
  return (
    <div>
      <RecruiterJobManagementTable jobs={jobs.additional} searchParams={searchParams} />
    </div>
  );
};
export default RecruiterJob;
