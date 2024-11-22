'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MoreVertical, Check, X } from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { JobWithApplicant } from '@/types/jobs.types'
import ProfileHeroSection from '@/components/profile/ProfileHeroSection'
import ProfileAboutMe from '@/components/profile/AboutMe'
import ProfileResume from '@/components/profile/ProfileResume'
import ProfileSkills from '@/components/profile/ProfileSkills'
import ProfileProjects from '@/components/profile/ProfileProjects'
import ProfileExperience from '@/components/profile/ProfileExperience'
import ProfileEducation from '@/components/profile/ProfileEducation'
import ProfileCertificate from '@/components/profile/ProfileCertificate'
import { getUserDetailsWithId } from '@/actions/user.profile.actions'
import Loading from '@/app/profile/[userId]/loading'
import { calculateFitPercentage, getRelevanceInfo } from '@/lib/candidateEvaluete/calculateStringSimilarity'
import { updateApplicationStatus } from '@/actions/job.action'
import { Status } from '@prisma/client'
import { useToast } from '@/components/ui/use-toast';

const CandidateOverAllDetails = ({ jobDetail }: { jobDetail: JobWithApplicant }) => {
  const [selectedCandidate, setSelectedCandidate] = useState<string>(jobDetail.userApplied[0]?.userId || '')
  const [cachedProfiles, setCachedProfiles] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [relevanceFilter, setRelevanceFilter] = useState('all')
  const [applications, setApplications] = useState(jobDetail.userApplied)
 
  const { toast } = useToast();

  const fetchCandidateProfile = async (userId: string) => {
    if (cachedProfiles[userId]) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const res = await getUserDetailsWithId(userId)
      if (res.status) {
        setCachedProfiles(prev => ({
          ...prev,
          [userId]: res.additional
        }))
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (selectedCandidate) {
      fetchCandidateProfile(selectedCandidate)
    }
  }, [selectedCandidate])

  const handleSetCandidate = (userId: string) => {
    setSelectedCandidate(userId)
  }

  const getRelevanceRange = (percentage: number) => {
    if (percentage < 40) return 'below40'
    if (percentage < 70) return '40-70'
    if (percentage < 85) return '70-85'
    return 'above85'
  }

  const filteredCandidates = applications.filter(candidate => {
    const matchesSearch = candidate.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || candidate.status === filterStatus
    
    const relevancePercentage = calculateFitPercentage(candidate.user, jobDetail)
    const relevanceRange = getRelevanceRange(relevancePercentage)
    const matchesRelevance = relevanceFilter === 'all' || relevanceFilter === relevanceRange

    return matchesSearch && matchesStatus && matchesRelevance
  })

  const acceptanceMessage = jobDetail.acceptanceMessage 
  ? jobDetail.acceptanceMessage 
  : `Congratulations! You have been accepted for the position of ${jobDetail.title}. We are thrilled to have you join our team as a ${jobDetail.type.toLowerCase()} working in ${jobDetail.workMode.toLowerCase()} mode. Further details will be shared with you soon.`;

const rejectionMessage = jobDetail.rejectionMessage 
  ? jobDetail.rejectionMessage 
  : `Thank you for applying for the position of ${jobDetail.title}. We appreciate your effort and interest in joining our team. Unfortunately, we have decided to move forward with other candidates at this time. Please feel free to apply for future opportunities that match your skills.`;


  const handleStatusUpdate = async (e: React.MouseEvent, applicationId: number,userId:string, newStatus: Status, email:string, name:string ) => {
    e.stopPropagation() // Stop the event from bubbling up to the Card
    
    try {
      const result = await updateApplicationStatus(applicationId,userId, newStatus,email,name,jobDetail.company.companyName,jobDetail.title,acceptanceMessage ,rejectionMessage)
      
      if (result.status) {
        setApplications(prevApplications => 
          prevApplications.map(app => 
            app.id === applicationId 
              ? { ...app, status: newStatus }
              : app
          )
        )
  
        toast({
          title: "Status Updated",
          description: result.message,
          variant: newStatus === 'Accepted' ? "default" : "destructive",
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update candidate status",
        variant: "destructive",
      })
    }
  }

  return (
    <div className='w-full flex h-screen overflow-hidden'>
      <div className="w-1/3 border-r p-4 flex flex-col">
        <div className="mb-4">
          <Input 
            placeholder="Search candidates" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-2 mb-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All candidates</SelectItem>
              <SelectItem value="Review">Review</SelectItem>
              <SelectItem value="Accepted">Accepted  </SelectItem>
              <SelectItem value="Rejected"> Rejected </SelectItem>
            </SelectContent>
          </Select>

          <Select value={relevanceFilter} onValueChange={setRelevanceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Relevance Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Relevance</SelectItem>
              <SelectItem value="above85">Excellent Match (85%+)</SelectItem>
              <SelectItem value="70-85">Good Match (70-85%)</SelectItem>
              <SelectItem value="40-70">Fair Match (40-70%)</SelectItem>
              <SelectItem value="below40">Poor Match (Below 40%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ScrollArea className="flex-grow">
          {filteredCandidates.length > 0 ? (
            filteredCandidates.map((candidate) => {
              const relevancePercentage = calculateFitPercentage(candidate.user, jobDetail)
              const relevanceInfo = getRelevanceInfo(relevancePercentage)
              
              return (
                <Card 
                  key={candidate.id} 
                  className={`mb-2 cursor-pointer ${selectedCandidate === candidate.userId ? 'border-primary' : ''}`}
                  onClick={() => handleSetCandidate(candidate.userId)}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 mr-4">
                        {candidate?.user.avatar && <AvatarImage src={candidate?.user.avatar} />}
                        <AvatarFallback>{candidate?.user.name}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{candidate?.user.name}</h3>
                        <div className="flex gap-2">
                          <Badge variant="outline">{candidate?.status}</Badge>
                          <Badge 
                            variant="outline" 
                            className={`${relevanceInfo.color}`}
                          >
                            {relevancePercentage}% - {relevanceInfo.level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => e.stopPropagation()} // Prevent card click when opening dropdown
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent onClick={(e) => e.stopPropagation()}> {/* Prevent card click when clicking dropdown content */}
                        <DropdownMenuItem 
                          className='cursor-pointer'
                          onClick={(e) => handleStatusUpdate(e, candidate.id,candidate.user.id, 'Accepted',candidate.user.email,candidate.user.name)}
                        >
                          <Check className="mr-2 h-4 w-4"/> Send Accepted Message
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className='cursor-pointer'
                          onClick={(e) => handleStatusUpdate(e, candidate.id,candidate.user.id, 'Rejected',candidate.user.email,candidate.user.name)}
                        >
                          <X className="mr-2 h-4 w-4"/> Send Rejection Mail
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <p className="text-center text-muted-foreground">No candidates found.</p>
          )}
        </ScrollArea>
      </div>

      <div className="w-2/3 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6 min-w-full">
            {isLoading ? (
              <Loading />
            ) : (
              cachedProfiles[selectedCandidate] && (
                <>
                  <ProfileHeroSection userdetails={cachedProfiles[selectedCandidate]} />
                  <ProfileAboutMe
                    aboutMe={cachedProfiles[selectedCandidate].aboutMe || ''}
                    isOwner={false}
                  />
                  <ProfileResume
                    resume={cachedProfiles[selectedCandidate].resume || ''}
                    isOwner={false}
                    name={cachedProfiles[selectedCandidate].name}
                    resumeUpdateDate={cachedProfiles[selectedCandidate].resumeUpdateDate || new Date()}
                  />
                  <ProfileSkills 
                    isOwner={false} 
                    skills={cachedProfiles[selectedCandidate].skills} 
                  />
                  <ProfileProjects 
                    projects={cachedProfiles[selectedCandidate].project} 
                    isOwner={false} 
                  />
                  <ProfileExperience
                    isOwner={false}
                    experiences={cachedProfiles[selectedCandidate].experience}
                  />
                  <ProfileEducation
                    isOwner={false}
                    education={cachedProfiles[selectedCandidate].education}
                  />
                  <ProfileCertificate
                    isOwner={false}
                    certificate={cachedProfiles[selectedCandidate].certificate}
                  />
                </>
              )
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default CandidateOverAllDetails