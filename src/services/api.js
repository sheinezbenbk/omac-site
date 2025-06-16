
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://backend-enq3u5yiw-sheinezbenbks-projects.vercel.app/api" // Production (Vercel)
    : "http://localhost:3001/api" // Développement (backend en local)

class ApiService { 
  
  // ===============================================
  // GESTION DES ÉVÉNEMENTS
  // ===============================================

  static async getEvents() {
    try {
      console.log("🔄 Chargement des événements depuis:", `${API_BASE_URL}/events`)

      const response = await fetch(`${API_BASE_URL}/events`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("📡 Réponse events:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const events = await response.json()
      console.log("✅ Événements chargés:", events.length || 0)
      return events
    } catch (error) {
      console.error("❌ Erreur lors du chargement des événements:", error)
      throw error
    }
  }

  static async createEvent(eventData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de la création")
      }

      return await response.json()
    } catch (error) {
      console.error("Erreur lors de la création de l'événement:", error)
      throw error
    }
  }

  static async updateEvent(eventId, eventData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de la modification")
      }

      return await response.json()
    } catch (error) {
      console.error("Erreur lors de la modification de l'événement:", error)
      throw error
    }
  }

  static async deleteEvent(eventId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de la suppression")
      }

      return await response.json()
    } catch (error) {
      console.error("Erreur lors de la suppression de l'événement:", error)
      throw error
    }
  }

  // ===============================================
  // AUTHENTIFICATION ADMIN
  // ===============================================

  static async login(credentials) {
    try {
      console.log("🔄 Tentative de connexion à:", `${API_BASE_URL}/auth/login`)
      console.log("🌍 Environnement:", process.env.NODE_ENV || "development")

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      console.log("📡 Réponse serveur:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
      })

      if (!response.ok) {
        let errorMessage = "Erreur de connexion"

        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (parseError) {
          console.error("Erreur parsing réponse:", parseError)
          if (response.status === 401) {
            errorMessage = "Identifiants invalides"
          } else if (response.status >= 500) {
            errorMessage = "Erreur serveur"
          } else if (response.status === 404) {
            errorMessage = "Route non trouvée - Vérifiez votre backend"
          }
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log("✅ Données reçues:", { hasToken: !!data.token, hasAdmin: !!data.admin })

      // Stocker le token et les infos admin dans localStorage
      if (data.token) {
        localStorage.setItem("omac_token", data.token)
        localStorage.setItem("omac_admin", JSON.stringify(data.admin))
        console.log("💾 Token et données admin sauvegardés")
      }

      return data
    } catch (error) {
      console.error("❌ Erreur lors de la connexion:", error)

      // Améliorer les messages d'erreur
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error("Erreur de connexion - Vérifiez que votre backend local tourne sur localhost:3001")
      }

      throw error
    }
  }

  static async logout() {
    try {
      const token = localStorage.getItem("omac_token")

      if (token) {
        // Appel API pour blacklister le token
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log("🔄 Déconnexion côté serveur...")
      }
    } catch (error) {
      console.error("⚠️ Erreur déconnexion serveur (non bloquante):", error)
    } finally {
      // TOUJOURS supprimer les données locales
      localStorage.removeItem("omac_token")
      localStorage.removeItem("omac_admin")
      localStorage.removeItem("omac_remember_user")
      console.log("✅ Session locale nettoyée")
    }
  }

  static async changePassword(passwords, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwords),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors du changement de mot de passe")
      }

      return await response.json()
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error)
      throw error
    }
  }

  // ===============================================
  // UTILITAIRES
  // ===============================================

  static isAuthenticated() {
    const token = localStorage.getItem("omac_token")
    const adminData = localStorage.getItem("omac_admin")

    if (!token || !adminData) {
      console.log("🔍 Pas de token ou données admin")
      return false
    }

    try {
      // Vérifier que le token n'est pas expiré
      const payload = JSON.parse(atob(token.split(".")[1]))
      const now = Date.now() / 1000

      if (payload.exp < now) {
        console.log("🕰️ Token expiré, suppression...")
        localStorage.removeItem("omac_token")
        localStorage.removeItem("omac_admin")
        return false
      }

      console.log("✅ Token valide")
      return true
    } catch (error) {
      console.error("❌ Erreur vérification token:", error)
      localStorage.removeItem("omac_token")
      localStorage.removeItem("omac_admin")
      return false
    }
  }

  static getToken() {
    return localStorage.getItem("omac_token")
  }

  static getAdmin() {
    const adminData = localStorage.getItem("omac_admin")
    return adminData ? JSON.parse(adminData) : null
  }

  // Test de connexion à l'API
  static async testConnection() {
    try {
      console.log("🔍 Test de connexion à:", `${API_BASE_URL}/health`)
      console.log("🌍 Environnement détecté:", process.env.NODE_ENV || "development")

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 secondes timeout

      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Connexion API réussie:", data)
        return data
      } else {
        console.error("❌ Erreur de connexion API:", response.status, response.statusText)
        return null
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("❌ Timeout de connexion à l'API")
      } else {
        console.error("❌ Impossible de se connecter à l'API:", error)
      }
      return null
    }
  }

  // Nouvelle méthode pour diagnostiquer la configuration
  static getApiConfig() {
    return {
      baseUrl: API_BASE_URL,
      environment: process.env.NODE_ENV || "development",
      isLocal: API_BASE_URL.includes("localhost"),
      isProduction: process.env.NODE_ENV === "production",
    }
  }
}

export default ApiService
