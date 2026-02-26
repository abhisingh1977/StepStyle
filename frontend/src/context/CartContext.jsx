import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('stepstyle_cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('stepstyle_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(prev => {
            const exists = prev.find(i => i._id === product._id);
            if (exists) return prev.map(i => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i);
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => setCart(prev => prev.filter(i => i._id !== id));

    const updateQuantity = (id, quantity) => {
        if (quantity <= 0) return removeFromCart(id);
        setCart(prev => prev.map(i => i._id === id ? { ...i, quantity } : i));
    };

    const clearCart = () => setCart([]);

    const total = cart.reduce((sum, item) => {
        const price = item.price * (1 - (item.discountPercent || 0) / 100);
        return sum + price * item.quantity;
    }, 0);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, totalItems }}>
            {children}
        </CartContext.Provider>
    );
};
