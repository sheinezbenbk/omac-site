import React from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Partners from './components/Partners';

function App() {
  return (
    <div className="app">
      <Header />
      <Hero />
      <Partners />
    </div>
  );
}

export default App;