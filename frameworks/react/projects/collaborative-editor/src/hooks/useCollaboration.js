function useCollaboration() {
    const { content, dispatch, documentId, isConnected, setIsConnected } = window.useDocument();
    const socketRef = React.useRef(null);
    const [operationQueue, setOperationQueue] = React.useState([]);

    React.useEffect(() => {
        // Simulate WebSocket connection
        const connectToServer = () => {
            setIsConnected(true);
            console.log('Connected to collaboration server');
            
            // Simulate joining document
            const currentUser = {
                id: window.getCurrentUserId(),
                name: window.getCurrentUserName(),
                color: window.getRandomColor(),
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${window.getCurrentUserId()}`
            };
            
            dispatch({ type: 'ADD_USER', payload: currentUser });
        };

        // Simulate connection after delay
        const timer = setTimeout(connectToServer, 1000);
        
        return () => {
            clearTimeout(timer);
            setIsConnected(false);
        };
    }, [documentId]);

    const applyOperation = React.useCallback((operation) => {
        switch (operation.type) {
            case 'insert':
                const newContent = content.slice(0, operation.position) + 
                                 operation.text + 
                                 content.slice(operation.position);
                dispatch({ type: 'SET_CONTENT', payload: newContent });
                break;
            case 'delete':
                const deletedContent = content.slice(0, operation.position) + 
                                     content.slice(operation.position + operation.length);
                dispatch({ type: 'SET_CONTENT', payload: deletedContent });
                break;
        }
    }, [content, dispatch]);

    const sendOperation = React.useCallback((operation) => {
        if (isConnected) {
            console.log('Sending operation:', operation);
            // In real implementation, send via WebSocket
        } else {
            setOperationQueue(prev => [...prev, operation]);
        }
    }, [isConnected]);

    const insertText = React.useCallback((position, text) => {
        const operation = window.generateOperation('insert', position, text, window.getCurrentUserId());
        applyOperation(operation);
        sendOperation(operation);
    }, [applyOperation, sendOperation]);

    const deleteText = React.useCallback((position, length) => {
        const operation = window.generateOperation('delete', position, '', window.getCurrentUserId());
        operation.length = length;
        applyOperation(operation);
        sendOperation(operation);
    }, [applyOperation, sendOperation]);

    const updateCursor = React.useCallback((position) => {
        dispatch({
            type: 'UPDATE_CURSOR',
            payload: {
                userId: window.getCurrentUserId(),
                position: { x: position * 8, y: 100 } // Simulate cursor position
            }
        });
    }, [dispatch]);

    return {
        insertText,
        deleteText,
        updateCursor,
        isConnected,
        operationQueue
    };
}

window.useCollaboration = useCollaboration;
