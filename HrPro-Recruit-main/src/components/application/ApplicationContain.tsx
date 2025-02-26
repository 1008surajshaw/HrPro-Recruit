'use client'

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompleteApplication from './CompleteApplication';
import BookmarkedJobs from './BookmarkedJobs';
import { GetAllApplicationResponse } from '@/types/application.type';
import { Job, JobType } from '@/types/jobs.types';

interface ApplicationContainProps {
  initialData: GetAllApplicationResponse;
  bookmarkedJobs: JobType[] | null;
}

const ApplicationContain: React.FC<ApplicationContainProps> = ({ initialData, bookmarkedJobs }) => {
  const [activeTab, setActiveTab] = useState("applied");

  return (
    <div className="container mx-auto p-4 space-y-6 min-h-screen">
      <Tabs defaultValue="applied" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="applied">Applied Jobs</TabsTrigger>
          <TabsTrigger value="bookmarked">Bookmarked Jobs</TabsTrigger>
        </TabsList>
        <TabsContent value="applied">
          <CompleteApplication appliedJobs={initialData} />
        </TabsContent>
        <TabsContent value="bookmarked">
          <BookmarkedJobs bookmarkedJobs={bookmarkedJobs} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationContain;

