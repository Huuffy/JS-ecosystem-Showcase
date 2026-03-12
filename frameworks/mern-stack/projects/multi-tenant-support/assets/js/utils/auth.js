// Authentication utility functions
const auth = {
    // Token management
    getToken() {
        return localStorage.getItem('authToken');
    },

    setToken(token) {
        localStorage.setItem('authToken', token);
        this.scheduleTokenRefresh(token);
    },

    clearToken() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        this.clearTokenRefresh();
    },

    // Refresh token management
    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    },

    setRefreshToken(token) {
        localStorage.setItem('refreshToken', token);
    },

    // User management
    getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    },

    setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('userId', user.id);
    },

    clearCurrentUser() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userId');
    },

    // Authentication state
    isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;
        
        // Check if token is expired
        try {
            const payload = this.parseJWT(token);
            return payload.exp * 1000 > Date.now();
        } catch (error) {
            return false;
        }
    },

    // JWT parsing
    parseJWT(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            throw new Error('Invalid JWT token');
        }
    },

    // Login
    async login(credentials) {
        try {
            const response = await api.auth.login(credentials);
            
            if (response.token) {
                this.setToken(response.token);
                if (response.refreshToken) {
                    this.setRefreshToken(response.refreshToken);
                }
                if (response.user) {
                    this.setCurrentUser(response.user);
                }
                return { success: true, user: response.user };
            }
            
            return { success: false, error: 'Invalid credentials' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Logout
    async logout() {
        try {
            await api.auth.logout();
        } catch (error) {
            console.error('Logout API call failed:', error);
        } finally {
            this.clearToken();
            this.clearCurrentUser();
            tenantService.clearTenant();
            window.location.href = '/login';
        }
    },

    // Token refresh
    async refreshToken() {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            this.logout();
            return false;
        }

        try {
            const response = await api.auth.refresh();
            if (response.token) {
                this.setToken(response.token);
                return true;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
        }

        this.logout();
        return false;
    },

    // Schedule automatic token refresh
    scheduleTokenRefresh(token) {
        this.clearTokenRefresh();
        
        try {
            const payload = this.parseJWT(token);
            const expiresIn = (payload.exp * 1000) - Date.now();
            const refreshTime = expiresIn - (5 * 60 * 1000); // Refresh 5 minutes before expiry
            
            if (refreshTime > 0) {
                this.refreshTimeout = setTimeout(() => {
                    this.refreshToken();
                }, refreshTime);
            }
        } catch (error) {
            console.error('Failed to schedule token refresh:', error);
        }
    },

    clearTokenRefresh() {
        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
            this.refreshTimeout = null;
        }
    },

// Permission checking
    hasRole(role) {
        const user = this.getCurrentUser();
        return user && user.roles && user.roles.includes(role);
    },

    hasPermission(permission) {
        const user = this.getCurrentUser();
        return user && user.permissions && user.permissions.includes(permission);
    },

    // Check if user can access tenant
    canAccessTenant(tenantId) {
        const user = this.getCurrentUser();
        return user && user.tenants && user.tenants.includes(tenantId);
    },

    // Initialize authentication on page load
    init() {
        const token = this.getToken();
        if (token && this.isAuthenticated()) {
            this.scheduleTokenRefresh(token);
            return true;
        } else {
            this.clearToken();
            this.clearCurrentUser();
            return false;
        }
    },

    // Redirect to login if not authenticated
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '/login';
            return false;
        }
        return true;
    }
};

window.auth = auth;