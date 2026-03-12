function Filters({ categories }) {
    const { filters, setFilters } = window.useProducts();
    
    return React.createElement('div', { className: 'filters' },
        React.createElement('label', null,
            'Category: ',
            React.createElement('select', {
                value: filters.category || '',
                onChange: (e) => setFilters(f => ({ ...f, category: e.target.value }))
            },
                React.createElement('option', { value: '' }, 'All Categories'),
                categories.map(cat => 
                    React.createElement('option', { key: cat, value: cat }, cat)
                )
            )
        ),
        React.createElement('label', null,
            'Sort by: ',
            React.createElement('select', {
                value: filters.sort || '',
                onChange: (e) => setFilters(f => ({ ...f, sort: e.target.value }))
            },
                React.createElement('option', { value: '' }, 'Default'),
                React.createElement('option', { value: 'price-low' }, 'Price: Low to High'),
                React.createElement('option', { value: 'price-high' }, 'Price: High to Low'),
                React.createElement('option', { value: 'name' }, 'Name: A to Z')
            )
        )
    );
}

window.Filters = Filters;
