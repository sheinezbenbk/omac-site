import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutSection.css';
import icon1 from '../assets/check.png';
import icon2 from '../assets/check.png';
import icon3 from '../assets/check.png';

// importation des icônes
import jeunesseIcon from '../assets/basket.png';
import famillesIcon from '../assets/famille.png';
import scolariteIcon from '../assets/ecole.png';

const AboutSection = () => {
  const navigate = useNavigate();
  
  // Fonction pour naviguer vers la page Guide
  const handleGuideClick = () => {
    navigate('/guide');
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  // Fonction pour naviguer vers la page Projet Social
  const handleProjetSocialClick = () => {
    navigate('/projet-social');
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  // Fonctions pour naviguer vers les secteurs
  const handleJeunesseClick = () => {
    navigate('/jeunesse');
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  const handleFamilleClick = () => {
    navigate('/famille');
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  const handleScolariteClick = () => {
    navigate('/scolarite');
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };
  
  const items = [
    { id: 1, text: 'Accompagnement personnalisé des familles', icon: icon1 },
    { id: 2, text: 'Activités éducatives et culturelles variées', icon: icon2 },
    { id: 3, text: 'Engagement dans l\'éducation populaire et la laïcité', icon: icon3 }
  ];

  // SERVICES AVEC NAVIGATION CORRIGÉE
  const services = [
    {
      id: 1,
      icon: jeunesseIcon,
      title: "Jeunesse",
      description: "Accompagnement éducatif, activités sportives et culturelles, sorties et projets collectifs pour les jeunes de Torcy. Développement de l'autonomie et de la citoyenneté.",
      onClick: handleJeunesseClick
    },
    {
      id: 2,
      icon: famillesIcon,
      title: "Familles et Adultes",
      description: "Soutien aux familles, ateliers parentalité, activités intergénérationnelles et accompagnement social. Un espace d'écoute et d'entraide pour tous.",
      onClick: handleFamilleClick
    },
    {
      id: 3,
      icon: scolariteIcon,
      title: "Aide à la scolarité",
      description: "Soutien scolaire, accompagnement aux devoirs, ateliers de méthodologie et orientation. Réussite éducative pour tous les enfants du quartier.",
      onClick: handleScolariteClick
    }
  ];

  return (
    <section className="about-section">
      <div className="container">
        <div className="about-header">
          <h2 className="section-title">À Propos de l'OMAC</h2>
          <div className="subtitle-container">
            <p className="about-subtitle">Découvrez notre Histoire et nos Missions</p>
            <div className="green-underline"></div>
          </div>
        </div>
        
        <div className="about-columns">
          <div className="image-column">
            <div className="yellow-square"></div>
            <div className="image-container">
              <img src="/placeholder-image.jpg" alt="L'équipe OMAC de Torcy" />
            </div>
          </div>
          
          <div className="text-column">
            <div className="text-content">
              <h3 className="card-title">Au service de la communauté depuis des années</h3>
              
              <p>L'OMAC de Torcy est une association d'éducation populaire qui œuvre quotidiennement pour l'animation de la vie de quartier et l'accompagnement des habitants. Nous développons des projets collectifs dans un esprit de solidarité et de laïcité.</p>
              
              <p>Implantés dans plusieurs quartiers de Torcy, nous proposons des activités diversifiées qui favorisent le lien social, l'épanouissement personnel et la participation citoyenne. Notre équipe professionnelle accompagne les projets des habitants dans une démarche participative.</p>
              
              <ul className="feature-list">
                {items.map(item => (
                  <li key={item.id} className="feature-item">
                    <div className="icon-placeholder">
                      <img src={item.icon} alt={`Icône ${item.id}`} width="24" height="24" />
                    </div>
                    <span className="item-text">{item.text}</span>
                  </li>
                ))}
              </ul>
              
              <button className="btn-learn-more" onClick={handleGuideClick}>
                Guide de l'OMAC
              </button>
              <button className="btn-learn-more" onClick={handleProjetSocialClick}>
                Projet Social
              </button>
            </div>
            <div className="blue-square"></div>
          </div>
        </div>
        
        {/* SECTION SERVICES CORRIGÉE */}
        <div className="services-container">
          {services.map(service => (
            <div className="service-card" key={service.id}>
              <div className="service-icon">
                <img src={service.icon} alt={service.title} />
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <div className="card-divider"></div>
              {/* ✅ CORRECTION : Garder le design du lien avec onClick */}
              <a href="#" className="service-link" onClick={(e) => {
                e.preventDefault();
                service.onClick();
              }}>
                En Savoir Plus →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;