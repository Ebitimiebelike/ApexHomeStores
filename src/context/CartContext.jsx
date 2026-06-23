import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // ── STEP 1: READ FROM LOCALSTORAGE ON LOAD ──────────────────────
  // Instead of starting with an empty array [], we check if a cart already exists in the phone's browser cache.
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("apex_cart_items");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error reading cart from localStorage:", error);
      return []; // Fallback to empty array if it fails
    }
  });

  // ── STEP 2: WRITE TO LOCALSTORAGE ON EVERY CHANGE ───────────────
  // This side effect triggers automatically whenever an item is added, updated, or removed.
  useEffect(() => {
    localStorage.setItem("apex_cart_items", JSON.stringify(cartItems));
  }, [cartItems]);

  // ── YOUR EXISTING FUNCTIONS ─────────────────────────────────────
  // Keep your exact functions below! Do not change how they work.
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, amount) => {
    if (amount < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: amount } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // ── CALCULATIONS ────────────────────────────────────────────────
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);