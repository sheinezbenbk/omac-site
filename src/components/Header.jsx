import React from 'react';
import './Header.css';
import logoOmac from '../assets/omac-logo.png';
import admin from '../assets/admin.png'; 

const Header = () => {
  return (
    <header className="header">
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
        <img src={admin} alt="admin" />
      </div>
    </header>
  );
};

export default Header;