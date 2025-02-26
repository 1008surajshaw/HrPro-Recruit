'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import JobCard from '../searchjob/Jobcard';
import { JobType } from '@/types/jobs.types';
import { useSession } from 'next-auth/react';
import { hasUserAppliedForJob } from '@/actions/job.action';

interface BookmarkedJobsProps {
  bookmarkedJobs: JobType[] | null;
}

const BookmarkedJobs: React.FC<BookmarkedJobsProps> = ({ bookmarkedJobs }) => {
  const { data: session } = useSession();
  const [appliedJobs, setAppliedJobs] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!session?.user || !bookmarkedJobs) return;

    const fetchAppliedStatus = async () => {
      const appliedStatus: { [key: string]: boolean } = {};

      for (const job of bookmarkedJobs) {
        const hasApplied = await hasUserAppliedForJob(job.id);
        appliedStatus[job.id] = hasApplied;
      }

      setAppliedJobs(appliedStatus);
    };

    fetchAppliedStatus();
  }, [session?.user, bookmarkedJobs]);

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
              isApplied={appliedJobs[job.id] || false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkedJobs;
