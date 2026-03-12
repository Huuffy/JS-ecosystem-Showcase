function CommentPanel() {
    const { 
        comments, 
        showCommentPanel, 
        addComment, 
        addReply, 
        resolveComment, 
        toggleCommentPanel,
        replyingTo,
        setReplyingTo,
        getRepliesForComment
    } = window.useComments();
    const [newComment, setNewComment] = React.useState('');
    const [replyText, setReplyText] = React.useState('');

    const handleAddComment = () => {
        if (newComment.trim()) {
            addComment(newComment, { start: 0, end: 0 });
            setNewComment('');
        }
    };

    const handleAddReply = (parentId) => {
        if (replyText.trim()) {
            addReply(parentId, replyText);
            setReplyText('');
        }
    };

    if (!showCommentPanel) return null;

    return React.createElement('div', { className: 'comment-panel' },
        React.createElement('div', { className: 'comment-header' },
            React.createElement('h3', null, `Comments (${comments.length})`),
            React.createElement('button', { 
                className: 'close-btn',
                onClick: toggleCommentPanel,
                title: 'Close comments panel'
            }, '×')
        ),
        React.createElement('div', { className: 'comment-list' },
            comments.map(comment =>
                React.createElement('div', { 
                    key: comment.id,
                    className: `comment-item ${comment.resolved ? 'resolved' : ''}`
                },
                    React.createElement('div', { className: 'comment-author' }, 
                        comment.author,
                        comment.resolved && React.createElement('span', { className: 'resolved-badge' }, '✓ Resolved')
                    ),
                    React.createElement('div', { className: 'comment-text' }, comment.text),
                    React.createElement('div', { className: 'comment-time' }, 
                        new Date(comment.timestamp).toLocaleString()
                    ),
                    React.createElement('div', { className: 'comment-actions' },
                        React.createElement('button', {
                            className: 'reply-btn',
                            onClick: () => setReplyingTo(replyingTo === comment.id ? null : comment.id)
                        }, replyingTo === comment.id ? 'Cancel' : 'Reply'),
                        React.createElement('button', {
                            className: 'resolve-btn',
                            onClick: () => resolveComment(comment.id)
                        }, comment.resolved ? 'Unresolve' : 'Resolve')
                    ),
                    
                    // Show replies
                    getRepliesForComment(comment.id).map(reply =>
                        React.createElement('div', {
                            key: reply.id,
                            className: 'reply-item'
                        },
                            React.createElement('div', { className: 'reply-author' }, reply.author),
                            React.createElement('div', { className: 'reply-text' }, reply.text),
                            React.createElement('div', { className: 'reply-time' }, 
                                new Date(reply.timestamp).toLocaleString()
                            )
                        )
                    ),
                    
                    // Reply input
                    replyingTo === comment.id && React.createElement('div', { className: 'reply-input' },
                        React.createElement('textarea', {
                            value: replyText,
                            onChange: (e) => setReplyText(e.target.value),
                            placeholder: 'Write a reply...',
                            className: 'reply-textarea'
                        }),
                        React.createElement('button', {
                            onClick: () => handleAddReply(comment.id),
                            className: 'add-reply-btn',
                            disabled: !replyText.trim()
                        }, 'Reply')
                    )
                )
            )
        ),
        React.createElement('div', { className: 'comment-input' },
            React.createElement('textarea', {
                value: newComment,
                onChange: (e) => setNewComment(e.target.value),
                placeholder: 'Add a comment...',
                className: 'comment-textarea'
            }),
            React.createElement('button', {
                onClick: handleAddComment,
                className: 'add-comment-btn',
                disabled: !newComment.trim()
            }, 'Add Comment')
        )
    );
}

window.CommentPanel = CommentPanel;
