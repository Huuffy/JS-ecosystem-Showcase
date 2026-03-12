function VideoCard({ video, isActive, onClick }) {
    return React.createElement('div', { 
        className: `video-card ${isActive ? 'active' : ''}`,
        onClick: () => onClick(video)
    },
        React.createElement('div', { className: 'video-thumbnail' },
            React.createElement('img', { 
                src: video.thumbnail, 
                alt: video.title 
            }),
            React.createElement('div', { className: 'video-duration-badge' },
                `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}`
            )
        ),
        React.createElement('div', { className: 'video-card-info' },
            React.createElement('h3', { className: 'video-card-title' }, video.title),
            React.createElement('div', { className: 'video-card-meta' },
                React.createElement('span', { className: 'video-quality' }, video.quality),
                React.createElement('span', { className: 'video-views' }, `${video.views} views`)
            )
        )
    );
}

window.VideoCard = VideoCard;
