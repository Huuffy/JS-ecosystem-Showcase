function PlaylistSidebar() {
    const { 
        videos, 
        currentVideo, 
        setCurrentVideo, 
        categories, 
        currentCategory, 
        setCurrentCategory,
        favorites,
        watchHistory,
        shufflePlaylist
    } = window.useVideo();
    
    const [activeTab, setActiveTab] = React.useState('all');
    const [searchTerm, setSearchTerm] = React.useState('');

    const getDisplayVideos = () => {
        let displayVideos = videos;
        
        if (activeTab === 'favorites') {
            displayVideos = favorites;
        } else if (activeTab === 'history') {
            displayVideos = watchHistory;
        }
        
        if (searchTerm) {
            displayVideos = displayVideos.filter(video =>
                video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                video.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        return displayVideos;
    };

    const displayVideos = getDisplayVideos();

    return React.createElement('div', { className: 'playlist-sidebar' },
        React.createElement('div', { className: 'playlist-header' },
            React.createElement('div', { className: 'playlist-title-row' },
                React.createElement('h3', null, 'Video Playlist'),
                React.createElement('button', {
                    className: 'shuffle-btn',
                    onClick: shufflePlaylist,
                    title: 'Shuffle playlist'
                }, '🔀')
            ),
            React.createElement('div', { className: 'playlist-tabs' },
                React.createElement('button', {
                    className: `tab-btn ${activeTab === 'all' ? 'active' : ''}`,
                    onClick: () => setActiveTab('all')
                }, 'All Videos'),
                React.createElement('button', {
                    className: `tab-btn ${activeTab === 'favorites' ? 'active' : ''}`,
                    onClick: () => setActiveTab('favorites')
                }, `Favorites (${favorites.length})`),
                React.createElement('button', {
                    className: `tab-btn ${activeTab === 'history' ? 'active' : ''}`,
                    onClick: () => setActiveTab('history')
                }, 'History')
            )
        ),
        React.createElement('div', { className: 'search-container' },
            React.createElement('input', {
                type: 'text',
                className: 'search-input',
                placeholder: 'Search videos...',
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value)
            })
        ),
        activeTab === 'all' && React.createElement('div', { className: 'category-filter' },
            React.createElement('select', {
                value: currentCategory,
                onChange: (e) => setCurrentCategory(e.target.value),
                className: 'category-select'
            },
                categories.map(category =>
                    React.createElement('option', { key: category, value: category }, category)
                )
            )
        ),
        React.createElement('div', { className: 'playlist-content' },
            displayVideos.length === 0 
                ? React.createElement('div', { className: 'empty-state' },
                    React.createElement('p', null, 
                        activeTab === 'favorites' ? 'No favorite videos yet' :
                        activeTab === 'history' ? 'No watch history' :
                        'No videos found'
                    )
                )
                : displayVideos.map(video => 
                    React.createElement(window.VideoCard, {
                        key: video.id,
                        video: video,
                        isActive: currentVideo && currentVideo.id === video.id,
                        onClick: setCurrentVideo
                    })
                )
        )
    );
}

window.PlaylistSidebar = PlaylistSidebar;
