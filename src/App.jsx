import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import SpaceNavbar  from './Components/Navbar'
import SpaceFeatures from './Components/Features'
import SpaceFooter  from './Components/Footer'
import HomePage from './Components/Pages/Home'
import MissionSection from './Components/Pages/Mission'
import GalleryPage from './Components/GaleryPage'
import ExploreSection from './Components/Pages/Explore'
import PlanetsSection from './Components/Planets'

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
    <SpaceFeatures/>
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