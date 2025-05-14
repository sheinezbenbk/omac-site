import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src="/logo-omac.png" alt="Logo OMAC" />
      </div>
      <nav className="nav">
        <a href="#" className="nav-link">Accueil</a>
        <a href="#" className="nav-link">L'OMAC</a>
        <a href="#" className="nav-link">Nos Actions</a>
        <a href="#" className="nav-link">Actualités</a>
        <a href="#" className="nav-link">Contact</a>
      </nav>
      <div className="profile-icon">
        <span className="profile-dot"></span>
      </div>
    </header>
  );
};

export default Header;