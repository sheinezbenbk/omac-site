import React, { useState, useEffect } from 'react';
import './Header.css';
import logoOmac from '../assets/omac-logo.png';
import admin from '../assets/admin.png';
import { Link } from 'react-router-dom';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
     
  // détecte le défilement
  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };
     
  // clic sur l'icône admin
  const handleAdminClick = () => {
    window.location.href = '/admin';
  };
     
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
     
  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
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