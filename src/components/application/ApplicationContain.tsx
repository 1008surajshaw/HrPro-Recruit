import { getAllApplication } from '@/actions/job.action'
import React from 'react'
import CompleteApplication from './CompleteApplication'
import { redirect } from 'next/navigation'

const ApplicationContain = async () => {
    const appliedJobs = await getAllApplication()

    if (appliedJobs?.status !== 200) {
      redirect('/')
    }
  
    return <CompleteApplication appliedJobs={appliedJobs} />
}

export default ApplicationContain