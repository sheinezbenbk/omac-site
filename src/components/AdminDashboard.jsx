import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  
  // États pour les événements
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Atelier de peinture",
      date: "2025-05-15",
      time: "14:00 - 16:00",
      location: "Salle 2, OMAC Torcy",
      description: "Atelier de peinture pour les enfants de 6 à 12 ans. Matériel fourni.",
      image: "/api/placeholder/400/300"
    },
    {
      id: 2,
      title: "Sortie culturelle - Musée",
      date: "2025-05-20",
      time: "10:00 - 16:00",
      location: "Départ de l'OMAC Torcy",
      description: "Visite guidée du musée d'art moderne. Transport en bus inclus. Prévoir un pique-nique.",
      image: "/api/placeholder/400/300"
    },
    {
      id: 3,
      title: "Spectacle de fin d'année",
      date: "2025-06-10",
      time: "19:00 - 21:00",
      location: "Salle des fêtes, Torcy",
      description: "Spectacle présenté par les enfants des ateliers théâtre et danse.",
      image: "/api/placeholder/400/300"
    },
    {
      id: 4,
      title: "Pique-nique de l'été",
      date: "2025-07-05",
      time: "12:00 - 16:00",
      location: "Parc municipal, Torcy",
      description: "Grand pique-nique familial avec jeux et animations pour tous.",
      image: "/api/placeholder/400/300"
    }
  ]);

  // États pour les médias
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

  // Formulaire d'événement
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    image: ''
  });

  // Formulaire de média
  const [mediaForm, setMediaForm] = useState({
    type: 'video',
    title: '',
    description: '',
    thumbnail: '',
    url: ''
  });

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

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('omac_admin_logged');
    if (!isLoggedIn) {
      navigate('/admin');
    }
  }, [navigate]);

  // Gestion de la déconnexion
  const handleLogout = () => {
    sessionStorage.removeItem('omac_admin_logged');
    navigate('/admin');
  };

  // Gestion des événements
  const handleAddEvent = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      image: ''
    });
    setShowEventForm(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  const handleSaveEvent = () => {
    if (editingEvent) {
      // Modification
      setEvents(events.map(event => 
        event.id === editingEvent.id ? { ...eventForm, id: editingEvent.id } : event
      ));
    } else {
      // Ajout
      const newEvent = {
        ...eventForm,
        id: Date.now() // Simple ID generation
      };
      setEvents([...events, newEvent]);
    }
    setShowEventForm(false);
  };

  // Gestion des médias
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

      {/* Formulaire d'événement */}
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
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  placeholder="Ex: Atelier de peinture"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Horaire</label>
                <input
                  type="text"
                  className="form-input"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                  placeholder="Ex: 14:00 - 16:00"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Lieu</label>
                <input
                  type="text"
                  className="form-input"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                  placeholder="Ex: Salle 2, OMAC Torcy"
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
              <div className="form-group">
                <label className="form-label">URL de l'image</label>
                <input
                  type="url"
                  className="form-input"
                  value={eventForm.image}
                  onChange={(e) => setEventForm({...eventForm, image: e.target.value})}
                  placeholder="https://exemple.com/image.jpg"
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

      {/* Formulaire de média */}
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
    </div>
  );
};

export default AdminDashboard;