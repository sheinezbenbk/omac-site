import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import logoOmac from '../assets/omac-logo.png';
import admin from '../assets/admin.png';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [showOmacDropdown, setShowOmacDropdown] = useState(false); // ✅ Nouveau état pour dropdown OMAC
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
    setShowOmacDropdown(false); // Fermer l'autre dropdown
  };

  // ✅ Gestion du dropdown "L'OMAC"
  const handleOmacClick = (e) => {
    e.preventDefault();
    setShowOmacDropdown(!showOmacDropdown);
    setShowActionsDropdown(false); // Fermer l'autre dropdown
  };

  // ✅ Navigation vers Guide OMAC
  const handleGuideClick = () => {
    navigate('/guide');
    setShowOmacDropdown(false);
  };

  // ✅ Navigation vers Projet Social
  const handleProjetSocialClick = () => {
    navigate('/projet-social');
    setShowOmacDropdown(false);
  };

  // ✅ Navigation vers Jeunesse
  const handleJeunesseClick = () => {
    navigate('/jeunesse');
    setShowActionsDropdown(false);
  };

  // ✅ Navigation vers Scolarité
  const handleScolariteClick = () => {
    navigate('/scolarite');
    setShowActionsDropdown(false);
  };

  // ✅ Navigation vers Famille
  const handleFamilleClick = () => {
    navigate('/famille');
    setShowActionsDropdown(false);
  };

  // Fermer les dropdowns quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.nav-actions-container') && !event.target.closest('.nav-omac-container')) {
        setShowActionsDropdown(false);
        setShowOmacDropdown(false);
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
        
        {/* ✅ Dropdown L'OMAC */}
        <div className="nav-omac-container">
          <a 
            href="#" 
            className={`nav-link nav-omac ${showOmacDropdown ? 'active' : ''}`}
            onClick={handleOmacClick}
          >
            L'OMAC
            <span className={`dropdown-arrow ${showOmacDropdown ? 'rotated' : ''}`}>▼</span>
          </a>
          
          {showOmacDropdown && (
            <div className="omac-dropdown">
              <a 
                href="#" 
                className="dropdown-item"
                onClick={(e) => {
                  e.preventDefault();
                  handleGuideClick();
                }}
              >
                <span className="dropdown-icon">📖</span>
                Guide OMAC
              </a>
              
              <a 
                href="#" 
                className="dropdown-item"
                onClick={(e) => {
                  e.preventDefault();
                  handleProjetSocialClick();
                }}
              >
                <span className="dropdown-icon">📋</span>
                Projet Social
              </a>
              
              <a 
                href="#" 
                className="dropdown-item"
                onClick={(e) => {
                  e.preventDefault();
                  setShowOmacDropdown(false);
                  scrollToSection('about-section');
                }}
              >
                <span className="dropdown-icon">🏢</span>
                À Propos
              </a>
            </div>
          )}
        </div>
        
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
                  handleJeunesseClick();
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
                  handleFamilleClick();
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
                  handleScolariteClick();
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