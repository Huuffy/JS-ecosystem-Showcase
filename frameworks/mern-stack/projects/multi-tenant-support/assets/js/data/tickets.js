// Mock ticket data for development and testing
const mockTicketsData = {
    tickets: [
        {
            id: 'TKT-001',
            title: 'Login Issues with SSO',
            description: 'Users unable to login using single sign-on authentication. Error 500 appears when attempting to authenticate through corporate SSO portal.',
            status: 'open',
            priority: 'high',
            category: 'Authentication',
            assignee: 'John Smith',
            assigneeId: 'user_001',
            reporter: 'Alice Johnson',
            reporterId: 'user_002',
            tenantId: 'techcorp',
            created: new Date('2025-06-27T10:30:00'),
            updated: new Date('2025-06-27T14:15:00'),
            dueDate: new Date('2025-06-28T17:00:00'),
            tags: ['sso', 'authentication', 'urgent'],
            attachments: [],
            watchers: ['user_003', 'user_004'],
            estimatedHours: 4,
            actualHours: 2.5,
            resolution: null,
            satisfactionRating: null
        },
        {
            id: 'TKT-002',
            title: 'Email Notifications Not Working',
            description: 'System not sending automated email notifications for ticket updates and new assignments.',
            status: 'in-progress',
            priority: 'medium',
            category: 'Email',
            assignee: 'Sarah Wilson',
            assigneeId: 'user_005',
            reporter: 'Mike Davis',
            reporterId: 'user_006',
            tenantId: 'healthplus',
            created: new Date('2025-06-27T09:15:00'),
            updated: new Date('2025-06-27T13:45:00'),
            dueDate: new Date('2025-06-29T12:00:00'),
            tags: ['email', 'notifications', 'automation'],
            attachments: [
                { id: 1, name: 'email_config.png', size: '245KB', url: '#' }
            ],
            watchers: ['user_007'],
            estimatedHours: 6,
            actualHours: 3,
            resolution: null,
            satisfactionRating: null
        },
        {
            id: 'TKT-003',
            title: 'Database Performance Issues',
            description: 'Queries taking longer than usual to execute, affecting overall system performance.',
            status: 'resolved',
            priority: 'low',
            category: 'Database',
            assignee: 'Tom Brown',
            assigneeId: 'user_008',
            reporter: 'Lisa Chen',
            reporterId: 'user_009',
            tenantId: 'financegroup',
            created: new Date('2025-06-26T16:20:00'),
            updated: new Date('2025-06-27T08:30:00'),
            dueDate: new Date('2025-06-30T17:00:00'),
            tags: ['database', 'performance', 'optimization'],
            attachments: [],
            watchers: [],
            estimatedHours: 8,
            actualHours: 6.5,
            resolution: 'Optimized database indexes and updated query execution plans.',
            satisfactionRating: 4
        }
    ],

    messages: [
        {
            id: 1,
            ticketId: 'TKT-001',
            author: 'Alice Johnson',
            authorId: 'user_002',
            content: 'Users are getting error 500 when trying to login via SSO. This started happening around 10 AM today.',
            timestamp: new Date('2025-06-27T10:30:00'),
            type: 'comment',
            isInternal: false
        },
        {
            id: 2,
            ticketId: 'TKT-001',
            author: 'John Smith',
            authorId: 'user_001',
            content: 'Investigating the SSO configuration. Checking server logs for any authentication errors.',
            timestamp: new Date('2025-06-27T11:00:00'),
            type: 'internal',
            isInternal: true
        },
        {
            id: 3,
            ticketId: 'TKT-001',
            author: 'John Smith',
            authorId: 'user_001',
            content: 'Found the issue - SSO certificate expired. Working on renewal process.',
            timestamp: new Date('2025-06-27T14:15:00'),
            type: 'comment',
            isInternal: false
        }
    ],

    categories: [
        'Authentication',
        'Email',
        'Database',
        'UI/UX',
        'Performance',
        'Billing',
        'Integration',
        'Security',
        'General'
    ],

    priorities: [
        { value: 'low', label: 'Low', color: '#238636' },
        { value: 'medium', label: 'Medium', color: '#1f6feb' },
        { value: 'high', label: 'High', color: '#f85149' },
        { value: 'critical', label: 'Critical', color: '#da3633' }
    ],

    statuses: [
        { value: 'open', label: 'Open', color: '#1f6feb' },
        { value: 'in-progress', label: 'In Progress', color: '#f85149' },
        { value: 'pending', label: 'Pending', color: '#fb8500' },
        { value: 'resolved', label: 'Resolved', color: '#238636' },
        { value: 'closed', label: 'Closed', color: '#656d76' }
    ]
};

window.mockTicketsData = mockTicketsData;
