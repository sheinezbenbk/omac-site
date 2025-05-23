import React from 'react';
import './Hero.css';

const Hero = () => {
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
          <a href="#" className="btn btn-primary">Nos Actions →</a>
          <a href="#" className="btn btn-secondary">Contactez-nous</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;