function ProductCard({ product }) {
    const { addToCart } = window.useProducts();
    
    return React.createElement('div', { className: 'product-card' },
        React.createElement('img', { 
            src: product.image, 
            alt: product.name,
            className: 'product-image'
        }),
        React.createElement('h3', { className: 'product-name' }, product.name),
        React.createElement('div', { className: 'product-meta' },
            React.createElement('span', { className: 'product-category' }, product.category),
            React.createElement('span', { className: 'product-price' }, `$${product.price.toFixed(2)}`)
        ),
        React.createElement('button', {
            className: 'add-to-cart-btn',
            onClick: () => addToCart(product)
        }, 'Add to Cart')
    );
}

window.ProductCard = ProductCard;
  