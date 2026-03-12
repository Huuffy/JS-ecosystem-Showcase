function Toolbar() {
    const [activeFormats, setActiveFormats] = React.useState(new Set());
    const { toggleCommentPanel } = window.useComments();
    const [showVersionHistory, setShowVersionHistory] = React.useState(false);
    const [showShareDialog, setShowShareDialog] = React.useState(false);

    // Apply active formats to the editor when formats change
    React.useEffect(() => {
        const applyActiveFormats = () => {
            // Apply bold
            if (activeFormats.has('bold') && !document.queryCommandState('bold')) {
                document.execCommand('bold', false, null);
            } else if (!activeFormats.has('bold') && document.queryCommandState('bold')) {
                document.execCommand('bold', false, null);
            }

            // Apply italic
            if (activeFormats.has('italic') && !document.queryCommandState('italic')) {
                document.execCommand('italic', false, null);
            } else if (!activeFormats.has('italic') && document.queryCommandState('italic')) {
                document.execCommand('italic', false, null);
            }

            // Apply underline
            if (activeFormats.has('underline') && !document.queryCommandState('underline')) {
                document.execCommand('underline', false, null);
            } else if (!activeFormats.has('underline') && document.queryCommandState('underline')) {
                document.execCommand('underline', false, null);
            }

            // Apply strikethrough
            if (activeFormats.has('strikethrough') && !document.queryCommandState('strikeThrough')) {
                document.execCommand('strikeThrough', false, null);
            } else if (!activeFormats.has('strikethrough') && document.queryCommandState('strikeThrough')) {
                document.execCommand('strikeThrough', false, null);
            }
        };

        // Focus the editor and apply formats
        const editor = document.querySelector('.editor-textarea');
        if (editor) {
            editor.focus();
            applyActiveFormats();
        }
    }, [activeFormats]);

    const formatText = (format) => {
        const editor = document.querySelector('.editor-textarea');
        if (!editor) return;

        // Toggle the format in our state
        const newFormats = new Set(activeFormats);
        if (newFormats.has(format)) {
            newFormats.delete(format);
        } else {
            newFormats.add(format);
        }
        setActiveFormats(newFormats);

        // Focus the editor
        editor.focus();

        // Apply the format immediately
        let command = '';
        switch(format) {
            case 'bold':
                command = 'bold';
                break;
            case 'italic':
                command = 'italic';
                break;
            case 'underline':
                command = 'underline';
                break;
            case 'strikethrough':
                command = 'strikeThrough';
                break;
        }
        
        if (command) {
            document.execCommand(command, false, null);
        }

        // Ensure cursor stays in editor
        const selection = window.getSelection();
        if (selection.rangeCount === 0) {
            const range = document.createRange();
            range.selectNodeContents(editor);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    const insertList = (type) => {
        const command = type === 'ordered' ? 'insertOrderedList' : 'insertUnorderedList';
        document.execCommand(command, false, null);
    };

    const changeTextAlign = (alignment) => {
        const commands = {
            'left': 'justifyLeft',
            'center': 'justifyCenter',
            'right': 'justifyRight',
            'justify': 'justifyFull'
        };
        
        if (commands[alignment]) {
            document.execCommand(commands[alignment], false, null);
        }
    };

    const changeFontSize = (size) => {
        document.execCommand('fontSize', false, size);
    };

    const changeTextColor = (color) => {
        document.execCommand('foreColor', false, color);
    };

    const clearFormatting = () => {
        setActiveFormats(new Set());
        document.execCommand('removeFormat', false, null);
        
        // Focus back to editor
        const editor = document.querySelector('.editor-textarea');
        if (editor) {
            editor.focus();
        }
    };

    const exportDocument = (format) => {
        const editor = document.querySelector('.editor-textarea');
        if (!editor) return;
        
        switch(format) {
            case 'txt':
                const textContent = editor.textContent || editor.innerText;
                const blob = new Blob([textContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'document.txt';
                a.click();
                URL.revokeObjectURL(url);
                break;
            case 'html':
                const htmlContent = editor.innerHTML;
                const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
                const htmlUrl = URL.createObjectURL(htmlBlob);
                const htmlA = document.createElement('a');
                htmlA.href = htmlUrl;
                htmlA.download = 'document.html';
                htmlA.click();
                URL.revokeObjectURL(htmlUrl);
                break;
            case 'pdf':
                alert('PDF export would be implemented with a library like jsPDF');
                break;
            case 'docx':
                alert('DOCX export would be implemented with a library like docx');
                break;
        }
    };

    const toolbarButtons = [
        { id: 'bold', icon: '𝐁', title: 'Bold (Ctrl+B) - Toggle for new text' },
        { id: 'italic', icon: '𝐼', title: 'Italic (Ctrl+I) - Toggle for new text' },
        { id: 'underline', icon: '𝐔', title: 'Underline (Ctrl+U) - Toggle for new text' },
        { id: 'strikethrough', icon: '𝐒', title: 'Strikethrough - Toggle for new text' }
    ];

    return React.createElement('div', { className: 'toolbar' },
        React.createElement('div', { className: 'toolbar-group' },
            toolbarButtons.map(button =>
                React.createElement('button', {
                    key: button.id,
                    className: `toolbar-btn ${activeFormats.has(button.id) ? 'active' : ''}`,
                    onClick: () => formatText(button.id),
                    title: button.title
                }, button.icon)
            ),
            React.createElement('button', {
                className: 'toolbar-btn clear-format',
                onClick: clearFormatting,
                title: 'Clear all formatting'
            }, '🧹')
        ),
        
        React.createElement('div', { className: 'toolbar-group' },
            React.createElement('button', {
                className: 'toolbar-btn',
                onClick: () => insertList('unordered'),
                title: 'Bullet List'
            }, '•'),
            React.createElement('button', {
                className: 'toolbar-btn',
                onClick: () => insertList('ordered'),
                title: 'Numbered List'
            }, '1.')
        ),

        React.createElement('div', { className: 'toolbar-group' },
            React.createElement('button', {
                className: 'toolbar-btn',
                onClick: () => changeTextAlign('left'),
                title: 'Align Left'
            }, '⬅'),
            React.createElement('button', {
                className: 'toolbar-btn',
                onClick: () => changeTextAlign('center'),
                title: 'Align Center'
            }, '↔'),
            React.createElement('button', {
                className: 'toolbar-btn',
                onClick: () => changeTextAlign('right'),
                title: 'Align Right'
            }, '➡')
        ),

        React.createElement('div', { className: 'toolbar-group' },
            React.createElement('select', {
                className: 'font-size-select',
                onChange: (e) => {
                    if (e.target.value) {
                        changeFontSize(e.target.value);
                        e.target.value = '';
                    }
                },
                defaultValue: ''
            },
                React.createElement('option', { value: '', disabled: true }, 'Size'),
                React.createElement('option', { value: '1' }, 'Small'),
                React.createElement('option', { value: '3' }, 'Normal'),
                React.createElement('option', { value: '5' }, 'Large'),
                React.createElement('option', { value: '7' }, 'Huge')
            ),
            React.createElement('input', {
                type: 'color',
                className: 'color-picker',
                onChange: (e) => changeTextColor(e.target.value),
                title: 'Text Color'
            })
        ),
        
        React.createElement('div', { className: 'toolbar-group' },
            React.createElement('button', {
                className: 'toolbar-btn',
                onClick: toggleCommentPanel,
                title: 'Toggle Comments (Ctrl+/)'
            }, '💬'),
            React.createElement('button', {
                className: 'toolbar-btn',
                onClick: () => setShowVersionHistory(!showVersionHistory),
                title: 'Version History'
            }, '📝'),
            React.createElement('button', {
                className: 'toolbar-btn',
                onClick: () => setShowShareDialog(!showShareDialog),
                title: 'Share Document'
            }, '🔗')
        ),
        
        React.createElement('div', { className: 'toolbar-group' },
            React.createElement('select', {
                className: 'export-select',
                onChange: (e) => {
                    if (e.target.value) {
                        exportDocument(e.target.value);
                        e.target.value = '';
                    }
                },
                defaultValue: ''
            },
                React.createElement('option', { value: '', disabled: true }, 'Export...'),
                React.createElement('option', { value: 'txt' }, 'Text (.txt)'),
                React.createElement('option', { value: 'html' }, 'HTML (.html)'),
                React.createElement('option', { value: 'pdf' }, 'PDF (.pdf)'),
                React.createElement('option', { value: 'docx' }, 'Word (.docx)')
            )
        ),
        
        showVersionHistory && React.createElement(window.VersionHistory),
        showShareDialog && React.createElement(window.ShareDialog)
    );
}

window.Toolbar = Toolbar;
