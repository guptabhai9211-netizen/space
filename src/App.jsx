import React from 'react'
import SpaceNavbar from './Components/Navbar'
import SpaceHero from './Components/Hero'
import SpaceFooter from './Components/Footer'
import SpaceFeatures from './Components/Features'
import PlanetsSection from './Components/Planets'
import SpaceGallery from './Components/Gallery'

function App() {
  return (
    <div>

      <SpaceNavbar/>

      {/* Home */}
      <div id="home">
        <SpaceHero/>
      </div>

      {/* Missions */}
      <div id="missions">
        <SpaceFeatures/>
      </div>
      <SpaceGallery/>

      {/* Planets */}
      <div id="planets">
        <PlanetsSection/>
      </div>

      

      {/* Contact */}
      <div id="contact">
        <SpaceFooter/>
      </div>

    </div>
  )
}

export default App