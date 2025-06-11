"use client"

import { useState, useRef } from "react"
import "./AdminPanel.css"

const AdminPanel = ({ images, pdfUrl, onImagesUpdate, onPdfUpdate, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef(null)
  const pdfInputRef = useRef(null)

  // Mot de passe admin
  const ADMIN_PASSWORD = "admin123"

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Mot de passe incorrect")
    }
  }

  const handleFileUpload = (event) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result
          if (result) {
            const newImages = [...images, result]
            onImagesUpdate(newImages)
          }
        }
        reader.readAsDataURL(file)
      }
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handlePdfUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (file.type === "application/pdf") {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (result) {
          onPdfUpdate(result)
        }
      }
      reader.readAsDataURL(file)
    } else {
      alert("Veuillez sélectionner un fichier PDF valide.")
    }

    // Reset input
    if (pdfInputRef.current) {
      pdfInputRef.current.value = ""
    }
  }

  const handleDeleteImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesUpdate(newImages)
  }

  const handleDeleteAll = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer toutes les images ?")) {
      onImagesUpdate([])
    }
  }

  const handleDeletePdf = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer le PDF actuel ?")) {
      onPdfUpdate("")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-overlay">
        <div className="admin-modal">
          <div className="admin-header">
            <h3>Authentification Admin</h3>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="admin-content">
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {error && <div className="error-message">{error}</div>}
            <button className="login-btn" onClick={handleLogin}>
              Se connecter
            </button>
            <p className="password-hint">Mot de passe par défaut: admin123</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-overlay">
      <div className="admin-modal large">
        <div className="admin-header">
          <h3>Panneau d'Administration</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="admin-content">
          {/* Section PDF */}
          <div className="upload-section">
            <h4>Gestion du PDF "On vous propose"</h4>
            <div className="upload-controls">
              <button className="upload-btn" onClick={() => pdfInputRef.current?.click()}>
                📄 Choisir un PDF
              </button>
              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                style={{ display: "none" }}
              />
              {pdfUrl && (
                <>
                  <button className="view-pdf-btn" onClick={() => window.open(pdfUrl, '_blank')}>
                    👁️ Voir le PDF
                  </button>
                  <button className="delete-btn" onClick={handleDeletePdf}>
                    🗑️ Supprimer
                  </button>
                </>
              )}
            </div>
            <div className="pdf-status">
              {pdfUrl ? "PDF configuré ✔️" : "Aucun PDF configuré ❌"}
            </div>
          </div>

          {/* Upload d'images */}
          <div className="upload-section">
            <h4>Gestion du Carrousel d'Images</h4>
            <div className="upload-controls">
              <button className="upload-btn" onClick={() => fileInputRef.current?.click()}>
                📁 Choisir des Images
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <span className="upload-info">Formats: JPG, PNG, GIF, WebP</span>
            </div>
          </div>

          {/* Liste des images */}
          <div className="images-section">
            <div className="images-header">
              <h4>Images du Carrousel ({images.length})</h4>
              {images.length > 0 && (
                <button className="delete-all-btn" onClick={handleDeleteAll}>
                  🗑️ Tout Supprimer
                </button>
              )}
            </div>

            {images.length === 0 ? (
              <div className="empty-images">Aucune image uploadée. Le carrousel affichera des images par défaut.</div>
            ) : (
              <div className="images-grid">
                {images.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image || "/placeholder.svg"} alt={`Image ${index + 1}`} />
                    <button className="delete-image-btn" onClick={() => handleDeleteImage(index)}>
                      ×
                    </button>
                    <div className="image-number">Image {index + 1}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="instructions">
            <h4>Instructions:</h4>
            <ul>
              <li>• Pour le PDF: Choisissez un fichier PDF qui sera utilisé pour le bouton "On vous propose"</li>
              <li>• Pour les images: Ajoutez plusieurs images pour le carrousel</li>
              <li>• Les modifications sont sauvegardées automatiquement</li>
              <li>• Survolez les éléments pour voir les options de suppression</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel