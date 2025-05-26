import React, { useState, useEffect } from 'react';
import './EventsCalendar.css';

// exemple d'événements - les vraies données seront utilisés avec la BDD
const sampleEvents = [
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
    title: "Réunion des familles",
    date: "2025-05-28",
    time: "18:30 - 20:00",
    location: "Salle principale, OMAC Torcy",
    description: "Réunion d'information sur les activités d'été et discussion ouverte.",
    image: "/api/placeholder/400/300"
  }
];

const EventsCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  

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
  
  // Vérifier si une date a des événements
  const hasEvents = (year, month, day) => {
    const formattedDate = formatDate(year, month, day);
    return sampleEvents.some(event => event.date === formattedDate);
  };
  
  // Obtenir les événements pour une date spécifique
  const getEventsForDate = (year, month, day) => {
    const formattedDate = formatDate(year, month, day);
    return sampleEvents.filter(event => event.date === formattedDate);
  };
  
  // Gérer le clic sur une date
  const handleDateClick = (year, month, day) => {
    const events = getEventsForDate(year, month, day);
    if (events.length > 0) {
      setSelectedEvent(events[0]); // Prendre le premier événement par défaut
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
  
  return (
    <section className="events-section">
      <div className="container">
        <div className="events-header">
          <h2 className="section-title">Nos Activités</h2>
          <p className="events-subtitle">Découvrez nos prochains événements et formations</p>
          <div className="green-underline"></div>
        </div>
        
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
        
        {/* Modal pour afficher les détails de l'événement */}
        {showModal && selectedEvent && (
          <div className="event-modal-overlay" onClick={closeModal}>
            <div className="event-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={closeModal}>×</button>
              
              <div className="event-modal-content">
                <div className="event-image">
                  <img src={selectedEvent.image} alt={selectedEvent.title} />
                </div>
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
    </section>
  );
};

export default EventsCalendar;