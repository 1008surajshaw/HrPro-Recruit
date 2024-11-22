import PostJobForm from '@/components/jobpost/job-form';
import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getUserDetailsWithId } from '@/actions/user.profile.actions';
import { redirect } from 'next/navigation';


const page = async() => {

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'HR') redirect('/');

  const userId = session?.user.id

  let userDetails;
  if(userId){
    const res = await getUserDetailsWithId(userId);
    console.log(res,"resonse")
    if (res.status) {
      userDetails = res.additional;
      console.log(userDetails.company,"comapny detilsa")
    }
  }

  if(!userDetails?.company){
    return (
      <div className='h-screen w-full justify-center items-center border-2 dark:text-white '>
          please complete your company details first
      </div>
    )
  }

  return (
    <div className="mt-10 flex flex-col items-center">
      <div>
        <h1 className="text-start text-4xl font-semibold">Post a job</h1>
      </div>

      <PostJobForm compnayId={userDetails.company.id}/>
    </div>
  );
};

export default page;
