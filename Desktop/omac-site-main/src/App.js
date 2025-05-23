import React from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Partners from './components/Partners';
import AboutSection from './components/AboutSection';
import ScrollToTop from './components/ScrollToTop';
import EventsCalendar from './components/EventsCalendar'; 
import MediaRessources from './components/MediaResources'; 
import ContactSection from './components/ContactSection'; 


function App() {
  return (
    <div className="app">
      <Header />
      <Hero />
      <Partners />
      <AboutSection />
      <ScrollToTop />
      <EventsCalendar />
      <MediaRessources/>
      <ContactSection/>
    </div>
  );
}

export default App;