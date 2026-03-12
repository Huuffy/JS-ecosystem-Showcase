const { createContext, useContext, useState, useReducer } = React;

const DocumentContext = createContext();

function useDocument() {
    return useContext(DocumentContext);
}

function documentReducer(state, action) {
    switch (action.type) {
        case 'SET_CONTENT':
            return { ...state, content: action.payload };
        case 'ADD_USER':
            return { 
                ...state, 
                activeUsers: [...state.activeUsers.filter(u => u.id !== action.payload.id), action.payload]
            };
        case 'REMOVE_USER':
            return { 
                ...state, 
                activeUsers: state.activeUsers.filter(u => u.id !== action.payload)
            };
        case 'UPDATE_CURSOR':
            return {
                ...state,
                cursors: { ...state.cursors, [action.payload.userId]: action.payload.position }
            };
        case 'ADD_COMMENT':
            return {
                ...state,
                comments: [...state.comments, action.payload]
            };
        case 'ADD_REPLY':
            return {
                ...state,
                replies: [...(state.replies || []), action.payload]
            };
        case 'RESOLVE_COMMENT':
            return {
                ...state,
                comments: state.comments.map(c => 
                    c.id === action.payload ? { ...c, resolved: !c.resolved } : c
                )
            };
        case 'SET_VERSION':
            return { ...state, currentVersion: action.payload };
        case 'ADD_VERSION':
            return {
                ...state,
                versions: [...state.versions, action.payload]
            };
        case 'SET_SAVING':
            return { ...state, isSaving: action.payload };
        case 'TOGGLE_COMMENT_PANEL':
            return { ...state, showCommentPanel: !state.showCommentPanel };
        case 'UNDO':
            if (state.undoStack.length > 0) {
                const lastState = state.undoStack[state.undoStack.length - 1];
                return {
                    ...state,
                    content: lastState,
                    undoStack: state.undoStack.slice(0, -1),
                    redoStack: [...state.redoStack, state.content]
                };
            }
            return state;
        case 'REDO':
            if (state.redoStack.length > 0) {
                const nextState = state.redoStack[state.redoStack.length - 1];
                return {
                    ...state,
                    content: nextState,
                    redoStack: state.redoStack.slice(0, -1),
                    undoStack: [...state.undoStack, state.content]
                };
            }
            return state;
        case 'PUSH_UNDO':
            return {
                ...state,
                undoStack: [...state.undoStack.slice(-19), action.payload],
                redoStack: []
            };
        default:
            return state;
    }
}

const initialState = {
    content: 'Welcome to CollabEdit! Start typing to see real-time collaboration in action.\n\nThis is an advanced collaborative editor with features like:\n• Real-time editing\n• Live cursors\n• Comments and replies\n• Version history\n• Auto-save\n• Keyboard shortcuts\n\nTry Ctrl+S to save, Ctrl+Z to undo, or Ctrl+/ for comments!',
    activeUsers: [],
    cursors: {},
    comments: [
        {
            id: 'demo-comment-1',
            text: 'Welcome to the collaborative editor! Try adding your own comments.',
            author: 'System',
            timestamp: new Date().toISOString(),
            resolved: false,
            range: { start: 0, end: 20 }
        }
    ],
    replies: [],
    versions: [
        {
            id: 1,
            timestamp: new Date(Date.now() - 3600000),
            author: 'System',
            changes: 'Initial document creation',
            content: 'Initial version content'
        }
    ],
    currentVersion: 1,
    documentId: 'demo-doc-001',
    title: 'Collaborative Document Demo',
    isSaving: false,
    showCommentPanel: false,
    undoStack: [],
    redoStack: []
};

function DocumentProvider({ children }) {
    const [state, dispatch] = useReducer(documentReducer, initialState);
    const [isConnected, setIsConnected] = useState(false);

    return React.createElement(DocumentContext.Provider, {
        value: {
            ...state,
            dispatch,
            isConnected,
            setIsConnected
        }
    }, children);
}

window.useDocument = useDocument;
window.DocumentProvider = DocumentProvider;
