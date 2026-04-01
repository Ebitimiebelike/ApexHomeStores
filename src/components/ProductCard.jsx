import { useNavigate } from "react-router-dom";
import { formatNaira } from "../utils/currency";
const BG = "#eae6e1";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      style={{
        backgroundColor: "white",
        border: "1px solid #e8e4df",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden", backgroundColor: BG }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: "100%", height: "220px", objectFit: "cover", display: "block" }}
        />
        {product.badge && (
          <span style={{
            position: "absolute", top: "12px", left: "12px",
            backgroundColor: product.badge === "Sale" ? "#8b0000" : "#8b7355",
            color: "white", fontSize: "0.7rem", fontWeight: "700",
            padding: "3px 10px", letterSpacing: "1px",
          }}>
            {product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
        <span style={{ fontSize: "0.7rem", color: "#8b7355", letterSpacing: "1px", textTransform: "uppercase", fontFamily: "sans-serif" }}>
          {product.category}
        </span>
        <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: "700", color: "#1a1a1a", fontFamily: "'Georgia', serif", lineHeight: 1.3 }}>
          {product.name}
        </h3>

        {/* Stars */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ color: "#c8a43a", fontSize: "0.8rem" }}>
            {"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}
          </span>
          <span style={{ fontSize: "0.72rem", color: "#7a6e68", fontFamily: "sans-serif" }}>
            ({product.reviews})
          </span>
        </div>

        {/* Price in Naira */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "auto", paddingTop: "8px" }}>
          <span style={{ fontSize: "0.95rem", fontWeight: "700", color: "#1a1a1a", fontFamily: "sans-serif" }}>
            {formatNaira(product.price)}
          </span>
          {product.originalPrice && (
            <span style={{ fontSize: "0.82rem", color: "#aaa", textDecoration: "line-through", fontFamily: "sans-serif" }}>
              {formatNaira(product.originalPrice)}
            </span>
          )}
        </div>

        <button
          onClick={e => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
          style={{
            marginTop: "10px", backgroundColor: "#8b7355", color: "white",
            border: "none", padding: "10px", fontSize: "0.82rem",
            fontWeight: "600", letterSpacing: "0.5px", cursor: "pointer",
            fontFamily: "sans-serif", transition: "background-color 0.2s",
          }}
          onMouseEnter={e => { e.stopPropagation(); e.currentTarget.style.backgroundColor = "#6b5a50"; }}
          onMouseLeave={e => { e.stopPropagation(); e.currentTarget.style.backgroundColor = "#8b7355"; }}
        >
          View Product
        </button>
      </div>
    </div>
  );
}