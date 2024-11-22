import { getUserDetailsWithId } from '@/actions/user.profile.actions';
import Custom404Page from '@/app/[...404]/page';
import ProfileAboutMe from '@/components/profile/AboutMe';
import CompanyInfo from '@/components/profile/company/CompanyInfo';
import ProfileCertificate from '@/components/profile/ProfileCertificate';
import ProfileEducation from '@/components/profile/ProfileEducation';
import ProfileExperience from '@/components/profile/ProfileExperience';
import ProfileHeroSection from '@/components/profile/ProfileHeroSection';
import ProfileProjects from '@/components/profile/ProfileProjects';
import ProfileResume from '@/components/profile/ProfileResume';
import ProfileSkills from '@/components/profile/ProfileSkills';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';

const Page = async ({ params: { userId } }: { params: { userId: string } }) => {
  const session = await getServerSession(authOptions);

  const isOwner = session?.user.id === userId;
  const isHR = session?.user.role === 'HR'
  // console.log(session,"session data is thsi")
  let userDetails;
  const res = await getUserDetailsWithId(userId);
  if (res.status) {
    userDetails = res.additional;
  }

  if (!res.status) {
    return <Custom404Page />;
  }

  return (
    <>
      {userDetails && (
        <>
          <ProfileHeroSection userdetails={userDetails} />
          {
            isHR ? (
              <>
               <CompanyInfo
                isOwner={isOwner}
                company={userDetails.company }
               />
              </>
            ):(
              <>
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
      )}
    </>
  );
};

export default Page;
