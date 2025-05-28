import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  // Fonction pour scroller vers une section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          L'<span className="highlight">OMAC</span>, Au Cœur de la Vie de Quartier à Torcy
        </h1>
        <p className="hero-text">
          Ensemble, animons la vie de quartier, soutenons les familles et accompagnons les jeunes dans un esprit d'éducation populaire et de laïcité.
        </p>
        <div className="hero-buttons">
          <a 
            href="#" 
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
              // ✅ Navigation vers la page Guide
              navigate('/guide');
            }}
          >
            Guide de l'OMAC →
          </a>
          <a 
            href="#" 
            className="btn btn-secondary"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('contact-section');
            }}
          >
            Contactez-nous
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;