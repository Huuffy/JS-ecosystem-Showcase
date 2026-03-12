// Mock tenant data for multi-tenant functionality
const mockTenantsData = {
    tenants: [
        {
            id: 'techcorp',
            name: 'TechCorp Solutions',
            logo: 'TC',
            theme: 'techcorp',
            domain: 'techcorp.support.com',
            colors: {
                primary: '#007acc',
                secondary: '#00d4aa',
                accent: '#ff6b35'
            },
            settings: {
                autoAssignTickets: true,
                emailNotifications: true,
                businessHours: {
                    start: '09:00',
                    end: '17:00',
                    timezone: 'America/New_York'
                },
                slaTargets: {
                    firstResponse: 2, // hours
                    resolution: 24 // hours
                },
                ticketAutoClose: 7, // days
                maxTicketsPerAgent: 25
            },
            features: [
                'advanced-analytics',
                'custom-branding',
                'api-access',
                'sso-integration'
            ],
            subscription: {
                plan: 'enterprise',
                status: 'active',
                userLimit: 100,
                ticketLimit: -1 // unlimited
            },
            contactInfo: {
                supportEmail: 'support@techcorp.com',
                phone: '+1-555-0123',
                address: '123 Tech Street, Silicon Valley, CA 94000'
            }
        },
        {
            id: 'healthplus',
            name: 'HealthPlus Medical',
            logo: 'HP',
            theme: 'healthplus',
            domain: 'healthplus.support.com',
            colors: {
                primary: '#2e8b57',
                secondary: '#20b2aa',
                accent: '#ff69b4'
            },
            settings: {
                autoAssignTickets: false,
                emailNotifications: true,
                businessHours: {
                    start: '08:00',
                    end: '18:00',
                    timezone: 'America/Chicago'
                },
                slaTargets: {
                    firstResponse: 1, // hours
                    resolution: 12 // hours
                },
                ticketAutoClose: 5, // days
                maxTicketsPerAgent: 15
            },
            features: [
                'basic-analytics',
                'custom-branding',
                'email-integration'
            ],
            subscription: {
                plan: 'professional',
                status: 'active',
                userLimit: 50,
                ticketLimit: 1000
            },
            contactInfo: {
                supportEmail: 'help@healthplus.com',
                phone: '+1-555-0456',
                address: '456 Health Ave, Medical City, TX 75000'
            }
        },
        {
            id: 'financegroup',
            name: 'Finance Group Ltd',
            logo: 'FG',
            theme: 'financegroup',
            domain: 'financegroup.support.com',
            colors: {
                primary: '#4169e1',
                secondary: '#32cd32',
                accent: '#ffd700'
            },
            settings: {
                autoAssignTickets: true,
                emailNotifications: true,
                businessHours: {
                    start: '07:00',
                    end: '19:00',
                    timezone: 'America/Los_Angeles'
                },
                slaTargets: {
                    firstResponse: 4, // hours
                    resolution: 48 // hours
                },
                ticketAutoClose: 10, // days
                maxTicketsPerAgent: 30
            },
            features: [
                'advanced-analytics',
                'api-access',
                'compliance-reporting'
            ],
            subscription: {
                plan: 'business',
                status: 'active',
                userLimit: 25,
                ticketLimit: 500
            },
            contactInfo: {
                supportEmail: 'support@financegroup.com',
                phone: '+1-555-0789',
                address: '789 Finance Blvd, Money City, NY 10000'
            }
        }
    ],

    plans: [
        {
            id: 'basic',
            name: 'Basic',
            price: 29,
            features: [
                'Up to 10 users',
                'Basic ticket management',
                'Email support',
                '100 tickets/month'
            ]
        },
        {
            id: 'professional',
            name: 'Professional',
            price: 79,
            features: [
                'Up to 50 users',
                'Advanced analytics',
                'Custom branding',
                '1,000 tickets/month',
                'Email integration'
            ]
        },
        {
            id: 'business',
            name: 'Business',
            price: 149,
            features: [
                'Up to 100 users',
                'API access',
                'Advanced reporting',
                '5,000 tickets/month',
                'SSO integration'
            ]
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: 299,
            features: [
                'Unlimited users',
                'White-label solution',
                'Custom integrations',
                'Unlimited tickets',
                'Dedicated support'
            ]
        }
    ]
};

window.mockTenantsData = mockTenantsData;
