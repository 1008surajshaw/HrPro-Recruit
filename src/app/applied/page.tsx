import { Suspense } from "react";
import ApplicationContain from "@/components/application/ApplicationContain";
import { getAllApplication, GetUserBookmark } from "@/actions/job.action";
import { BookmarkResponse } from "@/types/jobs.types";

export default async function AppliedJobsPage() {
  const appliedJobs = await getAllApplication();
  const bookmarkedJobs: BookmarkResponse = await GetUserBookmark();
  
  if (!appliedJobs) {
    return <div>Error loading applied jobs</div>;
  }
  
  if (!bookmarkedJobs || bookmarkedJobs.status !== 200) {
    return <div>Error loading bookmarked jobs</div>;
  }
  
  return (
    <Suspense fallback={<div>Loading applications...</div>}>
      <ApplicationContain initialData={appliedJobs} bookmarkedJobs={bookmarkedJobs.data || null} />
    </Suspense>
  );
}

