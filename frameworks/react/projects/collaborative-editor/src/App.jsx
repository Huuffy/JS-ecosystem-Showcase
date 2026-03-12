function App() {
    return React.createElement(window.DocumentProvider, null,
        React.createElement('div', { className: 'app' },
            React.createElement('div', { className: 'app-header' },
                React.createElement('h1', { className: 'app-title' }, '📝 CollabEdit'),
                React.createElement('p', { className: 'app-subtitle' }, 
                    'Industrial-Grade Real-time Collaborative Document Editor'
                )
            ),
            React.createElement('main', { className: 'main-content' },
                React.createElement(window.Editor)
            )
        )
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
