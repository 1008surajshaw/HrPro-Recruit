import { JobQuerySchemaType,JobQuerySchema } from '@/lib/validators/jobs.validator';
import React from 'react'
import { redirect } from 'next/navigation';
import { options } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import JobManagement from '@/components/admin/JobManagement';
import RecruiterJob from '@/components/recruiter/RecruiterJob';


const page = async ({
  searchParams,
}: {
  searchParams: JobQuerySchemaType;
}) => {
  const parsedData = JobQuerySchema.safeParse(searchParams);
  const server = await getServerSession(options);
  if (!server?.user) {
    redirect('/api/auth/signin');
  } else if (server.user.role !== 'HR') {
    redirect('/jobs');
  }
  if (!(parsedData.success && parsedData.data)) {
    console.error(parsedData.error);
    redirect('/jobs');
  }
  const searchParamss = parsedData.data;
  return <RecruiterJob searchParams={searchParamss} />;
 
}

export default page