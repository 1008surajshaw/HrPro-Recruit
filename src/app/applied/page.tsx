import { getAllApplication } from "@/actions/job.action"
import ApplicationContain from "@/components/application/ApplicationContain";
import CompleteApplication from "@/components/application/CompleteApplication"
import { redirect } from 'next/navigation';
import { Suspense } from "react";

export default  function page() {
  
  return(  
    <Suspense>
      <ApplicationContain/>
    </Suspense>
  )
}

