// Header.jsx - Menu Burger PLAT (Option A)
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ApiService from '../services/api';
import './Header.css';
import logoOmac from '../assets/omac-logo.png';
import admin from '../assets/admin.png';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [showOmacDropdown, setShowOmacDropdown] = useState(false);
  const [isAdminConnected, setIsAdminConnected] = useState(false);
  
  // État pour le menu burger
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Vérifier le statut admin au chargement
  useEffect(() => {
    checkAdminStatus();
  }, [location.pathname]);

  const checkAdminStatus = () => {
    const connected = ApiService.isAuthenticated();
    setIsAdminConnected(connected);
    
    if (connected) {
      const adminData = ApiService.getAdmin();
      console.log('👤 Admin connecté dans Header:', adminData?.username);
    }
  };
     
  // Détecte le défilement
  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  // Fermer le menu mobile au scroll
  useEffect(() => {
    const handleScrollClose = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScrollClose);
    return () => window.removeEventListener('scroll', handleScrollClose);
  }, [isMobileMenuOpen]);

  // Fermer le menu mobile au redimensionnement
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);
     
  // Clic sur l'icône admin
  const handleAdminClick = () => {
    setIsMobileMenuOpen(false);
    
    if (isAdminConnected) {
      console.log('🎯 Admin connecté, redirection vers dashboard');
      navigate('/admin/dashboard');
    } else {
      console.log('🔓 Admin non connecté, redirection vers login');
      navigate('/admin');
    }
  };

  // Clic sur le logo
  const handleLogoClick = () => {
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  // Toggle menu burger
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Fermer les dropdowns desktop
    setShowActionsDropdown(false);
    setShowOmacDropdown(false);
  };

  // Fonction pour scroller vers une section
  const scrollToSection = (sectionId) => {
    // Fermer le menu mobile
    setIsMobileMenuOpen(false);
    setShowActionsDropdown(false);
    setShowOmacDropdown(false);
    
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
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
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  // Gestion du dropdown "Nos Actions" (DESKTOP SEULEMENT)
  const handleActionsClick = (e) => {
    e.preventDefault();
    setShowActionsDropdown(!showActionsDropdown);
    setShowOmacDropdown(false);
  };

  // Gestion du dropdown "L'OMAC" (DESKTOP SEULEMENT)
  const handleOmacClick = (e) => {
    e.preventDefault();
    setShowOmacDropdown(!showOmacDropdown);
    setShowActionsDropdown(false);
  };

  // Navigation vers Guide OMAC
  const handleGuideClick = () => {
    navigate('/guide');
    setShowOmacDropdown(false);
    setIsMobileMenuOpen(false);
  };

  // Navigation vers Projet Social
  const handleProjetSocialClick = () => {
    navigate('/projet-social');
    setShowOmacDropdown(false);
    setIsMobileMenuOpen(false);
  };

  // Navigation vers Jeunesse
  const handleJeunesseClick = () => {
    navigate('/jeunesse');
    setShowActionsDropdown(false);
    setIsMobileMenuOpen(false);
  };

  // Navigation vers Scolarité
  const handleScolariteClick = () => {
    navigate('/scolarite');
    setShowActionsDropdown(false);
    setIsMobileMenuOpen(false);
  };

  // Navigation vers Famille
  const handleFamilleClick = () => {
    navigate('/famille');
    setShowActionsDropdown(false);
    setIsMobileMenuOpen(false);
  };

  // Fermer les dropdowns quand on clique ailleurs (DESKTOP SEULEMENT)
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
             
      {/* Logo */}
      <div className="logo" onClick={handleLogoClick} style={{cursor: 'pointer'}}>
        <img src={logoOmac} alt="Logo OMAC" />
      </div>
      
      {/* Menu Burger */}
      <button 
        className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={toggleMobileMenu}
        aria-label="Menu de navigation"
      >
        <span className={`burger-line ${isMobileMenuOpen ? 'rotate1' : ''}`}></span>
        <span className={`burger-line ${isMobileMenuOpen ? 'hide' : ''}`}></span>
        <span className={`burger-line ${isMobileMenuOpen ? 'rotate2' : ''}`}></span>
      </button>
      
      {/* Navigation Desktop (cachée sur mobile) */}
      <nav className="nav desktop-nav">
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
        
        {/* Dropdown L'OMAC */}
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

      {/* 🆕 NOUVEAU : Menu Mobile PLAT (tous les liens visibles) */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
        <nav className="mobile-nav">
          
          {/* 🏠 Accueil */}
          <a 
            href="#" 
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('hero');
            }}
          >
            🏠 Accueil
          </a>
          
          {/* 📖 Guide OMAC */}
          <a 
            href="#" 
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleGuideClick();
            }}
          >
            📖 Guide OMAC
          </a>
          
          {/* 📋 Projet Social */}
          <a 
            href="#" 
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleProjetSocialClick();
            }}
          >
            📋 Projet Social
          </a>
          
          {/* 🏢 À Propos */}
          <a 
            href="#" 
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('about-section');
            }}
          >
            🏢 À Propos
          </a>
          
          {/* 🏀 Jeunesse */}
          <a 
            href="#" 
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleJeunesseClick();
            }}
          >
            🏀 Jeunesse
          </a>
          
          {/* 👨‍👩‍👧‍👦 Familles et Adultes */}
          <a 
            href="#" 
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleFamilleClick();
            }}
          >
            👨‍👩‍👧‍👦 Familles et Adultes
          </a>
          
          {/* 📚 Aide à la scolarité */}
          <a 
            href="#" 
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleScolariteClick();
            }}
          >
            📚 Aide à la scolarité
          </a>
          
          {/* 📅 Actualités */}
          <a 
            href="#" 
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('events-section');
            }}
          >
            📅 Actualités
          </a>
          
          {/* 📧 Contact */}
          <a 
            href="#" 
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('contact-section');
            }}
          >
            📧 Contact
          </a>

          {/* 🔐 Administration */}
          <div className="mobile-admin-section">
            <button 
              className="mobile-admin-btn"
              onClick={handleAdminClick}
            >
              <img 
                src={admin} 
                alt="Administration" 
                className="mobile-admin-icon"
              />
              <span>🔐 Administration</span>
              {isAdminConnected && <span className="admin-connected-badge">●</span>}
            </button>
            
            {isAdminConnected && (
              <p className="mobile-admin-status">
                👤 {ApiService.getAdmin()?.username} connecté
              </p>
            )}
          </div>
        </nav>
      </div>
      
      {/* Admin Desktop (caché sur mobile) */}
      <div className="admin desktop-only">
        <div 
          className={`admin-container ${isAdminConnected ? 'connected' : ''}`}
          onClick={handleAdminClick}
          title={isAdminConnected ? 'Aller au dashboard admin' : 'Se connecter en tant qu\'admin'}
        >
          <img 
            src={admin} 
            alt="Administration" 
            className="admin-icon"
          />
          {isAdminConnected && (
            <div className="admin-status-indicator">●</div>
          )}
        </div>
        
        {isAdminConnected && (
          <div className="admin-tooltip">
            {ApiService.getAdmin()?.username} connecté
          </div>
        )}
      </div>
      
      <style jsx>{`
        .admin-container {
          position: relative;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .admin-container:hover {
          transform: scale(1.1);
        }
        
        .admin-status-indicator {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          background: #8DC540;
          border-radius: 50%;
          border: 2px solid white;
          animation: pulse 2s infinite;
        }
        
        .admin-tooltip {
          position: absolute;
          top: 100%;
          right: 0;
          background: rgba(134, 165, 90, 0.8);
          color: white;
          padding: 5px 8px;
          font-size: 12px;
          border-radius: 4px;
          white-space: nowrap;
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.2s ease;
          pointer-events: none;
          z-index: 1000;
        }
        
        .admin-container:hover .admin-tooltip {
          opacity: 1;
          transform: translateY(0);
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </header>
  );
};

export default Header;