import React, { useState, useEffect } from 'react';
import './Header.css';
import logoOmac from '../assets/omac-logo.png';
import admin from '../assets/admin.png';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
     
  // Fonction qui détecte le défilement
  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };
     
  // Fonction pour gérer le clic sur l'icône admin
  const handleAdminClick = () => {
    // Redirection vers la page d'administration
    window.location.href = '/admin';
  };
     
  // Ajouter un écouteur d'événement pour le défilement lors du montage du composant
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
         
    // Nettoyer l'écouteur d'événement lors du démontage du composant
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
     
  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      {/* Ligne blanche qui apparaît lors du défilement */}
      <div className="header-bottom-line"></div>
             
      <div className="logo">
        <img src={logoOmac} alt="Logo OMAC" />
      </div>
      <nav className="nav">
        <a href="#" className="nav-link">Accueil</a>
        <a href="#" className="nav-link">L'OMAC</a>
        <a href="#" className="nav-link">Nos Actions</a>
        <a href="#" className="nav-link">Actualités</a>
        <a href="#" className="nav-link">Contact</a>
      </nav>
      <div className="admin">
        <img 
          src={admin} 
          alt="Administration" 
          className="admin-icon"
          onClick={handleAdminClick}
        />
      </div>
    </header>
  );
};

export default Header;