import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import products from "../data/products";
import { useCart } from "../context/CartContext";
import { formatNaira } from "../Utils/currency";
import Footer from "../components/Footer";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Destructure cart items from your useCart context to calculate item quantity
  const { addToCart, totalItems } = useCart();

  const product = products.find(p => p.id === Number(id));
  const [quantity, setQuantity] = useState(1);
  const [addedMsg, setAddedMsg] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);
  
  // State to trigger the instant click-based dangle animation
  const [isClickedDangling, setIsClickedDangling] = useState(false);

  // Responsiveness Listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1000);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!product) {
    return (
      <div style={{ padding: "80px 6%", textAlign: "center", fontFamily: "sans-serif" }}>
        <h2>Product not found</h2>
        <button
          onClick={() => navigate("/shop")}
          style={{ marginTop: "20px", padding: "12px 32px", backgroundColor: "#8b7355", color: "white", border: "none", cursor: "pointer", fontSize: "0.9rem" }}>
          Back to Shop
        </button>
      </div>
    );
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleAddToBasket = () => {
    addToCart(product, quantity);
    
    // Trigger the brown top popup banner
    setAddedMsg(true);
    
    // Trigger immediate click dangle physics animation
    setIsClickedDangling(true);

    // Keep the popup visible for exactly 5 seconds as requested
    setTimeout(() => {
      setAddedMsg(false);
    }, 5000);

    // Let the click animation cycle finish, then clean up state
    setTimeout(() => {
      setIsClickedDangling(false);
    }, 1200); 
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#eae6e1", fontFamily: "'Georgia', serif", position: "relative" }}>
      
      {/* --- INJECTING ANIMATIONS --- */}
      <style>{`
        /* Base Dangle Logic Structure */
        @keyframes dangleEffect {
          0% { transform: rotate(0deg); }
          15% { transform: rotate(15deg); }
          30% { transform: rotate(-12deg); }
          45% { transform: rotate(10deg); }
          60% { transform: rotate(-8deg); }
          75% { transform: rotate(4deg); }
          90% { transform: rotate(-2deg); }
          100% { transform: rotate(0deg); }
        }

        /* Continuous Idle Dangle loop: Dangles for 1.2s, stays idle for the remaining 3.8s of the 5s loop */
        @keyframes periodicDangle {
          0%, 76%, 100% { transform: rotate(0deg); }
          11% { transform: rotate(15deg); }
          22% { transform: rotate(-12deg); }
          33% { transform: rotate(10deg); }
          44% { transform: rotate(-8deg); }
          55% { transform: rotate(4deg); }
          66% { transform: rotate(-2deg); }
        }

        .idle-dangle-active {
          animation: periodicDangle 5s infinite ease-in-out;
        }

        .click-dangle-active {
          animation: dangleEffect 1.2s ease-in-out !important;
        }
      `}</style>

      {/* --- BROWN THEME TOP POPUP NOTIFICATION (Lasts 5 seconds) --- */}
      <div style={{
        position: "fixed",
        top: addedMsg ? "20px" : "-100px", 
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#6e573e", 
        color: "#f5efe9",
        padding: "14px 28px",
        borderRadius: "4px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        zIndex: 2000,
        fontFamily: "sans-serif",
        fontSize: "0.92rem",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)", 
        width: isMobile ? "85%" : "auto",
        maxWidth: "450px",
        justifyContent: "center"
      }}>
        <span style={{ fontSize: "1.1rem" }}>✓</span>
        <span>{product.name} successfully added to cart!</span>
      </div>

      {/* Breadcrumb */}
      <div style={{ padding: "16px 6%", fontSize: "0.8rem", fontFamily: "sans-serif", color: "#7a6e68" }}>
        <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Home</span>
        <span style={{ margin: "0 8px" }}>›</span>
        <span onClick={() => navigate("/shop")} style={{ cursor: "pointer" }}>Shop</span>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "#1a1a1a" }}>{product.name}</span>
      </div>

      {/* Main product section - Stacked on Mobile */}
      <div style={{ 
        display: "flex", 
        flexDirection: isMobile ? "column" : "row", 
        gap: isMobile ? "30px" : "60px", 
        padding: isMobile ? "10px 6% 40px" : "20px 6% 60px", 
        alignItems: "flex-start" 
      }}>

        {/* LEFT — Image */}
        <div style={{ 
          flex: isMobile ? "1" : "0 0 52%", 
          width: isMobile ? "100%" : "auto",
          backgroundColor: "white", 
          overflow: "hidden" 
        }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ 
              width: "100%", 
              height: isMobile ? "350px" : "500px", 
              objectFit: "cover", 
              display: "block" 
            }}
          />
        </div>

        {/* RIGHT — Details */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", width: isMobile ? "100%" : "auto" }}>
          <span style={{ fontSize: "0.75rem", color: "#8b7355", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "sans-serif" }}>
            {product.category}
          </span>

          <h1 style={{ margin: 0, fontSize: isMobile ? "1.6rem" : "1.9rem", fontWeight: "900", color: "#1a1a1a", lineHeight: 1.2, letterSpacing: "-0.5px" }}>
            {product.name}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#c8a43a", fontSize: "1rem" }}>
              {"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}
            </span>
            <span style={{ fontSize: "0.85rem", color: "#7a6e68", fontFamily: "sans-serif" }}>
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", paddingTop: "4px" }}>
            <span style={{ fontSize: "1.6rem", fontWeight: "700", color: "#1a1a1a", fontFamily: "sans-serif" }}>
              {formatNaira(product.price)}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: "1.1rem", color: "#aaa", textDecoration: "line-through", fontFamily: "sans-serif" }}>
                {formatNaira(product.originalPrice)}
              </span>
            )}
          </div>

          <div style={{ borderTop: "1px solid #d4cfc9", paddingTop: "16px" }}>
            <p style={{ margin: "0 0 10px", fontSize: "0.85rem", fontWeight: "600", fontFamily: "sans-serif", color: "#1a1a1a" }}>
              Quantity
            </p>
            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #c8c2bb", width: "fit-content" }}>
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: "40px", height: "40px", background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" }}>−</button>
              <span style={{ width: "40px", textAlign: "center", fontFamily: "sans-serif" }}>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} style={{ width: "40px", height: "40px", background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" }}>+</button>
            </div>
          </div>

          <button
            onClick={handleAddToBasket}
            style={{ padding: "15px", backgroundColor: "#8b7355", color: "white", border: "none", fontSize: "0.95rem", fontWeight: "600", letterSpacing: "1px", cursor: "pointer", marginTop: "8px", fontFamily: "sans-serif" }}
          >
            Add {quantity} to Basket — {formatNaira(product.price * quantity)}
          </button>

          <button
            onClick={() => navigate("/shop")}
            style={{ padding: "15px", backgroundColor: "transparent",
              color: "#1a1a1a", border: "2px solid #1a1a1a",
              fontSize: "0.95rem", fontWeight: "600", cursor: "pointer",marginTop: "8px",
              fontFamily: "sans-serif" }}>
            Continue Shopping
          </button>

          <div style={{ display: "flex", gap: "15px", paddingTop: "8px", borderTop: "1px solid #d4cfc9", flexWrap: "wrap" }}>
            {["🚚 Free Delivery", "↩️ Free Returns", "🔒 Secure Checkout"].map(b => (
              <span key={b} style={{ fontSize: "0.72rem", color: "#7a6e68", fontFamily: "sans-serif" }}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div style={{ padding: "0 6% 80px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "900", marginBottom: "24px", color: "#1a1a1a" }}>
            You might also like
          </h2>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", 
            gap: "24px" 
          }}>
            {related.map(p => (
              <div key={p.id} onClick={() => navigate(`/product/${p.id}`)} style={{ backgroundColor: "white", cursor: "pointer", border: "1px solid #e8e4df" }}>
                <img src={p.image} alt={p.name} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                <div style={{ padding: "14px" }}>
                  <p style={{ margin: "0 0 4px", fontSize: "0.92rem", fontWeight: "700", fontFamily: "'Georgia', serif" }}>{p.name}</p>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#8b7355", fontWeight: "600" }}>{formatNaira(p.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- FLOATING BASKET WRAPPER CONTEXT CONTAINER --- */}
      <div 
        style={{
          position: "fixed",
          bottom: isMobile ? "20px" : "30px",
          right: isMobile ? "20px" : "30px",
          zIndex: 1000,
        }}
        // Appends the infinite 5-second dangle loop unless overridden instantly by click state
        className={isClickedDangling ? "click-dangle-active" : "idle-dangle-active"}
      >
        {/* --- DYNAMIC COUNT BADGE (Rendered if items > 0) --- */}
        {totalItems > 0 && (
          <div style={{
            position: "absolute",
            top: "-4px",
            right: "-4px",
            backgroundColor: "#8b7355", // Styled to match your primary brown branding tint
            color: "white",
            fontSize: "0.75rem",
            fontWeight: "700",
            borderRadius: "50%",
            width: "22px",
            height: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            zIndex: 1001,
            fontFamily: "sans-serif"
          }}>
            {totalItems}
          </div>
        )}

        {/* Floating Action Button */}
        <button 
          onClick={() => navigate("/cart")}
          style={{
            width: isMobile ? "50px" : "60px",
            height: isMobile ? "50px" : "60px",
            borderRadius: "50%",
            backgroundColor: "#1a1a1a",
            color: "white",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transformOrigin: "top center"
          }}
        >
          <svg width={isMobile ? "20" : "24"} height={isMobile ? "20" : "24"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </button>
      </div>

      <Footer />
    </div>
  );
}