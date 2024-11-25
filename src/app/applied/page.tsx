import { Suspense } from "react";
import ApplicationContain from "@/components/application/ApplicationContain";
import { getAllApplication } from "@/actions/job.action";

export default async function AppliedJobsPage() {
  const appliedJobs = await getAllApplication();
  
  if(!appliedJobs){
    return 
  }
  
  return (
    <Suspense fallback={<div>Loading applications...</div>}>
      <ApplicationContain initialData={appliedJobs} />
    </Suspense>
  );
}

