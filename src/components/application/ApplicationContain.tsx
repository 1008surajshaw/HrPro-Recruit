import React from 'react';
import CompleteApplication from './CompleteApplication';
import { GetAllApplicationResponse } from '@/types/application.type';

const ApplicationContain = ({ initialData }: { initialData: GetAllApplicationResponse }) => {
  if (initialData.status !== 200) {
    // You might want to handle this error case differently
    return <div>Error loading applications</div>;
  }
  
  return <CompleteApplication appliedJobs={initialData} />;
};

export default ApplicationContain;

