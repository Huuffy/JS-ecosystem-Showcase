function Post({ post, onReact }) {
    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const postTime = new Date(timestamp);
        const diffInSeconds = Math.floor((now - postTime) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        return `${Math.floor(diffInSeconds / 86400)}d`;
    };

    return React.createElement('article', { 
        className: `post ${post.isOptimistic ? 'optimistic' : ''}` 
    },
        React.createElement('div', { className: 'post-header' },
            React.createElement('div', { className: 'user-info' },
                React.createElement('div', { className: 'user-avatar' }, post.user.avatar),
                React.createElement('div', { className: 'user-details' },
                    React.createElement('span', { className: 'username' }, post.user.name),
                    React.createElement('span', { className: 'timestamp' }, 
                        getTimeAgo(post.timestamp) + (post.isOptimistic ? ' • Sending...' : '')
                    )
                )
            )
        ),
        React.createElement('div', { className: 'post-content' },
            React.createElement('p', null, post.content),
            post.image && React.createElement('img', {
                src: post.image,
                alt: 'Post image',
                className: 'post-image'
            })
        ),
        React.createElement('div', { className: 'post-reactions' },
            ['❤️', '👍', '🚀'].map(emoji => 
                React.createElement('button', {
                    key: emoji,
                    onClick: () => onReact(post.id, emoji),
                    className: 'reaction-btn'
                }, `${emoji} ${post.reactions[emoji] || 0}`)
            )
        )
    );
}

window.Post = Post;
