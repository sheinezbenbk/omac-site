"use client"

import { useState, useEffect } from "react"
import "./ImageCarousel.css"

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  // Correction : spécifier les valeurs possibles pour fitMode
  const [fitMode, setFitMode] = useState("cover")

  // Images par défaut si aucune image n'est uploadée
  const defaultImages = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-vh4FU3rHri3SEY8QH0suUmHrun79_MiGiQ&s",
    "https://via.placeholder.com/600x400/3498db/ffffff?text=OMAC+Torcy",
    "https://via.placeholder.com/600x400/e74c3c/ffffff?text=Activités",
  ]

  const displayImages = images && images.length > 0 ? images : defaultImages

  // Auto-play du carrousel
  useEffect(() => {
    if (!isAutoPlaying || displayImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1))
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, displayImages.length])

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? displayImages.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === displayImages.length - 1 ? 0 : currentIndex + 1)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  // Fonction supprimée - plus besoin de changer le mode d'affichage

  if (displayImages.length === 0) {
    return (
      <div className="carousel-empty">
        <p>Aucune image à afficher</p>
      </div>
    )
  }

  return (
    <div
      className="image-carousel"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Container principal du carrousel */}
      <div className="carousel-container">
        {displayImages.map((image, index) => (
          <div key={index} className={`carousel-slide ${index === currentIndex ? "active" : ""}`}>
            <img
              src={image || "/placeholder.svg"}
              alt={`Slide ${index + 1}`}
              className="carousel-image"
              style={{ objectFit: "contain" }}
            />
          </div>
        ))}

        {/* Overlay gradient */}
        <div className="carousel-overlay"></div>

        {/* Boutons de navigation */}
        {displayImages.length > 1 && (
          <>
            <button className="carousel-btn carousel-btn-prev" onClick={goToPrevious}>
              &#8249;
            </button>
            <button className="carousel-btn carousel-btn-next" onClick={goToNext}>
              &#8250;
            </button>
          </>
        )}

        {/* Bouton de mode d'affichage supprimé */}

        {/* Compteur d'images */}
        {displayImages.length > 1 && (
          <div className="carousel-counter">
            {currentIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Indicateurs de pagination */}
      {displayImages.length > 1 && (
        <div className="carousel-indicators">
          {displayImages.map((_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${index === currentIndex ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageCarousel