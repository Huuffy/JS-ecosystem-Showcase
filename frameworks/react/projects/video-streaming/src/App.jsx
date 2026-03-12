const { useState, useEffect } = React;

function App() {
    return React.createElement(window.VideoProvider, null,
        React.createElement('div', { className: 'app' },
            React.createElement(window.Header),
            React.createElement('div', { className: 'main-content' },
                React.createElement('div', { className: 'video-section' },
                    React.createElement(window.VideoPlayer)
                ),
                React.createElement(window.PlaylistSidebar)
            )
        )
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
