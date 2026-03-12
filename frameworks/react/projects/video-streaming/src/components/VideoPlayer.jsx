function VideoPlayer() {
    const { 
        currentVideo, 
        addToFavorites, 
        removeFromFavorites, 
        favorites 
    } = window.useVideo();
    
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [showControls, setShowControls] = React.useState(true);
    const [isVideoLoaded, setIsVideoLoaded] = React.useState(false);

    const iframeRef = React.useRef(null);

    const isFavorite = favorites.some(fav => fav.id === currentVideo?.id);

    React.useEffect(() => {
        if (currentVideo) {
            setIsVideoLoaded(false);
            setIsPlaying(false);
            setTimeout(() => setIsVideoLoaded(true), 500);
        }
    }, [currentVideo]);

    const handlePlayPause = React.useCallback(() => {
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    const toggleFullscreen = React.useCallback(() => {
        setIsFullscreen(!isFullscreen);
    }, [isFullscreen]);

    const handleFavoriteToggle = React.useCallback(() => {
        if (isFavorite) {
            removeFromFavorites(currentVideo.id);
        } else {
            addToFavorites(currentVideo);
        }
    }, [isFavorite, currentVideo, addToFavorites, removeFromFavorites]);

    if (!currentVideo) {
        return React.createElement('div', { className: 'video-placeholder' },
            React.createElement('div', { className: 'placeholder-content' },
                React.createElement('h2', null, 'Select a video to start watching'),
                React.createElement('p', null, 'Choose from our collection of mobile game videos')
            )
        );
    }

    const embedUrl = `${currentVideo.url}?autoplay=0&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&playsinline=1&branding=0&logo=0`;

    return React.createElement('div', { className: 'video-player-container' },
        React.createElement('div', { 
            className: `video-wrapper ${isFullscreen ? 'fullscreen' : ''}`,
            onMouseEnter: () => setShowControls(true),
            onMouseLeave: () => setShowControls(false)
        },
            !isVideoLoaded && React.createElement('div', { className: 'video-loading' },
                React.createElement('div', { className: 'loading-spinner' }),
                React.createElement('p', null, 'Loading video...')
            ),
            React.createElement('iframe', {
                ref: iframeRef,
                className: `video-element ${isVideoLoaded ? 'loaded' : 'loading'}`,
                src: embedUrl,
                title: currentVideo.title,
                frameBorder: "0",
                allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                allowFullScreen: true,
                onLoad: () => setIsVideoLoaded(true)
            }),
            
            React.createElement('div', { className: 'youtube-logo-overlay' }),
            
            React.createElement('div', { 
                className: `custom-video-controls ${showControls ? 'visible' : 'hidden'}` 
            },
                React.createElement('div', { className: 'top-controls' },
                    React.createElement('button', {
                        className: `favorite-btn ${isFavorite ? 'active' : ''}`,
                        onClick: handleFavoriteToggle,
                        title: isFavorite ? 'Remove from favorites' : 'Add to favorites'
                    }, isFavorite ? '❤️' : '🤍')
                ),
                
                React.createElement('div', { className: 'bottom-controls' },
                    React.createElement('div', { className: 'controls-row' },
                        React.createElement('div', { className: 'left-controls' },
                            React.createElement('button', {
                                className: 'control-btn play-pause-btn',
                                onClick: handlePlayPause
                            }, isPlaying ? '⏸️' : '▶️')
                            
                            // REMOVED: Time display completely
                        ),
                        
                        React.createElement('div', { className: 'right-controls' },
                            React.createElement('button', {
                                className: 'control-btn settings-btn',
                                title: 'Settings'
                            }, '⚙️'),
                            React.createElement('button', {
                                className: 'control-btn fullscreen-btn',
                                onClick: toggleFullscreen,
                                title: 'Toggle fullscreen'
                            }, isFullscreen ? '🗗' : '⛶')
                        )
                    )
                )
            )
        ),
        React.createElement('div', { className: 'video-info' },
            React.createElement('h2', { className: 'video-title' }, currentVideo.title),
            React.createElement('div', { className: 'video-meta' },
                React.createElement('span', { className: 'video-duration' }, 
                    `${Math.floor(currentVideo.duration / 60)}:${(currentVideo.duration % 60).toString().padStart(2, '0')}`
                ),
                React.createElement('span', { className: 'video-quality' }, currentVideo.quality),
                React.createElement('span', { className: 'video-views' }, `${currentVideo.views} views`),
                React.createElement('span', { className: 'video-category' }, currentVideo.category)
            ),
            React.createElement('p', { className: 'video-description' }, currentVideo.description),
            React.createElement('div', { className: 'video-actions' },
                React.createElement('button', {
                    className: `action-btn favorite-action ${isFavorite ? 'active' : ''}`,
                    onClick: handleFavoriteToggle
                }, isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites')
            )
        )
    );
}

window.VideoPlayer = VideoPlayer;
