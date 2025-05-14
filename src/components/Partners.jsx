import React, { useEffect, useRef } from 'react';
import './Partners.css';

// Logos des partenaires
import torcyLogo from '../assets/torcy-logo.png';
import republicLogo from '../assets/republic-logo.png';
import anctLogo from '../assets/anct-logo.png';
import valleeLogo from '../assets/vallee-logo.png';
import omacLogo from '../assets/omac-logo.png';
import feduBoisLogo from '../assets/fedu-bois-logo.png';

const Partners = () => {
  const sliderRef = useRef(null);
  
  // Liste des logos (à personnaliser avec vos vrais logos)
  const logos = [
    { id: 1, src: torcyLogo, alt: 'Torcy' },
    { id: 2, src: republicLogo, alt: 'République Française' },
    { id: 3, src: anctLogo, alt: 'ANCT' },
    { id: 4, src: valleeLogo, alt: 'Vallée de la Marne' },
    { id: 5, src: omacLogo, alt: 'OMAC' },
    { id: 6, src: feduBoisLogo, alt: 'Fête du Bois' }
  ];
  
  // Effet pour l'animation
  useEffect(() => {
    if (!sliderRef.current) return;
    
    // Gérer la pause au survol
    const handleMouseEnter = () => {
      sliderRef.current.style.animationPlayState = 'paused';
    };
    
    const handleMouseLeave = () => {
      sliderRef.current.style.animationPlayState = 'running';
    };
    
    sliderRef.current.addEventListener('mouseenter', handleMouseEnter);
    sliderRef.current.addEventListener('mouseleave', handleMouseLeave);
    
    // Nettoyage
    return () => {
      if (!sliderRef.current) return;
      sliderRef.current.removeEventListener('mouseenter', handleMouseEnter);
      sliderRef.current.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  return (
    <section className="partners">
      <div className="partners-slider" ref={sliderRef}>
        {/* Première série de logos */}
        {logos.map(logo => (
          <img 
            key={logo.id} 
            src={logo.src} 
            alt={logo.alt} 
            className="partner-logo" 
          />
        ))}
        
        {/* Deuxième série pour effet infini */}
        {logos.map(logo => (
          <img 
            key={`duplicate-${logo.id}`} 
            src={logo.src} 
            alt={logo.alt} 
            className="partner-logo" 
          />
        ))}
      </div>
    </section>
  );
};

export default Partners;