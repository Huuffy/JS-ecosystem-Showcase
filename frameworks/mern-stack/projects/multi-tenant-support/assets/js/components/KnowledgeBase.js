// Enhanced Knowledge Base Component with backend integration
function KnowledgeBase() {
    const [articles, setArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const categories = ['all', 'Authentication', 'Email', 'Support', 'Features', 'General'];

    // Fetch articles from backend
    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:5000/api/articles')
            .then(res => res.json())
            .then(data => {
                setArticles(data);
                setFilteredArticles(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching articles:', error);
                setLoading(false);
            });
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = articles;

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(article => article.category === selectedCategory);
        }

        // Filter by search term
        if (searchTerm.trim()) {
            filtered = filtered.filter(article =>
                article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
            );
        }

        setFilteredArticles(filtered);
    }, [searchTerm, selectedCategory, articles]);

    const handleCreateArticle = async (articleData) => {
        setSaving(true);
        try {
            const response = await fetch('http://localhost:5000/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...articleData,
                    author: 'Current User',
                    created: new Date(),
                    updated: new Date(),
                    views: 0,
                    helpful: 0
                })
            });

            if (response.ok) {
                const newArticle = await response.json();
                setArticles(prev => [newArticle, ...prev]);
                setShowCreateModal(false);
            }
        } catch (error) {
            console.error('Error creating article:', error);
            alert('Failed to create article. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleMarkHelpful = async (articleId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/articles/${articleId}/helpful`, {
                method: 'PUT'
            });

            if (response.ok) {
                setArticles(articles.map(article =>
                    article.id === articleId
                        ? { ...article, helpful: article.helpful + 1 }
                        : article
                ));
            }
        } catch (error) {
            console.error('Error marking article as helpful:', error);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading knowledge base...</p>
            </div>
        );
    }

    return (
        <div className="knowledge-base">
            <div className="kb-header">
                <h2>Knowledge Base</h2>
                <button 
                    className="btn btn-primary tenant-themed"
                    onClick={() => setShowCreateModal(true)}
                    disabled={saving}
                >
                    Create Article
                </button>
            </div>

            <div className="kb-filters card">
                <div className="search-section">
                    <input
                        type="text"
                        className="form-input search-input"
                        placeholder="Search articles, tags, or content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="category-filters">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category === 'all' ? 'All Categories' : category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="kb-stats">
                <div className="stat-item">
                    <span className="stat-number">{articles.length}</span>
                    <span className="stat-label">Total Articles</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{filteredArticles.length}</span>
                    <span className="stat-label">Showing</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{articles.reduce((sum, article) => sum + (article.views || 0), 0)}</span>
                    <span className="stat-label">Total Views</span>
                </div>
            </div>

            <div className="articles-grid">
                {filteredArticles.length === 0 ? (
                    <div className="empty-state card">
                        <h3>No articles found</h3>
                        <p>Try adjusting your search terms or category filter.</p>
                    </div>
                ) : (
                    filteredArticles.map(article => (
                        <div key={article.id} className="article-card card">
                            <div className="article-header">
                                <h3 className="article-title">{article.title}</h3>
                                <span className="article-category">{article.category}</span>
                            </div>
                            
                            <div className="article-meta">
                                <span className="article-author">By {article.author}</span>
                                <span className="article-date">{new Date(article.updated || article.created).toLocaleDateString()}</span>
                            </div>
                            
                            <div className="article-preview">
                                {article.content.substring(0, 200)}...
                            </div>
                            
                            {article.tags && (
                                <div className="article-tags">
                                    {article.tags.map(tag => (
                                        <span key={tag} className="tag">{tag}</span>
                                    ))}
                                </div>
                            )}
                            
                            <div className="article-stats">
                                <span className="stat-item">
                                    👁️ {article.views || 0} views
                                </span>
                                <span className="stat-item">
                                    👍 {article.helpful || 0} helpful
                                </span>
                            </div>
                            
                            <div className="article-actions">
                                <button 
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedArticle(article)}
                                >
                                    Read Full Article
                                </button>
                                <button 
                                    className="btn btn-success"
                                    onClick={() => handleMarkHelpful(article.id)}
                                >
                                    Mark Helpful
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Article Modal */}
            {showCreateModal && (
                <CreateArticleModal 
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateArticle}
                    categories={categories.filter(cat => cat !== 'all')}
                    saving={saving}
                />
            )}

            {/* Article Details Modal */}
            {selectedArticle && (
                <ArticleDetailsModal 
                    article={selectedArticle}
                    onClose={() => setSelectedArticle(null)}
                    onMarkHelpful={handleMarkHelpful}
                />
            )}
        </div>
    );
}

// Create Article Modal Component
function CreateArticleModal({ onClose, onSubmit, categories, saving }) {
    const [formData, setFormData] = useState({
        title: '',
        category: categories[0] || 'General',
        content: '',
        tags: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.title.trim() && formData.content.trim()) {
            const articleData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            };
            onSubmit(articleData);
            setFormData({ title: '', category: categories[0] || 'General', content: '', tags: '' });
        }
    };

    return (
        <div className="modal active">
            <div className="modal-content large">
                <div className="modal-header">
                    <h2>Create New Article</h2>
                    <button className="close-btn" onClick={onClose} disabled={saving}>×</button>
                </div>
                
                <form onSubmit={handleSubmit} className="article-form">
                    <div className="form-group">
                        <label className="form-label">Title *</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="Enter article title"
                            required
                            disabled={saving}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <select 
                            className="form-input"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            disabled={saving}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Content *</label>
                        <textarea
                            className="form-input form-textarea"
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                            placeholder="Write your article content here..."
                            rows="10"
                            required
                            disabled={saving}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Tags</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.tags}
                            onChange={(e) => setFormData({...formData, tags: e.target.value})}
                            placeholder="Enter tags separated by commas"
                            disabled={saving}
                        />
                    </div>
                    
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary tenant-themed" disabled={saving}>
                            {saving ? 'Creating...' : 'Create Article'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Article Details Modal Component
function ArticleDetailsModal({ article, onClose, onMarkHelpful }) {
    return (
        <div className="modal active">
            <div className="modal-content large">
                <div className="modal-header">
                    <div>
                        <h2>{article.title}</h2>
                        <div className="article-meta">
                            <span className="article-category">{article.category}</span>
                            <span className="article-author">By {article.author}</span>
                            <span className="article-date">Updated {new Date(article.updated || article.created).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                
                <div className="article-content">
                    <div className="article-text">
                        {article.content.split('\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                    
                    {article.tags && (
                        <div className="article-tags">
                            {article.tags.map(tag => (
                                <span key={tag} className="tag">{tag}</span>
                            ))}
                        </div>
                    )}
                    
                    <div className="article-footer">
                        <div className="article-stats">
                            <span>👁️ {article.views || 0} views</span>
                            <span>👍 {article.helpful || 0} people found this helpful</span>
                        </div>
                        
                        <div className="article-actions">
                            <button 
                                className="btn btn-success"
                                onClick={() => onMarkHelpful(article.id)}
                            >
                                Mark as Helpful
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
