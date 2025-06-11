import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Jeunesse.css';
import Header from './Header';
import Footer from './Footer';

import icon1 from '../assets/check.png';
import icon2 from '../assets/check.png';
import icon3 from '../assets/check.png';
import icon4 from '../assets/check.png';

import sportIcon from '../assets/basket.png';
import culturelIcon from '../assets/ecole.png';
import projetIcon from '../assets/famille.png';

const Jeunesse = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const goToHome = () => {
    navigate('/');
  };

  const goToContact = () => {
    navigate('/');
    setTimeout(() => {
      scrollToSection('contact-section');
    }, 100);
  };


  const jeunesseFeatures = [
    { id: 1, text: 'Accueil libre et accompagnement de projets personnalisés', icon: icon1 },
    { id: 2, text: 'Activités ludiques, sportives et culturelles variées', icon: icon2 },
    { id: 3, text: 'Sorties et séjours éducatifs tout au long de l\'année', icon: icon3 },
    { id: 4, text: 'Informations, orientations et échanges bienveillants', icon: icon4 }
  ];

  const jeunesseServices = [
    {
      id: 1,
      icon: sportIcon,
      title: "Défis Sportifs",
      description: "Tournois inter-quartiers, initiation aux sports urbains, course d'orientation. Développement de l'esprit d'équipe et dépassement de soi.",
      link: "#sport"
    },
    {
      id: 2,
      icon: culturelIcon,
      title: "Expression Créative",
      description: "Ateliers hip-hop, graffiti légal, création vidéo, podcasts jeunes. Expression libre et développement des talents artistiques.",
      link: "#culture"
    },
    {
      id: 3,
      icon: projetIcon,
      title: "Projets Citoyens",
      description: "Montage de projets solidaires, aide à la création d'événements, sensibilisation environnementale. Formation à la citoyenneté active.",
      link: "#projets"
    }
  ];

  return (
    <div className="jeunesse-page">
      {/* Header commun */}
      <Header />

      {/* ✅ En-tête de la page jeunesse */}
      <section className="jeunesse-header">
        <div className="jeunesse-header-container">
          <h1 className="jeunesse-title">Secteur Jeunesse</h1>
          <p className="jeunesse-subtitle">
            Un espace d'épanouissement et d'autonomie pour les jeunes de Torcy,
            où chacun peut développer ses talents et construire ses projets d'avenir.
          </p>
          <div className="jeunesse-navigation">
            <button className="nav-btn" onClick={goToHome}>
              Retour à l'accueil
            </button>
          </div>
        </div>
      </section>

      {/* Section principale */}
      <section className="jeunesse-content">
        <div className="container">
          
          <div className="about-columns">
            <div className="image-column">
             
              <div className="image-container">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-vh4FU3rHri3SEY8QH0suUmHrun79_MiGiQ&s" alt="Jeunes en activité à l'OMAC" />
              </div>
            </div>
            
            <div className="text-column">
              <div className="text-content">
                <h3 className="card-title">Grandir ensemble dans la bienveillance</h3>
                
                <p>Les espaces jeunesse de l'OMAC accueillent les 11-17 ans dans un cadre sécurisant et stimulant. Nos équipes accompagnent chaque jeune dans sa découverte de l'autonomie et du vivre-ensemble.</p>
                
                <p>Entre défis sportifs, créations artistiques et projets citoyens, nous proposons une alternative positive aux écrans. Chaque activité vise à révéler les potentiels et à construire la confiance en soi.</p>
                
                <ul className="feature-list">
                  {jeunesseFeatures.map(item => (
                    <li key={item.id} className="feature-item">
                      <div className="icon-placeholder">
                        <img src={item.icon} alt={`Icône ${item.id}`} width="24" height="24" />
                      </div>
                      <span className="item-text">{item.text}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="btn-learn-more" onClick={goToContact}>
                  Nous Contacter
                </button>
              </div>
             
            </div>
          </div>
          
          {/* Section des services */}
          <div className="services-container">
            {jeunesseServices.map(service => (
              <div className="service-card" key={service.id}>
                <div className="service-icon">
                  <img src={service.icon} alt={service.title} />
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <div className="card-divider"></div>
              </div>
            ))}
          </div>

          {/* Section informations pratiques */}
          <div className="info-pratiques">
            <div className="info-block">
              <h3 className="info-title">Informations Pratiques</h3>
              <div className="info-grid">
                <div className="info-item">
                  <h4>Public concerné</h4>
                  <p>Jeunes de 11 à 17 ans résidant à Torcy</p>
                </div>
                <div className="info-item">
                  <h4>Modalités d'accueil</h4>
                  <p>Accueil libre et gratuit - Inscription simple</p>
                </div>
                <div className="info-item">
                  <h4>Horaires d'ouverture</h4>
                  <p>Lundi au Vendredi : 14h - 19h<br />Fermé le Jeudi (hors vacances)</p>
                </div>
                <div className="info-item">
                  <h4>Nos structures</h4>
                  <p>2 structures jeunesse réparties sur Torcy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer commun */}
      <Footer />
    </div>
  );
};

export default Jeunesse;