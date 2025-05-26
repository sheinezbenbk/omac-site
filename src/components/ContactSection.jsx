import React from 'react';
import './ContactSection.css';

import LocationIcon from '../assets/location.png';
import PhoneIcon from '../assets/phone.png';
import MailIcon from '../assets/mail.png';
import ClockIcon from '../assets/clock.png';

const ContactSection = () => {
  // Informations de contact
  const contactInfo = [
    {
      id: 1,
      type: 'location',
      title: 'Nous localiser',
      detail: '10 Rue de LA Fontaine, 77200 Torcy',
      icon: LocationIcon
    },
    {
      id: 2,
      type: 'phone',
      title: 'Numéro',
      detail: '01 60 31 31 01',
      icon: PhoneIcon
    },
    {
      id: 3,
      type: 'email',
      title: 'Adresse mail',
      detail: 'omac.torcy77@gmail.com',
      icon: MailIcon
    },
    {
      id: 4,
      type: 'hours',
      title: 'Horaires',
      detail: 'Lundi - Vendredi (Hors les jeudis) : 10h30 - 12h & 14h - 19h',
      icon: ClockIcon
    }
  ];

  // localitation
  const locations = [
    {
      name: "Leo Lagrange - OMAC",
      address: "10 Rue de la Fontaine, 77200 Torcy"
    },
    {
      name: "Arche Guédon",
      address: "Place des Rencontres, 77200 Torcy"
    },
    {
      name: "Beauregard",
      address: "Promenade du Galion, 77200 Torcy"
    },
    {
      name: "OMAC/Ferme du Couvent",
      address: "22 Rue du Couvent, 77200 Torcy"
    }
  ];

  return (
    <section className="contact-section">
      <div className="container">
        <div className="contact-header">
          <h2 className="section-title">Contactez-Nous</h2>
          <p className="contact-subtitle">N'hésitez pas à nous joindre pour toute information.</p>
          <div className="teal-underline"></div>
        </div>
        
        <div className="contact-content-no-map">
          <div className="contact-card">
            {contactInfo.map(info => (
              <div key={info.id} className="contact-item">
                <div className="contact-icon">
                  <img src={info.icon} alt={info.title} className="icon-image" />
                </div>
                <div className="contact-details">
                  <h3 className="contact-item-title">{info.title}</h3>
                  <p className="contact-item-detail">{info.detail}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="locations-info">
            <h3 className="locations-title">Nos emplacements</h3>
            <div className="locations-list">
              {locations.map((location, index) => (
                <div key={index} className="location-item">
                  <strong>{location.name}</strong>
                  <span>{location.address}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;  