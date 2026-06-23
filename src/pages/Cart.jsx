import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { formatNaira } from "../Utils/currency";
import Footer from "../components/Footer";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (cartItems.length === 0) {
    return (
      <div style={{ 
        minHeight: "100vh", backgroundColor: "#eae6e1",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Georgia', serif", gap: "16px",
        padding: "20px", textAlign: "center" 
      }}>
        <span style={{ fontSize: "3rem" }}>🛋️</span>
        <h2 style={{ margin: 0, fontSize: "1.4rem", color: "#1a1a1a" }}>Your basket is empty</h2>
        <p style={{ margin: 0, color: "#7a6e68", fontFamily: "sans-serif" }}>
          Looks like you haven't added anything yet.
        </p>
        <button
          onClick={() => navigate("/shop")}
          style={{ marginTop: "8px", padding: "13px 36px",
            backgroundColor: "#8b7355", color: "white",
            border: "none", fontSize: "0.9rem", fontWeight: "600",
            cursor: "pointer", fontFamily: "sans-serif" }}>
          Browse Furniture
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#eae6e1", fontFamily: "'Georgia', serif", overflowX: "hidden" }}>

      {/* Header Area */}
      <div style={{ 
        padding: isMobile ? "24px 5% 16px" : "40px 6% 24px", 
        borderBottom: "1px solid #d4cfc9",
        boxSizing: "border-box"
      }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? "1.5rem" : "1.8rem", fontWeight: "900", color: "#1a1a1a" }}>
          Your Basket
        </h1>
        <p style={{ margin: "4px 0 0", color: "#7a6e68",
          fontSize: "0.9rem", fontFamily: "sans-serif" }}>
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Main layout wrapper */}
      <div style={{ 
        display: "flex", 
        flexDirection: isMobile ? "column" : "row",
        gap: "24px", 
        padding: isMobile ? "16px 5%" : "32px 6%", // Using 5% evenly on mobile
        maxWidth: "1400px",
        margin: "0 auto",
        boxSizing: "border-box",
        width: "100%"
      }}>

        {/* LEFT — Cart items list container */}
        <div style={{ 
          flex: "1 1 0%", 
          width: "100%",
          display: "flex", 
          flexDirection: "column", 
          gap: "16px",
          boxSizing: "border-box"
        }}>
          {cartItems.map(item => (
            <div key={item.id} style={{ 
              backgroundColor: "white",
              border: "1px solid #e8e4df", 
              display: "flex", 
              flexDirection: isMobile ? "column" : "row", 
              gap: isMobile ? "14px" : "20px", 
              padding: isMobile ? "16px" : "20px",
              boxSizing: "border-box",
              width: "100%"
            }}>

              {/* Layout wrapper for product image + context details */}
              <div style={{ display: "flex", gap: "16px", flex: 1 }}>
                <img src={item.image} alt={item.name}
                  style={{ 
                    width: isMobile ? "90px" : "110px", 
                    height: isMobile ? "80px" : "90px",
                    objectFit: "cover", 
                    flexShrink: 0 
                  }} />

                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "0.65rem", color: "#8b7355",
                    letterSpacing: "1px", textTransform: "uppercase",
                    fontFamily: "sans-serif" }}>
                    {item.category}
                  </span>
                  <h3 style={{ margin: 0, fontSize: "0.95rem",
                    fontWeight: "700", color: "#1a1a1a", lineHeight: "1.3" }}>
                    {item.name}
                  </h3>
                  <p style={{ margin: "4px 0 0", fontSize: "0.9rem",
                    color: "#8b7355", fontFamily: "sans-serif", fontWeight: "600" }}>
                    {formatNaira(item.price)}
                  </p>
                </div>
              </div>

              {/* Quantity selection + remove row panel */}
              <div style={{ 
                display: "flex", 
                flexDirection: isMobile ? "row" : "column",
                alignItems: isMobile ? "center" : "flex-end", 
                justifyContent: "space-between",
                borderTop: isMobile ? "1px solid #f3ede6" : "none",
                paddingTop: isMobile ? "12px" : "0px",
                gap: "12px",
                width: "100%",
                boxSizing: "border-box"
              }}>

                <div style={{ display: "flex", alignItems: "center", backgroundColor: "white", border: "1.5px solid #c8c2bb" }}>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    style={{ width: "32px", height: "32px", background: "none",
                      border: "none", fontSize: "1.1rem", cursor: "pointer" }}>
                    −
                  </button>
                  <span style={{ width: "32px", textAlign: "center",
                    fontSize: "0.9rem", fontFamily: "sans-serif" }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{ width: "32px", height: "32px", background: "none",
                      border: "none", fontSize: "1.1rem", cursor: "pointer" }}>
                    +
                  </button>
                </div>

                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: "0 0 4px", fontWeight: "700",
                    fontFamily: "sans-serif", color: "#1a1a1a", fontSize: "0.95rem" }}>
                    {formatNaira(item.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{ background: "none", border: "none",
                      color: "#b03a2e", fontSize: "0.78rem", 
                      cursor: "pointer", fontFamily: "sans-serif",
                      textDecoration: "underline", padding: "4px 0" }}>
                    Remove
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* RIGHT — Order summary panel layout structure */}
        <div style={{ 
          width: "100%",
          flex: isMobile ? "1 1 auto" : "0 0 350px", 
          backgroundColor: "white",
          border: "1px solid #e8e4df", 
          padding: "24px",
          display: "flex", 
          flexDirection: "column", 
          gap: "14px",
          boxSizing: "border-box"
        }}>

          <h2 style={{ margin: 0, fontSize: "1.1rem",
            fontWeight: "900", color: "#1a1a1a" }}>
            Order Summary
          </h2>

          <div style={{ borderTop: "1px solid #e8e4df", paddingTop: "14px",
            display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between",
              fontSize: "0.88rem", fontFamily: "sans-serif", color: "#5a5550" }}>
              <span>Subtotal ({totalItems} items)</span>
              <span>{formatNaira(totalPrice)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between",
              fontSize: "0.88rem", fontFamily: "sans-serif", color: "#5a5550" }}>
              <span>Delivery</span>
              <span style={{ color: "#2d6a2d", fontWeight: "600" }}>
                {totalPrice >= 199000 ? "FREE" : formatNaira(5000)}
              </span>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #e8e4df", paddingTop: "14px",
            display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: "700", fontSize: "1rem", color: "#1a1a1a" }}>Total</span>
            <span style={{ fontWeight: "700", fontSize: "1.1rem",
              color: "#1a1a1a", fontFamily: "sans-serif" }}>
              {formatNaira(totalPrice >= 199000 ? totalPrice : totalPrice + 5000)}
            </span>
          </div>

          {totalPrice < 199000 && (
            <p style={{ margin: 0, fontSize: "0.78rem", color: "#8b7355",
              fontFamily: "sans-serif", backgroundColor: "#f5f0eb",
              padding: "10px", textAlign: "center" }}>
              Add {formatNaira(199000 - totalPrice)} more for free delivery
            </p>
          )}

          <button
            onClick={() => navigate("/checkout")}
            style={{ padding: "15px", backgroundColor: "#8b7355",
              color: "white", border: "none", fontSize: "0.95rem",
              fontWeight: "600", letterSpacing: "1px", cursor: "pointer",
              fontFamily: "sans-serif", marginTop: "10px" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6b5a50"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#8b7355"}>
            Proceed to Checkout
          </button>

          <button
            onClick={() => navigate("/shop")}
            style={{ padding: "12px", backgroundColor: "transparent",
              color: "#1a1a1a", border: "2px solid #1a1a1a",
              fontSize: "0.85rem", fontWeight: "600", cursor: "pointer",
              fontFamily: "sans-serif" }}>
            Continue Shopping
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}