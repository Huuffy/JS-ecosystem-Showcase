// Mock user data for authentication and user management
const mockUsersData = {
    users: [
        {
            id: 'user_001',
            username: 'john.smith',
            email: 'john.smith@techcorp.com',
            firstName: 'John',
            lastName: 'Smith',
            fullName: 'John Smith',
            avatar: null,
            role: 'agent',
            tenants: ['techcorp'],
            permissions: [
                'view_tickets',
                'create_tickets',
                'update_tickets',
                'assign_tickets',
                'view_analytics'
            ],
            isActive: true,
            lastLogin: new Date('2025-06-27T08:30:00'),
            createdAt: new Date('2025-01-15T10:00:00'),
            preferences: {
                theme: 'dark',
                notifications: true,
                language: 'en',
                timezone: 'America/New_York'
            },
            stats: {
                ticketsAssigned: 45,
                ticketsResolved: 42,
                avgResponseTime: 2.3,
                satisfactionRating: 4.2
            }
        },
        {
            id: 'user_002',
            username: 'alice.johnson',
            email: 'alice.johnson@techcorp.com',
            firstName: 'Alice',
            lastName: 'Johnson',
            fullName: 'Alice Johnson',
            avatar: null,
            role: 'user',
            tenants: ['techcorp'],
            permissions: [
                'view_tickets',
                'create_tickets',
                'update_own_tickets'
            ],
            isActive: true,
            lastLogin: new Date('2025-06-27T10:15:00'),
            createdAt: new Date('2025-02-20T14:30:00'),
            preferences: {
                theme: 'light',
                notifications: true,
                language: 'en',
                timezone: 'America/New_York'
            },
            stats: {
                ticketsCreated: 12,
                ticketsResolved: 10,
                avgSatisfactionGiven: 4.5
            }
        },
        {
            id: 'user_003',
            username: 'admin.user',
            email: 'admin@techcorp.com',
            firstName: 'Admin',
            lastName: 'User',
            fullName: 'Admin User',
            avatar: null,
            role: 'admin',
            tenants: ['techcorp', 'healthplus', 'financegroup'],
            permissions: [
                'view_tickets',
                'create_tickets',
                'update_tickets',
                'delete_tickets',
                'assign_tickets',
                'manage_users',
                'view_analytics',
                'manage_settings',
                'access_all_tenants'
            ],
            isActive: true,
            lastLogin: new Date('2025-06-27T07:45:00'),
            createdAt: new Date('2025-01-01T00:00:00'),
            preferences: {
                theme: 'dark',
                notifications: true,
                language: 'en',
                timezone: 'UTC'
            },
            stats: {
                tenantsManaged: 3,
                usersManaged: 25,
                systemUptime: 99.9
            }
        },
        {
            id: 'user_004',
            username: 'sarah.wilson',
            email: 'sarah.wilson@healthplus.com',
            firstName: 'Sarah',
            lastName: 'Wilson',
            fullName: 'Sarah Wilson',
            avatar: null,
            role: 'agent',
            tenants: ['healthplus'],
            permissions: [
                'view_tickets',
                'create_tickets',
                'update_tickets',
                'assign_tickets',
                'view_analytics'
            ],
            isActive: true,
            lastLogin: new Date('2025-06-27T09:00:00'),
            createdAt: new Date('2025-03-10T11:20:00'),
            preferences: {
                theme: 'light',
                notifications: true,
                language: 'en',
                timezone: 'America/Chicago'
            },
            stats: {
                ticketsAssigned: 38,
                ticketsResolved: 35,
                avgResponseTime: 1.8,
                satisfactionRating: 4.6
            }
        },
        {
            id: 'user_005',
            username: 'mike.davis',
            email: 'mike.davis@healthplus.com',
            firstName: 'Mike',
            lastName: 'Davis',
            fullName: 'Mike Davis',
            avatar: null,
            role: 'user',
            tenants: ['healthplus'],
            permissions: [
                'view_tickets',
                'create_tickets',
                'update_own_tickets'
            ],
            isActive: true,
            lastLogin: new Date('2025-06-27T11:30:00'),
            createdAt: new Date('2025-04-05T16:45:00'),
            preferences: {
                theme: 'light',
                notifications: false,
                language: 'en',
                timezone: 'America/Chicago'
            },
            stats: {
                ticketsCreated: 8,
                ticketsResolved: 7,
                avgSatisfactionGiven: 4.0
            }
        }
    ],

    roles: [
        {
            id: 'user',
            name: 'User',
            description: 'Can create and manage their own tickets',
            permissions: [
                'view_tickets',
                'create_tickets',
                'update_own_tickets',
                'view_knowledge_base'
            ]
        },
        {
            id: 'agent',
            name: 'Agent',
            description: 'Can handle and resolve tickets',
            permissions: [
                'view_tickets',
                'create_tickets',
                'update_tickets',
                'assign_tickets',
                'view_analytics',
                'manage_knowledge_base'
            ]
        },
        {
            id: 'manager',
            name: 'Manager',
            description: 'Can manage agents and view reports',
            permissions: [
                'view_tickets',
                'create_tickets',
                'update_tickets',
                'assign_tickets',
                'view_analytics',
                'manage_users',
                'view_reports',
                'manage_knowledge_base'
            ]
        },
        {
            id: 'admin',
            name: 'Administrator',
            description: 'Full system access and management',
            permissions: [
                'view_tickets',
                'create_tickets',
                'update_tickets',
                'delete_tickets',
                'assign_tickets',
                'manage_users',
                'view_analytics',
                'manage_settings',
                'access_all_tenants',
                'manage_knowledge_base',
                'system_administration'
            ]
        }
    ]
};

window.mockUsersData = mockUsersData;
