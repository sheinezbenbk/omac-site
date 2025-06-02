import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api'; // ✅ Import du service API
import './AdminDashboard.css';
import logoOmac from '../assets/omac-logo.png';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');
  const [showEventForm, setShowEventForm] = useState(false);
  const [showMediaForm, setShowMediaForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingMedia, setEditingMedia] = useState(null);
  
  // NOUVEAUX ÉTATS POUR LA NAVIGATION PAR MOIS
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [collapsedMonths, setCollapsedMonths] = useState(new Set());
  
  // ✅ NOUVEAU : États pour les événements de la BDD
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour les médias (inchangés pour l'instant)
  const [medias, setMedias] = useState([
    {
      id: 1,
      type: 'video',
      title: 'Atelier de danse pour enfants',
      description: 'Découvrez nos ateliers de danse où les enfants apprennent tout en s\'amusant.',
      thumbnail: '/api/placeholder/400/250',
      url: 'https://www.example.com/video1.mp4'
    },
    {
      id: 2,
      type: 'audio',
      title: 'Podcast - Rencontre avec les artistes',
      description: 'Écoutez les témoignages des artistes qui interviennent dans nos ateliers.',
      thumbnail: '/api/placeholder/400/250',
      url: 'https://www.example.com/audio1.mp3'
    }
  ]);

  // ✅ NOUVEAU : Formulaire d'événement pour la BDD
  const [eventForm, setEventForm] = useState({
    titre: '',
    description: '',
    date_debut: '',
    date_fin: '',
    couleur: '#3498db',
    toute_la_journee: false
  });

  // Formulaire de média
  const [mediaForm, setMediaForm] = useState({
    type: 'video',
    title: '',
    description: '',
    thumbnail: '',
    url: ''
  });

  // ✅ NOUVEAU : Charger les événements depuis la BDD
  useEffect(() => {
    checkAuthAndLoadData();
  }, [navigate]);

  const checkAuthAndLoadData = async () => {
    // Vérifier l'authentification plus rigoureusement
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
    
    // Charger les événements
    await loadEvents();
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
          date: startDate.toISOString().split('T')[0], // Format YYYY-MM-DD
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

  // FONCTIONS POUR LA GESTION DES MOIS
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
                     "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  // Grouper les événements par mois
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

    // Trier les événements dans chaque mois par date
    Object.keys(grouped).forEach(monthKey => {
      grouped[monthKey].events.sort((a, b) => new Date(a.date) - new Date(b.date));
    });

    return grouped;
  };

  // Naviguer vers le mois précédent/suivant
  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  // Obtenir les événements du mois sélectionné
  const getCurrentMonthEvents = () => {
    const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`;
    const grouped = groupEventsByMonth();
    return grouped[monthKey]?.events || [];
  };

  // Toggle collapse d'un mois
  const toggleMonthCollapse = (monthKey) => {
    const newCollapsed = new Set(collapsedMonths);
    if (newCollapsed.has(monthKey)) {
      newCollapsed.delete(monthKey);
    } else {
      newCollapsed.add(monthKey);
    }
    setCollapsedMonths(newCollapsed);
  };

  // Obtenir le nombre total d'événements et ceux du mois actuel
  const getTotalStats = () => {
    const currentMonthEvents = getCurrentMonthEvents();
    return {
      total: events.length,
      currentMonth: currentMonthEvents.length
    };
  };

  // ✅ NOUVEAU : Gestion de la déconnexion avec API
  const handleLogout = async () => {
    try {
      await ApiService.logout();
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
    navigate('/admin');
  };

  // ✅ NOUVEAU : Gestion des événements avec API
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
        await loadEvents(); // Recharger la liste
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
        // Modification
        await ApiService.updateEvent(editingEvent.id, eventForm, token);
        console.log('✅ Événement modifié');
      } else {
        // Ajout
        await ApiService.createEvent(eventForm, token);
        console.log('✅ Événement ajouté');
      }
      
      setShowEventForm(false);
      await loadEvents(); // Recharger la liste
      
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de l\'événement');
    }
  };

  // Gestion des médias (inchangée pour l'instant)
  const handleAddMedia = () => {
    setEditingMedia(null);
    setMediaForm({
      type: 'video',
      title: '',
      description: '',
      thumbnail: '',
      url: ''
    });
    setShowMediaForm(true);
  };

  const handleEditMedia = (media) => {
    setEditingMedia(media);
    setMediaForm(media);
    setShowMediaForm(true);
  };

  const handleDeleteMedia = (mediaId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette ressource ?')) {
      setMedias(medias.filter(media => media.id !== mediaId));
    }
  };

  const handleSaveMedia = () => {
    if (editingMedia) {
      // Modification
      setMedias(medias.map(media => 
        media.id === editingMedia.id ? { ...mediaForm, id: editingMedia.id } : media
      ));
    } else {
      // Ajout
      const newMedia = {
        ...mediaForm,
        id: Date.now()
      };
      setMedias([...medias, newMedia]);
    }
    setShowMediaForm(false);
  };

  // ✅ NOUVEAU : Affichage de loading
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

        {/* ✅ NOUVEAU : Affichage d'erreur */}
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
              onClick={loadEvents}
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

              {/* NAVIGATION PAR MOIS */}
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

              {/* AFFICHAGE GROUPÉ PAR MOIS */}
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
                    
                    if (sortedMonthKeys.length === 0) {
                      return (
                        <div className="empty-state">
                          <h3>Aucun événement</h3>
                          <p>Commencez par ajouter votre premier événement</p>
                          <button className="btn-add" onClick={handleAddEvent}>
                            + Ajouter un événement
                          </button>
                        </div>
                      );
                    }

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
                          <p className="item-meta">
                            {media.type === 'video' ? 'Vidéo' : 'Audio'}
                          </p>
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
                      <div className="item-details">
                        <div className="detail-item">
                          <span className="detail-label">Type</span>
                          <span className="detail-value">{media.type}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">URL</span>
                          <span className="detail-value">{media.url}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ✅ NOUVEAU : Formulaire d'événement pour la BDD */}
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

      {/* Formulaire de média (inchangé) */}
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
                <label className="form-label">Type de média</label>
                <select
                  className="form-select"
                  value={mediaForm.type}
                  onChange={(e) => setMediaForm({...mediaForm, type: e.target.value})}
                >
                  <option value="video">Vidéo</option>
                  <option value="audio">Audio</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Titre</label>
                <input
                  type="text"
                  className="form-input"
                  value={mediaForm.title}
                  onChange={(e) => setMediaForm({...mediaForm, title: e.target.value})}
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
                <label className="form-label">URL de la miniature</label>
                <input
                  type="url"
                  className="form-input"
                  value={mediaForm.thumbnail}
                  onChange={(e) => setMediaForm({...mediaForm, thumbnail: e.target.value})}
                  placeholder="https://exemple.com/miniature.jpg"
                />
              </div>
              <div className="form-group">
                <label className="form-label">URL du fichier {mediaForm.type === 'video' ? 'vidéo' : 'audio'}</label>
                <input
                  type="url"
                  className="form-input"
                  value={mediaForm.url}
                  onChange={(e) => setMediaForm({...mediaForm, url: e.target.value})}
                  placeholder={`https://exemple.com/fichier.${mediaForm.type === 'video' ? 'mp4' : 'mp3'}`}
                />
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