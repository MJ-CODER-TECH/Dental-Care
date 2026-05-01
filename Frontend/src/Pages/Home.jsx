import React from 'react'
import LandingPage from '../components/Home/LandingPage'
import Startigy from '../components/Home/Startigy'
import AboutSection from '../components/Home/AboutSection'
import DentalSection from '../components/Home/DentalSection'
import StatsSection from '../components/Home/Statssection'
import BestServicesSection from '../components/Home/BestServicessection'
import ServicesSection from '../components/Home/Servicessection'
import TestimonialSection from '../components/Home/Testimonialsection'
import DedicatedServicesSection from '../components/Home/DedicatedServicessection'
import { BlogsSection, CTASection } from "../components/Home/Blogsandctasection";

const Home = () => {
  return (
    <div className='w-full'>
     <LandingPage /> 
     <Startigy />
     <AboutSection />
     <DentalSection />
     <StatsSection />
     <BestServicesSection />
     <ServicesSection />
     <TestimonialSection />
     <DedicatedServicesSection />
     <BlogsSection />
     <CTASection />
      
          </div>
  )
}

export default Home