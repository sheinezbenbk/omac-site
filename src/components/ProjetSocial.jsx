import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjetSocial.css';

// Import des composants communs
import Header from './Header';
import Footer from './Footer';

const ProjetSocial = () => {
  const navigate = useNavigate();
  const [isFlipbookLoaded, setIsFlipbookLoaded] = useState(false);

  // Forcer le scroll en haut à chaque chargement de la page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  // Aller vers la section contact
  const goToContact = () => {
    navigate('/');
    setTimeout(() => {
      scrollToSection('contact-section');
    }, 100);
  };

  // Informations supplémentaires sur le projet social
  const projetSocialInfo = [
    {
      id: 1,
      icon: '📋',
      title: 'Projet Associatif',
      description: 'Découvrez les orientations stratégiques et les valeurs qui guident l\'action de l\'OMAC dans le développement local.'
    },
    {
      id: 2,
      icon: '🏘️',
      title: 'Cohésion Sociale',
      description: 'Nos actions visent à renforcer le lien social et la solidarité entre les habitants des différents quartiers de Torcy.'
    },
    {
      id: 3,
      icon: '👥',
      title: 'Éducation Populaire',
      description: 'L\'éducation populaire est au cœur de notre démarche pour favoriser l\'émancipation et la citoyenneté active.'
    },
    {
      id: 4,
      icon: '🎯',
      title: 'Développement Local',
      description: 'Nous contribuons au développement du territoire en favorisant la participation des habitants aux projets locaux.'
    }
  ];

  return (
    <div className="projet-social-page">
      {/* Header commun */}
      <Header />

      {/* En-tête de la page projet social */}
      <section className="projet-social-header">
        <div className="projet-social-header-container">
          <h1 className="projet-social-title">Projet Social de l'OMAC</h1>
          <p className="projet-social-subtitle">
            Découvrez le projet social de l'Office Municipal d'Animation de la Cité de Torcy, 
            nos orientations et nos engagements pour le développement local et la cohésion sociale.
          </p>
          <div className="projet-social-navigation">
            <button className="nav-btn" onClick={goToHome}>
              Retour à l'accueil
            </button>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="projet-social-content">
        <div className="projet-social-container">
          
          {/* Section du flipbook */}
          <div id="flipbook-section" className="flipbook-section">
            <div className="flipbook-header">
              <h2 className="flipbook-title">Projet Social Interactif OMAC Torcy</h2>
              <p className="flipbook-description">
                Parcourez notre projet social interactif pour découvrir en détail 
                nos orientations, nos valeurs et nos engagements pour la communauté.
              </p>
            </div>
            
            <div className="flipbook-container">
              <div className="flipbook-wrapper">
                {/* Indicateur de chargement */}
                {!isFlipbookLoaded && (
                  <div className="flipbook-loading">
                    <div className="loading-spinner"></div>
                    <p>Chargement du projet social en cours...</p>
                  </div>
                )}
                
                {/* Flipbook intégré */}
                <iframe 
                  className="flipbook-iframe"
                  src="https://online.fliphtml5.com/pilvj/fxcr/" 
                  seamless="seamless" 
                  scrolling="no" 
                  frameBorder="0" 
                  allowTransparency="true" 
                  allowFullScreen="true"
                  onLoad={handleFlipbookLoad}
                  title="Projet Social OMAC Torcy"
                />
              </div>
            </div>
          </div>

          {/* Section d'informations supplémentaires */}
          <div className="projet-social-info-section">
            {projetSocialInfo.map(info => (
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
          <div className="projet-social-actions">
            <h3 className="actions-title">Envie de participer à nos projets ?</h3>
            <p className="actions-description">
              L'OMAC de Torcy est ouverte à tous ceux qui souhaitent s'investir 
              dans la vie de quartier et contribuer au développement local.
            </p>
            <div className="actions-buttons">
              <button className="action-btn" onClick={goToContact}>
                Nous Rejoindre
              </button>
              <button className="action-btn secondary" onClick={() => scrollToSection('flipbook-section')}>
                Relire le Projet
              </button>
              <button className="action-btn secondary" onClick={goToHome}>
                Retour à l'Accueil
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer commun */}
      <Footer />
    </div>
  );
};

export default ProjetSocial;