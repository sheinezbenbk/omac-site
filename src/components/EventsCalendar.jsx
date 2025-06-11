import React, { useState, useEffect } from 'react';
import ApiService from '../services/api'; // ✅ Import du service API
import './EventsCalendar.css';

const EventsCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // ✅ NOUVEAU : États pour les données de la BDD
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ NOUVEAU : Charger les événements depuis la BDD au montage du composant
  useEffect(() => {
    loadEventsFromDB();
  }, []);

  const loadEventsFromDB = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Chargement des événements depuis SiteGround...');
      
      // Appel à votre API
      const eventsData = await ApiService.getEvents();
      
      console.log('✅ Événements reçus:', eventsData);
      
      // Transformer les données de la BDD au format de votre interface existante
      const formattedEvents = eventsData.map(event => {
        const startDate = new Date(event.date_debut);
        const endDate = new Date(event.date_fin);
        
        // Formater l'heure
        const timeStart = startDate.toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        const timeEnd = endDate.toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        return {
          id: event.id,
          title: event.titre,
          date: startDate.toISOString().split('T')[0], // Format YYYY-MM-DD pour votre logique existante
          time: event.toute_la_journee ? 'Toute la journée' : `${timeStart} - ${timeEnd}`,
          location: "OMAC Torcy", // Vous pouvez ajouter un champ location dans votre BDD plus tard
          description: event.description || 'Événement organisé par l\'OMAC Torcy',
          image: "/api/placeholder/400/300", // Image par défaut, vous pouvez ajouter des vraies images plus tard
          color: event.couleur || '#3498db',
          allDay: event.toute_la_journee === 1
        };
      });
      
      setEvents(formattedEvents);
      console.log('✅ Événements formatés:', formattedEvents);
      
    } catch (err) {
      console.error('❌ Erreur lors du chargement des événements:', err);
      setError('Impossible de charger les événements');
      
      // En cas d'erreur, utiliser des événements de fallback
      setEvents([
        {
          id: 'fallback-1',
          title: "Événements en cours de chargement...",
          date: new Date().toISOString().split('T')[0],
          time: "Bientôt disponible",
          location: "OMAC Torcy",
          description: "Les événements seront bientôt disponibles.",
          image: "/api/placeholder/400/300"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Fonction pour obtenir le premier jour du mois (0 = dimanche, 1 = lundi, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Formatter la date au format YYYY-MM-DD pour comparer avec les événements
  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  
  // Vérifier si une date a des événements (utilise maintenant les vraies données)
  const hasEvents = (year, month, day) => {
    const formattedDate = formatDate(year, month, day);
    return events.some(event => event.date === formattedDate);
  };
  
  // Obtenir les événements pour une date spécifique (utilise maintenant les vraies données)
  const getEventsForDate = (year, month, day) => {
    const formattedDate = formatDate(year, month, day);
    return events.filter(event => event.date === formattedDate);
  };
  
  // Gérer le clic sur une date
  const handleDateClick = (year, month, day) => {
    const eventsForDate = getEventsForDate(year, month, day);
    if (eventsForDate.length > 0) {
      setSelectedEvent(eventsForDate[0]); // Prendre le premier événement par défaut
      setShowModal(true);
    }
  };
  
  // Passer au mois précédent
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // Passer au mois suivant
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Fermer la modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };
  
  // Noms des mois en français
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  
  // Noms des jours de la semaine en français (commençant par Lundi)
  const dayNames = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];
  
  // Construire le calendrier
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    // Ajuster firstDay pour que Lundi soit le premier jour (0)
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    let days = [];
    
    // Ajouter les en-têtes des jours de la semaine
    const weekDays = dayNames.map((day, index) => (
      <div key={`header-${index}`} className="calendar-cell header">
        {day}
      </div>
    ));
    days.push(...weekDays);
    
    // Ajouter les jours vides avant le premier jour du mois
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-cell empty"></div>
      );
    }
    
    // Ajouter les jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const eventsOnDay = getEventsForDate(year, month, day);
      const hasEventOnDay = eventsOnDay.length > 0;
      
      days.push(
        <div 
          key={`day-${day}`} 
          className={`calendar-cell day ${hasEventOnDay ? 'has-event' : ''}`}
          onClick={() => handleDateClick(year, month, day)}
        >
          <div className="day-number">{day}</div>
          
          {/* Affichage du titre de l'événement dans la case */}
          {hasEventOnDay && (
            <div className="event-preview">
              {eventsOnDay[0].title}
              {eventsOnDay.length > 1 && <span className="event-count">+{eventsOnDay.length - 1}</span>}
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  // ✅ NOUVEAU : Affichage de loading
  if (loading) {
    return (
      <section className="events-section">
        <div className="container">
          <div className="events-header">
            <h2 className="section-title">Nos Activités</h2>
            <p className="events-subtitle">Chargement des événements OMAC...</p>
            <div className="green-underline"></div>
          </div>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div style={{ 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p>Connexion à la base de données SiteGround...</p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="events-section">
      <div className="container">
        <div className="events-header">
          <h2 className="section-title">Nos Activités</h2>
          <p className="events-subtitle">
            {error 
              ? 'Événements en cours de chargement...' 
              : `Découvrez tous les évènements et activités de l'OMAC Torcy`
            }
          </p>
          <div className="green-underline"></div>
        </div>
        
        {/* ✅ NOUVEAU : Affichage d'erreur si besoin */}
        {error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px', 
            backgroundColor: '#fff3cd', 
            borderLeft: '4px solid #ffc107',
            margin: '20px 0',
            borderRadius: '5px'
          }}>
            <p>⚠️ {error}</p>
            <button 
              onClick={loadEventsFromDB}
              style={{
                background: '#3498db',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Réessayer
            </button>
          </div>
        )}
        
        <div className="calendar-container">
          <div className="calendar-header">
            <button className="calendar-nav-btn" onClick={prevMonth}>
              &lt;
            </button>
            <h3 className="calendar-title">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button className="calendar-nav-btn" onClick={nextMonth}>
              &gt;
            </button>
          </div>
          
          <div className="calendar-grid">
            {renderCalendar()}
          </div>
        </div>
        
       
        {/* Modal pour afficher les détails de l'événement*/}
        {showModal && selectedEvent && (
          <div className="event-modal-overlay" onClick={closeModal}>
            <div className="event-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={closeModal}>×</button>
              
              <div className="event-modal-content">
                
                <div className="event-details">
                  <h3 className="event-title">{selectedEvent.title}</h3>
                  
                  <div className="event-info">
                    <div className="event-info-item">
                      <span className="info-label">Date:</span>
                      <span className="info-value">{new Date(selectedEvent.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    
                    <div className="event-info-item">
                      <span className="info-label">Horaire:</span>
                      <span className="info-value">{selectedEvent.time}</span>
                    </div>
                    
                    <div className="event-info-item">
                      <span className="info-label">Lieu:</span>
                      <span className="info-value">{selectedEvent.location}</span>
                    </div>
                  </div>
                  
                  <p className="event-description">{selectedEvent.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* ✅ NOUVEAU : CSS pour l'animation de loading */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default EventsCalendar;