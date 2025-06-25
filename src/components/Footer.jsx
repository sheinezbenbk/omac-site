import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

// Import des logos et icônes
import logoOmac from '../assets/omac-logo.png';
import fb from '../assets/facebook.png'; 
import insta from '../assets/instagram.png'; 
import snap from '../assets/snapchat.png'; 

// Import des logos partenaires 
import torcyLogo from '../assets/torcy-logo.png';
import caf from '../assets/caf.png';
import republic from '../assets/republic-logo.png';

const Footer = () => {
  const navigate = useNavigate();

  // Fonction utilitaire pour la navigation avec scroll
  const navigateTo = (path) => {
    navigate(path);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  // Fonction pour naviguer vers les sections de la page principale
  const scrollToSection = (sectionId) => {
    // Si on n'est pas sur la page principale, y aller d'abord
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else {
      // Si on est déjà sur la page principale, juste scroller
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Liens de navigation 
  const navigationLinks = [
    { name: 'Accueil', onClick: () => navigateTo('/') },
    { name: 'À Propos', onClick: () => scrollToSection('about-section') },
    { name: 'Actualités', onClick: () => scrollToSection('events-section') },
    { name: 'Contact', onClick: () => scrollToSection('contact-section') }
  ];

  const services = [
    { name: 'Jeunesse', onClick: () => navigateTo('/jeunesse') },
    { name: 'Familles et Adultes', onClick: () => navigateTo('/famille') },
    { name: 'Aide à la scolarité', onClick: () => navigateTo('/scolarite') },
  ];

  // Horaires d'ouverture
  const openingHours = [
    { day: 'Lundi', time: '10h30 - 12h & 14h - 19h' },
    { day: 'Mardi', time: '10h30 - 12h & 14h - 19h' },
    { day: 'Mercredi', time: '10h30 - 12h & 14h - 19h' },
    { day: 'Jeudi', time: 'Fermé', closed: true },
    { day: 'Vendredi', time: '10h30 - 12h & 14h - 19h' },
    { day: 'Samedi', time: 'Fermé', closed: true },
    { day: 'Dimanche', time: 'Fermé', closed: true }
  ];

  // Partenaires principaux pour le footer
  const mainPartners = [
    { src: torcyLogo, alt: 'Ville de Torcy' },
    { src: republic, alt: 'République Française' },
    { src: caf, alt: 'CAF' }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Section principale */}
        <div className="footer-main">
          {/* À propos de l'OMAC */}
          <div className="footer-about">
            <div className="footer-logo-section">
              <img src={logoOmac} alt="Logo OMAC" className="footer-logo" />
              <div className="footer-brand">
                <h3 className="footer-brand-name">OMAC Torcy</h3>
                <p className="footer-brand-subtitle">Office Municipal d'Animation de la Cité</p>
              </div>
            </div>
            
            <p className="footer-description">
              L'OMAC de Torcy œuvre depuis des années pour l'animation de la vie de quartier, 
              l'accompagnement des familles et le développement d'activités culturelles et éducatives 
              dans un esprit d'éducation populaire et de laïcité.
            </p>
            
            {/* Réseaux sociaux */}
            <div className="social-links">
              <a 
                href="https://www.facebook.com/people/Omac-Torcy/pfbid02stywG3nQuXqntZJdg7br91VUrmit1GvsuoGRTTcfeEbLSZzR5Mn54xLadD6cnPW3l/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link facebook" 
                aria-label="Facebook"
              >
                <img src={fb} alt="Facebook" style={{width: '24px', height: '24px'}} />
              </a>
              <a 
                href="https://www.instagram.com/omac_torcy/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link instagram" 
                aria-label="Instagram"
              >
                <img src={insta} alt="Instagram" style={{width: '24px', height: '24px'}} />
              </a>
              <a 
                href="https://www.snapchat.com/add/omac77200" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link snapchat" 
                aria-label="Snapchat"
              >
                <img src={snap} alt="Snapchat" style={{width: '24px', height: '24px'}} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="footer-section">
            <h4 className="footer-title">Navigation</h4>
            <ul className="footer-links">
              {navigationLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="footer-link" 
                    onClick={(e) => {
                      e.preventDefault();
                      link.onClick();
                    }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Nos Services */}
          <div className="footer-section">
            <h4 className="footer-title">Nos Services</h4>
            <ul className="footer-links">
              {services.map((service, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="footer-link" 
                    onClick={(e) => {
                      e.preventDefault();
                      service.onClick();
                    }}
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4 className="footer-title">Contact</h4>
            
            {/* Informations de contact */}
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-text">
                  <strong>Adresse principale</strong>
                  10 Rue de la Fontaine<br />
                  77200 Torcy
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-text">
                  <strong>Téléphone</strong>
                  <a href="tel:0160313101" style={{color: '#3498db', textDecoration: 'none'}}>
                    01 60 31 31 01
                  </a>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-text">
                  <strong>Email</strong>
                  <a href="mailto:omac.torcy77@gmail.com" style={{color: '#3498db', textDecoration: 'none'}}>
                    omac.torcy77@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section horaires */}
        <div className="footer-schedule-section">
          <h4 className="footer-schedule-title">Nos Horaires d'Ouverture</h4>
          <ul className="hours-list">
            {openingHours.map((hour, index) => (
              <li key={index} className="hours-item">
                <span className="hours-day">{hour.day}</span>
                <span className={`hours-time ${hour.closed ? 'hours-closed' : ''}`}>
                  {hour.time}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bas du footer */}
        <div className="footer-bottom">
          <div>
            <p className="footer-copyright">
              © 2025 OMAC Torcy - Office Municipal d'Animation de la Cité | Tous droits réservés | SBK
            </p>
            <a 
              href="https://omactorcy.fr" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-website"
            >
              🌐 omactorcy.fr
            </a>
          </div>
          
          {/* Partenaires principaux */}
          <div className="partners-footer">
            <span style={{ color: '#95a5a6', fontSize: '14px', marginRight: '10px' }}>
              Avec le soutien de :
            </span>
            {mainPartners.map((partner, index) => (
              <img 
                key={index}
                src={partner.src} 
                alt={partner.alt} 
                className="partner-logo-footer" 
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;