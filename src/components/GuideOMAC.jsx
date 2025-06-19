import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GuideOMAC.css';

import Header from './Header';
import Footer from './Footer';

const GuideOMAC = () => {
  const navigate = useNavigate();
  const [isFlipbookLoaded, setIsFlipbookLoaded] = useState(false);

  // Gestion du chargement du flipbook
  const handleFlipbookLoad = () => {
    setIsFlipbookLoaded(true);
  };

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

  // Retour à l'accueil
  const goToHome = () => {
    navigate('/');
  };

  const goToContact = () => {
    navigate('/');
    setTimeout(() => {
      scrollToSection('contact-section');
    }, 100);
  };

  // Informations supplémentaires sur le guide
  const guideInfo = [
    {
      id: 1,
      icon: '📖',
      title: 'Guide Complet',
      description: 'Découvrez l\'histoire, les missions et les valeurs de l\'OMAC de Torcy à travers ce guide interactif détaillé.'
    },
    {
      id: 2,
      icon: '🏢',
      title: 'Nos Structures',
      description: 'Explorez nos différents centres et découvrez les activités proposées dans chaque lieu d\'accueil.'
    },
    {
      id: 3,
      icon: '👥',
      title: 'Notre Équipe',
      description: 'Rencontrez les professionnels qui s\'engagent quotidiennement pour l\'animation de la vie de quartier.'
    },
    {
      id: 4,
      icon: '🎯',
      title: 'Nos Actions',
      description: 'Comprenez notre approche de l\'éducation populaire et découvrez nos projets communautaires.'
    }
  ];

  return (
    <div className="guide-page">
      <Header />

      <section className="guide-header">
        <div className="guide-header-container">
          <h1 className="guide-title">Guide de l'OMAC</h1>
          <p className="guide-subtitle">
            Découvrez l'Office Municipal d'Animation de la Cité de Torcy, 
            son histoire, ses missions et ses actions au service de la communauté.
          </p>
          <div className="guide-navigation">
            <button className="nav-btn" onClick={goToHome}>
               Retour à l'accueil
            </button>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="guide-content">
        <div className="guide-container">
          
          {/* Section du flipbook */}
          <div id="flipbook-section" className="flipbook-section">
            <div className="flipbook-header">
              <h2 className="flipbook-title">Guide Interactif OMAC Torcy</h2>
              <p className="flipbook-description">
                Parcourez notre guide interactif pour découvrir en détail 
                l'organisation, les services et les activités de l'OMAC.
              </p>
            </div>
            
            <div className="flipbook-container">
              <div className="flipbook-wrapper">
                {/* Indicateur de chargement */}
                {!isFlipbookLoaded && (
                  <div className="flipbook-loading">
                    <div className="loading-spinner"></div>
                    <p>Chargement du guide en cours...</p>
                  </div>
                )}
                
                {/* Flipbook intégré */}
                <iframe 
                  className="flipbook-iframe"
                  src="https://online.fliphtml5.com/pilvj/xhez/" 
                  seamless="seamless" 
                  scrolling="no" 
                  frameBorder="0" 
                  allowTransparency="true" 
                  allowFullScreen="true"
                  onLoad={handleFlipbookLoad}
                  title="Guide OMAC Torcy"
                />
              </div>
            </div>
          </div>

          {/* Section d'informations supplémentaires */}
          <div className="guide-info-section">
            {guideInfo.map(info => (
              <div key={info.id} className="info-card">
                <div className="info-card-icon">
                  {info.icon}
                </div>
                <h3 className="info-card-title">{info.title}</h3>
                <p className="info-card-description">{info.description}</p>
              </div>
            ))}
          </div>

          {/* Section d'actions */}
          <div className="guide-actions">
            <h3 className="actions-title">Besoin de plus d'informations ?</h3>
            <p className="actions-description">
              Notre équipe est à votre disposition pour répondre à toutes vos questions 
              et vous accompagner dans vos démarches.
            </p>
            <div className="actions-buttons">
              <button className="action-btn" onClick={goToContact}>
                 Nous Contacter
              </button>
              <button className="action-btn secondary" onClick={() => scrollToSection('flipbook-section')}>
                 Relire le Guide
              </button>
              <button className="action-btn" onClick={goToHome}>
                 Retour à l'Accueil
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GuideOMAC;