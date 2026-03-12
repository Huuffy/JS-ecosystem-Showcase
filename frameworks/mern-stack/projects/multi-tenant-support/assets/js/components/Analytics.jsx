// Advanced Analytics Component with backend integration
function Analytics() {
    const [metrics, setMetrics] = useState({});
    const [timeRange, setTimeRange] = useState('7d');
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        setLoading(true);
        // Use mock data directly (no backend on Vercel)
        const mockMetrics = {
            totalTickets: 1247,
            openTickets: 23,
            resolvedToday: 15,
            avgResponseTime: 2.3,
            satisfactionScore: 87,
            resolutionRate: 94.2,
            firstResponseTime: 1.8,
            escalationRate: 5.3,
            agentUtilization: 78.5,
            knowledgeBaseViews: 3421
        };

        const mockChartData = {
            ticketTrends: [
                { date: '2025-06-21', created: 45, resolved: 42 },
                { date: '2025-06-22', created: 38, resolved: 41 },
                { date: '2025-06-23', created: 52, resolved: 48 },
                { date: '2025-06-24', created: 41, resolved: 45 },
                { date: '2025-06-25', created: 47, resolved: 44 },
                { date: '2025-06-26', created: 39, resolved: 43 },
                { date: '2025-06-27', created: 35, resolved: 38 }
            ],
            categoryBreakdown: [
                { category: 'Authentication', count: 342, percentage: 27.4 },
                { category: 'Email', count: 298, percentage: 23.9 },
                { category: 'Database', count: 187, percentage: 15.0 },
                { category: 'UI/UX', count: 156, percentage: 12.5 },
                { category: 'Performance', count: 134, percentage: 10.7 },
                { category: 'Other', count: 130, percentage: 10.4 }
            ],
            priorityDistribution: [
                { priority: 'High', count: 89, color: '#f85149' },
                { priority: 'Medium', count: 456, color: '#1f6feb' },
                { priority: 'Low', count: 702, color: '#238636' }
            ]
        };

        setMetrics(mockMetrics);
        setChartData(mockChartData);
        setLoading(false);
    }, [timeRange]);

    const formatNumber = (num) => {
        return num?.toLocaleString() || '0';
    };

    const formatPercentage = (num) => {
        return `${(num || 0).toFixed(1)}%`;
    };

    const formatTime = (hours) => {
        return `${(hours || 0).toFixed(1)}h`;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading analytics...</p>
            </div>
        );
    }

    return (
        <div className="analytics">
            <div className="analytics-header">
                <h2>Analytics Dashboard</h2>
                <div className="time-range-selector">
                    <select 
                        className="form-input"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                    </select>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="metrics-grid">
                <div className="metric-card card primary">
                    <div className="metric-icon">🎫</div>
                    <div className="metric-content">
                        <h3>Total Tickets</h3>
                        <div className="metric-value">{formatNumber(metrics.totalTickets)}</div>
                        <div className="metric-change positive">+12% from last period</div>
                    </div>
                </div>

                <div className="metric-card card warning">
                    <div className="metric-icon">📋</div>
                    <div className="metric-content">
                        <h3>Open Tickets</h3>
                        <div className="metric-value">{formatNumber(metrics.openTickets)}</div>
                        <div className="metric-change negative">-5% from yesterday</div>
                    </div>
                </div>

                <div className="metric-card card success">
                    <div className="metric-icon">✅</div>
                    <div className="metric-content">
                        <h3>Resolved Today</h3>
                        <div className="metric-value">{formatNumber(metrics.resolvedToday)}</div>
                        <div className="metric-change positive">+8% from yesterday</div>
                    </div>
                </div>

                <div className="metric-card card info">
                    <div className="metric-icon">⏱️</div>
                    <div className="metric-content">
                        <h3>Avg Response Time</h3>
                        <div className="metric-value">{formatTime(metrics.avgResponseTime)}</div>
                        <div className="metric-change positive">-15% improvement</div>
                    </div>
                </div>

                <div className="metric-card card success">
                    <div className="metric-icon">😊</div>
                    <div className="metric-content">
                        <h3>Satisfaction Score</h3>
                        <div className="metric-value">{formatPercentage(metrics.satisfactionScore)}</div>
                        <div className="metric-change positive">+3% from last week</div>
                    </div>
                </div>

                <div className="metric-card card primary">
                    <div className="metric-icon">🎯</div>
                    <div className="metric-content">
                        <h3>Resolution Rate</h3>
                        <div className="metric-value">{formatPercentage(metrics.resolutionRate)}</div>
                        <div className="metric-change positive">+1.2% improvement</div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-section">
                <div className="chart-container card">
                    <div className="chart-header">
                        <h3>Ticket Trends</h3>
                        <div className="chart-legend">
                            <span className="legend-item">
                                <span className="legend-color" style={{backgroundColor: '#58a6ff'}}></span>
                                Created
                            </span>
                            <span className="legend-item">
                                <span className="legend-color" style={{backgroundColor: '#3fb950'}}></span>
                                Resolved
                            </span>
                        </div>
                    </div>
                    <div className="chart-content">
                        {chartData.ticketTrends && <TicketTrendsChart data={chartData.ticketTrends} />}
                    </div>
                </div>

                <div className="chart-container card">
                    <div className="chart-header">
                        <h3>Category Breakdown</h3>
                    </div>
                    <div className="chart-content">
                        {chartData.categoryBreakdown && <CategoryChart data={chartData.categoryBreakdown} />}
                    </div>
                </div>
            </div>

            {/* Detailed Stats */}
            <div className="detailed-stats">
                <div className="stats-section card">
                    <h3>Performance Metrics</h3>
                    <div className="stats-list">
                        <div className="stat-item">
                            <span className="stat-label">First Response Time</span>
                            <span className="stat-value">{formatTime(metrics.firstResponseTime)}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Escalation Rate</span>
                            <span className="stat-value">{formatPercentage(metrics.escalationRate)}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Agent Utilization</span>
                            <span className="stat-value">{formatPercentage(metrics.agentUtilization)}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Knowledge Base Views</span>
                            <span className="stat-value">{formatNumber(metrics.knowledgeBaseViews)}</span>
                        </div>
                    </div>
                </div>

                <div className="priority-distribution card">
                    <h3>Priority Distribution</h3>
                    <div className="priority-chart">
                        {chartData.priorityDistribution && chartData.priorityDistribution.map(item => (
                            <div key={item.priority} className="priority-item">
                                <div className="priority-info">
                                    <span className="priority-label">{item.priority}</span>
                                    <span className="priority-count">{item.count}</span>
                                </div>
                                <div className="priority-bar">
                                    <div 
                                        className="priority-fill"
                                        style={{
                                            width: `${(item.count / (metrics.totalTickets || 1000)) * 100}%`,
                                            backgroundColor: item.color
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Simple Chart Components
function TicketTrendsChart({ data }) {
    const maxValue = Math.max(...data.flatMap(d => [d.created, d.resolved]));
    
    return (
        <div className="line-chart">
            <div className="chart-grid">
                {data.map((item, index) => (
                    <div key={index} className="chart-day">
                        <div className="chart-bars">
                            <div 
                                className="chart-bar created"
                                style={{ height: `${(item.created / maxValue) * 100}%` }}
                                title={`Created: ${item.created}`}
                            ></div>
                            <div 
                                className="chart-bar resolved"
                                style={{ height: `${(item.resolved / maxValue) * 100}%` }}
                                title={`Resolved: ${item.resolved}`}
                            ></div>
                        </div>
                        <div className="chart-label">
                            {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CategoryChart({ data }) {
    return (
        <div className="category-chart">
            {data.map((item, index) => (
                <div key={index} className="category-item">
                    <div className="category-info">
                        <span className="category-name">{item.category}</span>
                        <span className="category-percentage">{item.percentage}%</span>
                    </div>
                    <div className="category-bar">
                        <div 
                            className="category-fill"
                            style={{ width: `${item.percentage}%` }}
                        ></div>
                    </div>
                    <span className="category-count">{item.count}</span>
                </div>
            ))}
        </div>
    );
}
