import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, Briefcase, Building2, CalendarDays } from 'lucide-react'
import MessageSection from "./MessageSection"
import { getCompleteConversationById,getResponseWithCompanyDetails } from "@/actions/message.action"
import { LoadingSpinner } from "../loading-spinner"
import MeetingScheduler from "./MeetingScheduler"
import { useSession } from "next-auth/react"

type ConversationItem = {
  id: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
  senderId: string;
};

type JobDetails = {
  title: string;
  description: string;
  skills: string[];
  responsibilities: string[];
};

type CompanyDetails = {
  companyName: string;
  companyBio: string;
  foundedYear: string;
  numberOfEmployees: string;
  city: string;
  country: string;
  companyType: string;
};

type otherUser ={
    id: string;
    name: string;
    avatar: string | null;
} | null

type jobApplications = {
  id:number
  job: {
      id: string;
      title: string;
      company: {
          companyName: string;
          companyLogo: string | null;
      };
  };
} | undefined

const UserCompleteConversation = ({ conversationId, isHR,otherUsers,jobApplication  }: { conversationId: string; isHR: boolean ;otherUsers:otherUser,jobApplication:jobApplications}) => {
  const session = useSession();
  const recId  = session.data?.user.id
  
  const [activeTab, setActiveTab] = useState("messages")
  const [conversation, setConversation] = useState<ConversationItem[]>()
  const [jobDetails, setJobDetails] = useState<JobDetails>()
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>()
  const [isLoading, setIsLoading] = useState(true)
  const [hasLoadedJob, setHasLoadedJob] = useState(false)
  const [hasLoadedCompany, setHasLoadedCompany] = useState(false)

  // Only fetch messages initially
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true)
      try {
        const response = await getCompleteConversationById(conversationId)
        // console.log(response,'response')
        if (response?.status) {
          setConversation(response.additional)
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [conversationId])

  // Fetch job and company details only when their tabs are clicked
  const handleTabChange = async (tab: string) => {
    setActiveTab(tab)

    // If job tab is clicked and job details haven't been loaded yet
    if (tab === "job" && !hasLoadedJob) {
      setIsLoading(true)
      try {
        const response = await getResponseWithCompanyDetails(conversationId)
        if (response?.status) {
          const { job } = response.additional.jobApplication
          setJobDetails({
            title: job.title,
            description: job.description,
            skills: job.skills,
            responsibilities: job.responsibilities
          })
          setHasLoadedJob(true)
        }
      } catch (error) {
        console.error('Error fetching job details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // If company tab is clicked and company details haven't been loaded yet
    if (tab === "company" && !hasLoadedCompany && !isHR) {
      setIsLoading(true)
      try {
        const response = await getResponseWithCompanyDetails(conversationId)
        if (response?.status) {
          const { company } = response.additional.jobApplication.job
          setCompanyDetails({
            companyName: company.companyName,
            companyBio: company.companyBio,
            foundedYear: company.foundedYear,
            numberOfEmployees: company.numberOfEmployees  ,
            city: company.city,
            country: company.country,
            companyType: company.companyType
          })
          setHasLoadedCompany(true)
        }
      } catch (error) {
        console.error('Error fetching company details:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <Tabs 
        defaultValue="messages" 
        className="flex-1 flex flex-col"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="job" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Job Description
          </TabsTrigger>
          <TabsTrigger value={isHR ? "meeting" : "company"} className="flex items-center gap-2">
            {isHR ? (
              <>
                <CalendarDays className="h-4 w-4" />
                Create Meeting
              </>
            ) : (
              <>
                <Building2 className="h-4 w-4" />
                Company
              </>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="flex-1 mt-0 overflow-hidden">
          {isLoading && activeTab === "messages" ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : conversation ? (
            <MessageSection 
              messages={conversation} 
              conversationId={conversationId}
              isHR={isHR}
            />
          ) : (
            <p>No messages found.</p>
          )}
        </TabsContent>

        <TabsContent value="job" className="mt-0">
          {isLoading && activeTab === "job" ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : jobDetails ? (
            <div className="p-4 space-y-4">
              <h2 className="text-2xl font-bold">{jobDetails.title}</h2>
              <p className="text-muted-foreground">{jobDetails.description}</p>
              <div className="space-y-2">
                <h3 className="font-semibold">Skills Required</h3>
                <div className="flex flex-wrap gap-2">
                  {jobDetails.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Responsibilities</h3>
                <ul className="list-disc list-inside space-y-1">
                  {jobDetails.responsibilities.map((responsibility, index) => (
                    <li key={index} className="text-muted-foreground">{responsibility}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p>No job details found.</p>
          )}
        </TabsContent>

        <TabsContent value={isHR ? "meeting" : "company"} className="mt-0">
          {isLoading && activeTab === "company" ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : !isHR && companyDetails ? (
            <div className="p-4 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  
                  <div>
                    <h2 className="text-2xl font-bold">{companyDetails.companyName}</h2>
                    <p className="text-muted-foreground">{companyDetails.companyBio}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Founded</h3>
                    <p className="text-muted-foreground">{companyDetails.foundedYear}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Company Size</h3>
                    <p className="text-muted-foreground">{companyDetails.numberOfEmployees} employees</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p className="text-muted-foreground">{companyDetails.city}, {companyDetails.country}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Company Type</h3>
                    <p className="text-muted-foreground">{companyDetails.companyType}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : isHR && recId && otherUsers?.id && jobApplication?.id  ? (
            <MeetingScheduler 
              recruiterId={recId}
              candidateId={otherUsers?.id}
              jobApplicationId={jobApplication?.id}
          />
          ) : (
            <p>No company details found.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserCompleteConversation;