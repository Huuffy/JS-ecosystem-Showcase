const { useState, useEffect } = React;

function Catalog() {
    const { filters, search } = window.useProducts();
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
    }, [filters, search]);

    useEffect(() => {
        setLoading(true);
        window.fetchProducts({ page, filter: filters, search })
            .then(({ products: newProducts, hasMore }) => {
                setProducts(prev => page === 1 ? newProducts : [...prev, ...newProducts]);
                setHasMore(hasMore);
                setLoading(false);
            });
    }, [filters, search, page]);

    // Infinite scroll
    useEffect(() => {
        if (!hasMore || loading) return;
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
                setPage(p => p + 1);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, loading]);

    // Extract categories for filter dropdown
    const categories = Array.from(new Set(products.map(p => p.category)));

    return React.createElement('div', { className: 'app' },
        React.createElement(window.Header),
        React.createElement('div', { className: 'controls' },
            React.createElement(window.SearchBar),
            React.createElement(window.Filters, { categories })
        ),
        React.createElement(window.ProductList, { products }),
        loading && React.createElement('div', { className: 'loading' }, 'Loading...'),
        !hasMore && React.createElement('div', { className: 'end-message' }, 'No more products!')
    );
}

function App() {
    return React.createElement(window.ProductsProvider, null,
        React.createElement(Catalog)
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
