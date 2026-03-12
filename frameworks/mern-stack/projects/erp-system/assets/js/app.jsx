const { useState, useEffect, useRef } = React;

function App() {
    const [role, setRole] = useState('admin');

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    return (
        <div className="erp-container">
            <header className="erp-header">
                <div className="erp-brand">
                    <i className="fas fa-server"></i> NexusERP System
                </div>
                <div className="role-selector">
                    <span><i className="fas fa-user-shield" style={{ marginRight: '8px', color: 'var(--erp-muted)' }}></i> Simulation Role:</span>
                    <select className="role-dropdown" value={role} onChange={handleRoleChange}>
                        <option value="admin">System Administrator</option>
                        <option value="hr">HR Manager</option>
                        <option value="finance">Finance Director</option>
                    </select>
                </div>
            </header>

            <main className="erp-dashboard">
                <h2 className="dashboard-title">
                    {role === 'admin' && 'Global Operations Overview'}
                    {role === 'hr' && 'Human Resources Dashboard'}
                    {role === 'finance' && 'Financial Reporting & Ledger'}
                </h2>
                
                <div className="dashboard-grid">
                    {/* Admin Widgets */}
                    {role === 'admin' && (
                        <>
                            <StatWidget title="System Health" value="99.9%" icon="heartbeat" color="#10b981" trend="Operational" trendUp={true} />
                            <StatWidget title="Active Users" value="1,245" icon="users" color="#6366f1" trend="+12% this week" trendUp={true} />
                            <StatWidget title="Database Load" value="42%" icon="database" color="#f59e0b" trend="-5% this month" trendUp={true} />
                            <div className="widget widget-double">
                                <ExpenseOverviewChart />
                            </div>
                            <PayrollWidget role={role} />
                        </>
                    )}

                    {/* HR Widgets */}
                    {role === 'hr' && (
                        <>
                            <StatWidget title="Total Headcount" value="482" icon="user-tie" color="#ec4899" trend="+15 this quarter" trendUp={true} />
                            <StatWidget title="Open Positions" value="24" icon="briefcase" color="#f59e0b" trend="Active recruitment" trendUp={true} />
                            <StatWidget title="Avg Tenure" value="3.2 Yrs" icon="calendar-alt" color="#6366f1" trend="Stable retention" trendUp={true} />
                            <PayrollWidget role={role} />
                            <div className="widget widget-double">
                                <DepartmentBreakdownChart />
                            </div>
                        </>
                    )}

                    {/* Finance Widgets */}
                    {role === 'finance' && (
                        <>
                            <StatWidget title="Q3 Revenue" value="$4.2M" icon="chart-line" color="#10b981" trend="+8% vs Q2" trendUp={true} />
                            <StatWidget title="YTD Expenses" value="$1.8M" icon="money-bill-wave" color="#ef4444" trend="Within budget" trendUp={true} />
                            <StatWidget title="Cash Flow" value="$840K" icon="coins" color="#6366f1" trend="Positive" trendUp={true} />
                            <div className="widget widget-double">
                                <ExpenseOverviewChart />
                            </div>
                            <PayrollWidget role={role} />
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

// Reusable Statistics Card Widget
function StatWidget({ title, value, icon, color, trend, trendUp }) {
    return (
        <div className="widget stat-card">
            <div className="widget-header">
                {title} <i className={`fas fa-${icon}`} style={{ color }}></i>
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-trend">
                <i className={`fas fa-arrow-${trendUp ? 'up' : 'down'} ${trendUp ? 'trend-up' : 'trend-down'}`}></i> 
                <span style={{ color: 'var(--erp-muted)' }}>{trend}</span>
            </div>
        </div>
    );
}

// Payroll Processing Background Job Simulation Widget
function PayrollWidget({ role }) {
    const [running, setRunning] = useState(false);
    const [logs, setLogs] = useState([
        { time: '09:00:00', text: 'Waiting for manual trigger.', status: 'info' }
    ]);
    const endOfLogRef = useRef(null);

    const runPayroll = () => {
        setRunning(true);
        setLogs(prev => [...prev, { time: getTime(), text: 'Cron Job Initiated by ' + role.toUpperCase(), status: 'processing' }]);
        
        const steps = [
            "Fetching 482 active employee records...",
            "Calculating monthly attendance & overtime...",
            "Computing tax deductions and benefits...",
            "Updating Financial Ledger in MongoDB...",
            "Generating electronic payslips...",
            "Dispatching emails via SendGrid SMTP...",
            "Payroll processing calculation completed successfully."
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < steps.length) {
                const step = steps[i];
                const isLast = (i === steps.length - 1);
                setLogs(prev => [...prev, { 
                    time: getTime(), 
                    text: step, 
                    status: isLast ? 'success' : 'processing' 
                }]);
                i++;
            } else {
                clearInterval(interval);
                setRunning(false);
            }
        }, 1200);
    };

    useEffect(() => {
        if (endOfLogRef.current) {
            endOfLogRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    const getTime = () => {
        const d = new Date();
        return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`;
    };

    return (
        <div className="widget">
            <div className="widget-header">
                Background Jobs <i className="fas fa-microchip" style={{ color: 'var(--erp-muted)' }}></i>
            </div>
            <div style={{ fontSize: '0.9rem', marginBottom: '10px' }}>
                Simulate Node.js Automated Payroll Cron
            </div>
            <div className="payroll-log">
                {logs.map((log, idx) => (
                    <div key={idx} className="log-entry">
                        <span style={{ color: '#6b7280', marginRight: '8px' }}>[{log.time}]</span>
                        <span className={`log-${log.status}`}>{log.text}</span>
                    </div>
                ))}
                <div ref={endOfLogRef} />
            </div>
            <div className="payroll-controls">
                <button 
                    className="run-btn" 
                    onClick={runPayroll} 
                    disabled={running}
                >
                    {running ? (
                        <><i className="fas fa-circle-notch fa-spin"></i> Processing Ledger...</>
                    ) : (
                        <><i className="fas fa-play"></i> Run Monthly Payroll</>
                    )}
                </button>
            </div>
        </div>
    );
}

// Chart Components (Mocking complex MongoDB Aggregations)
function ExpenseOverviewChart() {
    const chartRef = useRef(null);
    let chartInstance = null;

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');
        
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [
                    {
                        label: 'Revenue',
                        data: [65, 59, 80, 81, 95, 110, 130],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Expenses',
                        data: [40, 45, 42, 55, 48, 60, 58],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#9ca3af' } }
                },
                scales: {
                    y: { grid: { color: '#374151' }, ticks: { color: '#9ca3af' } },
                    x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
                }
            }
        });

        return () => chartInstance.destroy();
    }, []);

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="widget-header">
                MongoDB Financial Aggregation Output <i className="fas fa-chart-area" style={{ color: 'var(--erp-accent)' }}></i>
            </div>
            <div className="chart-container">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
}

function DepartmentBreakdownChart() {
    const chartRef = useRef(null);
    let chartInstance = null;

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');
        
        chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'],
                datasets: [{
                    data: [150, 45, 200, 24, 63],
                    backgroundColor: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { color: '#9ca3af', padding: 20 } }
                },
                cutout: '70%'
            }
        });

        return () => chartInstance.destroy();
    }, []);

    return (
         <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="widget-header">
                Employee Distribution by Department <i className="fas fa-chart-pie" style={{ color: 'var(--erp-hr)' }}></i>
            </div>
            <div className="chart-container">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
