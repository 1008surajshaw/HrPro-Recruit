import { getCandidateByJobId } from '@/actions/job.action';
import { JobByIdSchemaType } from '@/lib/validators/jobs.validator'
import React from 'react'
import { redirect } from 'next/navigation';

import CandidateOverAllDetails from '@/components/recruiter/CandidateOverAllDetails';


const page = async({ params }: { params: JobByIdSchemaType }) => {
    const job = await getCandidateByJobId(params);
  if (!job.status) {
    return;
  }
   
  const jobDetail = job.additional?.job;
  if (!jobDetail) {
    return redirect('/jobs');
  }

  return (
    <div className="flex ">
       <CandidateOverAllDetails jobDetail={jobDetail}/>
  </div>
  )
}

export default page