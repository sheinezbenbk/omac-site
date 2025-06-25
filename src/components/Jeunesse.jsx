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

  return (
    <div className="jeunesse-page">
      <Header />

      {/* En-tête de la page jeunesse */}
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
                <p>L'espace jeunesse de l'OMAC au Beauregard accueillent les 11-17 ans dans un cadre sécurisant et stimulant. Nos équipes accompagnent chaque jeune dans sa découverte de l'autonomie et du vivre-ensemble.</p>
                <p>Entre défis sportifs, créations artistiques et projets citoyens, nous proposons une alternative positive aux écrans. Chaque activité vise à révéler les potentiels et à construire la confiance en soi.</p>

              </div>

            </div>
          </div>


          {/* Section informations pratiques */}
          <div className="info-pratiques">
            <div className="info-block">
              <h3 className="info-title1">Informations Pratiques</h3>
              <div className="info-grid">
                <div className="info-item1">
                  <h4>Public concerné</h4>
                  <p>Jeunes de 11 à 17 ans résidant à Torcy</p>
                </div>
                <div className="info-item1">
                  <h4>Modalités d'accueil</h4>
                  <p>Accueil libre et gratuit</p>
                </div>
                <div className="info-item1">
                  <h4>Horaires d'ouverture</h4>
                  <p>Lundi et Vendredi : 14h - 19h<br />Mercredi : 14h - 19h <br/> <br /> <strong>Vacances scolaires</strong> : Du Lundi au Vendredi de 10h30 à 12h et de 14h à 19h</p>
                </div>
                <div className="info-item1">
                  <h4>Notre structure</h4>
                  <p>Espace jeunesse Beauregard <br /> Promenade du Galion, 77200 Torcy</p>
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

export default Jeunesse;