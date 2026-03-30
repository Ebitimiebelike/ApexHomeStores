import { createContext, useContext, useState } from "react";

// Step 1: Create the noticeboard
// This is just an empty board for now — we'll fill it via the Provider
const CartContext = createContext();

// Step 2: Create the Provider — this is the hallway noticeboard
// Every component wrapped inside this can access the cart
export function CartProvider({ children }) {

  // The actual cart data lives here — an array of items
  // Each item will look like: { id, name, price, image, quantity }
  const [cartItems, setCartItems] = useState([]);

  // ADD to cart
  // If the product is already in the cart, just increase its quantity
  // If it's new, add it as a fresh entry
  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // Map over items and update only the matching one
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      // Product not in cart yet — add it
      return [...prev, { ...product, quantity }];
    });
  };

  // REMOVE one item completely from cart
  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  // UPDATE quantity of a specific item
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return; // never go below 1
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Total number of items (used for the basket badge in navbar)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Total price
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    // Step 3: Share all of this with every component inside
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook — instead of writing useContext(CartContext) everywhere,
// you just write useCart(). Clean and reusable.
export function useCart() {
  return useContext(CartContext);
}