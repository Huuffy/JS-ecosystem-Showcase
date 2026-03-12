const { createContext, useContext, useState } = React;

const ProductsContext = createContext();

function useProducts() {
    return useContext(ProductsContext);
}

function ProductsProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [filters, setFilters] = useState({});
    const [search, setSearch] = useState('');

    const addToCart = (product) => {
        setCart(prev => [...prev, product]);
    };

    const removeFromCart = (index) => {
        setCart(prev => prev.filter((_, i) => i !== index));
    };

    const clearCart = () => {
        setCart([]);
    };

    return React.createElement(ProductsContext.Provider, {
        value: {
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            filters,
            setFilters,
            search,
            setSearch
        }
    }, children);
}

window.useProducts = useProducts;
window.ProductsProvider = ProductsProvider;
