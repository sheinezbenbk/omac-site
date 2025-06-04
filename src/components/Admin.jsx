"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ApiService from "../services/api"
import logoOmac from "../assets/omac-logo.png"

const Admin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    mot_de_passe: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  // Styles intégrés
  const styles = {
    adminPage: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #3498db 0%, #8DC540 50%, #f7be00 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "'Poppins', sans-serif",
      position: "relative",
      overflow: "hidden",
    },
    loginContainer: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderRadius: "20px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      width: "100%",
      maxWidth: "600px",
      padding: "50px",
      position: "relative",
      overflow: "hidden",
    },
    loginHeader: {
      textAlign: "center",
      marginBottom: "40px",
    },
    adminLogo: {
      width: "90px",
      height: "90px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 20px",
      overflow: "hidden",
      boxShadow: "0 8px 25px rgba(52, 152, 219, 0.3)",
      background: "white",
      border: "3px solid #f0f0f0",
    },
    logoImg: {
      width: "70px",
      height: "70px",
      objectFit: "contain",
    },
    loginTitle: {
      color: "#333",
      fontSize: "28px",
      fontWeight: "600",
      margin: "0 0 8px 0",
    },
    loginSubtitle: {
      color: "#666",
      fontSize: "16px",
      margin: "0",
      fontWeight: "400",
    },
    defaultCredentials: {
      background: "#e8f4fd",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "20px",
      border: "1px solid #bee5eb",
    },
    credentialsTitle: {
      margin: "0 0 10px 0",
      color: "#0c5460",
      fontSize: "16px",
    },
    credentialsText: {
      margin: "5px 0",
      fontSize: "14px",
    },
    credentialsSmall: {
      color: "#6c757d",
      fontSize: "12px",
    },
    errorMessage: {
      background: "#ffe6e6",
      color: "#e74c3c",
      padding: "12px 16px",
      borderRadius: "8px",
      fontSize: "14px",
      borderLeft: "4px solid #e74c3c",
      marginBottom: "20px",
    },
    loginForm: {
      display: "flex",
      flexDirection: "column",
      gap: "25px",
    },
    formGroup: {
      position: "relative",
    },
    formLabel: {
      display: "block",
      color: "#555",
      fontSize: "14px",
      fontWeight: "500",
      marginBottom: "8px",
    },
    formInput: {
      width: "100%",
      padding: "15px 20px",
      border: "2px solid #e1e8ed",
      borderRadius: "12px",
      fontSize: "16px",
      background: "#f8f9fa",
      transition: "all 0.3s ease",
      fontFamily: "'Poppins', sans-serif",
      boxSizing: "border-box",
    },
    formInputError: {
      borderColor: "#e74c3c",
      backgroundColor: "#ffe6e6",
    },
    loginOptions: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      margin: "10px 0",
      flexWrap: "wrap",
      gap: "10px",
    },
    rememberMe: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#666",
      fontSize: "14px",
    },
    rememberCheckbox: {
      width: "18px",
      height: "18px",
      cursor: "pointer",
    },
    forgotPassword: {
      color: "#3498db",
      background: "none",
      border: "none",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      textDecoration: "underline",
    },
    loginButton: {
      background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      padding: "16px 30px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginTop: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    loginButtonDisabled: {
      background: "#bdc3c7",
      cursor: "not-allowed",
    },
    loading: {
      display: "inline-block",
      width: "20px",
      height: "20px",
      border: "2px solid rgba(255,255,255,0.3)",
      borderRadius: "50%",
      borderTopColor: "white",
      animation: "spin 1s linear infinite",
    },
    // Nouveau style pour le bouton retour à l'accueil
    backToHomeButton: {
      background: "linear-gradient(135deg, #8DC540 0%, #6ab04c 100%)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      padding: "14px 30px",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginTop: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      width: "100%",
    },
    backToHomeButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 25px rgba(141, 197, 64, 0.4)",
    },
    buttonsContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      marginTop: "20px",
    },
  }

  // États pour les effets hover
  const [isBackButtonHovered, setIsBackButtonHovered] = useState(false)

  // Vérification d'authentification au chargement
  useEffect(() => {
    console.log("🔍 État de la connexion au chargement:", {
      hasToken: !!localStorage.getItem("omac_token"),
      isAuthenticated: ApiService ? ApiService.isAuthenticated() : "ApiService non disponible",
      currentPath: window.location.pathname,
    })

    if (ApiService && ApiService.isAuthenticated()) {
      console.log("👤 Utilisateur déjà connecté, redirection automatique vers dashboard...")
      navigate("/admin/dashboard", { replace: true })
    }
  }, [navigate])

  // Gestion du retour à l'accueil
  const handleBackToHome = () => {
    console.log("🏠 Retour à l'accueil")
    navigate("/")
  }

  // Gestion des changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }

    if (loginError) {
      setLoginError("")
    }
  }

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = "Le nom d'utilisateur est requis"
    }

    if (!formData.mot_de_passe) {
      newErrors.mot_de_passe = "Le mot de passe est requis"
    } else if (formData.mot_de_passe.length < 6) {
      newErrors.mot_de_passe = "Le mot de passe doit contenir au moins 6 caractères"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Gestion de la soumission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoginError("")

    console.log("🟡 Début handleSubmit")

    if (!validateForm()) {
      console.log("❌ Validation échouée")
      return
    }

    setIsLoading(true)

    try {
      console.log("🔄 Tentative de connexion...", {
        username: formData.username,
        password: "***",
      })

      if (!ApiService || !ApiService.login) {
        throw new Error("ApiService non disponible")
      }

      const response = await ApiService.login({
        username: formData.username,
        mot_de_passe: formData.mot_de_passe,
      })

      console.log("✅ Connexion réussie:", response)

      if (formData.rememberMe) {
        localStorage.setItem("omac_remember_user", formData.username)
      }

      console.log("🔄 Redirection vers dashboard...")
      navigate("/admin/dashboard")
    } catch (error) {
      console.error("❌ Erreur complète de connexion:", error)

      if (error.message && error.message.includes("Identifiants invalides")) {
        setLoginError("Nom d'utilisateur ou mot de passe incorrect")
      } else if (error.message && error.message.includes("Erreur de connexion")) {
        setLoginError("Problème de connexion au serveur. Vérifiez votre connexion internet.")
      } else if (error.message && error.message.includes("ApiService non disponible")) {
        setLoginError("Erreur technique : Service API non disponible")
      } else {
        setLoginError(`Erreur technique : ${error.message || "Erreur inconnue"}`)
      }
    } finally {
      setIsLoading(false)
      console.log("🟡 Fin handleSubmit")
    }
  }

  // Charger les données sauvegardées au chargement
  useEffect(() => {
    const rememberedUser = localStorage.getItem("omac_remember_user")
    if (rememberedUser) {
      setFormData((prev) => ({
        ...prev,
        username: rememberedUser,
        rememberMe: true,
      }))
    }
  }, [])

  // Gestion du "Mot de passe oublié"
  const handleForgotPassword = () => {
    alert(
      "Pour réinitialiser votre mot de passe, contactez l'administrateur système de l'OMAC.\n\nEmail: omac.torcy77@gmail.com\nTéléphone: 01 60 31 31 01",
    )
  }

  return (
    <div style={styles.adminPage}>
      {/* Conteneur de connexion */}
      <div style={styles.loginContainer}>
        {/* Header */}
        <div style={styles.loginHeader}>
          <div style={styles.adminLogo}>
            <img src={logoOmac || "/placeholder.svg"} alt="Logo OMAC" style={styles.logoImg} />
          </div>
          <h1 style={styles.loginTitle}>Administration OMAC</h1>
          <p style={styles.loginSubtitle}>Connectez-vous pour gérer le site</p>
        </div>

        
        {/* Message d'erreur général */}
        {loginError && <div style={styles.errorMessage}>{loginError}</div>}

        {/* Formulaire de connexion */}
        <form style={styles.loginForm} onSubmit={handleSubmit}>
          {/* Nom d'utilisateur */}
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.formLabel}>
              Nom d'utilisateur
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              style={{
                ...styles.formInput,
                ...(errors.username ? styles.formInputError : {}),
              }}
              placeholder="admin"
              autoComplete="username"
              disabled={isLoading}
            />
            {errors.username && <span style={styles.errorMessage}>{errors.username}</span>}
          </div>

          {/* Mot de passe */}
          <div style={styles.formGroup}>
            <label htmlFor="mot_de_passe" style={styles.formLabel}>
              Mot de passe
            </label>
            <input
              type="password"
              id="mot_de_passe"
              name="mot_de_passe"
              value={formData.mot_de_passe}
              onChange={handleInputChange}
              style={{
                ...styles.formInput,
                ...(errors.mot_de_passe ? styles.formInputError : {}),
              }}
              placeholder="omac77200"
              autoComplete="current-password"
              disabled={isLoading}
            />
            {errors.mot_de_passe && <span style={styles.errorMessage}>{errors.mot_de_passe}</span>}
          </div>

          {/* Options de connexion */}
          <div style={styles.loginOptions}>
            <label style={styles.rememberMe}>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                style={styles.rememberCheckbox}
                disabled={isLoading}
              />
              Se souvenir de moi
            </label>

            
          </div>

          {/* Conteneur des boutons */}
          <div style={styles.buttonsContainer}>
            {/* Bouton de connexion */}
            <button
              type="submit"
              style={{
                ...styles.loginButton,
                ...(isLoading ? styles.loginButtonDisabled : {}),
              }}
              disabled={isLoading}
            >
              {isLoading && <div style={styles.loading}></div>}
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>

            {/* Bouton retour à l'accueil */}
            <button
              type="button"
              onClick={handleBackToHome}
              style={{
                ...styles.backToHomeButton,
                ...(isBackButtonHovered ? styles.backToHomeButtonHover : {}),
              }}
              onMouseEnter={() => setIsBackButtonHovered(true)}
              onMouseLeave={() => setIsBackButtonHovered(false)}
              disabled={isLoading}
            >
              Retour à l'accueil
            </button>
          </div>
        </form>
      </div>

      {/* CSS pour l'animation de rotation */}
      <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
    </div>
  )
}

export default Admin
