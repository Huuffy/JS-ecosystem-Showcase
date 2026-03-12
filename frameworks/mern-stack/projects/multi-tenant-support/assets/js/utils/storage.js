// Local storage utility with encryption and expiration
const storage = {
    // Encryption key (in production, this should be more secure)
    encryptionKey: 'support-platform-key',

    // Set item with optional expiration
    setItem(key, value, expirationHours = null) {
        const item = {
            value: value,
            timestamp: Date.now(),
            expiration: expirationHours ? Date.now() + (expirationHours * 60 * 60 * 1000) : null
        };

        try {
            const encrypted = this.encrypt(JSON.stringify(item));
            localStorage.setItem(key, encrypted);
            return true;
        } catch (error) {
            console.error('Failed to store item:', error);
            return false;
        }
    },

    // Get item with expiration check
    getItem(key) {
        try {
            const encrypted = localStorage.getItem(key);
            if (!encrypted) return null;

            const decrypted = this.decrypt(encrypted);
            const item = JSON.parse(decrypted);

            // Check expiration
            if (item.expiration && Date.now() > item.expiration) {
                this.removeItem(key);
                return null;
            }

            return item.value;
        } catch (error) {
            console.error('Failed to retrieve item:', error);
            this.removeItem(key);
            return null;
        }
    },

    // Remove item
    removeItem(key) {
        localStorage.removeItem(key);
    },

    // Clear all items
    clear() {
        localStorage.clear();
    },

    // Simple encryption (Base64 + XOR)
    encrypt(text) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(
                text.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
            );
        }
        return btoa(result);
    },

    // Simple decryption
    decrypt(encrypted) {
        const text = atob(encrypted);
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(
                text.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
            );
        }
        return result;
    },

    // Cache management
    cache: {
        set(key, value, expirationMinutes = 30) {
            return storage.setItem(`cache_${key}`, value, expirationMinutes / 60);
        },

        get(key) {
            return storage.getItem(`cache_${key}`);
        },

        remove(key) {
            storage.removeItem(`cache_${key}`);
        },

        clear() {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('cache_')) {
                    localStorage.removeItem(key);
                }
            });
        }
    },

    // Session storage wrapper
    session: {
        setItem(key, value) {
            try {
                sessionStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Failed to store session item:', error);
                return false;
            }
        },

        getItem(key) {
            try {
                const item = sessionStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (error) {
                console.error('Failed to retrieve session item:', error);
                return null;
            }
        },

        removeItem(key) {
            sessionStorage.removeItem(key);
        },

        clear() {
            sessionStorage.clear();
        }
    }
};

window.storage = storage;
