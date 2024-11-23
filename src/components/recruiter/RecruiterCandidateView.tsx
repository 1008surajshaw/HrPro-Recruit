import { getUserDetailsWithId } from '@/actions/user.profile.actions';
import ProfileAboutMe from '@/components/profile/AboutMe';
import ProfileCertificate from '@/components/profile/ProfileCertificate';
import ProfileEducation from '@/components/profile/ProfileEducation';
import ProfileExperience from '@/components/profile/ProfileExperience';
import ProfileHeroSection from '@/components/profile/ProfileHeroSection';
import ProfileProjects from '@/components/profile/ProfileProjects';
import ProfileResume from '@/components/profile/ProfileResume';
import ProfileSkills from '@/components/profile/ProfileSkills';
import React  from 'react'

const RecruiterCandidateView = async({userId}:{userId:string}) => {
    const res = await getUserDetailsWithId(userId);
    let userDetails;
    
    if(res.status){
        userDetails = res.additional; 
    }

    const isOwner = false;
  return (
    <>
     {
        userDetails && (
            <>
                <ProfileHeroSection userdetails={userDetails} />
                <ProfileAboutMe
                    aboutMe={userDetails.aboutMe || ''}
                    isOwner={isOwner}
                  />
                  <ProfileResume
                    resume={userDetails.resume || ''}
                    isOwner={isOwner}
                    name={userDetails.name}
                    resumeUpdateDate={userDetails.resumeUpdateDate || new Date()}
                  />
                  <ProfileSkills isOwner={isOwner} skills={userDetails.skills} />
                  <ProfileProjects projects={userDetails.project} isOwner={isOwner} />
                  <ProfileExperience
                    isOwner={isOwner}
                    experiences={userDetails.experience}
                  />
                  <ProfileEducation
                    isOwner={isOwner}
                    education={userDetails.education}
                  />
                  
                  <ProfileCertificate
                    isOwner={isOwner}
                    certificate={userDetails.certificate}
                  />
            </>
        )
     }
    </>
  )
}

export default RecruiterCandidateView