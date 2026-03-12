function CartPage() {
    const { cart, removeFromCart, clearCart } = window.useProducts();
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    return React.createElement('div', { className: 'cart-page' },
        React.createElement('h1', null, 'Shopping Cart'),
        cart.length === 0 
            ? React.createElement('p', null, 'Your cart is empty')
            : React.createElement('div', null,
                cart.map((item, index) => 
                    React.createElement('div', { key: index, className: 'cart-item' },
                        React.createElement('span', null, item.name),
                        React.createElement('span', null, `$${item.price.toFixed(2)}`),
                        React.createElement('button', {
                            onClick: () => removeFromCart(index)
                        }, 'Remove')
                    )
                ),
                React.createElement('div', { className: 'cart-total' },
                    React.createElement('strong', null, `Total: $${total.toFixed(2)}`)
                ),
                React.createElement('button', {
                    className: 'clear-cart-btn',
                    onClick: clearCart
                }, 'Clear Cart')
            )
    );
}

window.CartPage = CartPage;
