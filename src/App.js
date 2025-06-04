import React from 'react';
import './App.css';
import Hero from './components/Hero';
import Partners from './components/Partners';
import AboutSection from './components/AboutSection';
import ScrollToTop from './components/ScrollToTop';
import EventsCalendar from './components/EventsCalendar'; 
import MediaRessources from './components/MediaResources'; 
import ContactSection from './components/ContactSection'; 
import './styles/responsive.css';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app">
     
      <div id="hero">
        <Hero />
      </div>
      
      <Partners />

      <div id="about-section">
        <AboutSection />
      </div>
      
      <ScrollToTop />

      <div id="events-section">
        <EventsCalendar />
      </div>
      
      <MediaRessources/>
      
      <div id="contact-section">
        <ContactSection/>
      </div>
      
      
      <Footer />
    </div>
  );
}

export default App;