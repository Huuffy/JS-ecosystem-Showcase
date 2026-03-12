// WebSocket service for real-time communication
const socketService = {
    socket: null,
    connected: false,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5,
    reconnectDelay: 1000,

    connect(url = 'http://localhost:5000') {
        if (this.socket) {
            this.disconnect();
        }

        this.socket = io(url, {
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: this.reconnectDelay
        });

        this.setupEventListeners();
    },

    setupEventListeners() {
        this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket.id);
            this.connected = true;
            this.reconnectAttempts = 0;
            this.emit('user-online', { userId: this.getCurrentUserId() });
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            this.connected = false;
        });

        this.socket.on('reconnect', (attemptNumber) => {
            console.log('Socket reconnected after', attemptNumber, 'attempts');
            this.connected = true;
        });

        this.socket.on('reconnect_error', (error) => {
            console.error('Socket reconnection failed:', error);
            this.reconnectAttempts++;
        });

        // Application-specific events
        this.socket.on('ticket-created', (data) => {
            this.handleTicketCreated(data);
        });

        this.socket.on('ticket-updated', (data) => {
            this.handleTicketUpdated(data);
        });

        this.socket.on('message-received', (data) => {
            this.handleMessageReceived(data);
        });

        this.socket.on('user-typing', (data) => {
            this.handleUserTyping(data);
        });
    },

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
        }
    },

    emit(event, data) {
        if (this.socket && this.connected) {
            this.socket.emit(event, data);
        } else {
            console.warn('Socket not connected, cannot emit:', event);
        }
    },

    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    },

    off(event, callback) {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    },

    // Application-specific methods
    joinTenantRoom(tenantId) {
        this.emit('join-tenant', { tenantId });
    },

    leaveTenantRoom(tenantId) {
        this.emit('leave-tenant', { tenantId });
    },

    sendTypingIndicator(ticketId, isTyping) {
        this.emit('typing', { ticketId, isTyping });
    },

    // Event handlers
    handleTicketCreated(data) {
        // Dispatch custom event for components to listen
        window.dispatchEvent(new CustomEvent('ticket-created', { detail: data }));
        
        // Show notification
        this.showNotification('New Ticket', `Ticket ${data.id} has been created`);
    },

    handleTicketUpdated(data) {
        window.dispatchEvent(new CustomEvent('ticket-updated', { detail: data }));
    },

    handleMessageReceived(data) {
        window.dispatchEvent(new CustomEvent('message-received', { detail: data }));
        
        // Show notification if not current ticket
        if (!this.isCurrentTicket(data.ticketId)) {
            this.showNotification('New Message', `New message in ticket ${data.ticketId}`);
        }
    },

    handleUserTyping(data) {
        window.dispatchEvent(new CustomEvent('user-typing', { detail: data }));
    },

    // Helper methods
    getCurrentUserId() {
        // Get from localStorage or context
        return localStorage.getItem('userId') || 'anonymous';
    },

    isCurrentTicket(ticketId) {
        // Check if the ticket is currently being viewed
        return window.location.hash.includes(ticketId);
    },

    showNotification(title, message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/favicon.ico'
            });
        }
    },

    // Request notification permission
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
};

window.socketService = socketService;
