function Header() {
    const { cart } = window.useProducts();
    
    return React.createElement('header', { className: 'header' },
        React.createElement('h1', null, '🛒 ShopCore - Product Discovery'),
        React.createElement('div', { className: 'cart-indicator' },
            `Cart: ${cart.length} items`
        )
    );
}

window.Header = Header;
