"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import ApiService from "../services/api"
import "./AdminDashboard.css"
import logoOmac from "../assets/omac-logo.png"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("events")
  const [showEventForm, setShowEventForm] = useState(false)
  const [showMediaForm, setShowMediaForm] = useState(false)
  const [showCarouselForm, setShowCarouselForm] = useState(false)
  const [showPdfForm, setShowPdfForm] = useState(false) // ✅ NOUVEAU
  const [editingEvent, setEditingEvent] = useState(null)
  const [editingMedia, setEditingMedia] = useState(null)
  const [editingCarouselImage, setEditingCarouselImage] = useState(null)
  const [editingPdf, setEditingPdf] = useState(null) // ✅ NOUVEAU

  // États pour la navigation par mois
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [collapsedMonths, setCollapsedMonths] = useState(new Set())

  // États pour les événements de la BDD
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // États pour les médias YouTube (localStorage)
  const [medias, setMedias] = useState([])
  const [loadingMedias, setLoadingMedias] = useState(false)

  // États pour les images du carrousel
  const [carouselImages, setCarouselImages] = useState([])
  const [loadingCarousel, setLoadingCarousel] = useState(false)
  const fileInputRef = useRef(null)

  // ✅ NOUVEAU : États pour les PDFs
  const [pdfs, setPdfs] = useState([])
  const [loadingPdfs, setLoadingPdfs] = useState(false)
  const pdfInputRef = useRef(null)

  // Formulaire d'événement pour la BDD
  const [eventForm, setEventForm] = useState({
    titre: "",
    description: "",
    date_debut: "",
    date_fin: "",
    couleur: "#3498db",
    toute_la_journee: false,
  })

  // Formulaire de média pour YouTube
  const [mediaForm, setMediaForm] = useState({
    titre: "",
    description: "",
    youtubeId: "",
  })

  // Formulaire pour les images du carrousel
  const [carouselForm, setCarouselForm] = useState({
    title: "",
    alt: "",
    file: null,
  })

  // ✅ NOUVEAU : Formulaire pour les PDFs
  const [pdfForm, setPdfForm] = useState({
    title: "",
    description: "",
    file: null,
  })

  // Charger les données au montage
  useEffect(() => {
    checkAuthAndLoadData()
  }, [navigate])

  const checkAuthAndLoadData = async () => {
    // Vérifier l'authentification
    if (!ApiService.isAuthenticated()) {
      console.log("❌ Pas d'authentification valide, redirection vers login")
      navigate("/admin")
      return
    }

    // Vérifier que l'admin existe toujours
    const adminData = ApiService.getAdmin()
    if (!adminData) {
      console.log("❌ Données admin manquantes, redirection vers login")
      navigate("/admin")
      return
    }

    console.log("✅ Admin connecté:", adminData.username)

    // Charger toutes les données
    await loadEvents()
    loadMedias()
    loadCarouselImages()
    loadPdfs() // ✅ NOUVEAU
  }

  const loadEvents = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔄 Chargement des événements...")
      const eventsData = await ApiService.getEvents()

      // Transformer les données pour votre interface existante
      const formattedEvents = eventsData.map((event) => {
        const startDate = new Date(event.date_debut)
        const endDate = new Date(event.date_fin)

        return {
          id: event.id,
          title: event.titre,
          date: startDate.toISOString().split("T")[0],
          time: event.toute_la_journee
            ? "Toute la journée"
            : `${startDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} - ${endDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`,
          location: "OMAC Torcy",
          description: event.description || "Événement OMAC",
          image: "/api/placeholder/400/300",
          couleur: event.couleur,
          // Données originales pour l'édition
          date_debut: event.date_debut,
          date_fin: event.date_fin,
          toute_la_journee: event.toute_la_journee,
        }
      })

      setEvents(formattedEvents)
      console.log("✅ Événements chargés:", formattedEvents)
    } catch (err) {
      console.error("❌ Erreur chargement événements:", err)
      setError("Impossible de charger les événements")
    } finally {
      setLoading(false)
    }
  }

  // Fonction loadMedias pour localStorage
  const loadMedias = () => {
    try {
      setLoadingMedias(true)

      console.log("🔄 Chargement des médias depuis localStorage...")
      const saved = localStorage.getItem("omac_youtube_videos")

      let mediasData = []
      if (saved) {
        mediasData = JSON.parse(saved)
      } else {
        // Données par défaut
        mediasData = [
          {
            id: 1,
            titre: "Atelier de danse pour enfants",
            description: "Découvrez nos ateliers de danse créative pour les plus jeunes.",
            youtubeId: "dQw4w9WgXcQ",
          },
        ]
        localStorage.setItem("omac_youtube_videos", JSON.stringify(mediasData))
      }

      // Transformer les données pour votre interface existante
      const formattedMedias = mediasData.map((media) => ({
        id: media.id,
        type: "video",
        title: media.titre,
        description: media.description,
        thumbnail: `https://img.youtube.com/vi/${media.youtubeId}/maxresdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${media.youtubeId}`,
        youtubeId: media.youtubeId,
      }))

      setMedias(formattedMedias)
      console.log("✅ Médias chargés:", formattedMedias)
    } catch (err) {
      console.error("❌ Erreur chargement médias:", err)
      setError("Impossible de charger les médias")
    } finally {
      setLoadingMedias(false)
    }
  }

  // Fonction pour charger les images du carrousel
  const loadCarouselImages = () => {
    try {
      setLoadingCarousel(true)

      console.log("🔄 Chargement des images du carrousel...")
      const saved = localStorage.getItem("carousel-images")

      let imagesData = []
      if (saved) {
        const savedImages = JSON.parse(saved)
        // Transformer en format avec métadonnées
        imagesData = savedImages.map((src, index) => ({
          id: index + 1,
          src: src,
          alt: `Image ${index + 1}`,
          title: `Image ${index + 1}`,
        }))
      }

      setCarouselImages(imagesData)
      console.log("✅ Images carrousel chargées:", imagesData)
    } catch (err) {
      console.error("❌ Erreur chargement images carrousel:", err)
      setError("Impossible de charger les images du carrousel")
    } finally {
      setLoadingCarousel(false)
    }
  }

  // ✅ NOUVEAU : Fonction pour charger les PDFs
  const loadPdfs = () => {
    try {
      setLoadingPdfs(true)

      console.log("🔄 Chargement des PDFs...")
      const saved = localStorage.getItem("omac_pdfs")

      let pdfsData = []
      if (saved) {
        pdfsData = JSON.parse(saved)
      } else {
        // Données par défaut
        pdfsData = [
          {
            id: 1,
            title: "Guide des activités OMAC",
            description: "Découvrez toutes nos activités et services proposés.",
            fileName: "guide-activites.pdf",
            fileData: null, // Sera rempli quand un vrai PDF sera uploadé
            uploadDate: new Date().toISOString(),
          },
        ]
        localStorage.setItem("omac_pdfs", JSON.stringify(pdfsData))
      }

      setPdfs(pdfsData)
      console.log("✅ PDFs chargés:", pdfsData)
    } catch (err) {
      console.error("❌ Erreur chargement PDFs:", err)
      setError("Impossible de charger les PDFs")
    } finally {
      setLoadingPdfs(false)
    }
  }

  // Fonction pour sauvegarder les images du carrousel
  const saveCarouselImages = (images) => {
    try {
      // Sauvegarder juste les URLs pour compatibilité avec AboutSection
      const imageSrcs = images.map((img) => img.src)
      localStorage.setItem("carousel-images", JSON.stringify(imageSrcs))
      loadCarouselImages() // Recharger
    } catch (error) {
      console.error("❌ Erreur sauvegarde images carrousel:", error)
    }
  }

  // ✅ NOUVEAU : Fonction pour sauvegarder les PDFs
  const savePdfs = (newPdfs) => {
    try {
      localStorage.setItem("omac_pdfs", JSON.stringify(newPdfs))
      loadPdfs() // Recharger
    } catch (error) {
      console.error("❌ Erreur sauvegarde PDFs:", error)
    }
  }

  // Fonction pour sauvegarder dans localStorage
  const saveMediasToStorage = (newMedias) => {
    try {
      const dataToSave = newMedias.map((media) => ({
        id: media.id,
        titre: media.title,
        description: media.description,
        youtubeId: media.youtubeId,
      }))
      localStorage.setItem("omac_youtube_videos", JSON.stringify(dataToSave))
      loadMedias() // Recharger les données
    } catch (error) {
      console.error("❌ Erreur sauvegarde médias:", error)
    }
  }

  // Fonction pour extraire l'ID YouTube
  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : url
  }

  // FONCTIONS POUR LA GESTION DES MOIS (inchangées)
  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ]

  const groupEventsByMonth = () => {
    const grouped = {}

    events.forEach((event) => {
      const eventDate = new Date(event.date)
      const monthKey = `${eventDate.getFullYear()}-${eventDate.getMonth()}`

      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          year: eventDate.getFullYear(),
          month: eventDate.getMonth(),
          events: [],
        }
      }

      grouped[monthKey].events.push(event)
    })

    Object.keys(grouped).forEach((monthKey) => {
      grouped[monthKey].events.sort((a, b) => new Date(a.date) - new Date(b.date))
    })

    return grouped
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() + direction)
    setCurrentMonth(newDate)
  }

  const getCurrentMonthEvents = () => {
    const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`
    const grouped = groupEventsByMonth()
    return grouped[monthKey]?.events || []
  }

  const toggleMonthCollapse = (monthKey) => {
    const newCollapsed = new Set(collapsedMonths)
    if (newCollapsed.has(monthKey)) {
      newCollapsed.delete(monthKey)
    } else {
      newCollapsed.add(monthKey)
    }
    setCollapsedMonths(newCollapsed)
  }

  const getTotalStats = () => {
    const currentMonthEvents = getCurrentMonthEvents()
    return {
      total: events.length,
      currentMonth: currentMonthEvents.length,
    }
  }

  // Gestion de la déconnexion
  const handleLogout = async () => {
    try {
      await ApiService.logout()
    } catch (error) {
      console.error("Erreur déconnexion:", error)
    }
    navigate("/admin")
  }

  // Gestion des événements (inchangées)
  const handleAddEvent = () => {
    setEditingEvent(null)
    setEventForm({
      titre: "",
      description: "",
      date_debut: "",
      date_fin: "",
      couleur: "#3498db",
      toute_la_journee: false,
    })
    setShowEventForm(true)
  }

  const handleEditEvent = (event) => {
    setEditingEvent(event)
    setEventForm({
      titre: event.title,
      description: event.description,
      date_debut: event.date_debut,
      date_fin: event.date_fin,
      couleur: event.couleur || "#3498db",
      toute_la_journee: event.toute_la_journee || false,
    })
    setShowEventForm(true)
  }

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      try {
        const token = ApiService.getToken()
        await ApiService.deleteEvent(eventId, token)
        await loadEvents()
        console.log("✅ Événement supprimé")
      } catch (error) {
        console.error("❌ Erreur suppression:", error)
        alert("Erreur lors de la suppression de l'événement")
      }
    }
  }

  const handleSaveEvent = async () => {
    try {
      const token = ApiService.getToken()

      if (editingEvent) {
        await ApiService.updateEvent(editingEvent.id, eventForm, token)
        console.log("✅ Événement modifié")
      } else {
        await ApiService.createEvent(eventForm, token)
        console.log("✅ Événement ajouté")
      }

      setShowEventForm(false)
      await loadEvents()
    } catch (error) {
      console.error("❌ Erreur sauvegarde:", error)
      alert("Erreur lors de la sauvegarde de l'événement")
    }
  }

  // Gestion des médias pour localStorage
  const handleAddMedia = () => {
    setEditingMedia(null)
    setMediaForm({
      titre: "",
      description: "",
      youtubeId: "",
    })
    setShowMediaForm(true)
  }

  const handleEditMedia = (media) => {
    setEditingMedia(media)
    setMediaForm({
      titre: media.title,
      description: media.description,
      youtubeId: media.youtubeId,
    })
    setShowMediaForm(true)
  }

  const handleDeleteMedia = (mediaId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette ressource ?")) {
      try {
        const newMedias = medias.filter((media) => media.id !== mediaId)
        saveMediasToStorage(newMedias)
        console.log("✅ Média supprimé")
      } catch (error) {
        console.error("❌ Erreur suppression:", error)
        alert("Erreur lors de la suppression du média")
      }
    }
  }

  const handleSaveMedia = () => {
    try {
      if (!mediaForm.titre || !mediaForm.youtubeId) {
        alert("Veuillez remplir tous les champs obligatoires")
        return
      }

      const youtubeId = extractYouTubeId(mediaForm.youtubeId)

      if (youtubeId.length !== 11) {
        alert("ID YouTube invalide")
        return
      }

      let newMedias
      if (editingMedia) {
        // Modifier
        newMedias = medias.map((media) =>
          media.id === editingMedia.id
            ? {
                ...media,
                title: mediaForm.titre,
                description: mediaForm.description,
                youtubeId: youtubeId,
                thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
                url: `https://www.youtube.com/watch?v=${youtubeId}`,
              }
            : media,
        )
        console.log("✅ Média modifié")
      } else {
        // Ajouter
        const newMedia = {
          id: Math.max(...medias.map((v) => v.id), 0) + 1,
          type: "video",
          title: mediaForm.titre,
          description: mediaForm.description,
          youtubeId: youtubeId,
          thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
          url: `https://www.youtube.com/watch?v=${youtubeId}`,
        }
        newMedias = [...medias, newMedia]
        console.log("✅ Média ajouté")
      }

      saveMediasToStorage(newMedias)
      setShowMediaForm(false)
    } catch (error) {
      console.error("❌ Erreur sauvegarde média:", error)
      alert("Erreur lors de la sauvegarde du média")
    }
  }

  // Gestion des images du carrousel
  const handleAddCarouselImage = () => {
    setEditingCarouselImage(null)
    setCarouselForm({
      title: "",
      alt: "",
      file: null,
    })
    setShowCarouselForm(true)
  }

  const handleEditCarouselImage = (image) => {
    setEditingCarouselImage(image)
    setCarouselForm({
      title: image.title || "",
      alt: image.alt || "",
      file: null,
    })
    setShowCarouselForm(true)
  }

  const handleDeleteCarouselImage = (imageId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
      try {
        const newImages = carouselImages.filter((img) => img.id !== imageId)
        saveCarouselImages(newImages)
        console.log("✅ Image supprimée")
      } catch (error) {
        console.error("❌ Erreur suppression:", error)
        alert("Erreur lors de la suppression de l'image")
      }
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith("image/")) {
        alert("Veuillez sélectionner un fichier image")
        return
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Le fichier est trop volumineux (max 5MB)")
        return
      }

      setCarouselForm({
        ...carouselForm,
        file: file,
      })
    }
  }

  const handleSaveCarouselImage = async () => {
    try {
      if (!carouselForm.alt) {
        alert("Veuillez remplir le texte alternatif")
        return
      }

      if (!editingCarouselImage && !carouselForm.file) {
        alert("Veuillez sélectionner une image")
        return
      }

      let imageSrc = editingCarouselImage?.src || ""

      // Si un nouveau fichier est sélectionné, le convertir en base64
      if (carouselForm.file) {
        imageSrc = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target.result)
          reader.onerror = reject
          reader.readAsDataURL(carouselForm.file)
        })
      }

      let newImages
      if (editingCarouselImage) {
        // Modifier l'image existante
        newImages = carouselImages.map((img) =>
          img.id === editingCarouselImage.id
            ? {
                ...img,
                title: carouselForm.title,
                alt: carouselForm.alt,
                src: imageSrc,
              }
            : img,
        )
        console.log("✅ Image modifiée")
      } else {
        // Ajouter une nouvelle image
        const newImage = {
          id: Math.max(...carouselImages.map((img) => img.id), 0) + 1,
          title: carouselForm.title,
          alt: carouselForm.alt,
          src: imageSrc,
        }
        newImages = [...carouselImages, newImage]
        console.log("✅ Image ajoutée")
      }

      saveCarouselImages(newImages)
      setShowCarouselForm(false)
    } catch (error) {
      console.error("❌ Erreur sauvegarde image:", error)
      alert("Erreur lors de la sauvegarde de l'image")
    }
  }

  // ✅ NOUVEAU : Gestion des PDFs
  const handleAddPdf = () => {
    setEditingPdf(null)
    setPdfForm({
      title: "",
      description: "",
      file: null,
    })
    setShowPdfForm(true)
  }

  const handleEditPdf = (pdf) => {
    setEditingPdf(pdf)
    setPdfForm({
      title: pdf.title || "",
      description: pdf.description || "",
      file: null,
    })
    setShowPdfForm(true)
  }

  const handleDeletePdf = (pdfId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      try {
        const newPdfs = pdfs.filter((pdf) => pdf.id !== pdfId)
        savePdfs(newPdfs)
        console.log("✅ PDF supprimé")
      } catch (error) {
        console.error("❌ Erreur suppression:", error)
        alert("Erreur lors de la suppression du document")
      }
    }
  }

  const handlePdfFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Vérifier le type de fichier
      if (file.type !== "application/pdf") {
        alert("Veuillez sélectionner un fichier PDF")
        return
      }

      // Vérifier la taille (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("Le fichier est trop volumineux (max 10MB)")
        return
      }

      setPdfForm({
        ...pdfForm,
        file: file,
      })
    }
  }

  const handleSavePdf = async () => {
    try {
      if (!pdfForm.title) {
        alert("Veuillez remplir le titre")
        return
      }

      if (!editingPdf && !pdfForm.file) {
        alert("Veuillez sélectionner un fichier PDF")
        return
      }

      let fileData = editingPdf?.fileData || null
      let fileName = editingPdf?.fileName || ""

      // Si un nouveau fichier est sélectionné, le convertir en base64
      if (pdfForm.file) {
        fileData = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target.result)
          reader.onerror = reject
          reader.readAsDataURL(pdfForm.file)
        })
        fileName = pdfForm.file.name
      }

      let newPdfs
      if (editingPdf) {
        // Modifier le PDF existant
        newPdfs = pdfs.map((pdf) =>
          pdf.id === editingPdf.id
            ? {
                ...pdf,
                title: pdfForm.title,
                description: pdfForm.description,
                fileName: fileName,
                fileData: fileData,
                uploadDate: new Date().toISOString(),
              }
            : pdf,
        )
        console.log("✅ PDF modifié")
      } else {
        // Ajouter un nouveau PDF
        const newPdf = {
          id: Math.max(...pdfs.map((pdf) => pdf.id), 0) + 1,
          title: pdfForm.title,
          description: pdfForm.description,
          fileName: fileName,
          fileData: fileData,
          uploadDate: new Date().toISOString(),
        }
        newPdfs = [...pdfs, newPdf]
        console.log("✅ PDF ajouté")
      }

      savePdfs(newPdfs)
      setShowPdfForm(false)
    } catch (error) {
      console.error("❌ Erreur sauvegarde PDF:", error)
      alert("Erreur lors de la sauvegarde du document")
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
      alert("Aucun fichier disponible pour ce document")
    }
  }

  // Affichage de loading
  if (loading) {
    return (
      <div className="admin-dashboard">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #3498db",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              animation: "spin 1s linear infinite",
              marginBottom: "20px",
            }}
          ></div>
          <p>Chargement du dashboard OMAC...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="dashboard-title">
            <div className="dashboard-logo">
              <img src={logoOmac || "/placeholder.svg"} alt="OMAC Logo" />
            </div>
            <div className="title-text">
              <h1>Dashboard OMAC</h1>
              <p>Gestion des événements et ressources multimédias</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-home" onClick={() => navigate("/")}>
              Accueil
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="dashboard-content">
        {/* ✅ MODIFIÉ : Onglets avec le nouvel onglet Documents */}
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === "events" ? "active" : ""}`}
            onClick={() => setActiveTab("events")}
          >
            Événements ({events.length})
          </button>
          <button
            className={`tab-button ${activeTab === "media" ? "active" : ""}`}
            onClick={() => setActiveTab("media")}
          >
            Ressources Multimédias ({medias.length})
          </button>
          <button
            className={`tab-button ${activeTab === "carousel" ? "active" : ""}`}
            onClick={() => setActiveTab("carousel")}
          >
            Carrousel d'Accueil ({carouselImages.length})
          </button>
          <button className={`tab-button ${activeTab === "pdfs" ? "active" : ""}`} onClick={() => setActiveTab("pdfs")}>
            Documents PDF ({pdfs.length})
          </button>
        </div>

        {/* Affichage d'erreur */}
        {error && (
          <div
            style={{
              background: "#fff3cd",
              border: "1px solid #ffeeba",
              borderRadius: "5px",
              padding: "15px",
              margin: "20px 0",
              color: "#856404",
            }}
          >
            <strong>⚠️ {error}</strong>
            <button
              onClick={() => {
                loadEvents()
                loadMedias()
                loadCarouselImages()
                loadPdfs() // ✅ NOUVEAU
              }}
              style={{
                marginLeft: "15px",
                background: "#ffc107",
                border: "none",
                padding: "5px 10px",
                borderRadius: "3px",
              }}
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Contenu des onglets */}
        <div className="tab-content">
          {/* Onglet Events (inchangé) */}
          {activeTab === "events" && (
            <div className="events-section">
              <div className="section-header">
                <h2 className="section-title">Gestion des Événements</h2>
                <button className="btn-add" onClick={handleAddEvent}>
                  + Ajouter un événement
                </button>
              </div>

              {/* Navigation par mois */}
              <div className="month-navigation">
                <div className="month-selector">
                  <button className="month-nav-btn" onClick={() => navigateMonth(-1)}>
                    ←
                  </button>
                  <div className="current-month">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </div>
                  <button className="month-nav-btn" onClick={() => navigateMonth(1)}>
                    →
                  </button>
                </div>

                <div className="month-stats">
                  <div className="stat-item">
                    <span className="stat-label">Ce mois</span>
                    <span className="stat-number">{getTotalStats().currentMonth}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total</span>
                    <span className="stat-number">{getTotalStats().total}</span>
                  </div>
                </div>
              </div>

              {/* Affichage groupé par mois */}
              <div className="items-list">
                {events.length === 0 ? (
                  <div className="empty-state">
                    <h3>Aucun événement</h3>
                    <p>Commencez par ajouter votre premier événement</p>
                    <button className="btn-add" onClick={handleAddEvent}>
                      + Ajouter un événement
                    </button>
                  </div>
                ) : (
                  (() => {
                    const groupedEvents = groupEventsByMonth()
                    const sortedMonthKeys = Object.keys(groupedEvents).sort().reverse()

                    return sortedMonthKeys.map((monthKey) => {
                      const monthData = groupedEvents[monthKey]
                      const isCollapsed = collapsedMonths.has(monthKey)

                      return (
                        <div key={monthKey} className="month-group">
                          <div className="month-group-header" onClick={() => toggleMonthCollapse(monthKey)}>
                            <h3 className="month-group-title">
                              {monthNames[monthData.month]} {monthData.year}
                            </h3>
                            <div className="month-group-info">
                              <span className="month-group-count">
                                {monthData.events.length} événement{monthData.events.length > 1 ? "s" : ""}
                              </span>
                              <button className={`month-group-toggle ${isCollapsed ? "collapsed" : ""}`}>▼</button>
                            </div>
                          </div>

                          <div className={`month-events ${isCollapsed ? "collapsed" : ""}`}>
                            {monthData.events.map((event) => (
                              <div key={event.id} className="item-card">
                                <div className="event-date-badge">
                                  {new Date(event.date).getDate()}{" "}
                                  {monthNames[new Date(event.date).getMonth()].slice(0, 3)}
                                </div>
                                <div className="item-header">
                                  <div>
                                    <h3 className="item-title">{event.title}</h3>
                                    <p className="item-meta">
                                      {event.time} • {event.location}
                                    </p>
                                  </div>
                                  <div className="item-actions">
                                    <button className="btn-edit" onClick={() => handleEditEvent(event)}>
                                      Modifier
                                    </button>
                                    <button className="btn-delete" onClick={() => handleDeleteEvent(event.id)}>
                                      Supprimer
                                    </button>
                                  </div>
                                </div>
                                <p className="item-description">{event.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })
                  })()
                )}
              </div>
            </div>
          )}

          {/* Onglet Media (inchangé) */}
          {activeTab === "media" && (
            <div className="media-section">
              <div className="section-header">
                <h2 className="section-title">Gestion des Ressources Multimédias</h2>
                <button className="btn-add" onClick={handleAddMedia}>
                  + Ajouter une ressource
                </button>
              </div>

              <div className="items-list">
                {medias.length === 0 ? (
                  <div className="empty-state">
                    <h3>Aucune ressource multimédia</h3>
                    <p>Commencez par ajouter votre première ressource</p>
                    <button className="btn-add" onClick={handleAddMedia}>
                      + Ajouter une ressource
                    </button>
                  </div>
                ) : (
                  medias.map((media) => (
                    <div key={media.id} className="item-card">
                      <div className="item-header">
                        <div>
                          <h3 className="item-title">{media.title}</h3>
                          <p className="item-meta">Vidéo YouTube</p>
                        </div>
                        <div className="item-actions">
                          <button className="btn-edit" onClick={() => handleEditMedia(media)}>
                            Modifier
                          </button>
                          <button className="btn-delete" onClick={() => handleDeleteMedia(media.id)}>
                            Supprimer
                          </button>
                        </div>
                      </div>
                      <p className="item-description">{media.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Onglet Carrousel (inchangé) */}
          {activeTab === "carousel" && (
            <div className="carousel-section">
              <div className="section-header">
                <h2 className="section-title">Gestion du Carrousel d'Accueil</h2>
                <button className="btn-add" onClick={handleAddCarouselImage}>
                  + Ajouter une image
                </button>
              </div>

              <div className="items-list">
                {carouselImages.length === 0 ? (
                  <div className="empty-state">
                    <h3>Aucune image dans le carrousel</h3>
                    <p>Commencez par ajouter votre première image</p>
                    <button className="btn-add" onClick={handleAddCarouselImage}>
                      + Ajouter une image
                    </button>
                  </div>
                ) : (
                  carouselImages.map((image) => (
                    <div key={image.id} className="item-card carousel-image-card">
                      <div className="carousel-image-preview">
                        <img
                          src={image.src || "/placeholder.svg"}
                          alt={image.alt}
                          style={{
                            width: "100px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      </div>
                      <div className="item-header">
                        <div>
                          <h3 className="item-title">{image.title || "Sans titre"}</h3>
                          <p className="item-meta">{image.alt}</p>
                        </div>
                        <div className="item-actions">
                          <button className="btn-edit" onClick={() => handleEditCarouselImage(image)}>
                            Modifier
                          </button>
                          <button className="btn-delete" onClick={() => handleDeleteCarouselImage(image.id)}>
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ✅ NOUVEAU : Onglet Documents PDF */}
          {activeTab === "pdfs" && (
            <div className="pdfs-section">
              <div className="section-header">
                <h2 className="section-title">Gestion du PDF - On vous propose</h2>
                <button className="btn-add" onClick={handleAddPdf}>
                  + Ajouter un document
                </button>
              </div>

              <div className="items-list">
                {pdfs.length === 0 ? (
                  <div className="empty-state">
                    <h3>Aucun document PDF</h3>
                    <p>Commencez par ajouter votre premier document</p>
                    <button className="btn-add" onClick={handleAddPdf}>
                      + Ajouter un document
                    </button>
                  </div>
                ) : (
                  pdfs.map((pdf) => (
                    <div key={pdf.id} className="item-card pdf-card">
                      <div className="pdf-icon">📄</div>
                      <div className="item-header">
                        <div>
                          <h3 className="item-title">{pdf.title}</h3>
                          <p className="item-meta">
                            {pdf.fileName} • Ajouté le {new Date(pdf.uploadDate).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <div className="item-actions">
                          <button className="btn-edit" onClick={() => handleEditPdf(pdf)}>
                            Modifier
                          </button>
                          <button className="btn-delete" onClick={() => handleDeletePdf(pdf.id)}>
                            Supprimer
                          </button>
                        </div>
                      </div>
                      {pdf.description && <p className="item-description">{pdf.description}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Formulaire d'événement (inchangé) */}
      {showEventForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <div className="form-header">
              <h3 className="form-title">{editingEvent ? "Modifier l'événement" : "Ajouter un événement"}</h3>
              <button className="form-close" onClick={() => setShowEventForm(false)}>
                ×
              </button>
            </div>
            <div className="form-body">
              <div className="form-group">
                <label className="form-label">Titre de l'événement</label>
                <input
                  type="text"
                  className="form-input"
                  value={eventForm.titre}
                  onChange={(e) => setEventForm({ ...eventForm, titre: e.target.value })}
                  placeholder="Ex: Atelier de peinture"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date et heure de début</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={eventForm.date_debut}
                  onChange={(e) => setEventForm({ ...eventForm, date_debut: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date et heure de fin</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={eventForm.date_fin}
                  onChange={(e) => setEventForm({ ...eventForm, date_fin: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <input
                    type="checkbox"
                    checked={eventForm.toute_la_journee}
                    onChange={(e) => setEventForm({ ...eventForm, toute_la_journee: e.target.checked })}
                  />
                  Événement toute la journée
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">Couleur</label>
                <input
                  type="color"
                  className="form-input"
                  value={eventForm.couleur}
                  onChange={(e) => setEventForm({ ...eventForm, couleur: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Décrivez l'événement..."
                />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn-cancel" onClick={() => setShowEventForm(false)}>
                Annuler
              </button>
              <button className="btn-save" onClick={handleSaveEvent}>
                {editingEvent ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire de média pour YouTube (inchangé) */}
      {showMediaForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <div className="form-header">
              <h3 className="form-title">{editingMedia ? "Modifier la ressource" : "Ajouter une ressource"}</h3>
              <button className="form-close" onClick={() => setShowMediaForm(false)}>
                ×
              </button>
            </div>
            <div className="form-body">
              <div className="form-group">
                <label className="form-label">Titre</label>
                <input
                  type="text"
                  className="form-input"
                  value={mediaForm.titre}
                  onChange={(e) => setMediaForm({ ...mediaForm, titre: e.target.value })}
                  placeholder="Ex: Atelier de danse pour enfants"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={mediaForm.description}
                  onChange={(e) => setMediaForm({ ...mediaForm, description: e.target.value })}
                  placeholder="Décrivez la ressource multimédia..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">URL ou ID YouTube</label>
                <input
                  type="text"
                  className="form-input"
                  value={mediaForm.youtubeId}
                  onChange={(e) => setMediaForm({ ...mediaForm, youtubeId: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=... ou ID direct"
                />
                <p style={{ fontSize: "0.875rem", color: "#666", margin: "0.5rem 0 0 0" }}>
                  Vous pouvez coller l'URL complète ou juste l'ID de la vidéo
                </p>
              </div>
            </div>
            <div className="form-actions">
              <button className="btn-cancel" onClick={() => setShowMediaForm(false)}>
                Annuler
              </button>
              <button className="btn-save" onClick={handleSaveMedia}>
                {editingMedia ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire pour les images du carrousel (inchangé) */}
      {showCarouselForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <div className="form-header">
              <h3 className="form-title">{editingCarouselImage ? "Modifier l'image" : "Ajouter une image"}</h3>
              <button className="form-close" onClick={() => setShowCarouselForm(false)}>
                ×
              </button>
            </div>
            <div className="form-body">
              <div className="form-group">
                <label className="form-label">Titre (optionnel)</label>
                <input
                  type="text"
                  className="form-input"
                  value={carouselForm.title}
                  onChange={(e) => setCarouselForm({ ...carouselForm, title: e.target.value })}
                  placeholder="Ex: Notre équipe dévouée"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Texte alternatif *</label>
                <input
                  type="text"
                  className="form-input"
                  value={carouselForm.alt}
                  onChange={(e) => setCarouselForm({ ...carouselForm, alt: e.target.value })}
                  placeholder="Description de l'image pour l'accessibilité"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">{editingCarouselImage ? "Nouvelle image (optionnel)" : "Image *"}</label>
                <div className="file-input-container">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input"
                    id="carousel-file-input"
                    ref={fileInputRef}
                  />
                  <label htmlFor="carousel-file-input" className="file-input-label">
                    📁 {carouselForm.file ? carouselForm.file.name : "Choisir une image"}
                  </label>
                </div>
                <p style={{ fontSize: "0.875rem", color: "#666", margin: "0.5rem 0 0 0" }}>
                  Formats acceptés: JPG, PNG, GIF, WebP (max 5MB)
                </p>
              </div>

              {/* Prévisualisation de l'image actuelle lors de l'édition */}
              {editingCarouselImage && (
                <div className="form-group">
                  <label className="form-label">Image actuelle</label>
                  <img
                    src={editingCarouselImage.src || "/placeholder.svg"}
                    alt={editingCarouselImage.alt}
                    style={{
                      width: "200px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                </div>
              )}
            </div>
            <div className="form-actions">
              <button className="btn-cancel" onClick={() => setShowCarouselForm(false)}>
                Annuler
              </button>
              <button className="btn-save" onClick={handleSaveCarouselImage}>
                {editingCarouselImage ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ NOUVEAU : Formulaire pour les PDFs */}
      {showPdfForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <div className="form-header">
              <h3 className="form-title">{editingPdf ? "Modifier le document" : "Ajouter un document"}</h3>
              <button className="form-close" onClick={() => setShowPdfForm(false)}>
                ×
              </button>
            </div>
            <div className="form-body">
              <div className="form-group">
                <label className="form-label">Titre *</label>
                <input
                  type="text"
                  className="form-input"
                  value={pdfForm.title}
                  onChange={(e) => setPdfForm({ ...pdfForm, title: e.target.value })}
                  placeholder="Ex: Guide des activités OMAC"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={pdfForm.description}
                  onChange={(e) => setPdfForm({ ...pdfForm, description: e.target.value })}
                  placeholder="Description du document..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">{editingPdf ? "Nouveau fichier (optionnel)" : "Fichier PDF *"}</label>
                <div className="file-input-container">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfFileChange}
                    className="file-input"
                    id="pdf-file-input"
                    ref={pdfInputRef}
                  />
                  <label htmlFor="pdf-file-input" className="file-input-label">
                    📄 {pdfForm.file ? pdfForm.file.name : "Choisir un fichier PDF"}
                  </label>
                </div>
                <p style={{ fontSize: "0.875rem", color: "#666", margin: "0.5rem 0 0 0" }}>
                  Format accepté: PDF (max 10MB)
                </p>
              </div>

              {/* Affichage du fichier actuel lors de l'édition */}
              {editingPdf && (
                <div className="form-group">
                  <label className="form-label">Fichier actuel</label>
                  <div
                    style={{
                      padding: "10px",
                      background: "#f8f9fa",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span>📄</span>
                    <span>{editingPdf.fileName}</span>
                    {editingPdf.fileData && (
                      <button
                        type="button"
                        className="btn-download"
                        onClick={() => handleDownloadPdf(editingPdf)}
                        style={{ marginLeft: "auto" }}
                      >
                        Télécharger
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="form-actions">
              <button className="btn-cancel" onClick={() => setShowPdfForm(false)}>
                Annuler
              </button>
              <button className="btn-save" onClick={handleSavePdf}>
                {editingPdf ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS pour l'animation et les nouveaux styles */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .carousel-image-card {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .carousel-image-preview {
          flex-shrink: 0;
        }
        
        .pdf-card {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .pdf-icon {
          flex-shrink: 0;
          font-size: 24px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .file-input-container {
          position: relative;
        }
        
        .file-input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
        
        .file-input-label {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 15px;
          border: 2px dashed #ddd;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }
        
        .file-input-label:hover {
          border-color: #27ae60;
          background: #f0f8f0;
        }
        
        .btn-download {
          background: #28a745;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 3px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        
        .btn-download:hover {
          background: #218838;
        }
        
        .btn-view {
          background: #17a2b8;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 3px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        
        .btn-view:hover {
          background: #138496;
        }
      `}</style>
    </div>
  )
}

export default AdminDashboard
