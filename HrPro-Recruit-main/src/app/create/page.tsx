import PostJobForm from '@/components/jobpost/job-form';
import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getUserDetailsWithId } from '@/actions/user.profile.actions';
import { redirect } from 'next/navigation';
import SubscriptionExpirationModal from '@/components/jobpost/SubscriptionExpirationModal';
import Image from 'next/image';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, UserCircle } from "lucide-react"


const page = async() => {

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'HR') redirect('/');

  const userId = session?.user.id

  let userDetails;
  if(userId){
    const res = await getUserDetailsWithId(userId);
    if (res.status) {
      userDetails = res.additional;
    }
  }

  const isSubscriptionValid = userDetails?.subscriptionEndDate 
    ? new Date(userDetails.subscriptionEndDate) > new Date() 
    : false;
  const hasNoSubscription = !userDetails?.subscriptionTierId;

  if(!userDetails?.company){
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center bg-background text-foreground p-4">
      <div className="text-center max-w-2xl">
       
        <h1 className="text-3xl font-bold mb-4">Company Profile Incomplete</h1>
        <p className="text-xl mb-8">
          Please complete your company details to access the full features of our platform.
        </p>
        <div className="flex justify-center space-x-4">
          <Button asChild className="flex items-center">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex items-center">
            <Link href="/profile">
              <UserCircle className="mr-2 h-4 w-4" /> Complete Profile
            </Link>
          </Button>
        </div>
      </div>
    </div>
    )
  }

  

  return (
    <>
     {(hasNoSubscription || !isSubscriptionValid) && (
        <SubscriptionExpirationModal 
          hasSubscription={!!userDetails?.subscriptionTierId}
        />
      )}

      <div className="mt-10 flex flex-col items-center">
        <div>
          <h1 className="text-start text-4xl font-semibold">Post a job</h1>
        </div>

        <PostJobForm compnayId={userDetails.company.id}/>
      </div>
    </>
  );
};

export default page;
