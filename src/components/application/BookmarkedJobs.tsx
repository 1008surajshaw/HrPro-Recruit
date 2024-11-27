'use client'

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import JobCard from '../searchjob/Jobcard';
import {  JobType } from '@/types/jobs.types';

interface BookmarkedJobsProps {
  bookmarkedJobs: JobType[] | null;
}

const BookmarkedJobs: React.FC<BookmarkedJobsProps> = ({ bookmarkedJobs }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bookmarked Jobs</h1>
        <p className="text-muted-foreground">Jobs you've saved for later</p>
      </div>

      {!bookmarkedJobs || bookmarkedJobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-40">
            <p className="text-muted-foreground">No bookmarked jobs found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bookmarkedJobs.map((job) => (
            <JobCard 
              key={job.id}
              job={job}
              isBookmarked={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkedJobs;

