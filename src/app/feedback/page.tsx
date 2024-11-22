import FeedbackPage from '@/components/feedback/FeedBack';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import React from 'react'

const page = async() => {
    const auth = await getServerSession(authOptions);

    const userType = auth?.user.role == "HR"  ? "HR" : "USER"
    if(!auth?.user){
        return <p>Need to first Authenticate yourself before any FeedBack</p>
    }
  return (
    <div>
        <FeedbackPage userType={userType} userId={auth?.user.id} />
    </div>
  )
}

export default page