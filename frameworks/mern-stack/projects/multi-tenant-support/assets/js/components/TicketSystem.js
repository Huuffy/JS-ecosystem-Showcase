// Enhanced Ticket System Component with backend integration
function TicketSystem() {
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
        search: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch tickets from backend
    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:5000/api/tickets')
            .then(res => res.json())
            .then(data => {
                setTickets(data);
                setFilteredTickets(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching tickets:', error);
                setLoading(false);
            });
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = tickets;

        if (filters.status !== 'all') {
            filtered = filtered.filter(ticket => ticket.status === filters.status);
        }

        if (filters.priority !== 'all') {
            filtered = filtered.filter(ticket => ticket.priority === filters.priority);
        }

        if (filters.search) {
            filtered = filtered.filter(ticket => 
                ticket.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                ticket.description.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        setFilteredTickets(filtered);
    }, [filters, tickets]);

    const handleCreateTicket = async (ticketData) => {
        setSaving(true);
        try {
            const response = await fetch('http://localhost:5000/api/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...ticketData,
                    status: 'open',
                    created: new Date(),
                    updated: new Date()
                })
            });

            if (response.ok) {
                const newTicket = await response.json();
                setTickets(prev => [newTicket, ...prev]);
                setShowCreateModal(false);
            }
        } catch (error) {
            console.error('Error creating ticket:', error);
            alert('Failed to create ticket. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/tickets/${ticketId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    status: newStatus,
                    updated: new Date()
                })
            });

            if (response.ok) {
                setTickets(tickets.map(ticket => 
                    ticket.id === ticketId 
                        ? { ...ticket, status: newStatus, updated: new Date() }
                        : ticket
                ));
            }
        } catch (error) {
            console.error('Error updating ticket status:', error);
        }
    };

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'high': return '#dc3545';
            case 'medium': return '#ffc107';
            case 'low': return '#28a745';
            default: return '#6c757d';
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'open': return '#007bff';
            case 'in-progress': return '#ffc107';
            case 'resolved': return '#28a745';
            case 'closed': return '#6c757d';
            default: return '#6c757d';
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading tickets...</p>
            </div>
        );
    }

    return (
        <div className="ticket-system">
            <div className="ticket-header">
                <h2>Support Tickets</h2>
                <button 
                    className="btn btn-primary tenant-themed"
                    onClick={() => setShowCreateModal(true)}
                    disabled={saving}
                >
                    Create New Ticket
                </button>
            </div>

            {/* Filters */}
            <div className="ticket-filters card">
                <div className="filter-group">
                    <label className="form-label">Search</label>
                    <input
                        type="text"
                        className="form-input search-input"
                        placeholder="Search tickets..."
                        value={filters.search}
                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                    />
                </div>
                <div className="filter-group">
                    <label className="form-label">Status</label>
                    <select 
                        className="form-input"
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label className="form-label">Priority</label>
                    <select 
                        className="form-input"
                        value={filters.priority}
                        onChange={(e) => setFilters({...filters, priority: e.target.value})}
                    >
                        <option value="all">All Priority</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
            </div>

            {/* Tickets List */}
            <div className="tickets-list">
                {filteredTickets.length === 0 ? (
                    <div className="empty-state card">
                        <h3>No tickets found</h3>
                        <p>Try adjusting your filters or create a new ticket.</p>
                    </div>
                ) : (
                    filteredTickets.map(ticket => (
                        <div key={ticket.id} className="ticket-card card">
                            <div className="ticket-header">
                                <div className="ticket-id-title">
                                    <span className="ticket-id">{ticket.id}</span>
                                    <h3 className="ticket-title">{ticket.title}</h3>
                                </div>
                                <div className="ticket-actions">
                                    <select 
                                        className="status-select"
                                        value={ticket.status}
                                        onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                        style={{ color: getStatusColor(ticket.status) }}
                                    >
                                        <option value="open">Open</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                            </div>
                            
                            <p className="ticket-description">{ticket.description}</p>
                            
                            <div className="ticket-meta">
                                <div className="meta-item">
                                    <span className="meta-label">Priority:</span>
                                    <span 
                                        className="priority-badge"
                                        style={{ color: getPriorityColor(ticket.priority) }}
                                    >
                                        {ticket.priority.toUpperCase()}
                                    </span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Category:</span>
                                    <span>{ticket.category}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Assignee:</span>
                                    <span>{ticket.assignee || 'Unassigned'}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Created:</span>
                                    <span>{new Date(ticket.created).toLocaleDateString()}</span>
                                </div>
                            </div>
                            
                            <div className="ticket-actions-bottom">
                                <button 
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedTicket(ticket)}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Ticket Modal */}
            {showCreateModal && (
                <CreateTicketModal 
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateTicket}
                    saving={saving}
                />
            )}

            {/* Ticket Details Modal */}
            {selectedTicket && (
                <TicketDetailsModal 
                    ticket={selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                    onStatusChange={handleStatusChange}
                />
            )}
        </div>
    );
}

// Create Ticket Modal Component
function CreateTicketModal({ onClose, onSubmit, saving }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        category: 'General'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.title.trim() && formData.description.trim()) {
            onSubmit(formData);
            setFormData({ title: '', description: '', priority: 'medium', category: 'General' });
        }
    };

    return (
        <div className="modal active">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Create New Ticket</h2>
                    <button className="close-btn" onClick={onClose} disabled={saving}>×</button>
                </div>
                
                <form onSubmit={handleSubmit} className="ticket-form">
                    <div className="form-group">
                        <label className="form-label">Title *</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="Brief description of the issue"
                            required
                            disabled={saving}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Description *</label>
                        <textarea
                            className="form-input form-textarea"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Detailed description of the issue"
                            rows="4"
                            required
                            disabled={saving}
                        />
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Priority</label>
                            <select 
                                className="form-input"
                                value={formData.priority}
                                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                disabled={saving}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select 
                                className="form-input"
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                disabled={saving}
                            >
                                <option value="General">General</option>
                                <option value="Authentication">Authentication</option>
                                <option value="Email">Email</option>
                                <option value="Database">Database</option>
                                <option value="UI/UX">UI/UX</option>
                                <option value="Performance">Performance</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary tenant-themed" disabled={saving}>
                            {saving ? 'Creating...' : 'Create Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Ticket Details Modal Component
function TicketDetailsModal({ ticket, onClose, onStatusChange }) {
    return (
        <div className="modal active">
            <div className="modal-content large">
                <div className="modal-header">
                    <div>
                        <h2>{ticket.title}</h2>
                        <span className="ticket-id">{ticket.id}</span>
                    </div>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                
                <div className="ticket-details">
                    <div className="ticket-info">
                        <p><strong>Description:</strong> {ticket.description}</p>
                        <div className="ticket-meta-grid">
                            <div><strong>Status:</strong> {ticket.status}</div>
                            <div><strong>Priority:</strong> {ticket.priority}</div>
                            <div><strong>Category:</strong> {ticket.category}</div>
                            <div><strong>Assignee:</strong> {ticket.assignee || 'Unassigned'}</div>
                            <div><strong>Created:</strong> {new Date(ticket.created).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
