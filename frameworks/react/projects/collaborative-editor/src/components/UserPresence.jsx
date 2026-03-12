function UserPresence() {
    const { activeUsers, currentUser, getActiveUserCount } = window.usePresence();
    const { isConnected } = window.useDocument();

    return React.createElement('div', { className: 'user-presence' },
        React.createElement('div', { className: 'connection-status' },
            React.createElement('div', { 
                className: `status-indicator ${isConnected ? 'connected' : 'disconnected'}` 
            }),
            React.createElement('span', { className: 'status-text' },
                isConnected ? 'Connected' : 'Connecting...'
            )
        ),
        React.createElement('div', { className: 'active-users' },
            React.createElement('span', { className: 'user-count' },
                `${getActiveUserCount()} user${getActiveUserCount() !== 1 ? 's' : ''} online`
            ),
            React.createElement('div', { className: 'user-avatars' },
                activeUsers.slice(0, 5).map(user =>
                    React.createElement('div', {
                        key: user.id,
                        className: 'user-avatar',
                        style: { borderColor: user.color },
                        title: `${user.name} ${user.id === currentUser.id ? '(You)' : ''}`
                    },
                        React.createElement('img', {
                            src: user.avatar,
                            alt: user.name,
                            onError: (e) => {
                                e.target.style.display = 'none';
                                e.target.parentNode.textContent = user.name[0];
                            }
                        })
                    )
                ),
                activeUsers.length > 5 && React.createElement('div', { 
                    className: 'user-avatar overflow',
                    title: `+${activeUsers.length - 5} more users`
                }, `+${activeUsers.length - 5}`)
            )
        )
    );
}

window.UserPresence = UserPresence;
