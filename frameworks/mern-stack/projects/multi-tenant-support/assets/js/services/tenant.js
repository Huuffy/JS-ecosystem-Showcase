// Tenant management service
const tenantService = {
    currentTenant: null,
    tenantCache: new Map(),

    // Set current tenant
    setTenant(tenant) {
        this.currentTenant = tenant;
        this.applyTenantTheme(tenant);
        this.cacheTenant(tenant);
        localStorage.setItem('selectedTenant', tenant.id);
        
        // Emit tenant change event
        window.dispatchEvent(new CustomEvent('tenant-changed', { detail: tenant }));
    },

    // Get current tenant
    getTenant() {
        if (!this.currentTenant) {
            const tenantId = localStorage.getItem('selectedTenant');
            if (tenantId) {
                this.currentTenant = this.getCachedTenant(tenantId);
            }
        }
        return this.currentTenant;
    },

    // Clear current tenant
    clearTenant() {
        this.currentTenant = null;
        localStorage.removeItem('selectedTenant');
        this.removeTenantTheme();
        
        // Emit tenant cleared event
        window.dispatchEvent(new CustomEvent('tenant-cleared'));
    },

    // Apply tenant theme
    applyTenantTheme(tenant) {
        const root = document.documentElement;
        
        // Set theme attribute
        root.setAttribute('data-tenant', tenant.theme || tenant.id);
        
        // Apply custom colors if available
        if (tenant.colors) {
            root.style.setProperty('--tenant-primary', tenant.colors.primary);
            root.style.setProperty('--tenant-secondary', tenant.colors.secondary);
            root.style.setProperty('--tenant-accent', tenant.colors.accent);
        }
        
        // Apply custom CSS if available
        if (tenant.customCSS) {
            this.injectCustomCSS(tenant.customCSS);
        }
        
        // Update favicon if available
        if (tenant.favicon) {
            this.updateFavicon(tenant.favicon);
        }
        
        // Update page title
        if (tenant.name) {
            document.title = `${tenant.name} - Support Platform`;
        }
    },

    // Remove tenant theme
    removeTenantTheme() {
        const root = document.documentElement;
        root.removeAttribute('data-tenant');
        
        // Remove custom properties
        root.style.removeProperty('--tenant-primary');
        root.style.removeProperty('--tenant-secondary');
        root.style.removeProperty('--tenant-accent');
        
        // Remove custom CSS
        this.removeCustomCSS();
        
        // Reset title
        document.title = 'Support Platform';
    },

    // Inject custom CSS
    injectCustomCSS(css) {
        this.removeCustomCSS(); // Remove existing first
        
        const style = document.createElement('style');
        style.id = 'tenant-custom-css';
        style.textContent = css;
        document.head.appendChild(style);
    },

    // Remove custom CSS
    removeCustomCSS() {
        const existingStyle = document.getElementById('tenant-custom-css');
        if (existingStyle) {
            existingStyle.remove();
        }
    },

    // Update favicon
    updateFavicon(faviconUrl) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = faviconUrl;
    },

    // Cache tenant data
    cacheTenant(tenant) {
        this.tenantCache.set(tenant.id, {
            ...tenant,
            cachedAt: Date.now()
        });
    },

    // Get cached tenant
    getCachedTenant(tenantId) {
        const cached = this.tenantCache.get(tenantId);
        if (cached) {
            // Check if cache is still valid (1 hour)
            const isValid = Date.now() - cached.cachedAt < 3600000;
            if (isValid) {
                return cached;
            } else {
                this.tenantCache.delete(tenantId);
            }
        }
        return null;
    },

    // Load tenant configuration
    async loadTenantConfig(tenantId) {
        try {
            const tenant = await api.tenants.getById(tenantId);
            this.cacheTenant(tenant);
            return tenant;
        } catch (error) {
            console.error('Failed to load tenant config:', error);
            return null;
        }
    },

    // Get tenant-specific settings
    getTenantSettings() {
        const tenant = this.getTenant();
        return tenant ? tenant.settings || {} : {};
    },

    // Update tenant settings
    async updateTenantSettings(settings) {
        const tenant = this.getTenant();
        if (!tenant) return false;

        try {
            const updatedTenant = await api.tenants.update(tenant.id, {
                settings: { ...tenant.settings, ...settings }
            });
            
            this.setTenant(updatedTenant);
            return true;
        } catch (error) {
            console.error('Failed to update tenant settings:', error);
            return false;
        }
    },

    // Check tenant permissions
    hasPermission(permission) {
        const tenant = this.getTenant();
        if (!tenant || !tenant.permissions) return false;
        
        return tenant.permissions.includes(permission);
    },

    // Get tenant branding
    getBranding() {
        const tenant = this.getTenant();
        return tenant ? {
            logo: tenant.logo,
            name: tenant.name,
            colors: tenant.colors,
            customCSS: tenant.customCSS
        } : null;
    }
};

window.tenantService = tenantService;
