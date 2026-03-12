function Header() {
    return React.createElement('header', { className: 'header' },
        React.createElement('div', { className: 'header-content' },
            React.createElement('h1', { className: 'app-title' }, '🎬 StreamFlix'),
            React.createElement('div', { className: 'header-info' },
                React.createElement('div', { className: 'app-description' },
                    'Mobile Game Video Collection'
                )
            )
        )
    );
}

window.Header = Header;
