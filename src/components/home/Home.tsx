import LandingPage from './pov/LandingPage'
import ExploreJob from './pov/ExploreJob'
import LatestJob from './pov/LatestJob'
import TopCompany from './pov/TopCompany'
import CarrierAdvice from './pov/CarrierAdvice'
import Testimonials from './Testimonials'
import { JobLanding } from './job-landing'
import ExplorePage from './pov/ExplorePage'

export  const Home = () => {
  return (
    <div className='w-full '>
        <LandingPage/>
        <ExplorePage/>
        <ExploreJob/>
        <JobLanding/>
        {/* <LatestJob/> */}
        <TopCompany/>
        <Testimonials />
        <CarrierAdvice/>
    </div>
  )
}

