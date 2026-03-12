// Comprehensive Settings Component with localStorage persistence
function Settings({ settings, setSettings }) {
    const [localSettings, setLocalSettings] = useState({
        theme: 'default',
        notifications: true,
        autoAssign: false,
        emailDigest: true,
        soundAlerts: false,
        language: 'en',
        timezone: 'UTC',
        ticketAutoClose: 7,
        maxTicketsPerAgent: 20
    });

    const [tenantSettings, setTenantSettings] = useState({
        companyName: 'TechCorp Solutions',
        supportEmail: 'support@techcorp.com',
        logo: null,
        primaryColor: '#58a6ff',
        secondaryColor: '#3fb950',
        customDomain: 'support.techcorp.com',
        businessHours: {
            start: '09:00',
            end: '17:00',
            timezone: 'UTC'
        }
    });

    const [activeTab, setActiveTab] = useState('general');
    const [saving, setSaving] = useState(false);

    // Load settings from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('appSettings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setLocalSettings({ ...localSettings, ...parsed });
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }

        const savedTenant = localStorage.getItem('tenantSettings');
        if (savedTenant) {
            try {
                const parsed = JSON.parse(savedTenant);
                setTenantSettings({ ...tenantSettings, ...parsed });
            } catch (error) {
                console.error('Error loading tenant settings:', error);
            }
        }
    }, []);

    // Save settings to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('appSettings', JSON.stringify(localSettings));
        // Update parent settings state
        if (setSettings) {
            setSettings({ theme: localSettings.theme, notifications: localSettings.notifications });
        }
    }, [localSettings, setSettings]);

    useEffect(() => {
        localStorage.setItem('tenantSettings', JSON.stringify(tenantSettings));
    }, [tenantSettings]);

    const handleToggle = (key) => {
        setLocalSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSettingChange = (key, value) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleTenantSettingChange = (key, value) => {
        setTenantSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Simulate API call to save settings
            const response = await fetch('http://localhost:5000/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userSettings: localSettings,
                    tenantSettings: tenantSettings
                })
            });

            if (response.ok) {
                alert('Settings saved successfully!');
            } else {
                throw new Error('Failed to save settings');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Settings saved locally! (Server connection failed)');
        } finally {
            setSaving(false);
        }
    };

    const handleLogoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setTenantSettings(prev => ({ ...prev, logo: e.target.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const tabs = [
        { id: 'general', label: 'General', icon: '⚙️' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
        { id: 'tenant', label: 'Organization', icon: '🏢' },
        { id: 'integrations', label: 'Integrations', icon: '🔗' }
    ];

    return (
        <div className="settings">
            <div className="settings-header">
                <h2>Settings</h2>
                <button 
                    className="btn btn-primary tenant-themed"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="settings-container">
                <div className="settings-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="tab-icon">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="settings-content">
                    {activeTab === 'general' && (
                        <div className="settings-section">
                            <h3>General Settings</h3>
                            
                            <div className="setting-group">
                                <label className="setting-label">Theme</label>
                                <select 
                                    className="form-input"
                                    value={localSettings.theme}
                                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                                >
                                    <option value="default">Default</option>
                                    <option value="techcorp">TechCorp</option>
                                    <option value="healthplus">HealthPlus</option>
                                    <option value="financegroup">FinanceGroup</option>
                                </select>
                            </div>

                            <div className="setting-group">
                                <label className="setting-label">Language</label>
                                <select 
                                    className="form-input"
                                    value={localSettings.language}
                                    onChange={(e) => handleSettingChange('language', e.target.value)}
                                >
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                </select>
                            </div>

                            <div className="setting-group">
                                <label className="setting-label">Timezone</label>
                                <select 
                                    className="form-input"
                                    value={localSettings.timezone}
                                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                                >
                                    <option value="UTC">UTC</option>
                                    <option value="America/New_York">Eastern Time</option>
                                    <option value="America/Chicago">Central Time</option>
                                    <option value="America/Denver">Mountain Time</option>
                                    <option value="America/Los_Angeles">Pacific Time</option>
                                </select>
                            </div>

                            <div className="setting-group">
                                <label className="setting-label">Auto-close tickets after (days)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={localSettings.ticketAutoClose}
                                    onChange={(e) => handleSettingChange('ticketAutoClose', parseInt(e.target.value))}
                                    min="1"
                                    max="30"
                                />
                            </div>

                            <div className="setting-group">
                                <label className="setting-label">Maximum tickets per agent</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={localSettings.maxTicketsPerAgent}
                                    onChange={(e) => handleSettingChange('maxTicketsPerAgent', parseInt(e.target.value))}
                                    min="5"
                                    max="50"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="settings-section">
                            <h3>Notification Preferences</h3>
                            
                            <div className="setting-toggle">
                                <label className="toggle-label">
                                    <input
                                        type="checkbox"
                                        checked={localSettings.notifications}
                                        onChange={() => handleToggle('notifications')}
                                    />
                                    <span className="toggle-slider"></span>
                                    Enable email notifications
                                </label>
                                <p className="setting-description">
                                    Receive email notifications for new tickets and updates
                                </p>
                            </div>

                            <div className="setting-toggle">
                                <label className="toggle-label">
                                    <input
                                        type="checkbox"
                                        checked={localSettings.emailDigest}
                                        onChange={() => handleToggle('emailDigest')}
                                    />
                                    <span className="toggle-slider"></span>
                                    Daily email digest
                                </label>
                                <p className="setting-description">
                                    Receive a daily summary of ticket activity
                                </p>
                            </div>

                            <div className="setting-toggle">
                                <label className="toggle-label">
                                    <input
                                        type="checkbox"
                                        checked={localSettings.soundAlerts}
                                        onChange={() => handleToggle('soundAlerts')}
                                    />
                                    <span className="toggle-slider"></span>
                                    Sound alerts
                                </label>
                                <p className="setting-description">
                                    Play sound notifications for urgent tickets
                                </p>
                            </div>

                            <div className="setting-toggle">
                                <label className="toggle-label">
                                    <input
                                        type="checkbox"
                                        checked={localSettings.autoAssign}
                                        onChange={() => handleToggle('autoAssign')}
                                    />
                                    <span className="toggle-slider"></span>
                                    Auto-assign tickets
                                </label>
                                <p className="setting-description">
                                    Automatically assign new tickets to available agents
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'tenant' && (
                        <div className="settings-section">
                            <h3>Organization Settings</h3>
                            
                            <div className="setting-group">
                                <label className="setting-label">Company Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={tenantSettings.companyName}
                                    onChange={(e) => handleTenantSettingChange('companyName', e.target.value)}
                                />
                            </div>

                            <div className="setting-group">
                                <label className="setting-label">Support Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={tenantSettings.supportEmail}
                                    onChange={(e) => handleTenantSettingChange('supportEmail', e.target.value)}
                                />
                            </div>

                            <div className="setting-group">
                                <label className="setting-label">Company Logo</label>
                                <div className="logo-upload">
                                    {tenantSettings.logo && (
                                        <img src={tenantSettings.logo} alt="Company Logo" className="logo-preview" />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="file-input"
                                    />
                                </div>
                            </div>

                            <div className="color-settings">
                                <div className="setting-group">
                                    <label className="setting-label">Primary Color</label>
                                    <input
                                        type="color"
                                        className="color-input"
                                        value={tenantSettings.primaryColor}
                                        onChange={(e) => handleTenantSettingChange('primaryColor', e.target.value)}
                                    />
                                </div>

                                <div className="setting-group">
                                    <label className="setting-label">Secondary Color</label>
                                    <input
                                        type="color"
                                        className="color-input"
                                        value={tenantSettings.secondaryColor}
                                        onChange={(e) => handleTenantSettingChange('secondaryColor', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="setting-group">
                                <label className="setting-label">Custom Domain</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={tenantSettings.customDomain}
                                    onChange={(e) => handleTenantSettingChange('customDomain', e.target.value)}
                                />
                            </div>

                            <div className="business-hours">
                                <h4>Business Hours</h4>
                                <div className="time-settings">
                                    <div className="setting-group">
                                        <label className="setting-label">Start Time</label>
                                        <input
                                            type="time"
                                            className="form-input"
                                            value={tenantSettings.businessHours.start}
                                            onChange={(e) => handleTenantSettingChange('businessHours', {
                                                ...tenantSettings.businessHours,
                                                start: e.target.value
                                            })}
                                        />
                                    </div>
                                    <div className="setting-group">
                                        <label className="setting-label">End Time</label>
                                        <input
                                            type="time"
                                            className="form-input"
                                            value={tenantSettings.businessHours.end}
                                            onChange={(e) => handleTenantSettingChange('businessHours', {
                                                ...tenantSettings.businessHours,
                                                end: e.target.value
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'integrations' && (
                        <div className="settings-section">
                            <h3>Integrations</h3>
                            
                            <div className="integration-item">
                                <div className="integration-info">
                                    <h4>Slack Integration</h4>
                                    <p>Send ticket notifications to Slack channels</p>
                                </div>
                                <button className="btn btn-secondary">Configure</button>
                            </div>

                            <div className="integration-item">
                                <div className="integration-info">
                                    <h4>Email Integration</h4>
                                    <p>Create tickets from email messages</p>
                                </div>
                                <button className="btn btn-secondary">Configure</button>
                            </div>

                            <div className="integration-item">
                                <div className="integration-info">
                                    <h4>Webhook Integration</h4>
                                    <p>Send ticket events to external systems</p>
                                </div>
                                <button className="btn btn-secondary">Configure</button>
                            </div>

                            <div className="integration-item">
                                <div className="integration-info">
                                    <h4>API Access</h4>
                                    <p>Manage API keys and access tokens</p>
                                </div>
                                <button className="btn btn-secondary">Manage</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
