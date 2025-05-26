import React, { useState, useRef } from 'react';
import './MediaResources.css';

// Exemple pour les ressources multimédias - BDD pour les vraies ressources 
const sampleMedias = [
  {
    id: 1,
    type: 'video',
    title: 'Atelier de danse pour enfants',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec porta scelerisque interdum. Praesent vitae tortor elementum.',
    thumbnail: '/api/placeholder/400/250',
    url: 'https://www.example.com/video1.mp4'
  },
  {
    id: 2,
    type: 'audio',
    title: 'Podcast - Rencontre avec les artistes',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec porta scelerisque interdum. Praesent vitae tortor elementum.',
    thumbnail: '/api/placeholder/400/250',
    url: 'https://www.example.com/audio1.mp3'
  },
  {
    id: 3,
    type: 'video',
    title: 'Reportage - Journée portes ouvertes',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec porta scelerisque interdum. Praesent vitae tortor elementum.',
    thumbnail: '/api/placeholder/400/250',
    url: 'https://www.example.com/video2.mp4'
  },
  {
    id: 4,
    type: 'audio',
    title: 'Entretien - Éducation populaire et culture',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec porta scelerisque interdum. Praesent vitae tortor elementum.',
    thumbnail: '/api/placeholder/400/250',
    url: 'https://www.example.com/audio2.mp3'
  },
  {
    id: 5,
    type: 'video',
    title: 'Spectacle de fin d année',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec porta scelerisque interdum. Praesent vitae tortor elementum.',
    thumbnail: '/api/placeholder/400/250',
    url: 'https://www.example.com/video3.mp4'
  }
];

const MediaResources = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const carouselRef = useRef(null);
  
  // Calculer le nombre de slides visibles en fonction de la taille de l'écran
  const getVisibleCount = () => {
    if (window.innerWidth < 768) {
      return 1; // Mobile: 1 slide
    } else if (window.innerWidth < 1024) {
      return 2; // Tablette: 2 slides
    } else {
      return 3; // Desktop: 3 slides
    }
  };
  
  const [visibleCount, setVisibleCount] = useState(getVisibleCount());
  
  // Mettre à jour le nombre de slides visibles lors du redimensionnement
  React.useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Naviguer vers la slide précédente
  const prevSlide = () => {
    setCurrentSlide(prev => (prev > 0 ? prev - 1 : 0));
  };
  
  // Naviguer vers la slide suivante
  const nextSlide = () => {
    const maxSlide = sampleMedias.length - visibleCount;
    setCurrentSlide(prev => (prev < maxSlide ? prev + 1 : maxSlide));
  };
  
  // Ouvrir le lecteur multimédia
  const openMediaPlayer = (media) => {
    setSelectedMedia(media);
  };
  
  // Fermer le lecteur multimédia
  const closeMediaPlayer = () => {
    setSelectedMedia(null);
  };
  
  return (
    <section className="media-resources-section">
      <div className="container">
        <div className="media-header">
          <h2 className="section-title">Ressources Multimédias</h2>
          <p className="media-subtitle">
            Accédez à nos contenus audio et vidéo pour découvrir<br />
            avis et retours sur l'OMAC de Torcy.
          </p>
          <div className="green-underline"></div>
        </div>
        
        <div className="carousel-container">
          <div className="carousel-controls">
            <button 
              className={`carousel-control prev ${currentSlide === 0 ? 'disabled' : ''}`}
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              &lt;
            </button>
            <button 
              className={`carousel-control next ${currentSlide >= sampleMedias.length - visibleCount ? 'disabled' : ''}`}
              onClick={nextSlide}
              disabled={currentSlide >= sampleMedias.length - visibleCount}
            >
              &gt;
            </button>
          </div>
          
          <div className="carousel-track-container">
            <div 
              className="carousel-track" 
              ref={carouselRef}
              style={{ 
                transform: `translateX(-${currentSlide * (100 / visibleCount)}%)`,
                gridTemplateColumns: `repeat(${sampleMedias.length}, ${100 / visibleCount}%)`
              }}
            >
              {sampleMedias.map(media => (
                <div 
                  key={media.id} 
                  className="media-card"
                  onClick={() => openMediaPlayer(media)}
                >
                  <div className="media-thumbnail">
                    <img src={media.thumbnail} alt={media.title} />
                    <div className="media-play-button">
                      <div className={`play-icon ${media.type === 'audio' ? 'audio-icon' : ''}`}>
                        {media.type === 'video' ? (
                          <svg viewBox="0 0 24 24" fill="#fff">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="#fff">
                            <path d="M8 5.14v14l11-7-11-7zm6.93 7L9.4 8.27v7.46L14.93 12z" />
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="media-info">
                    <h3 className="media-title">{media.title}</h3>
                    <p className="media-description">{media.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Lecteur multimédia */}
        {selectedMedia && (
          <div className="media-player-overlay" onClick={closeMediaPlayer}>
            <div className="media-player" onClick={e => e.stopPropagation()}>
              <button className="player-close-btn" onClick={closeMediaPlayer}>×</button>
              
              <div className="player-content">
                {selectedMedia.type === 'video' ? (
                  <div className="video-container">
                    <video 
                      controls 
                      autoPlay
                      className="video-player"
                    >
                      <source src={selectedMedia.url} type="video/mp4" />
                      Votre navigateur ne supporte pas la lecture de vidéos.
                    </video>
                  </div>
                ) : (
                  <div className="audio-container">
                    <img 
                      src={selectedMedia.thumbnail} 
                      alt={selectedMedia.title} 
                      className="audio-thumbnail" 
                    />
                    <audio 
                      controls 
                      autoPlay
                      className="audio-player"
                    >
                      <source src={selectedMedia.url} type="audio/mpeg" />
                      Votre navigateur ne supporte pas la lecture audio.
                    </audio>
                  </div>
                )}
                
                <div className="player-info">
                  <h3 className="player-title">{selectedMedia.title}</h3>
                  <p className="player-description">{selectedMedia.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MediaResources;