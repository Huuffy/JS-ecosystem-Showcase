const { useEffect, useState } = React;

function Feed({ posts, loading, onReact }) {
    const [visiblePosts, setVisiblePosts] = useState([]);
    const [page, setPage] = useState(1);
    const POSTS_PER_PAGE = 5;

    useEffect(() => {
        setVisiblePosts(posts.slice(0, page * POSTS_PER_PAGE));
    }, [posts, page]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000) {
                if (visiblePosts.length < posts.length) {
                    setPage(prev => prev + 1);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [visiblePosts.length, posts.length]);

    if (loading) {
        return React.createElement('div', { className: 'loading-container' },
            React.createElement('div', { className: 'spinner' }),
            React.createElement('p', null, 'Loading posts...')
        );
    }

    return React.createElement('div', { className: 'feed' },
        visiblePosts.map(post => 
            React.createElement(window.Post, {
                key: post.id,
                post: post,
                onReact: onReact
            })
        ),
        visiblePosts.length < posts.length && 
            React.createElement('div', { className: 'load-more' },
                React.createElement('div', { className: 'spinner' }),
                React.createElement('p', null, 'Loading more posts...')
            )
    );
}

window.Feed = Feed;
