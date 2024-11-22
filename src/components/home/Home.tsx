import LandingPage from './pov/LandingPage'
import ExploreJob from './pov/ExploreJob'
import LatestJob from './pov/LatestJob'
import TopCompany from './pov/TopCompany'
import CarrierAdvice from './pov/CarrierAdvice'

export  const Home = () => {
  return (
    <div className='w-full '>
        <LandingPage/>
        <ExploreJob/>
        <LatestJob/>
        <TopCompany/>
        <CarrierAdvice/>
    </div>
  )
}

