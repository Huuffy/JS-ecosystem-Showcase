function Editor() {
    const { content, dispatch, isSaving, undoStack, redoStack } = window.useDocument();
    const { insertText, deleteText, updateCursor } = window.useCollaboration();
    const { currentUser, activeUsers, cursors } = window.usePresence();
    const { toggleCommentPanel } = window.useComments();
    const editorRef = React.useRef(null);
    const [selection, setSelection] = React.useState({ start: 0, end: 0 });
    const lastContentRef = React.useRef(content);

    // Auto-save functionality
    React.useEffect(() => {
        if (content !== lastContentRef.current) {
            dispatch({ type: 'SET_SAVING', payload: true });
            
            const timer = setTimeout(() => {
                dispatch({ type: 'SET_SAVING', payload: false });
                console.log('Document auto-saved');
                
                // Add to version history
                dispatch({
                    type: 'ADD_VERSION',
                    payload: {
                        id: Date.now(),
                        timestamp: new Date(),
                        author: window.getCurrentUserName(),
                        changes: 'Auto-saved changes',
                        content: content
                    }
                });
            }, 2000);

            lastContentRef.current = content;
            return () => clearTimeout(timer);
        }
    }, [content, dispatch]);

    // Set initial content and handle content updates without cursor jumping
    React.useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== content) {
            const selection = window.getSelection();
            const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
            const startOffset = range ? range.startOffset : 0;
            const endOffset = range ? range.endOffset : 0;
            
            editorRef.current.innerHTML = content;
            
            // Restore cursor position
            if (range && editorRef.current.firstChild) {
                try {
                    const newRange = document.createRange();
                    const textNode = editorRef.current.firstChild;
                    newRange.setStart(textNode, Math.min(startOffset, textNode.textContent.length));
                    newRange.setEnd(textNode, Math.min(endOffset, textNode.textContent.length));
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                } catch (e) {
                    // Fallback: place cursor at end
                    const newRange = document.createRange();
                    newRange.selectNodeContents(editorRef.current);
                    newRange.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                }
            }
        }
    }, [content]);

    const handleContentChange = React.useCallback((e) => {
        const newContent = e.target.innerHTML;
        const oldContent = content;
        
        // Only update if content actually changed
        if (oldContent !== newContent) {
            // Push to undo stack
            dispatch({ type: 'PUSH_UNDO', payload: oldContent });
            dispatch({ type: 'SET_CONTENT', payload: newContent });
        }
    }, [content, dispatch]);

    const handleSelectionChange = React.useCallback(() => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            setSelection({ 
                start: range.startOffset, 
                end: range.endOffset 
            });
            updateCursor(range.startOffset);
        }
    }, [updateCursor]);

    const handleKeyDown = React.useCallback((e) => {
        // Ctrl+S for save
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            dispatch({ type: 'SET_SAVING', payload: true });
            setTimeout(() => {
                dispatch({ type: 'SET_SAVING', payload: false });
                alert('Document saved!');
            }, 500);
        }
        
        // Ctrl+Z for undo
        if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            if (undoStack.length > 0) {
                dispatch({ type: 'UNDO' });
                if (editorRef.current) {
                    editorRef.current.innerHTML = undoStack[undoStack.length - 1];
                }
            }
        }
        
        // Ctrl+Shift+Z for redo
        if (e.ctrlKey && e.shiftKey && e.key === 'z') {
            e.preventDefault();
            if (redoStack.length > 0) {
                dispatch({ type: 'REDO' });
                if (editorRef.current) {
                    editorRef.current.innerHTML = redoStack[redoStack.length - 1];
                }
            }
        }
        
        // Ctrl+/ for comments
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            toggleCommentPanel();
        }

        // Ctrl+B for bold (toggle)
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            const boldBtn = document.querySelector('.toolbar-btn[title*="Bold"]');
            if (boldBtn) boldBtn.click();
        }

        // Ctrl+I for italic (toggle)
        if (e.ctrlKey && e.key === 'i') {
            e.preventDefault();
            const italicBtn = document.querySelector('.toolbar-btn[title*="Italic"]');
            if (italicBtn) italicBtn.click();
        }

        // Ctrl+U for underline (toggle)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            const underlineBtn = document.querySelector('.toolbar-btn[title*="Underline"]');
            if (underlineBtn) underlineBtn.click();
        }
    }, [dispatch, toggleCommentPanel, undoStack, redoStack]);

    const handlePaste = React.useCallback((e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    }, []);

    const renderLiveCursors = () => {
        return Object.entries(cursors).map(([userId, position]) => {
            const user = activeUsers.find(u => u.id === userId);
            if (!user || userId === currentUser.id) return null;
            
            return React.createElement('div', {
                key: userId,
                className: 'live-cursor',
                style: {
                    position: 'absolute',
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    borderLeft: `2px solid ${user.color}`,
                    height: '20px',
                    pointerEvents: 'none',
                    zIndex: 10
                }
            },
                React.createElement('div', {
                    className: 'cursor-label',
                    style: {
                        background: user.color,
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '12px',
                        marginTop: '-25px',
                        whiteSpace: 'nowrap'
                    }
                }, user.name)
            );
        });
    };

    return React.createElement('div', { className: 'editor-container' },
        React.createElement('div', { className: 'editor-header' },
            React.createElement('div', { className: 'title-section' },
                React.createElement('h1', { className: 'document-title' }, 'Collaborative Document'),
                isSaving && React.createElement('span', { className: 'saving-indicator' }, '💾 Saving...')
            ),
            React.createElement(window.UserPresence),
            React.createElement(window.Toolbar)
        ),
        React.createElement('div', { className: 'editor-content' },
            React.createElement('div', { className: 'editor-wrapper' },
                React.createElement('div', {
                    ref: editorRef,
                    className: 'editor-textarea',
                    contentEditable: true,
                    onInput: handleContentChange,
                    onKeyDown: handleKeyDown,
                    onPaste: handlePaste,
                    onMouseUp: handleSelectionChange,
                    onKeyUp: handleSelectionChange,
                    suppressContentEditableWarning: true,
                    'data-placeholder': 'Start typing to collaborate...'
                }),
                renderLiveCursors()
            ),
            React.createElement(window.CommentPanel)
        ),
        React.createElement('div', { className: 'editor-footer' },
            React.createElement('div', { className: 'shortcuts-info' },
                'Shortcuts: Ctrl+S (Save) | Ctrl+Z (Undo) | Ctrl+Shift+Z (Redo) | Ctrl+/ (Comments) | Ctrl+B (Bold) | Ctrl+I (Italic) | Ctrl+U (Underline)'
            ),
            React.createElement('div', { className: 'status-info' },
                `${editorRef.current ? editorRef.current.textContent.length : 0} characters | ${undoStack.length} undo steps | ${redoStack.length} redo steps`
            )
        )
    );
}

window.Editor = Editor;
