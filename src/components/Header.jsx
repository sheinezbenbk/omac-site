import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import logoOmac from '../assets/omac-logo.png';
import admin from '../assets/admin.png';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
     
  // Détecte le défilement
  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };
     
  // Clic sur l'icône admin
  const handleAdminClick = () => {
    navigate('/admin');
  };

  // Clic sur le logo pour retourner à l'accueil
  const handleLogoClick = () => {
    navigate('/');
  };

  // Fonction pour scroller vers une section
  const scrollToSection = (sectionId) => {
    // Si on n'est pas sur la page d'accueil, naviguer d'abord
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
      // Attendre que la navigation soit terminée puis scroller
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    } else {
      // Si on est déjà sur la page d'accueil, scroller directement
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  // Gestion du dropdown "Nos Actions"
  const handleActionsClick = (e) => {
    e.preventDefault();
    setShowActionsDropdown(!showActionsDropdown);
  };

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.nav-actions-container')) {
        setShowActionsDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
     
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
     
  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-bottom-line"></div>
             
      <div className="logo" onClick={handleLogoClick} style={{cursor: 'pointer'}}>
        <img src={logoOmac} alt="Logo OMAC" />
      </div>
      
      <nav className="nav">
        <a 
          href="#" 
          className="nav-link"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('hero');
          }}
        >
          Accueil
        </a>
        
        <a 
          href="#" 
          className="nav-link"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('about-section');
          }}
        >
          L'OMAC
        </a>
        
        {/* Dropdown Nos Actions */}
        <div className="nav-actions-container">
          <a 
            href="#" 
            className={`nav-link nav-actions ${showActionsDropdown ? 'active' : ''}`}
            onClick={handleActionsClick}
          >
            Nos Actions
            <span className={`dropdown-arrow ${showActionsDropdown ? 'rotated' : ''}`}>▼</span>
          </a>
          
          {showActionsDropdown && (
            <div className="actions-dropdown">
              <a 
                href="#" 
                className="dropdown-item"
                onClick={(e) => {
                  e.preventDefault();
                  setShowActionsDropdown(false);
                  // Ici tu pourras ajouter la navigation vers la page Jeunesse
                  console.log('Navigation vers Jeunesse');
                }}
              >
                <span className="dropdown-icon">🏀</span>
                Jeunesse
              </a>
              
              <a 
                href="#" 
                className="dropdown-item"
                onClick={(e) => {
                  e.preventDefault();
                  setShowActionsDropdown(false);
                  // Ici tu pourras ajouter la navigation vers la page Familles
                  console.log('Navigation vers Familles et Adultes');
                }}
              >
                <span className="dropdown-icon">👨‍👩‍👧‍👦</span>
                Familles et Adultes
              </a>
              
              <a 
                href="#" 
                className="dropdown-item"
                onClick={(e) => {
                  e.preventDefault();
                  setShowActionsDropdown(false);
                  // Ici tu pourras ajouter la navigation vers la page Scolarité
                  console.log('Navigation vers Aide à la scolarité');
                }}
              >
                <span className="dropdown-icon">📚</span>
                Aide à la scolarité
              </a>
            </div>
          )}
        </div>
        
        <a 
          href="#" 
          className="nav-link"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('events-section');
          }}
        >
          Actualités
        </a>
        
        <a 
          href="#" 
          className="nav-link"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('contact-section');
          }}
        >
          Contact
        </a>
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