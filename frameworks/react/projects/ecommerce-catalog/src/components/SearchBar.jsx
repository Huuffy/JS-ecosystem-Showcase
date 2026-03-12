function SearchBar() {
    const { search, setSearch } = window.useProducts();
    
    return React.createElement('input', {
        className: 'search-bar',
        type: 'text',
        placeholder: 'Search products...',
        value: search,
        onChange: (e) => setSearch(e.target.value)
    });
}

window.SearchBar = SearchBar;
