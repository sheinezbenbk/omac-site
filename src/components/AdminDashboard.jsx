import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import './AdminDashboard.css';
import logoOmac from '../assets/omac-logo.png';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');
  const [showEventForm, setShowEventForm] = useState(false);
  const [showMediaForm, setShowMediaForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingMedia, setEditingMedia] = useState(null);
  
  // États pour la navigation par mois
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [collapsedMonths, setCollapsedMonths] = useState(new Set());
  
  // États pour les événements de la BDD
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ MODIFIÉ : États pour les médias YouTube (localStorage)
  const [medias, setMedias] = useState([]);
  const [loadingMedias, setLoadingMedias] = useState(false);

  // Formulaire d'événement pour la BDD
  const [eventForm, setEventForm] = useState({
    titre: '',
    description: '',
    date_debut: '',
    date_fin: '',
    couleur: '#3498db',
    toute_la_journee: false
  });

  // ✅ MODIFIÉ : Formulaire de média pour YouTube
  const [mediaForm, setMediaForm] = useState({
    titre: '',
    description: '',
    youtubeId: ''
  });

  // Charger les données au montage
  useEffect(() => {
    checkAuthAndLoadData();
  }, [navigate]);

  const checkAuthAndLoadData = async () => {
    // Vérifier l'authentification
    if (!ApiService.isAuthenticated()) {
      console.log('❌ Pas d\'authentification valide, redirection vers login');
      navigate('/admin');
      return;
    }

    // Vérifier que l'admin existe toujours
    const adminData = ApiService.getAdmin();
    if (!adminData) {
      console.log('❌ Données admin manquantes, redirection vers login');
      navigate('/admin');
      return;
    }

    console.log('✅ Admin connecté:', adminData.username);
    
    // Charger les événements ET les médias
    await loadEvents();
    loadMedias(); // ✅ MODIFIÉ : Plus async car localStorage
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Chargement des événements...');
      const eventsData = await ApiService.getEvents();
      
      // Transformer les données pour votre interface existante
      const formattedEvents = eventsData.map(event => {
        const startDate = new Date(event.date_debut);
        const endDate = new Date(event.date_fin);
        
        return {
          id: event.id,
          title: event.titre,
          date: startDate.toISOString().split('T')[0],
          time: event.toute_la_journee 
            ? 'Toute la journée' 
            : `${startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
          location: "OMAC Torcy",
          description: event.description || 'Événement OMAC',
          image: "/api/placeholder/400/300",
          couleur: event.couleur,
          // Données originales pour l'édition
          date_debut: event.date_debut,
          date_fin: event.date_fin,
          toute_la_journee: event.toute_la_journee
        };
      });
      
      setEvents(formattedEvents);
      console.log('✅ Événements chargés:', formattedEvents);
      
    } catch (err) {
      console.error('❌ Erreur chargement événements:', err);
      setError('Impossible de charger les événements');
    } finally {
      setLoading(false);
    }
  };

  // ✅ MODIFIÉ : Fonction loadMedias pour localStorage
  const loadMedias = () => {
    try {
      setLoadingMedias(true);
      
      console.log('🔄 Chargement des médias depuis localStorage...');
      const saved = localStorage.getItem('omac_youtube_videos');
      
      let mediasData = [];
      if (saved) {
        mediasData = JSON.parse(saved);
      } else {
        // Données par défaut
        mediasData = [
          {
            id: 1,
            titre: 'Atelier de danse pour enfants',
            description: 'Découvrez nos ateliers de danse créative pour les plus jeunes.',
            youtubeId: 'dQw4w9WgXcQ'
          }
        ];
        localStorage.setItem('omac_youtube_videos', JSON.stringify(mediasData));
      }
      
      // Transformer les données pour votre interface existante
      const formattedMedias = mediasData.map(media => ({
        id: media.id,
        type: 'video',
        title: media.titre,
        description: media.description,
        thumbnail: `https://img.youtube.com/vi/${media.youtubeId}/maxresdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${media.youtubeId}`,
        youtubeId: media.youtubeId
      }));
      
      setMedias(formattedMedias);
      console.log('✅ Médias chargés:', formattedMedias);
      
    } catch (err) {
      console.error('❌ Erreur chargement médias:', err);
      setError('Impossible de charger les médias');
    } finally {
      setLoadingMedias(false);
    }
  };

  // ✅ MODIFIÉ : Fonction pour sauvegarder dans localStorage
  const saveMediasToStorage = (newMedias) => {
    try {
      const dataToSave = newMedias.map(media => ({
        id: media.id,
        titre: media.title,
        description: media.description,
        youtubeId: media.youtubeId
      }));
      localStorage.setItem('omac_youtube_videos', JSON.stringify(dataToSave));
      loadMedias(); // Recharger les données
    } catch (error) {
      console.error('❌ Erreur sauvegarde médias:', error);
    }
  };

  // ✅ MODIFIÉ : Fonction pour extraire l'ID YouTube
  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  // FONCTIONS POUR LA GESTION DES MOIS (inchangées)
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
                     "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  const groupEventsByMonth = () => {
    const grouped = {};
    
    events.forEach(event => {
      const eventDate = new Date(event.date);
      const monthKey = `${eventDate.getFullYear()}-${eventDate.getMonth()}`;
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          year: eventDate.getFullYear(),
          month: eventDate.getMonth(),
          events: []
        };
      }
      
      grouped[monthKey].events.push(event);
    });

    Object.keys(grouped).forEach(monthKey => {
      grouped[monthKey].events.sort((a, b) => new Date(a.date) - new Date(b.date));
    });

    return grouped;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  const getCurrentMonthEvents = () => {
    const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`;
    const grouped = groupEventsByMonth();
    return grouped[monthKey]?.events || [];
  };

  const toggleMonthCollapse = (monthKey) => {
    const newCollapsed = new Set(collapsedMonths);
    if (newCollapsed.has(monthKey)) {
      newCollapsed.delete(monthKey);
    } else {
      newCollapsed.add(monthKey);
    }
    setCollapsedMonths(newCollapsed);
  };

  const getTotalStats = () => {
    const currentMonthEvents = getCurrentMonthEvents();
    return {
      total: events.length,
      currentMonth: currentMonthEvents.length
    };
  };

  // Gestion de la déconnexion
  const handleLogout = async () => {
    try {
      await ApiService.logout();
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
    navigate('/admin');
  };

  // Gestion des événements (inchangées)
  const handleAddEvent = () => {
    setEditingEvent(null);
    setEventForm({
      titre: '',
      description: '',
      date_debut: '',
      date_fin: '',
      couleur: '#3498db',
      toute_la_journee: false
    });
    setShowEventForm(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      titre: event.title,
      description: event.description,
      date_debut: event.date_debut,
      date_fin: event.date_fin,
      couleur: event.couleur || '#3498db',
      toute_la_journee: event.toute_la_journee || false
    });
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        const token = ApiService.getToken();
        await ApiService.deleteEvent(eventId, token);
        await loadEvents();
        console.log('✅ Événement supprimé');
      } catch (error) {
        console.error('❌ Erreur suppression:', error);
        alert('Erreur lors de la suppression de l\'événement');
      }
    }
  };

  const handleSaveEvent = async () => {
    try {
      const token = ApiService.getToken();
      
      if (editingEvent) {
        await ApiService.updateEvent(editingEvent.id, eventForm, token);
        console.log('✅ Événement modifié');
      } else {
        await ApiService.createEvent(eventForm, token);
        console.log('✅ Événement ajouté');
      }
      
      setShowEventForm(false);
      await loadEvents();
      
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de l\'événement');
    }
  };

  // ✅ MODIFIÉ : Gestion des médias pour localStorage
  const handleAddMedia = () => {
    setEditingMedia(null);
    setMediaForm({
      titre: '',
      description: '',
      youtubeId: ''
    });
    setShowMediaForm(true);
  };

  const handleEditMedia = (media) => {
    setEditingMedia(media);
    setMediaForm({
      titre: media.title,
      description: media.description,
      youtubeId: media.youtubeId
    });
    setShowMediaForm(true);
  };

  const handleDeleteMedia = (mediaId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette ressource ?')) {
      try {
        const newMedias = medias.filter(media => media.id !== mediaId);
        saveMediasToStorage(newMedias);
        console.log('✅ Média supprimé');
      } catch (error) {
        console.error('❌ Erreur suppression:', error);
        alert('Erreur lors de la suppression du média');
      }
    }
  };

  const handleSaveMedia = () => {
    try {
      if (!mediaForm.titre || !mediaForm.youtubeId) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }

      const youtubeId = extractYouTubeId(mediaForm.youtubeId);
      
      if (youtubeId.length !== 11) {
        alert('ID YouTube invalide');
        return;
      }
      
      let newMedias;
      if (editingMedia) {
        // Modifier
        newMedias = medias.map(media => 
          media.id === editingMedia.id 
            ? { 
                ...media, 
                title: mediaForm.titre,
                description: mediaForm.description,
                youtubeId: youtubeId,
                thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
                url: `https://www.youtube.com/watch?v=${youtubeId}`
              }
            : media
        );
        console.log('✅ Média modifié');
      } else {
        // Ajouter
        const newMedia = {
          id: Math.max(...medias.map(v => v.id), 0) + 1,
          type: 'video',
          title: mediaForm.titre,
          description: mediaForm.description,
          youtubeId: youtubeId,
          thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
          url: `https://www.youtube.com/watch?v=${youtubeId}`
        };
        newMedias = [...medias, newMedia];
        console.log('✅ Média ajouté');
      }
      
      saveMediasToStorage(newMedias);
      setShowMediaForm(false);
      
    } catch (error) {
      console.error('❌ Erreur sauvegarde média:', error);
      alert('Erreur lors de la sauvegarde du média');
    }
  };

  // Affichage de loading
  if (loading) {
    return (
      <div className="admin-dashboard">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column'
        }}>
          <div style={{ 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }}></div>
          <p>Chargement du dashboard OMAC...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="dashboard-title">
            <div className="dashboard-logo">
              <img src={logoOmac} alt="OMAC Logo" />
            </div>
            <div className="title-text">
              <h1>Dashboard OMAC</h1>
              <p>Gestion des événements et ressources multimédias</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-home" onClick={() => navigate('/')}>
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
        {/* Onglets */}
        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Événements ({events.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => setActiveTab('media')}
          >
            Ressources Multimédias ({medias.length})
          </button>
        </div>

        {/* Affichage d'erreur */}
        {error && (
          <div style={{ 
            background: '#fff3cd', 
            border: '1px solid #ffeeba',
            borderRadius: '5px',
            padding: '15px',
            margin: '20px 0',
            color: '#856404'
          }}>
            <strong>⚠️ {error}</strong>
            <button 
              onClick={() => {
                loadEvents();
                loadMedias();
              }}
              style={{ 
                marginLeft: '15px', 
                background: '#ffc107', 
                border: 'none', 
                padding: '5px 10px', 
                borderRadius: '3px' 
              }}
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Contenu des onglets */}
        <div className="tab-content">
          {activeTab === 'events' && (
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
                  <button 
                    className="month-nav-btn" 
                    onClick={() => navigateMonth(-1)}
                  >
                    ←
                  </button>
                  <div className="current-month">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </div>
                  <button 
                    className="month-nav-btn" 
                    onClick={() => navigateMonth(1)}
                  >
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
                    const groupedEvents = groupEventsByMonth();
                    const sortedMonthKeys = Object.keys(groupedEvents).sort().reverse();
                    
                    return sortedMonthKeys.map(monthKey => {
                      const monthData = groupedEvents[monthKey];
                      const isCollapsed = collapsedMonths.has(monthKey);
                      
                      return (
                        <div key={monthKey} className="month-group">
                          <div 
                            className="month-group-header"
                            onClick={() => toggleMonthCollapse(monthKey)}
                          >
                            <h3 className="month-group-title">
                              {monthNames[monthData.month]} {monthData.year}
                            </h3>
                            <div className="month-group-info">
                              <span className="month-group-count">
                                {monthData.events.length} événement{monthData.events.length > 1 ? 's' : ''}
                              </span>
                              <button className={`month-group-toggle ${isCollapsed ? 'collapsed' : ''}`}>
                                ▼
                              </button>
                            </div>
                          </div>
                          
                          <div className={`month-events ${isCollapsed ? 'collapsed' : ''}`}>
                            {monthData.events.map(event => (
                              <div key={event.id} className="item-card">
                                <div className="event-date-badge">
                                  {new Date(event.date).getDate()} {monthNames[new Date(event.date).getMonth()].slice(0, 3)}
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
                      );
                    });
                  })()
                )}
              </div>
            </div>
          )}

          {activeTab === 'media' && (
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
                  medias.map(media => (
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
        </div>
      </main>

      {/* Formulaire d'événement (inchangé) */}
      {showEventForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <div className="form-header">
              <h3 className="form-title">
                {editingEvent ? 'Modifier l\'événement' : 'Ajouter un événement'}
              </h3>
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
                  onChange={(e) => setEventForm({...eventForm, titre: e.target.value})}
                  placeholder="Ex: Atelier de peinture"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date et heure de début</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={eventForm.date_debut}
                  onChange={(e) => setEventForm({...eventForm, date_debut: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date et heure de fin</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={eventForm.date_fin}
                  onChange={(e) => setEventForm({...eventForm, date_fin: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <input
                    type="checkbox"
                    checked={eventForm.toute_la_journee}
                    onChange={(e) => setEventForm({...eventForm, toute_la_journee: e.target.checked})}
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
                  onChange={(e) => setEventForm({...eventForm, couleur: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  placeholder="Décrivez l'événement..."
                />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn-cancel" onClick={() => setShowEventForm(false)}>
                Annuler
              </button>
              <button className="btn-save" onClick={handleSaveEvent}>
                {editingEvent ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ MODIFIÉ : Formulaire de média pour YouTube */}
      {showMediaForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <div className="form-header">
              <h3 className="form-title">
                {editingMedia ? 'Modifier la ressource' : 'Ajouter une ressource'}
              </h3>
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
                  onChange={(e) => setMediaForm({...mediaForm, titre: e.target.value})}
                  placeholder="Ex: Atelier de danse pour enfants"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={mediaForm.description}
                  onChange={(e) => setMediaForm({...mediaForm, description: e.target.value})}
                  placeholder="Décrivez la ressource multimédia..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">URL ou ID YouTube</label>
                <input
                  type="text"
                  className="form-input"
                  value={mediaForm.youtubeId}
                  onChange={(e) => setMediaForm({...mediaForm, youtubeId: e.target.value})}
                  placeholder="https://www.youtube.com/watch?v=... ou ID direct"
                />
                <p style={{ fontSize: '0.875rem', color: '#666', margin: '0.5rem 0 0 0' }}>
                  Vous pouvez coller l'URL complète ou juste l'ID de la vidéo
                </p>
              </div>
              
            </div>
            <div className="form-actions">
              <button className="btn-cancel" onClick={() => setShowMediaForm(false)}>
                Annuler
              </button>
              <button className="btn-save" onClick={handleSaveMedia}>
                {editingMedia ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS pour l'animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;