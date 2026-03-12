const { useState, useEffect, useRef, useCallback } = React;

function useRealTimeFeed(userId) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(0);
    const socketRef = useRef(null);

    useEffect(() => {
        // Mock Socket.IO connection for frontend-only demo
        const mockSocket = {
            callbacks: {},
            connected: true,
            on(event, callback) {
                this.callbacks[event] = callback;
            },
            emit(event, data) {
                if (event === 'user-joined') {
                    console.log('Mock emit user-joined:', data);
                } else if (event === 'create-post') {
                    // Simulate server response for new post
                    setTimeout(() => {
                        const confirmedPost = { ...data, id: Date.now(), isOptimistic: false, reactions: {}, timestamp: new Date().toISOString() };
                        if (this.callbacks['new-post']) {
                            this.callbacks['new-post'](confirmedPost);
                        }
                    }, 1000);
                }
            },
            disconnect() {
                this.connected = false;
            }
        };

        socketRef.current = mockSocket;

        // Simulate successful connection delay
        setTimeout(() => {
            setConnected(true);
            socketRef.current.emit('user-joined', {
                id: userId,
                name: `User${userId.slice(-4)}`,
                avatar: `User${userId.slice(-4)}`[0]
            });
        }, 500);

        socketRef.current.on('initial-posts', (initialPosts) => {
            setPosts(initialPosts);
            setLoading(false);
        });

        socketRef.current.on('new-post', (post) => {
            setPosts(prevPosts => {
                // Remove optimistic post if it exists
                const filteredPosts = prevPosts.filter(p => !p.isOptimistic);
                return [post, ...filteredPosts];
            });
        });

        socketRef.current.on('post-reaction', (data) => {
            setPosts(prevPosts => 
                prevPosts.map(post => 
                    post.id === data.postId 
                        ? { ...post, reactions: { ...post.reactions, [data.emoji]: (post.reactions[data.emoji] || 0) + 1 }}
                        : post
                )
            );
        });

        socketRef.current.on('users-count', (count) => {
            setOnlineUsers(count);
        });

        // Load initial posts
        setTimeout(() => {
            const samplePosts = generateSamplePosts();
            setPosts(samplePosts);
            setLoading(false);
        }, 1000);

        return () => {
            socketRef.current?.disconnect();
        };
    }, [userId]);

    const addOptimisticPost = useCallback((postData) => {
        const optimisticPost = {
            id: `temp-${Date.now()}`,
            user: { id: userId, name: `User${userId.slice(-4)}`, avatar: `User${userId.slice(-4)}`[0] },
            content: postData.content,
            image: postData.image,
            timestamp: new Date().toISOString(),
            reactions: {},
            isOptimistic: true
        };

        setPosts(prevPosts => [optimisticPost, ...prevPosts]);

        // Emit to server
        if (socketRef.current?.connected) {
            socketRef.current.emit('create-post', postData);
        } else {
            // Simulate server response for demo
            setTimeout(() => {
                const confirmedPost = { ...optimisticPost, id: Date.now(), isOptimistic: false };
                setPosts(prevPosts => [confirmedPost, ...prevPosts.filter(p => p.id !== optimisticPost.id)]);
            }, 1000);
        }
    }, [userId]);

    const reactToPost = useCallback((postId, emoji) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('react-to-post', { postId, emoji, userId });
        }
        
        // Optimistic update
        setPosts(prevPosts => 
            prevPosts.map(post => 
                post.id === postId 
                    ? { ...post, reactions: { ...post.reactions, [emoji]: (post.reactions[emoji] || 0) + 1 }}
                    : post
            )
        );
    }, [userId]);

    const generateSamplePosts = () => {
        const sampleContent = [
            "Just shipped a new React feature! 🚀",
            "Beautiful sunset today ☀️",
            "Coffee and code - perfect combination ☕",
            "Learning WebSockets is amazing!",
            "Building real-time apps with React",
            "CSS animations are so satisfying 🎨",
            "TypeScript makes everything better 💯",
            "Working on some cool UI components",
            "React hooks changed everything!",
            "Live coding session was awesome 📺"
        ];

        return Array.from({ length: 8 }, (_, i) => ({
            id: Date.now() + i,
            user: {
                id: `user-${i}`,
                name: `Developer${i + 1}`,
                avatar: `D${i + 1}`
            },
            content: sampleContent[i],
            timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
            reactions: {
                '❤️': Math.floor(Math.random() * 20),
                '👍': Math.floor(Math.random() * 15),
                '🚀': Math.floor(Math.random() * 10)
            },
            image: Math.random() > 0.6 ? `https://picsum.photos/400/300?random=${i}` : null
        }));
    };

    return {
        posts,
        loading,
        connected,
        onlineUsers,
        addOptimisticPost,
        reactToPost
    };
}

window.useRealTimeFeed = useRealTimeFeed;
