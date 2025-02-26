import { OnboardingProcess } from '@/components/user-multistep-form/OnboardingProcess'
import { authOptions } from '@/lib/authOptions'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'USER') {
    redirect('/')
  }

  if (session.user.onBoard === true) {
    redirect('/jobs')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <OnboardingProcess />
    </div>
  )
}

