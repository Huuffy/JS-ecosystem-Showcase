function VersionHistory() {
    const { versions, content, dispatch } = window.useDocument();
    const [selectedVersion, setSelectedVersion] = React.useState(null);

    const restoreVersion = React.useCallback((version) => {
        if (window.confirm(`Restore to version from ${new Date(version.timestamp).toLocaleString()}?`)) {
            // Push current content to undo stack
            dispatch({ type: 'PUSH_UNDO', payload: content });
            
            // Restore version content
            dispatch({ 
                type: 'SET_CONTENT', 
                payload: version.content || `Restored content from version ${version.id}\n\n${content}` 
            });
            
            // Add restoration to version history
            dispatch({
                type: 'ADD_VERSION',
                payload: {
                    id: Date.now(),
                    timestamp: new Date(),
                    author: window.getCurrentUserName(),
                    changes: `Restored to version ${version.id}`,
                    content: version.content || content
                }
            });
            
            alert(`Document restored to version from ${new Date(version.timestamp).toLocaleString()}`);
        }
    }, [content, dispatch]);

    const previewVersion = (version) => {
        setSelectedVersion(selectedVersion?.id === version.id ? null : version);
    };

    return React.createElement('div', { className: 'version-history' },
        React.createElement('h3', null, `Version History (${versions.length} versions)`),
        React.createElement('div', { className: 'version-list' },
            versions.slice().reverse().map(version =>
                React.createElement('div', {
                    key: version.id,
                    className: `version-item ${selectedVersion?.id === version.id ? 'selected' : ''}`
                },
                    React.createElement('div', { className: 'version-info' },
                        React.createElement('span', { className: 'version-author' }, version.author),
                        React.createElement('span', { className: 'version-time' }, 
                            new Date(version.timestamp).toLocaleString()
                        )
                    ),
                    React.createElement('div', { className: 'version-changes' }, version.changes),
                    React.createElement('div', { className: 'version-actions' },
                        React.createElement('button', { 
                            className: 'preview-btn',
                            onClick: () => previewVersion(version)
                        }, selectedVersion?.id === version.id ? 'Hide Preview' : 'Preview'),
                        React.createElement('button', { 
                            className: 'restore-btn',
                            onClick: () => restoreVersion(version)
                        }, 'Restore')
                    ),
                    selectedVersion?.id === version.id && React.createElement('div', { className: 'version-preview' },
                        React.createElement('h4', null, 'Preview:'),
                        React.createElement('div', { className: 'preview-content' },
                            version.content || 'No content preview available'
                        )
                    )
                )
            )
        )
    );
}

window.VersionHistory = VersionHistory;
