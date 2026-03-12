function ProductList({ products }) {
    return React.createElement('div', { className: 'product-list' },
        products.map(product => 
            React.createElement(window.ProductCard, { 
                key: product.id, 
                product 
            })
        )
    );
}

window.ProductList = ProductList;
