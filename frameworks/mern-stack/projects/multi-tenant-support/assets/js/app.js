// app.js - Main React app with API integration and tenant context

const { useState, useEffect, useContext, createContext } = React;

// Tenant Context and static tenants
const TenantContext = createContext();

const TENANTS = [
  { id: "techcorp", name: "TechCorp", logo: "TC", theme: "techcorp", domain: "techcorp.support" },
  { id: "healthplus", name: "HealthPlus", logo: "HP", theme: "healthplus", domain: "healthplus.support" },
  { id: "finance", name: "FinanceGroup", logo: "FG", theme: "finance", domain: "finance.support" },
];

// Persist hook for localStorage
function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}

function App() {
  const [currentTenant, setCurrentTenant] = useState(null);
  const [showTenantModal, setShowTenantModal] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [settings, setSettings] = usePersistedState("settings", {
    theme: "default",
    notifications: true,
  });

  useEffect(() => {
    const savedTenant = localStorage.getItem("selectedTenant");
    if (savedTenant) {
      const tenant = TENANTS.find((t) => t.id === savedTenant);
      if (tenant) {
        setCurrentTenant(tenant);
        setShowTenantModal(false);
        applyTheme(tenant);
      }
    }
  }, []);

  function applyTheme(tenant) {
    if (!tenant) {
      document.documentElement.removeAttribute("data-theme");
      document.documentElement.removeAttribute("data-tenant");
      document.body.classList.remove("tenant-themed");
      return;
    }
    document.documentElement.setAttribute("data-theme", tenant.theme);
    document.documentElement.setAttribute("data-tenant", tenant.theme);
    document.body.classList.add("tenant-themed");
  }

  function selectTenant(tenant) {
    setCurrentTenant(tenant);
    setShowTenantModal(false);
    localStorage.setItem("selectedTenant", tenant.id);
    applyTheme(tenant);
  }

  function switchTenant() {
    setCurrentTenant(null);
    setShowTenantModal(true);
    localStorage.removeItem("selectedTenant");
    applyTheme(null);
  }

  if (showTenantModal) {
    return <TenantSelector tenants={TENANTS} onSelect={selectTenant} />;
  }

  return (
    <TenantContext.Provider value={currentTenant}>
      <div className="app-container">
        <Sidebar
          activeSection={activeSection}
          onChange={setActiveSection}
          onSwitchTenant={switchTenant}
        />
        <div className="main-content">
          <Header tenant={currentTenant} />
          <div className="content-area">
            <MainContent
              activeSection={activeSection}
              settings={settings}
              setSettings={setSettings}
            />
          </div>
        </div>
      </div>
    </TenantContext.Provider>
  );
}

// TenantSelector
function TenantSelector({ tenants, onSelect }) {
  return (
    <div className="modal active">
      <div className="modal-content">
        <h2>Select Your Organization</h2>
        <div className="tenant-grid">
          {tenants.map((tenant) => (
            <div
              key={tenant.id}
              className="tenant-card"
              tabIndex="0"
              role="button"
              onClick={() => onSelect(tenant)}
              onKeyDown={(e) => e.key === "Enter" && onSelect(tenant)}
            >
              <div className="tenant-logo">{tenant.logo}</div>
              <h3>{tenant.name}</h3>
              <p className="text-secondary">{tenant.domain}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Sidebar Navigation
function Sidebar({ activeSection, onChange, onSwitchTenant }) {
  const tenant = useContext(TenantContext);
  const panels = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "tickets", label: "Support Tickets", icon: "🎫" },
    { id: "chatbot", label: "AI Chatbot", icon: "🤖" },
    { id: "knowledge", label: "Knowledge Base", icon: "📚" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="sidebar-header" style={{ marginBottom: "1.5rem" }}>
        <div className="sidebar-tenant-info">
          <div className="tenant-logo-custom" aria-label="Tenant Logo">{tenant?.logo}</div>
          <div>
            <h3>{tenant?.name}</h3>
            <button className="btn btn-secondary btn-sm" onClick={onSwitchTenant}>
              Switch Tenant
            </button>
          </div>
        </div>
      </div>
      <nav className="nav-menu" role="list">
        {panels.map(({ id, label, icon }) => (
          <div className="nav-item" role="listitem" key={id}>
            <a
              href="#"
              className={`nav-link${activeSection === id ? " active tenant-themed" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                onChange(id);
              }}
              aria-current={activeSection === id ? "page" : undefined}
              tabIndex="0"
              role="link"
            >
              <span className="nav-icon" aria-hidden="true">
                {icon}
              </span>
              {label}
            </a>
          </div>
        ))}
      </nav>
    </aside>
  );
}

// Header
function Header({ tenant }) {
  return (
    <header className="header" role="banner">
      <h1 tabIndex="0">Support Platform - {tenant?.name}</h1>
      <div className="header-actions" aria-label="Page actions">{/* Empty per user request */}</div>
    </header>
  );
}

// MainContent Switcher
function MainContent({ activeSection, settings, setSettings }) {
  switch (activeSection) {
    case "dashboard":
      return <Dashboard />;
    case "tickets":
      return <TicketSystem />;
    case "chatbot":
      return <Chatbot />;
    case "knowledge":
      return <KnowledgeBase />;
    case "analytics":
      return <Analytics />;
    case "settings":
      return <Settings settings={settings} setSettings={setSettings} />;
    default:
      return <Dashboard />;
  }
}

// Dashboard Component with live API data
function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("http://localhost:5000/api/analytics")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  if (loading) return <p>Loading dashboard...</p>;
  if (!stats) return <p>Unable to load dashboard data.</p>;

  return (
    <main className="dashboard" role="main" aria-label="Dashboard">
      <h2>Dashboard Overview</h2>
      <div className="stats-grid">
        <section aria-label="Total tickets" tabIndex="0" className="stat-card card">
          <h3>Total Tickets</h3>
          <p className="stat-number">{stats.totalTickets}</p>
        </section>
        <section aria-label="Open tickets" tabIndex="0" className="stat-card card">
          <h3>Open Tickets</h3>
          <p className="stat-number">{stats.openTickets}</p>
        </section>
        <section aria-label="Tickets resolved today" tabIndex="0" className="stat-card card">
          <h3>Resolved Today</h3>
          <p className="stat-number">{stats.resolvedToday}</p>
        </section>
        <section aria-label="Average response time" tabIndex="0" className="stat-card card">
          <h3>Avg. Response Time</h3>
          <p className="stat-number">{stats.avgResponseTime}</p>
        </section>
      </div>
    </main>
  );
}

// TicketSystem Component
function TicketSystem() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", priority: "medium", category: "General" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/tickets")
      .then((res) => res.json())
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function createTicket(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    setSaving(true);
    fetch("http://localhost:5000/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form }),
    })
      .then((res) => res.json())
      .then((newTicket) => {
        setTickets((prev) => [newTicket, ...prev]);
        setForm({ title: "", description: "", priority: "medium", category: "General" });
        setShowCreate(false);
      })
      .finally(() => setSaving(false));
  }

  if (loading) return <p>Loading tickets...</p>;

  return (
    <section className="ticket-system" aria-label="Support Tickets">
      <header className="ticket-header">
        <h2>Support Tickets</h2>
        <button onClick={() => setShowCreate(true)} className="btn btn-primary tenant-themed">
          Create New Ticket
        </button>
      </header>
      {showCreate && (
        <div className="modal active" role="dialog" aria-modal="true">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create a New Ticket</h3>
              <button disabled={saving} onClick={() => setShowCreate(false)} aria-label="Close modal" className="close-btn">
                &times;
              </button>
            </div>
            <form onSubmit={createTicket} className="ticket-form">
              <div className="form-group">
                <label htmlFor="ticket-title">Title</label>
                <input
                  id="ticket-title"
                  type="text"
                  required
                  disabled={saving}
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="ticket-desc">Description</label>
                <textarea
                  id="ticket-desc"
                  required
                  disabled={saving}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ticket-priority">Priority</label>
                  <select
                    id="ticket-priority"
                    disabled={saving}
                    value={form.priority}
                    onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="ticket-category">Category</label>
                  <select
                    id="ticket-category"
                    disabled={saving}
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  >
                    <option>General</option>
                    <option>Authentication</option>
                    <option>Email</option>
                    <option>Database</option>
                  </select>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <button disabled={saving} type="button" onClick={() => setShowCreate(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button disabled={saving} type="submit" className="btn btn-primary tenant-themed">
                  {saving ? "Saving..." : "Save Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="tickets-list">
        {tickets.length === 0 ? (
          <p>No tickets available.</p>
        ) : (
          tickets.map((t) => (
            <article key={t.id} className="ticket-card card" tabIndex="0" aria-labelledby={`title-${t.id}`}>
              <h3 id={`title-${t.id}`}>{t.title}</h3>
              <p>{t.description}</p>
              <small>
                Status: {t.status}, Priority: {t.priority}, Category: {t.category}
              </small>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

// Chatbot Component
function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = React.useRef(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/chatbot")
      .then((res) => res.json())
      .then((msgs) => setMessages(msgs))
      .catch(() =>
        setMessages([
          { id: 0, text: "Welcome! Start typing your message.", sender: "bot", timestamp: new Date() },
        ])
      );
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMsg(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { text: input, sender: "user" };
    setMessages((prev) => [...prev, { ...userMsg, id: Date.now() }]);
    setInput("");
    setTyping(true);

    fetch("http://localhost:5000/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userMsg),
    })
      .then(() => {
        setTimeout(() => {
          const botReply = {
            id: Date.now() + 1,
            text: "Thank you for your message! Our support team will be with you shortly.",
            sender: "bot",
          };
          setMessages((prev) => [...prev, botReply]);
          setTyping(false);
        }, 1500);
      })
      .catch(() => setTyping(false));
  }

  return (
    <section className="chatbot-container" aria-label="Chatbot">
      <header className="chatbot-header">
        <h2>AI Chatbot</h2>
        <div className="bot-status">
          <span className="status-indicator online" aria-hidden="true"></span> Online
        </div>
      </header>
      <main className="chat-window" style={{ display: "flex", flexDirection: "column", height: "70vh" }}>
        <div className="messages-container" style={{ overflowY: "auto", flexGrow: 1, padding: 10 }}>
          {messages.map((m) => (
            <div key={m.id} className={`message ${m.sender}`} style={{ margin: "6px 0" }}>
              <div className={`message-content ${m.sender === "user" ? "user-msg" : "bot-msg"}`}>{m.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          {typing && <div className="message bot"><em>Typing...</em></div>}
        </div>
        <form onSubmit={sendMsg} style={{ marginTop: "auto", display: "flex" }}>
          <input
            type="text"
            aria-label="Type your message"
            placeholder="Type your message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={typing}
            required
            style={{ flexGrow: 1, padding: "10px", borderRadius: "20px", border: "1px solid #666" }}
          />
          <button type="submit" disabled={typing} style={{ marginLeft: 8, padding: "10px 20px", borderRadius: "20px" }}>
            Send
          </button>
        </form>
      </main>
    </section>
  );
}

// KnowledgeBase Component
function KnowledgeBase() {
  const [articles, setArticles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showCreate, setShowCreate] = React.useState(false);
  const [form, setForm] = React.useState({ title: "", content: "" });
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/articles")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function createArticle(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    fetch("http://localhost:5000/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((newArticle) => {
        setArticles((prev) => [newArticle, ...prev]);
        setForm({ title: "", content: "" });
        setShowCreate(false);
      })
      .finally(() => setSaving(false));
  }

  if (loading) return <p>Loading articles...</p>;

  return (
    <section className="knowledge-base">
      <header className="kb-header">
        <h2>Knowledge Base</h2>
        <button onClick={() => setShowCreate(true)} className="btn btn-primary tenant-themed">
          Create Article
        </button>
      </header>

      {showCreate && (
        <div className="modal active" role="dialog" aria-modal="true">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create Article</h3>
              <button onClick={() => setShowCreate(false)} disabled={saving} className="close-btn" aria-label="Close modal">
                &times;
              </button>
            </div>
            <form onSubmit={createArticle} className="article-form">
              <div className="form-group">
                <label htmlFor="article-title">Title</label>
                <input
                  id="article-title"
                  required
                  disabled={saving}
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="article-content">Content</label>
                <textarea
                  id="article-content"
                  required
                  disabled={saving}
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                />
              </div>
              <div style={{ textAlign: "right" }}>
                <button onClick={() => setShowCreate(false)} disabled={saving} type="button" className="btn btn-secondary">
                  Cancel
                </button>
                <button disabled={saving} type="submit" className="btn btn-primary tenant-themed">
                  {saving ? "Saving..." : "Save Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="articles-list">
        {articles.length === 0 ? (
          <p>No articles found.</p>
        ) : (
          articles.map((a) => (
            <article key={a.id} className="article-card card" tabIndex="0" aria-labelledby={`art-title-${a.id}`}>
              <h3 id={`art-title-${a.id}`}>{a.title}</h3>
              <p>{a.content.length > 150 ? a.content.slice(0, 150) + "..." : a.content}</p>
              <small>
                By {a.author} on {new Date(a.created).toLocaleDateString()}
              </small>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

// Settings Component: persistent settings updated and saved
function Settings({ settings, setSettings }) {
  const [theme, setTheme] = useState(settings.theme || "default");
  const [notifications, setNotifications] = useState(typeof settings.notifications === "boolean" ? settings.notifications : true);

  useEffect(() => {
    setSettings({ theme, notifications });
  }, [theme, notifications]);

  return (
    <section className="settings" aria-label="Settings">
      <h2>Settings</h2>
      <form style={{ maxWidth: 400, margin: "auto" }}>
        <div className="form-group">
          <label htmlFor="theme-select">Theme</label>
          <select id="theme-select" value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="default">Default</option>
            <option value="techcorp">TechCorp</option>
            <option value="healthplus">HealthPlus</option>
            <option value="finance">FinanceGroup</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="notifications-toggle" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input id="notifications-toggle" type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
            Enable Email Notifications
          </label>
        </div>
      </form>
    </section>
  );
}

// Render app
ReactDOM.render(<App />, document.getElementById("root"));
