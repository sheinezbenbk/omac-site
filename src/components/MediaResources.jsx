import React, { useState, useRef } from 'react';
import './MediaResources.css';

// 🎯 DONNÉES PAR DÉFAUT (fallback si localStorage vide)
const defaultMedias = [
  {
    id: 1,
    type: 'video',
    title: 'Atelier de danse pour enfants',
    description: 'Découvrez nos ateliers de danse créative pour les plus jeunes. Une approche ludique et éducative.',
    youtubeId: 'dQw4w9WgXcQ',
  },
  {
    id: 2,
    type: 'video',
    title: 'Podcast - Rencontre avec les artistes',
    description: 'Échanges privilégiés avec nos artistes résidents sur leur processus créatif.',
    youtubeId: 'jNQXAC9IVRw',
  }
];

const MediaResources = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [sampleMedias, setSampleMedias] = useState(defaultMedias);
  const carouselRef = useRef(null);
  
  // 🎯 CHARGER LES VIDÉOS DEPUIS LE LOCALSTORAGE
  React.useEffect(() => {
    const loadVideosFromStorage = () => {
      try {
        const saved = localStorage.getItem('omac_youtube_videos');
        if (saved) {
          const videos = JSON.parse(saved);
          // Convertir au format attendu par MediaResources
          const formattedVideos = videos.map(video => ({
            id: video.id,
            type: 'video',
            title: video.titre,
            description: video.description,
            youtubeId: video.youtubeId
          }));
          setSampleMedias(formattedVideos);
          console.log('✅ Vidéos chargées depuis le dashboard:', formattedVideos);
        } else {
          // Utiliser les données par défaut
          setSampleMedias(defaultMedias);
        }
      } catch (error) {
        console.error('❌ Erreur chargement vidéos:', error);
        setSampleMedias(defaultMedias);
      }
    };

    // Charger au montage
    loadVideosFromStorage();

    // Écouter les changements dans le localStorage (si l'admin modifie les vidéos)
    const handleStorageChange = (e) => {
      if (e.key === 'omac_youtube_videos') {
        console.log('🔄 Vidéos mises à jour dans le dashboard, rechargement...');
        loadVideosFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
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
            Accédez à nos contenus vidéo pour découvrir<br />
            les activités et la vie de l'OMAC de Torcy.
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
                    {/* 🎯 MINIATURE YOUTUBE AUTOMATIQUE */}
                    <img 
                      src={`https://img.youtube.com/vi/${media.youtubeId}/maxresdefault.jpg`} 
                      alt={media.title} 
                    />
                    <div className="media-play-button">
                      <div className="play-icon">
                        <svg viewBox="0 0 24 24" fill="#fff">
                          <path d="M8 5v14l11-7z" />
                        </svg>
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
        
        {/* 🎯 LECTEUR YOUTUBE */}
        {selectedMedia && (
          <div className="media-player-overlay" onClick={closeMediaPlayer}>
            <div className="media-player" onClick={e => e.stopPropagation()}>
              <button className="player-close-btn" onClick={closeMediaPlayer}>×</button>
              
              <div className="player-content">
                <div className="video-container">
                  <iframe
                    width="100%"
                    height="400"
                    src={`https://www.youtube.com/embed/${selectedMedia.youtubeId}?autoplay=1`}
                    title={selectedMedia.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="video-player"
                  ></iframe>
                </div>
                
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