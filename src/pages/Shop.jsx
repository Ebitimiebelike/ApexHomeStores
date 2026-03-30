import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import products from "../data/products";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ALL_CATEGORIES = ["All", ...new Set(products.map(p => p.category))];

// Real images per category for the banner
const CATEGORY_BANNERS = {
  "All":            { img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80", label: "All Furniture" },
  "Sofas & Chairs": { img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80", label: "Sofas & Chairs" },
  "Dining":         { img: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1400&q=80", label: "Dining" },
  "Living Room":    { img: "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1400&q=80", label: "Living Room" },
  "Beds & Bedroom": { img: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1400&q=80", label: "Beds & Bedroom" },
  "Accessories":    { img: "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=1400&q=80", label: "Accessories" },
};

const SORT_OPTIONS = [
  { value: "default",    label: "Featured" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating",     label: "Highest Rated" },
];

export default function Shop() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  // useSearchParams reads the ?category= part of the URL
  // It works just like useState but synced to the URL
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category") || "All";

  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [sortBy, setSortBy] = useState("default");

  // When the URL changes (e.g. user clicks navbar category),
  // update the active filter to match
  useEffect(() => {
    setActiveCategory(urlCategory);
  }, [urlCategory]);

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    // Update the URL so the back button works correctly
    if (cat === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  // Filter first
  const filtered = activeCategory === "All"
    ? products
    : products.filter(p => p.category === activeCategory);

  // Then sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc")  return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating")     return b.rating - a.rating;
    return 0; // default — keep original order
  });

  const banner = CATEGORY_BANNERS[activeCategory] || CATEGORY_BANNERS["All"];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#eae6e1", position: "relative" }}>
      
      {/* --- FLOATING BASKET ICON --- */}
      <button 
        onClick={() => navigate("/cart")}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#1a1a1a",
          color: "white",
          border: "none",
          cursor: "pointer",
          zIndex: 1000,
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        
        {/* The Badge */}
        {totalItems > 0 && (
          <div style={{
            position: "absolute",
            top: "0",
            right: "0",
            backgroundColor: "#8b0000",
            color: "white",
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            fontSize: "0.75rem",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid white"
          }}>
            {totalItems}
          </div>
        )}
      </button>

      {/* ── CATEGORY BANNER IMAGE ── */}

      {/* ── CATEGORY BANNER IMAGE ── */}
      <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
        <img src={banner.img} alt={banner.label}
          style={{ width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
            display: "block", filter: "brightness(0.55)" }}
        />
        <div style={{ position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center" }}>
          <p style={{ margin: "0 0 6px", fontSize: "0.72rem",
            color: "#f5d98b", letterSpacing: "3px",
            textTransform: "uppercase", fontFamily: "sans-serif" }}>
            Apex Home Furnishings
          </p>
          <h1 style={{ margin: 0, fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            fontWeight: "900", color: "white", letterSpacing: "-0.5px" }}>
            {banner.label}
          </h1>
        </div>
      </div>

      {/* ── FILTER + SORT BAR ── */}
      <div style={{ backgroundColor: "white",
        borderBottom: "1px solid #e8e4df", padding: "0 6%",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: "0" }}>

        {/* Category filter tabs */}
        <div style={{ display: "flex", overflowX: "auto" }}>
          {ALL_CATEGORIES.map(cat => (
            <button key={cat}
              onClick={() => handleCategoryClick(cat)}
              style={{
                background: "none", border: "none",
                borderBottom: activeCategory === cat
                  ? "3px solid #8b7355" : "3px solid transparent",
                padding: "14px 18px", fontSize: "0.85rem",
                fontWeight: activeCategory === cat ? "700" : "400",
                color: activeCategory === cat ? "#8b7355" : "#5a5550",
                cursor: "pointer", transition: "all 0.15s",
                fontFamily: "sans-serif", whiteSpace: "nowrap",
                marginBottom: "-1px",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div style={{ display: "flex", alignItems: "center",
          gap: "10px", padding: "12px 0" }}>
          <span style={{ fontSize: "0.82rem", color: "#7a6e68",
            fontFamily: "sans-serif", whiteSpace: "nowrap" }}>
            Sort by:
          </span>
          <select value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ padding: "8px 12px", border: "1.5px solid #c8c2bb",
              backgroundColor: "white", fontSize: "0.85rem",
              fontFamily: "sans-serif", color: "#1a1a1a",
              cursor: "pointer", outline: "none" }}>
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── PRODUCT COUNT ── */}
      <div style={{ padding: "20px 6% 0",
        fontSize: "0.85rem", color: "#7a6e68", fontFamily: "sans-serif" }}>
        Showing <strong style={{ color: "#1a1a1a" }}>{sorted.length}</strong> products
        {activeCategory !== "All" && (
          <span> in <strong style={{ color: "#1a1a1a" }}>{activeCategory}</strong>
            <button onClick={() => handleCategoryClick("All")}
              style={{ marginLeft: "10px", background: "none", border: "none",
                color: "#8b7355", cursor: "pointer", fontSize: "0.82rem",
                fontFamily: "sans-serif", textDecoration: "underline" }}>
              Clear filter
            </button>
          </span>
        )}
      </div>

      {/* ── PRODUCT GRID ── */}
      {sorted.length > 0 ? (
        <div style={{ padding: "24px 6% 60px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "12px" }}>
          {sorted.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        // Empty state
        <div style={{ padding: "80px 6%", textAlign: "center" }}>
          <p style={{ fontSize: "2rem", marginBottom: "12px" }}>🛋️</p>
          <h2 style={{ margin: "0 0 8px", color: "#1a1a1a", fontSize: "1.2rem" }}>
            No products found
          </h2>
          <p style={{ margin: "0 0 24px", color: "#7a6e68",
            fontFamily: "sans-serif" }}>
            Try a different category.
          </p>
          <button onClick={() => handleCategoryClick("All")}
            style={{ padding: "12px 32px", backgroundColor: "#8b7355",
              color: "white", border: "none", cursor: "pointer",
              fontFamily: "sans-serif", fontWeight: "600" }}>
            View All Products
          </button>
        </div>
      )}
    </div>
  );
}