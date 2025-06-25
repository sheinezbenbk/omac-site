import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Scolarite.css';

import Header from './Header';
import Footer from './Footer';

import icon1 from '../assets/check.png';
import icon2 from '../assets/check.png';
import icon3 from '../assets/check.png';
import icon4 from '../assets/check.png';

import devoirIcon from '../assets/ecole.png';
import methodeIcon from '../assets/check.png';
import orientationIcon from '../assets/famille.png';

const Scolarite = () => {
  const navigate = useNavigate();

  // Forcer le scroll en haut à chaque chargement de la page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  // Points forts de l'accompagnement à la scolarité
  const scolariteFeatures = [
    { id: 1, text: 'Soutien scolaire personnalisé et bienveillant', icon: icon1 },
    { id: 2, text: 'Accompagnement aux devoirs et méthodologie', icon: icon2 },
    { id: 3, text: 'Lutte contre le décrochage scolaire', icon: icon3 },
    { id: 4, text: 'Ateliers d\'orientation et de remotivation', icon: icon4 }
  ];


  return (
    <div className="scolarite-page">
      <Header />

      {/* En-tête de la page scolarité */}
      <section className="scolarite-header">
        <div className="scolarite-header-container">
          <h1 className="scolarite-title">Aide à la Scolarité</h1>
          <p className="scolarite-subtitle">
            Un accompagnement éducatif complémentaire pour favoriser la réussite 
            de tous les élèves dans un cadre bienveillant et structurant.
          </p>
          <div className="scolarite-navigation">
            <button className="nav-btn" onClick={goToHome}>
              Retour à l'accueil
            </button>
          </div>
        </div>
      </section>

      {/* Section principale */}
      <section className="scolarite-content">
        <div className="container">
          
          <div className="about-columns">
            <div className="image-column">
           
              <div className="image-container">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-vh4FU3rHri3SEY8QH0suUmHrun79_MiGiQ&s" alt="Enfants en activité scolaire à l'OMAC" />
              </div>
            </div>
            
            <div className="text-column">
              <div className="text-content">
                <h3 className="card-title">Chaque élève mérite de réussir</h3>
                
                <p>Notre accompagnement à la scolarité vise à redonner confiance aux élèves en difficulté et à consolider les acquis de tous. Nous travaillons en étroite collaboration avec les familles et les équipes éducatives.</p>
                
                <p>Au-delà de l'aide aux devoirs, nous développons l'autonomie et les méthodes de travail. Chaque enfant bénéficie d'un suivi personnalisé dans un cadre chaleureux qui favorise l'épanouissement et la motivation.</p>
                
                <ul className="feature-list">
                  {scolariteFeatures.map(item => (
                    <li key={item.id} className="feature-item">
                      <div className="icon-placeholder">
                        <img src={item.icon} alt={`Icône ${item.id}`} width="24" height="24" />
                      </div>
                      <span className="item-text">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
            </div>
          </div>

          {/* infos pratique */}
          <div className="partenaires-scolarite">
            <div className="partenaires-block">
              <h3 className="partenaires-title">Informations pratiques</h3>
              <div className="partenaires-grid">
                <div className="partenaire-item">
                  <h4>Éducation Nationale</h4>
                  <p>Collaboration étroite avec les établissements scolaires de Torcy</p>
                </div>
                <div className="partenaire-item">
                  <h4>Familles</h4>
                  <p>Dialogue constant avec les parents pour un suivi cohérent</p>
                </div>
                <div className="partenaire-item">
                  <h4>Ville de Torcy</h4>
                  <p>Soutien municipal dans le cadre de la réussite éducative</p>
                </div>
                <div className="partenaire-item">
                  <h4>Associations</h4>
                  <p>Réseau partenarial pour enrichir l'accompagnement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Scolarite;