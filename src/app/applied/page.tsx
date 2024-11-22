import { getAllApplication } from "@/actions/job.action"
import { AppliedJob } from "@/types/jobs.types"
import { CandidateApplication } from "@/components/application/CandidateApplication"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

export default async function ApplicationsPage() {
  const appliedJobs = await getAllApplication()

  if (appliedJobs?.status !== 200) {
    return (
      <div className="container mx-auto p-4">
        <Card className="bg-red-50 dark:bg-red-900/10">
          <CardContent className="p-6">
            <p className="text-center text-red-600 dark:text-red-400">
              An error occurred while fetching your applications. Please refresh the page or try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Applied Jobs</h1>
          <p className="text-muted-foreground">Track your job applications and their status</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in-review">In Review</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {appliedJobs.result.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-40">
            <p className="text-muted-foreground">No applications found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {appliedJobs.result.map((application) => (
            <CandidateApplication 
              key={`${application.job.title}-${application.appliedAt}`}
              application={application}
            />
          ))}
        </div>
      )}
    </div>
  )
}