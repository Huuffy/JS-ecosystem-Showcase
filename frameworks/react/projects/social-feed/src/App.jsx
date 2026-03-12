const { useState, useEffect } = React;

function App() {
    const userId = useState(() => `user-${Date.now()}`)[0];
    const {
        posts,
        loading,
        connected,
        onlineUsers,
        addOptimisticPost,
        reactToPost
    } = window.useRealTimeFeed(userId);

    return React.createElement('div', { className: 'app' },
        React.createElement(window.Header, {
            onlineUsers: onlineUsers,
            connected: connected
        }),
        React.createElement('main', { className: 'main-content' },
            React.createElement(window.PostCreator, {
                onCreatePost: addOptimisticPost
            }),
            React.createElement(window.Feed, {
                posts: posts,
                loading: loading,
                onReact: reactToPost
            })
        )
    );
}

// Render the app
ReactDOM.render(React.createElement(App), document.getElementById('root'));
