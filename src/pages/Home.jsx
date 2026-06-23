import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
// Import your products array from data/products.js
import products from "../data/products"; 
// Import your ProductCard component
import ProductCard from "../components/ProductCard";
// Import your Navbar component (currently named Hero)
import Hero from "../components/Hero"; 
import Footer from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  return (
    <div style={{ backgroundColor: "#faf8f6", minHeight: "100vh", position: "relative" }}>
      {/* CSS Injection for the Dangling/Floating Animation Effect */}
      <style>{`
        @keyframes dangleFloat {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(3deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }
        .dangling-cart-btn {
          animation: dangleFloat 3s ease-in-out infinite;
        }
        .dangling-cart-btn:hover {
          animation-play-state: paused; /* Stops swinging when user hovers to click */
        }
      `}</style>

      {/* Your sticky navbar */}
      <Hero />

      {/* Main Content Area */}
      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px 4% 40px" }}>
        
        {/* Integrated Micro-Header Introduction */}
        <div style={{ marginBottom: "35px", maxWidth: "800px" }}>
          <p style={{ 
            margin: "0 0 6px", 
            fontSize: "0.75rem", 
            color: "#8b7355", 
            letterSpacing: "1.5px", 
            textTransform: "uppercase", 
            fontFamily: "sans-serif", 
            fontWeight: "700" 
          }}>
            Welcome to Apex Home Furnishings
          </p>
          <h1 style={{ 
            fontFamily: "'Georgia', serif", 
            color: "#1a1a1a", 
            fontSize: "2.2rem", 
            fontWeight: "800",
            margin: "0 0 10px",
            letterSpacing: "-0.5px"
          }}>
            Featured Collections
          </h1>
          <p style={{ 
            color: "#5a5550", 
            margin: 0,
            fontSize: "0.95rem",
            fontFamily: "sans-serif",
            lineHeight: "1.5"
          }}>
            Explore premium furniture pieces engineered with minimalist aesthetics and exceptional quality, carefully curated for modern spaces.
          </p>
        </div>

        {/* Dynamic Responsive Product Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "24px"
        }}>
          {products && products.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
        
      </main>

      {/* ── FLOATING DANGLING CART BUTTON ── */}
      <button
        onClick={() => navigate("/cart")}
        className="dangling-cart-btn"  /* Added our animated CSS class here */
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#1a1a1a", 
          border: "none",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)", // Slightly deeper shadow so it looks elevated
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99,
          transition: "transform 0.2s ease, background-color 0.2s ease",
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          {/* Shopping Bag SVG */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>

          {/* Item Count Notification Badge */}
          {totalItems > 0 && (
            <div style={{
              position: "absolute",
              top: "-10px",
              right: "-10px",
              backgroundColor: "#8b7355",
              color: "white",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              fontSize: "0.7rem",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
            }}>
              {totalItems}
            </div>
          )}
        </div>
      </button>

      <Footer />
    </div>
  );
}