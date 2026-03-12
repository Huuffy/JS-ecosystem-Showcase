const { useState, useEffect, useRef } = React;

const INITIAL_DOCS = [
    { id: 1, title: 'Q3_Financial_Report.pdf', size: '2.4 MB', type: 'pdf', status: 'approved', date: 'Oct 12, 2023', author: 'Finance Dept' },
    { id: 2, title: 'Employee_Handbook_v2.docx', size: '1.1 MB', type: 'word', status: 'pending', date: 'Oct 14, 2023', author: 'HR Dept' },
    { id: 3, title: 'Architecture_Diagram.png', size: '4.5 MB', type: 'image', status: 'approved', date: 'Oct 15, 2023', author: 'Engineering' },
    { id: 4, title: 'Vendor_Agreement_Acme.pdf', size: '800 KB', type: 'pdf', status: 'rejected', date: 'Oct 16, 2023', author: 'Legal' },
    { id: 5, title: 'Marketing_Assets_Q4.zip', size: '45.2 MB', type: 'archive', status: 'approved', date: 'Oct 18, 2023', author: 'Marketing' }
];

function App() {
    const [documents, setDocuments] = useState(INITIAL_DOCS);
    const [activeTab, setActiveTab] = useState('all');
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleUpload = (newDoc) => {
        setDocuments([newDoc, ...documents]);
    };

    const filteredDocs = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'all' || 
                          (activeTab === 'pending' && doc.status === 'pending') ||
                          (activeTab === 'approved' && doc.status === 'approved');
        return matchesSearch && matchesTab;
    });

    return (
        <div className="app-container">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <main className="main-content">
                <header className="topbar">
                    <div className="search-bar">
                        <i className="fas fa-search"></i>
                        <input 
                            type="text" 
                            placeholder="Search in GridFS..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="upload-btn" onClick={() => setUploadModalOpen(true)}>
                        <i className="fas fa-cloud-upload-alt"></i> Upload File
                    </button>
                </header>

                <div className="content-area">
                    <h2 className="section-title">
                        {activeTab === 'all' ? 'All Documents' : 
                         activeTab === 'pending' ? 'Pending Approval' : 'Approved Documents'}
                    </h2>
                    
                    <div className="document-grid">
                        {filteredDocs.map(doc => (
                            <DocumentCard key={doc.id} doc={doc} />
                        ))}
                    </div>
                    
                    {filteredDocs.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                            <i className="fas fa-folder-open" style={{ fontSize: '3rem', marginBottom: '16px' }}></i>
                            <p>No documents found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </main>

            {isUploadModalOpen && (
                <UploadModal 
                    onClose={() => setUploadModalOpen(false)} 
                    onUpload={handleUpload} 
                />
            )}
        </div>
    );
}

function Sidebar({ activeTab, setActiveTab }) {
    return (
        <aside className="sidebar">
            <div className="brand">
                <i className="fas fa-layer-group"></i> DocFlow
            </div>
            <nav className="nav-links">
                <div className={`nav-item ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
                    <i className="fas fa-home"></i> Dashboard
                </div>
                <div className={`nav-item ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
                    <i className="fas fa-clock"></i> Pending Approvals
                </div>
                <div className={`nav-item ${activeTab === 'approved' ? 'active' : ''}`} onClick={() => setActiveTab('approved')}>
                    <i className="fas fa-check-circle"></i> Approved
                </div>
                <div className="nav-item">
                    <i className="fas fa-share-alt"></i> Shared with Me
                </div>
                <div className="nav-item" style={{ marginTop: 'auto' }}>
                    <i className="fas fa-cog"></i> Settings
                </div>
            </nav>
        </aside>
    );
}

function DocumentCard({ doc }) {
    const getIcon = (type) => {
        switch(type) {
            case 'pdf': return <i className="fas fa-file-pdf" style={{ color: '#ef4444' }}></i>;
            case 'word': return <i className="fas fa-file-word" style={{ color: '#3b82f6' }}></i>;
            case 'image': return <i className="fas fa-file-image" style={{ color: '#10b981' }}></i>;
            case 'archive': return <i className="fas fa-file-archive" style={{ color: '#f59e0b' }}></i>;
            default: return <i className="fas fa-file"></i>;
        }
    };

    return (
        <div className="doc-card">
            <div className="doc-preview">
                {getIcon(doc.type)}
            </div>
            <div className="doc-info">
                <div className="doc-title" title={doc.title}>{doc.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{doc.size} • {doc.date}</div>
                <div className="doc-meta">
                    <span>{doc.author}</span>
                    <span className={`badge ${doc.status}`}>{doc.status.toUpperCase()}</span>
                </div>
            </div>
        </div>
    );
}

function UploadModal({ onClose, onUpload }) {
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('Streaming to GridFS...');

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const processFile = (file) => {
        setUploading(true);
        
        // Simulate Express Multer/GridFS streaming and Node.js Sharp processing
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.random() * 15;
            if (currentProgress > 50 && statusText === 'Streaming to GridFS...') {
                setStatusText('Extracting text and generating thumbnails (Sharp/PDF2Pic)...');
            }
            if (currentProgress >= 100) {
                clearInterval(interval);
                setProgress(100);
                setStatusText('Processing complete. Initiating approval workflow.');
                
                setTimeout(() => {
                    const newDoc = {
                        id: Date.now(),
                        title: file.name,
                        size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
                        type: file.name.split('.').pop().toLowerCase() === 'pdf' ? 'pdf' : 
                              file.type.includes('image') ? 'image' : 'word',
                        status: 'pending',
                        date: 'Just now',
                        author: 'Current User'
                    };
                    onUpload(newDoc);
                    onClose();
                }, 1000);
            } else {
                setProgress(currentProgress);
            }
        }, 300);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3><i className="fas fa-cloud-upload-alt"></i> Upload Document</h3>
                    <button className="close-btn" onClick={onClose}><i className="fas fa-times"></i></button>
                </div>
                
                {!uploading ? (
                    <div 
                        className={`drop-zone ${dragActive ? 'active' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.onchange = (e) => processFile(e.target.files[0]);
                            input.click();
                        }}
                    >
                        <i className="fas fa-file-upload"></i>
                        <h4>Drag & Drop files here</h4>
                        <p style={{ marginTop: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            or click to browse from your computer
                        </p>
                    </div>
                ) : (
                    <div className="upload-progress">
                        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
                        </div>
                        <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="status-text">{statusText}</div>
                    </div>
                )}
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
