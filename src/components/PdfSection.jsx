"use client"

import { useState, useEffect } from "react"
import "./PdfSection.css"

const PdfSection = () => {
  const [pdfs, setPdfs] = useState([])
  const [loading, setLoading] = useState(true)

  // Charger PDF depuis le localStorage
  useEffect(() => {
    loadPdfs()
  }, [])

  const loadPdfs = () => {
    try {
      setLoading(true)
      const saved = localStorage.getItem("omac_pdfs")

      let pdfsData = []
      if (saved) {
        pdfsData = JSON.parse(saved)
      } else {
        // Données par défaut si aucun PDF n'est configuré
        pdfsData = [
          {
            id: 1,
            title: "Guide des activités OMAC",
            description: "Découvrez toutes nos activités et services proposés.",
            fileName: "guide-activites.pdf",
            fileData: null,
            uploadDate: new Date().toISOString(),
          },
        ]
      }

      setPdfs(pdfsData)
    } catch (error) {
      console.error("❌ Erreur chargement PDF:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPdf = (pdf) => {
    if (pdf.fileData) {
      // Créer un lien de téléchargement
      const link = document.createElement("a")
      link.href = pdf.fileData
      link.download = pdf.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      alert("Ce document n'est pas encore disponible. Contactez l'administration.")
    }
  }

  const handleViewPdf = (pdf) => {
    if (pdf.fileData) {
      // Ouvrir le PDF dans un nouvel onglet
      const newWindow = window.open()
      newWindow.document.write(`
        <html>
          <head>
            <title>${pdf.title}</title>
            <style>
              body { margin: 0; padding: 0; }
              iframe { width: 100%; height: 100vh; border: none; }
            </style>
          </head>
          <body>
            <iframe src="${pdf.fileData}" type="application/pdf"></iframe>
          </body>
        </html>
      `)
    } else {
      alert("Ce document n'est pas encore disponible. Contactez l'administration.")
    }
  }

  if (loading) {
    return (
      <section className="pdf-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">On vous propose</h2>
            <div className="loading-spinner">Chargement...</div>
          </div>
        </div>
      </section>
    )
  }

  if (pdfs.length === 0) {
    return (
      <section className="pdf-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">On vous propose</h2>
            <p className="section-subtitle">Aucun document disponible pour le moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="pdf-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">On vous propose</h2>
          <div className="subtitle-container">
            <p className="section-subtitle">Découvrez nos documents et ressources</p>
            <div className="green-underline"></div>
          </div>
        </div>

        <div className="pdf-grid">
          {pdfs.map((pdf) => (
            <div key={pdf.id} className="pdf-card">
              <div className="pdf-icon">📄</div>

              <div className="pdf-content">
                <h3 className="pdf-title">{pdf.title}</h3>
                {pdf.description && <p className="pdf-description">{pdf.description}</p>}

                <div className="pdf-meta">
                  <span className="pdf-filename">{pdf.fileName}</span>
                  {pdf.uploadDate && (
                    <span className="pdf-date">
                      Mis à jour le {new Date(pdf.uploadDate).toLocaleDateString("fr-FR")}
                    </span>
                  )}
                </div>
              </div>

              <div className="pdf-actions">
                <button
                  className="btn-view"
                  onClick={() => handleViewPdf(pdf)}
                  disabled={!pdf.fileData}
                  title="Voir le document"
                >
                  👁️ Voir
                </button>
                <button
                  className="btn-download"
                  onClick={() => handleDownloadPdf(pdf)}
                  disabled={!pdf.fileData}
                  title="Télécharger le document"
                >
                  ⬇️ Télécharger
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Message informatif si certains documents ne sont pas disponibles */}
        {pdfs.some((pdf) => !pdf.fileData) && (
          <div className="info-message">
            <p>
              💡 Certains documents sont en cours de mise à jour. N'hésitez pas à nous contacter pour plus
              d'informations.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default PdfSection
