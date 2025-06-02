// src/services/api.js - Service API pour connecter React à SiteGround

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // En production sur SiteGround, même domaine
  : 'http://localhost:3001/api';  // En développement local

class ApiService {
  
  // ===============================================
  // GESTION DES ÉVÉNEMENTS
  // ===============================================
  
  static async getEvents() {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const events = await response.json();
      return events;
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
      throw error;
    }
  }

  static async createEvent(eventData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
      throw error;
    }
  }

  static async updateEvent(eventId, eventData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la modification');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la modification de l\'événement:', error);
      throw error;
    }
  }

  static async deleteEvent(eventId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
      throw error;
    }
  }

  // ===============================================
  // AUTHENTIFICATION ADMIN
  // ===============================================
  
  static async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur de connexion');
      }
      
      const data = await response.json();
      
      // Stocker le token et les infos admin dans localStorage
      if (data.token) {
        localStorage.setItem('omac_token', data.token);
        localStorage.setItem('omac_admin', JSON.stringify(data.admin));
      }
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  static async logout() {
    try {
      const token = localStorage.getItem('omac_token');
      
      if (token) {
        // Appel API pour blacklister le token
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('🔄 Déconnexion côté serveur...');
      }
    } catch (error) {
      console.error('⚠️ Erreur déconnexion serveur (non bloquante):', error);
    } finally {
      // TOUJOURS supprimer les données locales
      localStorage.removeItem('omac_token');
      localStorage.removeItem('omac_admin');
      console.log('✅ Session locale nettoyée');
    }
  }

  static async changePassword(passwords, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwords)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors du changement de mot de passe');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      throw error;
    }
  }

  // ===============================================
  // UTILITAIRES
  // ===============================================
  
  // Vérifier si l'utilisateur est connecté (version améliorée)
  static isAuthenticated() {
    const token = localStorage.getItem('omac_token');
    const adminData = localStorage.getItem('omac_admin');
    
    if (!token || !adminData) {
      return false;
    }
    
    try {
      // Vérifier que le token n'est pas expiré
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      
      if (payload.exp < now) {
        console.log('🕰️ Token expiré, suppression...');
        localStorage.removeItem('omac_token');
        localStorage.removeItem('omac_admin');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('❌ Erreur vérification token:', error);
      localStorage.removeItem('omac_token');
      localStorage.removeItem('omac_admin');
      return false;
    }
  }

  // Récupérer le token
  static getToken() {
    return localStorage.getItem('omac_token');
  }

  // Récupérer les infos admin
  static getAdmin() {
    const adminData = localStorage.getItem('omac_admin');
    return adminData ? JSON.parse(adminData) : null;
  }

  // Test de connexion à l'API
  static async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Connexion API réussie:', data);
        return data;
      } else {
        console.error('❌ Erreur de connexion API');
        return null;
      }
    } catch (error) {
      console.error('❌ Impossible de se connecter à l\'API:', error);
      return null;
    }
  }
}

export default ApiService;