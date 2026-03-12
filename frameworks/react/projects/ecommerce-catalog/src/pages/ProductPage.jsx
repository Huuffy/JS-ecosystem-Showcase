function ProductPage({ productId }) {
    const [product, setProduct] = React.useState(null);
    
    React.useEffect(() => {
        // Simulate fetching product details
        const mockProduct = {
            id: productId,
            name: 'Sample Product',
            description: 'This is a detailed product description.',
            price: 99.99,
            category: 'Electronics',
            image: 'https://picsum.photos/seed/detail/600/400'
        };
        setProduct(mockProduct);
    }, [productId]);
    
    if (!product) {
        return React.createElement('div', { className: 'loading' }, 'Loading product...');
    }
    
    return React.createElement('div', { className: 'product-page' },
        React.createElement('h1', null, product.name),
        React.createElement('img', { src: product.image, alt: product.name }),
        React.createElement('p', null, product.description),
        React.createElement('span', { className: 'price' }, `$${product.price}`)
    );
}

window.ProductPage = ProductPage;
