function useComments() {
    const { comments, replies, dispatch, showCommentPanel } = window.useDocument();
    const [selectedRange, setSelectedRange] = React.useState(null);
    const [replyingTo, setReplyingTo] = React.useState(null);

    const addComment = React.useCallback((text, range) => {
        const comment = {
            id: `comment-${Date.now()}`,
            text,
            range: range || { start: 0, end: 0 },
            author: window.getCurrentUserName(),
            timestamp: new Date().toISOString(),
            resolved: false
        };

        dispatch({ type: 'ADD_COMMENT', payload: comment });
    }, [dispatch]);

    const addReply = React.useCallback((parentId, text) => {
        const reply = {
            id: `reply-${Date.now()}`,
            text,
            parentId,
            author: window.getCurrentUserName(),
            timestamp: new Date().toISOString()
        };

        dispatch({ type: 'ADD_REPLY', payload: reply });
        setReplyingTo(null);
    }, [dispatch]);

    const resolveComment = React.useCallback((commentId) => {
        dispatch({ type: 'RESOLVE_COMMENT', payload: commentId });
    }, [dispatch]);

    const toggleCommentPanel = React.useCallback(() => {
        dispatch({ type: 'TOGGLE_COMMENT_PANEL' });
    }, [dispatch]);

    const getCommentsInRange = React.useCallback((start, end) => {
        return comments.filter(comment => 
            comment.range.start >= start && comment.range.end <= end
        );
    }, [comments]);

    const getRepliesForComment = React.useCallback((commentId) => {
        return (replies || []).filter(reply => reply.parentId === commentId);
    }, [replies]);

    return {
        comments,
        replies,
        selectedRange,
        setSelectedRange,
        showCommentPanel,
        replyingTo,
        setReplyingTo,
        addComment,
        addReply,
        resolveComment,
        toggleCommentPanel,
        getCommentsInRange,
        getRepliesForComment
    };
}

window.useComments = useComments;
