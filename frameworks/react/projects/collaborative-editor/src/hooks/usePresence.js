function usePresence() {
    const { activeUsers, cursors } = window.useDocument();
    const [currentUser] = React.useState(() => ({
        id: window.getCurrentUserId(),
        name: window.getCurrentUserName(),
        color: window.getRandomColor(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${window.getCurrentUserId()}`
    }));

    const getUserCursor = React.useCallback((userId) => {
        return cursors[userId] || null;
    }, [cursors]);

    const getActiveUserCount = React.useCallback(() => {
        return activeUsers.length;
    }, [activeUsers]);

    return {
        currentUser,
        activeUsers,
        cursors,
        getUserCursor,
        getActiveUserCount
    };
}

window.usePresence = usePresence;
