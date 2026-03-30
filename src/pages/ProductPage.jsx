import { useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import products from "../data/products";
import { useCart } from "../context/CartContext";

export default function ProductPage() {
  // Zone 2 — read the :id from the URL
  const { id } = useParams();
  const navigate = useNavigate();
const { addToCart } = useCart();

  // Find the product whose id matches the URL
  // useParams always gives you a string, so we convert it to a number with Number()
  const product = products.find(p => p.id === Number(id));
  const [quantity, setQuantity] = useState(1);
  const [addedMsg, setAddedMsg] = useState(false);

  // Guard clause — if someone types a bad URL like /product/999
  if (!product) {
    return (
      <div style={{ padding: "80px 6%", textAlign: "center", fontFamily: "sans-serif" }}>
        <h2>Product not found</h2>
        <button
          onClick={() => navigate("/shop")}
          style={{ marginTop: "20px", padding: "12px 32px", backgroundColor: "#8b7355",
            color: "white", border: "none", cursor: "pointer", fontSize: "0.9rem" }}>
          Back to Shop
        </button>
      </div>
    );
  }

  // Related products — same category, exclude current product, max 3
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleAddToBasket = () => {
  addToCart(product, quantity); // 👈 this line is new
  setAddedMsg(true);
  setTimeout(() => setAddedMsg(false), 2000);
};

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#eae6e1", fontFamily: "'Georgia', serif" }}>

      {/* Breadcrumb */}
      <div style={{ padding: "16px 6%", fontSize: "0.8rem", fontFamily: "sans-serif", color: "#7a6e68" }}>
        <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Home</span>
        <span style={{ margin: "0 8px" }}>›</span>
        <span onClick={() => navigate("/shop")} style={{ cursor: "pointer" }}>Shop</span>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "#1a1a1a" }}>{product.name}</span>
      </div>

      {/* Main product section */}
      <div style={{ display: "flex", gap: "60px", padding: "20px 6% 60px", alignItems: "flex-start" }}>

        {/* LEFT — Image */}
        <div style={{ flex: "0 0 52%", backgroundColor: "white", overflow: "hidden" }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "500px", objectFit: "cover", display: "block" }}
          />
        </div>

        {/* RIGHT — Details */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Category */}
          <span style={{ fontSize: "0.75rem", color: "#8b7355", letterSpacing: "1.5px",
            textTransform: "uppercase", fontFamily: "sans-serif" }}>
            {product.category}
          </span>

          {/* Name */}
          <h1 style={{ margin: 0, fontSize: "1.9rem", fontWeight: "900",
            color: "#1a1a1a", lineHeight: 1.2, letterSpacing: "-0.5px" }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#c8a43a", fontSize: "1rem" }}>
              {"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}
            </span>
            <span style={{ fontSize: "0.85rem", color: "#7a6e68", fontFamily: "sans-serif" }}>
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", paddingTop: "4px" }}>
            <span style={{ fontSize: "1.6rem", fontWeight: "700", color: "#1a1a1a", fontFamily: "sans-serif" }}>
              ${product.price}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: "1.1rem", color: "#aaa",
                textDecoration: "line-through", fontFamily: "sans-serif" }}>
                ${product.originalPrice}
              </span>
            )}
            {product.originalPrice && (
              <span style={{ backgroundColor: "#8b0000", color: "white",
                padding: "3px 10px", fontSize: "0.75rem", fontWeight: "700" }}>
                Save ${product.originalPrice - product.price}
              </span>
            )}
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #d4cfc9", paddingTop: "16px" }}>

            {/* Quantity selector */}
            <p style={{ margin: "0 0 10px", fontSize: "0.85rem",
              fontWeight: "600", fontFamily: "sans-serif", color: "#1a1a1a" }}>
              Quantity
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0",
              border: "1.5px solid #c8c2bb", width: "fit-content" }}>
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{ width: "40px", height: "40px", background: "none",
                  border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#1a1a1a" }}>
                −
              </button>
              <span style={{ width: "40px", textAlign: "center",
                fontFamily: "sans-serif", fontSize: "0.9rem" }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                style={{ width: "40px", height: "40px", background: "none",
                  border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#1a1a1a" }}>
                +
              </button>
            </div>
          </div>

          {/* Add to basket */}
          <button
            onClick={handleAddToBasket}
            style={{ padding: "15px", backgroundColor: "#8b7355", color: "white",
              border: "none", fontSize: "0.95rem", fontWeight: "600",
              letterSpacing: "1px", cursor: "pointer", marginTop: "8px",
              fontFamily: "sans-serif", transition: "background-color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6b5a50"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#8b7355"}
          >
            {addedMsg ? "✓ Added to Basket!" : `Add ${quantity} to Basket — $${product.price * quantity}`}
          </button>

          {/* Trust badges */}
          <div style={{ display: "flex", gap: "20px", paddingTop: "8px",
            borderTop: "1px solid #d4cfc9", flexWrap: "wrap" }}>
            {["🚚 Free Delivery over $199", "↩️ Free 30-day Returns", "🔒 Secure Checkout"].map(b => (
              <span key={b} style={{ fontSize: "0.78rem", color: "#7a6e68", fontFamily: "sans-serif" }}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div style={{ padding: "0 6% 60px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "900", marginBottom: "24px",
            color: "#1a1a1a", letterSpacing: "-0.3px" }}>
            You might also like
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {related.map(p => (
              <div
                key={p.id}
                onClick={() => navigate(`/product/${p.id}`)}
                style={{ backgroundColor: "white", cursor: "pointer",
                  border: "1px solid #e8e4df", overflow: "hidden",
                  transition: "box-shadow 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
                <img src={p.image} alt={p.name}
                  style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }} />
                <div style={{ padding: "14px" }}>
                  <p style={{ margin: "0 0 4px", fontSize: "0.92rem",
                    fontWeight: "700", color: "#1a1a1a", fontFamily: "'Georgia', serif" }}>
                    {p.name}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.9rem",
                    color: "#8b7355", fontFamily: "sans-serif", fontWeight: "600" }}>
                    ${p.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}