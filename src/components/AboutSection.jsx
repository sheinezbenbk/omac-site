"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./AboutSection.css"
import icon1 from "../assets/check.png"
import icon2 from "../assets/check.png"
import icon3 from "../assets/check.png"

// importation des icônes
import jeunesseIcon from "../assets/basket.png"
import famillesIcon from "../assets/famille.png"
import scolariteIcon from "../assets/ecole.png"

// Import du carrousel
import ImageCarousel from "./ImageCarousel.tsx"

const AboutSection = () => {
  const navigate = useNavigate()
  const [images, setImages] = useState([])
  const [currentPdf, setCurrentPdf] = useState(null)

  // Charger les images depuis le localStorage au démarrage
  useEffect(() => {
    const savedImages = localStorage.getItem("carousel-images")
    if (savedImages) {
      setImages(JSON.parse(savedImages))
    }
  }, [])

  // Charger le PDF le plus récent depuis le localStorage au démarrage
  useEffect(() => {
    const loadLatestPdf = () => {
      try {
        const savedPdfs = localStorage.getItem("omac_pdfs")
        if (savedPdfs) {
          const pdfsData = JSON.parse(savedPdfs)
          // Trouver le PDF le plus récent qui a des données
          if (pdfsData && pdfsData.length > 0) {
            // Trier par date de mise à jour (du plus récent au plus ancien)
            const sortedPdfs = pdfsData
              .filter((pdf) => pdf.fileData) // Seulement les PDFs avec des données
              .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))

            if (sortedPdfs.length > 0) {
              setCurrentPdf(sortedPdfs[0])
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement du PDF:", error)
      }
    }

    loadLatestPdf()
  }, [])

  // Fonction pour naviguer vers la page Guide
  const handleGuideClick = () => {
    navigate("/guide")
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
  }

  // Fonction pour naviguer vers la page Projet Social
  const handleProjetSocialClick = () => {
    navigate("/projet-social")
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
  }

  // Fonctions pour naviguer vers les secteurs
  const handleJeunesseClick = () => {
    navigate("/jeunesse")
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
  }

  const handleFamilleClick = () => {
    navigate("/famille")
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
  }

  const handleScolariteClick = () => {
    navigate("/scolarite")
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
  }

  // Fonction pour ouvrir le PDF
  const handleOpenPdf = () => {
    if (currentPdf && currentPdf.fileData) {
      try {
        // Convertir le base64 en blob pour l'ouvrir
        const base64Data = currentPdf.fileData.split(",")[1] // Enlever le préfixe data:application/pdf;base64,
        const byteCharacters = atob(base64Data)
        const byteNumbers = new Array(byteCharacters.length)

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }

        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: "application/pdf" })
        const blobUrl = URL.createObjectURL(blob)

        // Ouvrir dans un nouvel onglet
        window.open(blobUrl, "_blank")

        // Nettoyer l'URL après un délai
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl)
        }, 1000)
      } catch (error) {
        console.error("Erreur ouverture PDF:", error)
        alert("Erreur lors de l'ouverture du document.")
      }
    } else {
      alert("Le document n'est pas encore disponible. Contactez l'administration.")
    }
  }

  const items = [
    { id: 1, text: "Accompagnement personnalisé des familles", icon: icon1 },
    { id: 2, text: "Activités éducatives et culturelles variées", icon: icon2 },
    { id: 3, text: "Engagement dans l'éducation populaire et la laïcité", icon: icon3 },
  ]

  // SERVICES AVEC NAVIGATION CORRIGÉE
  const services = [
    {
      id: 1,
      icon: jeunesseIcon,
      title: "Jeunesse",
      description:
        "Accompagnement éducatif, activités sportives et culturelles, sorties et projets collectifs pour les jeunes de Torcy. Développement de l'autonomie et de la citoyenneté.",
      onClick: handleJeunesseClick,
    },
    {
      id: 2,
      icon: famillesIcon,
      title: "Familles et Adultes",
      description:
        "Soutien aux familles, ateliers parentalité, activités intergénérationnelles et accompagnement social. Un espace d'écoute et d'entraide pour tous.",
      onClick: handleFamilleClick,
    },
    {
      id: 3,
      icon: scolariteIcon,
      title: "Aide à la scolarité",
      description:
        "Soutien scolaire, accompagnement aux devoirs, ateliers de méthodologie et orientation. Réussite éducative pour tous les enfants du quartier.",
      onClick: handleScolariteClick,
    },
  ]

  return (
    <section className="about-section">
      <div className="container">
        <div className="about-header">
          <h2 className="section-title">À Propos de l'OMAC</h2>
          <div className="subtitle-container">
            <p className="about-subtitle">Découvrez notre Histoire et nos Missions</p>
            <div className="green-underline"></div>
          </div>
        </div>

        <div className="about-columns">
          {/* CARROUSEL D'IMAGES */}
          <div className="image-column">
            <div className="yellow-square"></div>
            <div className="image-container">
              <ImageCarousel images={images} />
            </div>
          </div>

          <div className="text-column">
            <div className="text-content">
              <h3 className="card-title">Au service de la communauté depuis des années</h3>

              <p>
                L'OMAC de Torcy est une association d'éducation populaire qui œuvre quotidiennement pour l'animation de
                la vie de quartier et l'accompagnement des habitants. Nous développons des projets collectifs dans un
                esprit de solidarité et de laïcité.
              </p>

              <p>
                Implantés dans plusieurs quartiers de Torcy, nous proposons des activités diversifiées qui favorisent le
                lien social, l'épanouissement personnel et la participation citoyenne. Notre équipe professionnelle
                accompagne les projets des habitants dans une démarche participative.
              </p>

              <ul className="feature-list">
                {items.map((item) => (
                  <li key={item.id} className="feature-item">
                    <div className="icon-placeholder">
                      <img src={item.icon || "/placeholder.svg"} alt={`Icône ${item.id}`} width="24" height="24" />
                    </div>
                    <span className="item-text">{item.text}</span>
                  </li>
                ))}
              </ul>

              <button className="btn-learn-more" onClick={handleGuideClick}>
                Guide de l'OMAC
              </button>
              <button className="btn-learn-more" onClick={handleProjetSocialClick}>
                Projet Social
              </button>
              <button className="btn-learn-more" onClick={handleOpenPdf}>
                📄 On vous propose
              </button>
            </div>
            <div className="blue-square"></div>
          </div>
        </div>

        {/* SECTION SERVICES CORRIGÉE */}
        <div className="services-container">
          {services.map((service) => (
            <div className="service-card" key={service.id}>
              <div className="service-icon">
                <img src={service.icon || "/placeholder.svg"} alt={service.title} />
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <div className="card-divider"></div>
              <a
                href="#"
                className="service-link"
                onClick={(e) => {
                  e.preventDefault()
                  service.onClick()
                }}
              >
                En Savoir Plus →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutSection
