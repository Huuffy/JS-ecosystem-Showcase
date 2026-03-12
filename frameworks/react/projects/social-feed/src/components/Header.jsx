function Header({ onlineUsers, connected }) {
    return React.createElement('header', { className: 'header' },
        React.createElement('div', { className: 'header-content' },
            React.createElement('h1', { className: 'app-title' }, '🚀 SocialStream'),
            React.createElement('div', { className: 'header-info' },
                React.createElement('div', { className: 'online-status' },
                    React.createElement('span', { 
                        className: `status-dot ${connected ? 'connected' : 'disconnected'}` 
                    }),
                    React.createElement('span', null, `${onlineUsers} online`)
                ),
                React.createElement('div', { className: 'user-avatar' }, 'U')
            )
        )
    );
}

window.Header = Header;
