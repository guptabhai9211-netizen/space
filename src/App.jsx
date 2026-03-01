import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import SpaceNavbar  from './Components/Navbar'
import SpaceFooter  from './Components/Footer'
import HomePage from './Components/Pages/Home'
import MissionSection from './Components/Pages/Mission'
import GalleryPage from './Components/GaleryPage'
import ExploreSection from './Components/Pages/Explore'
import PlanetsSection from './Components/Planets'
import SpaceGalaxy from './Components/Pages/SpaceGlaxy'
import SolarSystem from './Components/Solar-system'
import FutureTech from './Components/Pages/Section1'
import FunFactsSection from './Components/SpaceAgencies'
import SpaceTimeline from './Components/Spacetimline'

/* ── Pages ── */


/* Scroll to top on every route change */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
  return null
}

function AppLayout() {
  return (
    <div>
      <SpaceNavbar />
      <ScrollToTop />

      

       
      <Routes>
        <Route path="/"         element={ <>
    <HomePage/>
    <SpaceTimeline/>
    <SpaceGalaxy/>
    <SolarSystem/>
    <FutureTech/>
    <FunFactsSection/>
  </>}  
       
           />
        
        <Route path="/missions" element={<MissionSection/>} />
        <Route path="/gallery"  element={<GalleryPage/>}  />
        <Route path="/explore"  element={<ExploreSection/>}  />
        <Route path="/planets"  element={<PlanetsSection/>}  />
      </Routes>
      <SpaceFooter />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}