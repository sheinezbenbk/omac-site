import React from 'react';
import './AboutSection.css';
import icon1 from '../assets/check.png';
import icon2 from '../assets/check.png';
import icon3 from '../assets/check.png';

// importation des icônes
import jeunesseIcon from '../assets/basket.png';
import famillesIcon from '../assets/famille.png';
import scolariteIcon from '../assets/ecole.png';

const AboutSection = () => {
  
  const items = [
    { id: 1, text: 'Lorem ipsum dolor sit amet', icon: icon1 },
    { id: 2, text: 'Lorem ipsum dolor sit amet', icon: icon2 },
    { id: 3, text: 'Lorem ipsum dolor sit amet', icon: icon3 }
  ];

  // Données des services
  const services = [
    {
      id: 1,
      icon: jeunesseIcon,
      title: "Jeunesse",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec porta scelerisque interdum.",
      link: "#" //renvoie à la page Jeunesse
    },
    {
      id: 2,
      icon: famillesIcon,
      title: "Familles et Adultes",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec porta scelerisque interdum.",
      link: "#" //renvoie à la page F&A
    },
    {
      id: 3,
      icon: scolariteIcon,
      title: "Aide à la scolarité",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec porta scelerisque interdum.",
      link: "#" //renvoie à la page Scolarité
    }
  ];

  return (
    <section className="about-section">
      <div className="container">
        <div className="about-header">
          <h2 className="section-title">À Propos</h2>
          <div className="subtitle-container">
            <p className="about-subtitle">Découvrez notre Histoire et notre Missions</p>
            <div className="green-underline"></div>
          </div>
        </div>
        
        <div className="about-columns">
          <div className="image-column">
            <div className="yellow-square"></div>
            <div className="image-container">
              <img src="/placeholder-image.jpg" alt="À propos de l'OMAC" />
            </div>
          </div>
          
         
          <div className="text-column">
            <div className="text-content">
              <h3 className="card-title">Lorem ipsum dolor</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing a sollicitudin est. Donec porta scelerisque interdum. Praesent vitae tellus elementum dolor viverra blandit. Vestibulum fermentum velit.</p>
              <p>Vivamus in dolor ut sapien gravida mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mollis et massa.</p>
              
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
              
              <button className="btn-learn-more">En Savoir Plus</button>
            </div>
            <div className="blue-square"></div>
          </div>
        </div>
        
        
        <div className="services-container">
          {services.map(service => (
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
      </div>
    </section>
  );
};

export default AboutSection;