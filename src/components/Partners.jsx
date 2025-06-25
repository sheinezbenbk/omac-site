import React, { useRef } from 'react';
import './Partners.css';

import torcyLogo from '../assets/torcy-logo.png';
import caf from '../assets/caf.png';
import republic from '../assets/republic-logo.png';
import anct from '../assets/anct.png';
import centre from '../assets/centre.png';
import vallee from '../assets/vallee.png';
import fete from '../assets/fete.png';
import ferme from '../assets/ferme.png'; 

const Partners = () => {
  const sliderRef = useRef(null);
  
  const logos = [
    { id: 1, src:torcyLogo, alt: 'Torcy' },
    { id: 3, src:republic, alt: 'République Française' },
    { id: 2, src: caf, alt: 'caf' },
    { id: 4, src:anct, alt: 'ANCT' },
    { id: 5, src:vallee,  alt: 'Vallée de la Marne' },
    { id: 6, src:centre, alt:'centre'  },
    { id: 7, src: fete, alt: 'Fête ' },
    {id:8, src:ferme, alt:'ferme'}
  ];
  
  
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