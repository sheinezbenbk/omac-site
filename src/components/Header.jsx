"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useNavigate, useLocation } from "react-router-dom"
import logoOmac from "../assets/omac-logo.png"
import admin from "../assets/admin.png"

// Composants d'icônes simples
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
)

const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
)

const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6,9 12,15 18,9"></polyline>
  </svg>
)

const ChevronUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="18,15 12,9 6,15"></polyline>
  </svg>
)

// Composant Dropdown avec portail pour desktop
const DropdownPortal = ({ isOpen, children, triggerRef }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const scrollY = window.scrollY

      // Calcul initial de la position
      let left = rect.left + rect.width / 2 - 110 // Centré (110 = moitié de la largeur du dropdown)

      // Ajustement pour éviter le dépassement à droite
      const windowWidth = window.innerWidth
      if (left + 220 > windowWidth) {
        left = windowWidth - 230 // 10px de marge
      }

      // Ajustement pour éviter le dépassement à gauche
      if (left < 10) {
        left = 10
      }

      setPosition({
        top: rect.bottom + scrollY + 10, // 10px de marge
        left: left,
      })
    }
  }, [isOpen, triggerRef])

  if (!isOpen) return null

  return createPortal(
    <div
      ref={dropdownRef}
      style={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        width: "220px",
        maxWidth: "calc(100vw - 20px)",
        overflow: "hidden",
        zIndex: 999999,
        animation: "dropdownSlide 0.3s ease-out",
      }}
    >
      {/* Flèche du dropdown */}
      <div
        style={{
          position: "absolute",
          top: "-8px",
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderBottom: "8px solid white",
        }}
      />
      {children}
      <style jsx>{`
        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>,
    document.body,
  )
}

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [showActionsDropdown, setShowActionsDropdown] = useState(false)
  const [showOmacDropdown, setShowOmacDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileDrop1Open, setMobileDrop1Open] = useState(false)
  const [mobileDrop2Open, setMobileDrop2Open] = useState(false)

  // Refs pour les éléments de navigation desktop
  const omacRef = useRef(null)
  const actionsRef = useRef(null)

  const navigate = useNavigate()
  const location = useLocation()

  // Styles CSS pour mobile
  const styles = {
    header: {
      padding: "15px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "fixed",
      width: "100vw",
      maxWidth: "100vw",
      top: 0,
      left: 0,
      zIndex: 1000,
      transition: "background-color 0.3s ease, box-shadow 0.3s ease",
      height: "70px",
      backgroundColor: scrolled ? "rgba(187, 224, 182, 0.8)" : "transparent",
      boxShadow: scrolled ? "0 2px 10px rgba(0, 0, 0, 0.1)" : "none",
      backdropFilter: scrolled ? "blur(10px)" : "none",
      boxSizing: "border-box",
      overflowX: "hidden",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      flexShrink: 0,
    },
    logoImg: {
      width: "50px",
      height: "50px",
      maxWidth: "50px",
      maxHeight: "50px",
    },
    nav: {
      display: "none",
      gap: "30px",
      alignItems: "center",
    },
    navLink: {
      color: scrolled ? "#3498db" : "#ffffff",
      fontWeight: 400,
      fontSize: "20px",
      transition: "all 0.3s ease",
      textDecoration: "none",
      cursor: "pointer",
      position: "relative",
      whiteSpace: "nowrap",
    },
    hamburgerMenu: {
      display: "flex",
      background: "none",
      border: "none",
      color: scrolled ? "#3498db" : "#ffffff",
      cursor: "pointer",
      padding: "5px",
      zIndex: 1001,
      flexShrink: 0,
    },
    mobileNavOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1001,
      opacity: mobileMenuOpen ? 1 : 0,
      visibility: mobileMenuOpen ? "visible" : "hidden",
      transition: "opacity 0.3s ease, visibility 0.3s ease",
    },
    mobileNav: {
      position: "fixed",
      top: 0,
      right: mobileMenuOpen ? 0 : "-100%",
      width: "280px",
      maxWidth: "80vw",
      height: "100vh",
      backgroundColor: "white",
      zIndex: 1002,
      boxShadow: "-5px 0 15px rgba(0, 0, 0, 0.1)",
      transition: "right 0.3s ease",
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
      overflowX: "hidden",
    },
    mobileNavHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px",
      borderBottom: "1px solid #f0f0f0",
      flexShrink: 0,
    },
    mobileLogoImg: {
      width: "50px",
      height: "50px",
      cursor: "pointer",
    },
    closeMobileNav: {
      background: "none",
      border: "none",
      color: "#333",
      cursor: "pointer",
      padding: "5px",
      flexShrink: 0,
    },
    mobileNavLinks: {
      display: "flex",
      flexDirection: "column",
      padding: "20px",
      flex: 1,
      overflowY: "auto",
    },
    mobileNavLink: {
      color: "#333",
      fontSize: "18px",
      fontWeight: 500,
      padding: "15px 0",
      textDecoration: "none",
      borderBottom: "1px solid #f0f0f0",
      transition: "color 0.3s ease",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    mobileDropdown: {
      borderBottom: "1px solid #f0f0f0",
    },
    mobileDropdownHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 0",
      color: "#333",
      fontSize: "18px",
      fontWeight: 500,
      cursor: "pointer",
    },
    mobileDropdownContent: {
      paddingLeft: "15px",
      paddingBottom: "10px",
    },
    mobileDropdownItem: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "12px 0",
      color: "#333",
      textDecoration: "none",
      fontSize: "16px",
      transition: "color 0.3s ease",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    mobileAdmin: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      marginTop: "20px",
      padding: "15px",
      backgroundColor: "#f8f9fa",
      borderRadius: "10px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    mobileAdminIcon: {
      width: "30px",
      height: "25px",
      flexShrink: 0,
    },
    admin: {
      display: "none", 
      alignItems: "center",
    },
    adminIcon: {
      width: "50px",
      height: "40px",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    dropdownItem: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "15px 20px",
      color: "#333",
      textDecoration: "none",
      fontSize: "16px",
      fontWeight: 500,
      transition: "all 0.3s ease",
      borderBottom: "1px solid #f0f0f0",
    },
  }

  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Styles pour desktop
  if (isDesktop) {
    styles.header.padding = "20px 50px"
    styles.header.height = "80px"
    styles.logoImg.width = "60px"
    styles.logoImg.height = "60px"
    styles.nav.display = "flex"
    styles.hamburgerMenu.display = "none"
    styles.admin.display = "flex"
  }

  // Détecte le défilement
  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }
  }

  // Clic sur l'icône admin
  const handleAdminClick = () => {
    navigate("/admin")
    setMobileMenuOpen(false)
  }

  // Clic sur le logo pour retourner à l'accueil
  const handleLogoClick = () => {
    navigate("/")
    setMobileMenuOpen(false)
  }

  // Fonction pour scroller vers une section
  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false)
    setShowActionsDropdown(false)
    setShowOmacDropdown(false)

    if (location.pathname !== "/") {
      navigate("/", { replace: true })
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      }, 100)
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }
  }

  // Navigation functions
  const handleGuideClick = () => {
    navigate("/guide")
    setShowOmacDropdown(false)
    setMobileMenuOpen(false)
  }

  const handleProjetSocialClick = () => {
    navigate("/projet-social")
    setShowOmacDropdown(false)
    setMobileMenuOpen(false)
  }

  const handleJeunesseClick = () => {
    navigate("/jeunesse")
    setShowActionsDropdown(false)
    setMobileMenuOpen(false)
  }

  const handleScolariteClick = () => {
    navigate("/scolarite")
    setShowActionsDropdown(false)
    setMobileMenuOpen(false)
  }

  const handleFamilleClick = () => {
    navigate("/famille")
    setShowActionsDropdown(false)
    setMobileMenuOpen(false)
  }

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    setShowActionsDropdown(false)
    setShowOmacDropdown(false)
  }

  // Fermer les dropdowns quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!omacRef.current?.contains(event.target) && !actionsRef.current?.contains(event.target)) {
        setShowActionsDropdown(false)
        setShowOmacDropdown(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Empêcher le défilement du corps lorsque le menu mobile est ouvert
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [mobileMenuOpen])

  // Ne forcer aucun défilement horizontal
  useEffect(() => {
    const preventHorizontalScroll = () => {
      document.documentElement.style.overflowX = "hidden"
      document.body.style.overflowX = "hidden"
      document.body.style.maxWidth = "100vw"
      document.documentElement.style.maxWidth = "100vw"
    }

    preventHorizontalScroll()

    // Vérifier périodiquement
    const interval = setInterval(preventHorizontalScroll, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      <header style={styles.header}>
        <div className="logo" onClick={handleLogoClick} style={styles.logo}>
          <img src={logoOmac || "/placeholder.svg"} alt="Logo OMAC" style={styles.logoImg} />
        </div>

        {/* Desktop Navigation */}
        <nav style={styles.nav}>
          <a
            href="#"
            style={styles.navLink}
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("hero")
            }}
          >
            Accueil
          </a>

          {/* Dropdown L'OMAC Desktop */}
          <div ref={omacRef} style={{ position: "relative" }}>
            <a
              href="#"
              style={{
                ...styles.navLink,
                display: "flex",
                alignItems: "center",
                gap: "5px",
                color: showOmacDropdown ? "#f7be00" : scrolled ? "#3498db" : "#ffffff",
              }}
              onClick={(e) => {
                e.preventDefault()
                setShowOmacDropdown(!showOmacDropdown)
                setShowActionsDropdown(false)
              }}
            >
              L'OMAC
              <span
                style={{
                  fontSize: "12px",
                  transition: "transform 0.3s ease",
                  marginLeft: "5px",
                  transform: showOmacDropdown ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                ▼
              </span>
            </a>
          </div>

          {/* Dropdown Nos Actions Desktop */}
          <div ref={actionsRef} style={{ position: "relative" }}>
            <a
              href="#"
              style={{
                ...styles.navLink,
                display: "flex",
                alignItems: "center",
                gap: "5px",
                color: showActionsDropdown ? "#f7be00" : scrolled ? "#3498db" : "#ffffff",
              }}
              onClick={(e) => {
                e.preventDefault()
                setShowActionsDropdown(!showActionsDropdown)
                setShowOmacDropdown(false)
              }}
            >
              Nos Actions
              <span
                style={{
                  fontSize: "12px",
                  transition: "transform 0.3s ease",
                  marginLeft: "5px",
                  transform: showActionsDropdown ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                ▼
              </span>
            </a>
          </div>

          <a
            href="#"
            style={styles.navLink}
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("events-section")
            }}
          >
            Actualités
          </a>

          <a
            href="#"
            style={styles.navLink}
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("contact-section")
            }}
          >
            Contact
          </a>
        </nav>

        {/* Hamburger Menu Button */}
        <button style={styles.hamburgerMenu} onClick={toggleMobileMenu} aria-label="Menu">
          {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
        </button>

        {/* Desktop Admin */}
        <div style={styles.admin}>
          <img
            src={admin || "/placeholder.svg"}
            alt="Administration"
            style={styles.adminIcon}
            onClick={handleAdminClick}
          />
        </div>
      </header>

      {/* Mobile Navigation */}
      <div style={styles.mobileNavOverlay} onClick={toggleMobileMenu}></div>
      <nav style={styles.mobileNav}>
        <div style={styles.mobileNavHeader}>
          <div onClick={handleLogoClick}>
            <img src={logoOmac || "/placeholder.svg"} alt="Logo OMAC" style={styles.mobileLogoImg} />
          </div>
          <button style={styles.closeMobileNav} onClick={toggleMobileMenu}>
            <XIcon />
          </button>
        </div>

        <div style={styles.mobileNavLinks}>
          <a
            href="#"
            style={styles.mobileNavLink}
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("hero")
            }}
          >
            Accueil
          </a>

          {/* Mobile Dropdown L'OMAC */}
          <div style={styles.mobileDropdown}>
            <div style={styles.mobileDropdownHeader} onClick={() => setMobileDrop1Open(!mobileDrop1Open)}>
              <span>L'OMAC</span>
              {mobileDrop1Open ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </div>

            {mobileDrop1Open && (
              <div style={styles.mobileDropdownContent}>
                <a
                  href="#"
                  style={styles.mobileDropdownItem}
                  onClick={(e) => {
                    e.preventDefault()
                    handleGuideClick()
                  }}
                >
                  <span>📖</span>
                  Guide OMAC
                </a>

                <a
                  href="#"
                  style={styles.mobileDropdownItem}
                  onClick={(e) => {
                    e.preventDefault()
                    handleProjetSocialClick()
                  }}
                >
                  <span>📋</span>
                  Projet Social
                </a>

                <a
                  href="#"
                  style={styles.mobileDropdownItem}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection("about-section")
                  }}
                >
                  <span>🏢</span>À Propos
                </a>
              </div>
            )}
          </div>

          {/* Mobile Dropdown Nos Actions */}
          <div style={styles.mobileDropdown}>
            <div style={styles.mobileDropdownHeader} onClick={() => setMobileDrop2Open(!mobileDrop2Open)}>
              <span>Nos Actions</span>
              {mobileDrop2Open ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </div>

            {mobileDrop2Open && (
              <div style={styles.mobileDropdownContent}>
                <a
                  href="#"
                  style={styles.mobileDropdownItem}
                  onClick={(e) => {
                    e.preventDefault()
                    handleJeunesseClick()
                  }}
                >
                  <span>🏀</span>
                  Jeunesse
                </a>

                <a
                  href="#"
                  style={styles.mobileDropdownItem}
                  onClick={(e) => {
                    e.preventDefault()
                    handleFamilleClick()
                  }}
                >
                  <span>👨‍👩‍👧‍👦</span>
                  Familles et Adultes
                </a>

                <a
                  href="#"
                  style={styles.mobileDropdownItem}
                  onClick={(e) => {
                    e.preventDefault()
                    handleScolariteClick()
                  }}
                >
                  <span>📚</span>
                  Aide à la scolarité
                </a>
              </div>
            )}
          </div>

          <a
            href="#"
            style={styles.mobileNavLink}
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("events-section")
            }}
          >
            Actualités
          </a>

          <a
            href="#"
            style={styles.mobileNavLink}
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("contact-section")
            }}
          >
            Contact
          </a>

          <div style={styles.mobileAdmin} onClick={handleAdminClick}>
            <img src={admin || "/placeholder.svg"} alt="Administration" style={styles.mobileAdminIcon} />
            <span>Administration</span>
          </div>
        </div>
      </nav>

      {/* Dropdowns Desktop avec portail */}
      <DropdownPortal isOpen={showOmacDropdown} triggerRef={omacRef}>
        <a
          href="#"
          style={styles.dropdownItem}
          onClick={(e) => {
            e.preventDefault()
            handleGuideClick()
          }}
        >
          <span style={{ fontSize: "18px", width: "24px", textAlign: "center" }}>📖</span>
          Guide OMAC
        </a>

        <a
          href="#"
          style={styles.dropdownItem}
          onClick={(e) => {
            e.preventDefault()
            handleProjetSocialClick()
          }}
        >
          <span style={{ fontSize: "18px", width: "24px", textAlign: "center" }}>📋</span>
          Projet Social
        </a>

        <a
          href="#"
          style={{
            ...styles.dropdownItem,
            borderBottom: "none",
          }}
          onClick={(e) => {
            e.preventDefault()
            setShowOmacDropdown(false)
            scrollToSection("about-section")
          }}
        >
          <span style={{ fontSize: "18px", width: "24px", textAlign: "center" }}>🏢</span>À Propos
        </a>
      </DropdownPortal>

      <DropdownPortal isOpen={showActionsDropdown} triggerRef={actionsRef}>
        <a
          href="#"
          style={styles.dropdownItem}
          onClick={(e) => {
            e.preventDefault()
            handleJeunesseClick()
          }}
        >
          <span style={{ fontSize: "18px", width: "24px", textAlign: "center" }}>🏀</span>
          Jeunesse
        </a>

        <a
          href="#"
          style={styles.dropdownItem}
          onClick={(e) => {
            e.preventDefault()
            handleFamilleClick()
          }}
        >
          <span style={{ fontSize: "18px", width: "24px", textAlign: "center" }}>👨‍👩‍👧‍👦</span>
          Familles et Adultes
        </a>

        <a
          href="#"
          style={{
            ...styles.dropdownItem,
            borderBottom: "none",
          }}
          onClick={(e) => {
            e.preventDefault()
            handleScolariteClick()
          }}
        >
          <span style={{ fontSize: "18px", width: "24px", textAlign: "center" }}>📚</span>
          Aide à la scolarité
        </a>
      </DropdownPortal>

      {/* Style global pour forcer l'absence de défilement horizontal */}
      <style>{`
        * {
          box-sizing: border-box !important;
        }
        
        html {
          overflow-x: hidden !important;
          width: 100% !important;
          max-width: 100vw !important;
          margin: 0 !important;
          padding: 0 !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        
        html::-webkit-scrollbar-horizontal {
          display: none !important;
        }
        
        body {
          overflow-x: hidden !important;
          width: 100% !important;
          max-width: 100vw !important;
          margin: 0 !important;
          padding: 0 !important;
          position: relative !important;
        }
        
        #root {
          overflow-x: hidden !important;
          width: 100% !important;
          max-width: 100vw !important;
        }
        
        /* Supprimer complètement les barres de défilement horizontales */
        ::-webkit-scrollbar-horizontal {
          width: 0 !important;
          height: 0 !important;
          display: none !important;
        }
        
        /* Pour tous les navigateurs */
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        
        *::-webkit-scrollbar-horizontal {
          display: none !important;
        }
      `}</style>
    </>
  )
}

export default Header
