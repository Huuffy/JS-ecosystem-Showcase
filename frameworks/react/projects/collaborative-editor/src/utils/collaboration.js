// Advanced utility functions for operational transform and collaboration

function generateOperation(type, position, text, userId) {
    return {
        id: `op-${Date.now()}-${Math.random()}`,
        type,
        position,
        text,
        userId,
        timestamp: Date.now()
    };
}

function getCurrentUserId() {
    if (!localStorage.getItem('userId')) {
        const userId = `user-${Math.floor(Math.random() * 100000)}`;
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', `User ${Math.floor(Math.random() * 1000)}`);
    }
    return localStorage.getItem('userId');
}

function getCurrentUserName() {
    return localStorage.getItem('userName') || 'Anonymous User';
}

function getRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#FF8A65', '#81C784', '#64B5F6'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Simplified operational transform for concurrent edits
function transformOperation(op1, op2) {
    if (op1.type === 'insert' && op2.type === 'insert') {
        if (op1.position <= op2.position) {
            return { ...op2, position: op2.position + op1.text.length };
        }
    } else if (op1.type === 'delete' && op2.type === 'insert') {
        if (op1.position < op2.position) {
            return { ...op2, position: op2.position - op1.length };
        }
    }
    return op2;
}

// Export functions to global scope
window.generateOperation = generateOperation;
window.getCurrentUserId = getCurrentUserId;
window.getCurrentUserName = getCurrentUserName;
window.getRandomColor = getRandomColor;
window.transformOperation = transformOperation;
