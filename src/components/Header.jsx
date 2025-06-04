"use client"

import { useState, useEffect } from "react"
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

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [showActionsDropdown, setShowActionsDropdown] = useState(false)
  const [showOmacDropdown, setShowOmacDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileDrop1Open, setMobileDrop1Open] = useState(false)
  const [mobileDrop2Open, setMobileDrop2Open] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  // Styles CSS intégrés avec corrections pour mobile
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
      display: "none", // Caché sur mobile par défaut
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
      display: "none", // Caché sur mobile
      alignItems: "center",
    },
    adminIcon: {
      width: "50px",
      height: "40px",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
  }

  // Media queries avec JavaScript pour desktop
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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Prevent body scroll when mobile menu is open
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

  // Force no horizontal scroll
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

          <a
            href="#"
            style={styles.navLink}
            onClick={(e) => {
              e.preventDefault()
              setShowOmacDropdown(!showOmacDropdown)
              setShowActionsDropdown(false)
            }}
          >
            L'OMAC ▼
          </a>

          <a
            href="#"
            style={styles.navLink}
            onClick={(e) => {
              e.preventDefault()
              setShowActionsDropdown(!showActionsDropdown)
              setShowOmacDropdown(false)
            }}
          >
            Nos Actions ▼
          </a>

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

    </>
  )
}

export default Header
