import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Famille.css';

// Import des composants communs
import Header from './Header';
import Footer from './Footer';

// Import des icônes
import icon1 from '../assets/check.png';
import icon2 from '../assets/check.png';
import icon3 from '../assets/check.png';
import icon4 from '../assets/check.png';

// Import des icônes pour les services
import parentaliteIcon from '../assets/famille.png';
import atelierIcon from '../assets/ecole.png';
import echangeIcon from '../assets/check.png';

const Famille = () => {
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

  // Points forts du secteur famille
  const familleFeatures = [
    { id: 1, text: 'Soutien aux familles et accompagnement social', icon: icon1 },
    { id: 2, text: 'Ateliers parentalité et communication bienveillante', icon: icon2 },
    { id: 3, text: 'Activités intergénérationnelles et familiales', icon: icon3 },
    { id: 4, text: 'Espace d\'écoute et d\'entraide pour tous', icon: icon4 }
  ];

  // Services proposés par le secteur famille
  const familleServices = [
    {
      id: 1,
      icon: parentaliteIcon,
      title: "Café des Parents",
      description: "Rencontres conviviales autour de thématiques éducatives. Échanges d'expériences entre parents et conseils de professionnels dans une ambiance détendue.",
      link: "#parentalite"
    },
    {
      id: 2,
      icon: atelierIcon,
      title: "Moments en Famille",
      description: "Ateliers créatifs parents-enfants pour renforcer les liens familiaux. Cuisine du monde, bricolage récup', jardinage et activités manuelles partagées.",
      link: "#ateliers"
    },
    {
      id: 3,
      icon: echangeIcon,
      title: "Écoute et Médiation",
      description: "Accompagnement dans les moments difficiles. Soutien aux familles monoparentales, aide aux démarches administratives et médiation en cas de conflits.",
      link: "#accompagnement"
    }
  ];

  return (
    <div className="famille-page">
      {/* Header commun */}
      <Header />

      {/* En-tête de la page famille */}
      <section className="famille-header">
        <div className="famille-header-container">
          <h1 className="famille-title">Familles et Adultes</h1>
          <p className="famille-subtitle">
            Un lieu de rencontre et d'entraide où chaque famille peut trouver
            écoute, soutien et moments de partage dans un esprit de convivialité.
          </p>
          <div className="famille-navigation">
            <button className="nav-btn" onClick={goToHome}>
              Retour à l'accueil
            </button>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="famille-content">
        <div className="container">
          
          <div className="about-columns">
            <div className="image-column">
           
              <div className="image-container">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-vh4FU3rHri3SEY8QH0suUmHrun79_MiGiQ&s" alt="Familles en activité à l'OMAC" />
              </div>
            </div>
            
            <div className="text-column">
              <div className="text-content">
                <h3 className="card-title">Créer du lien et briser l'isolement</h3>
                
                <p>Le secteur famille crée des espaces de rencontre et d'échange pour tous les habitants de Torcy. Nous organisons des cafés parents, des ateliers intergénérationnels et des sorties familiales dans une ambiance chaleureuse.</p>
                
                <p>Notre approche privilégie l'écoute active et la valorisation des compétences de chacun. Nous accompagnons les parents dans leur quotidien et favorisons la création de réseaux de solidarité entre voisins.</p>
                
                <ul className="feature-list">
                  {familleFeatures.map(item => (
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
                <button className="btn-learn-more" onClick={goToHome}>
                  Retour Accueil
                </button>
              </div>
             
            </div>
          </div>
          
          {/* Section des services */}
          <div className="services-container">
            {familleServices.map(service => (
              <div className="service-card" key={service.id}>
                <div className="service-icon">
                  <img src={service.icon} alt={service.title} />
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <div className="card-divider"></div>
                <a href={service.link} className="service-link">
                  En Savoir Plus →
                </a>
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
                  <p>Toutes les familles et adultes de Torcy</p>
                </div>
                <div className="info-item">
                  <h4>Modalités d'accueil</h4>
                  <p>Accueil libre et gratuit - Sur inscription pour les ateliers</p>
                </div>
                <div className="info-item">
                  <h4>Horaires</h4>
                  <p>Lundi au Vendredi : 10h30 - 12h & 14h - 19h<br />Fermé le Jeudi (hors vacances)</p>
                </div>
                <div className="info-item">
                  <h4>Approche</h4>
                  <p>Bienveillance, écoute et respect des différences</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section activités spéciales */}
          <div className="activites-speciales">
            <div className="activites-block">
              <h3 className="activites-title">Nos Activités Spéciales</h3>
              <div className="activites-grid">
                <div className="activite-item">
                  <h4>Café des Parents</h4>
                  <p>Rencontres mensuelles pour échanger en toute convivialité autour d'un café</p>
                </div>
                <div className="activite-item">
                  <h4>Sorties Familiales</h4>
                  <p>Découvertes culturelles et sorties nature pour toute la famille</p>
                </div>
                <div className="activite-item">
                  <h4>Groupes de Parole</h4>
                  <p>Espaces d'expression et d'écoute animés par des professionnels</p>
                </div>
                <div className="activite-item">
                  <h4>Fêtes et Événements</h4>
                  <p>Organisation de moments festifs et conviviaux tout au long de l'année</p>
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

export default Famille;