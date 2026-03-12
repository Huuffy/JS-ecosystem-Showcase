// Comprehensive API service with error handling and authentication
const api = {
    baseURL: 'http://localhost:5000/api',
    
    // Helper method to get headers with authentication
    getHeaders() {
        const token = localStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    },

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            credentials: 'include',
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                if (response.status === 401) {
                    // Handle unauthorized - redirect to login
                    localStorage.removeItem('authToken');
                    window.location.href = '/login';
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            return await response.text();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    },

    // GET request
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    // POST request
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // PUT request
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    },

    // Specific API methods
    tickets: {
        getAll: () => api.get('/tickets'),
        getById: (id) => api.get(`/tickets/${id}`),
        create: (data) => api.post('/tickets', data),
        update: (id, data) => api.put(`/tickets/${id}`, data),
        delete: (id) => api.delete(`/tickets/${id}`),
        addMessage: (id, message) => api.post(`/tickets/${id}/messages`, message)
    },

    tenants: {
        getAll: () => api.get('/tenants'),
        getById: (id) => api.get(`/tenants/${id}`),
        update: (id, data) => api.put(`/tenants/${id}`, data)
    },

    analytics: {
        getMetrics: (timeRange) => api.get(`/analytics/metrics?range=${timeRange}`),
        getChartData: (type, timeRange) => api.get(`/analytics/charts/${type}?range=${timeRange}`)
    },

    auth: {
        login: (credentials) => api.post('/auth/login', credentials),
        logout: () => api.post('/auth/logout'),
        refresh: () => api.post('/auth/refresh')
    }
};

window.api = api;
