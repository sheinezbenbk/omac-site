import React from 'react';
import './Footer.css';

// Import des logos et icônes
import logoOmac from '../assets/omac-logo.png';
import fb from '../assets/facebook.png'; 
import insta from '../assets/instagram.png'; 
import snap from '../assets/snapchat.png'; 

// Import des logos partenaires (réutilisation depuis Partners)
import torcyLogo from '../assets/torcy-logo.png';
import caf from '../assets/caf.png';
import republic from '../assets/republic-logo.png';

const Footer = () => {
  // Liens de navigation
  const navigationLinks = [
    { name: 'Accueil', href: '#' },
    { name: 'À Propos', href: '#' },
    { name: 'Nos Actions', href: '#' },
    { name: 'Activités', href: '#' },
    { name: 'Contact', href: '#' }
  ];

  // Services proposés
  const services = [
    { name: 'Jeunesse', href: '#' },
    { name: 'Familles et Adultes', href: '#' },
    { name: 'Aide à la scolarité', href: '#' },
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
              <a href="#" className="social-link facebook" aria-label="Facebook">
                <img src={fb} alt="Facebook" style={{width: '24px', height: '24px'}} />
              </a>
              <a href="#" className="social-link instagram" aria-label="Instagram">
                <img src={insta} alt="Instagram" style={{width: '24px', height: '24px'}} />
              </a>
              <a href="#" className="social-link snapchat" aria-label="Snapchat">
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
                  <a href={link.href} className="footer-link">{link.name}</a>
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
                  <a href={service.href} className="footer-link">{service.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - SANS les horaires maintenant */}
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
                  01 60 31 31 01
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-text">
                  <strong>Email</strong>
                  omac.torcy77@gmail.com
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ NOUVELLE SECTION HORAIRES - Plus large et séparée */}
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