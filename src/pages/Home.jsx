import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import products from "../data/products";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

const BG = "#eae6e1";

// ── Category quick-filter data ────────────────────────────────────
const CATEGORIES = [
  { label: "All",            emoji: "🛋️" },
  { label: "Sofas & Chairs", emoji: "🪑" },
  { label: "Dining",         emoji: "🍽️" },
  { label: "Living Room",    emoji: "🏠" },
  { label: "Beds & Bedroom", emoji: "🛏️" },
  { label: "Accessories",    emoji: "🪴" },
];

// ── Featured banner slides ────────────────────────────────────────
const BANNERS = [
  {
    tag:      "Easter Sale",
    headline: "Up to 30% off\nSelected Furniture",
    sub:      "Use code EASTER30 at checkout · Ends 21 Apr",
    cta:      "Shop the Sale",
    filter:   "All",
    bg:       "#2d1a0e",
    accent:   "#f5d98b",
  },
  {
    tag:      "New In",
    headline: "Sofas Built\nto Last",
    sub:      "Handcrafted velvet and fabric sofas — delivered to your door",
    cta:      "Shop Sofas",
    filter:   "Sofas & Chairs",
    bg:       "#1a2d1a",
    accent:   "#a8d5a2",
  },
  {
    tag:      "Bedroom",
    headline: "Sleep Better\nEvery Night",
    sub:      "Beds, wardrobes and bedroom storage — all in one place",
    cta:      "Shop Bedroom",
    filter:   "Beds & Bedroom",
    bg:       "#1a1a2d",
    accent:   "#a2b8d5",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBanner,   setActiveBanner]   = useState(0);
  const [hoveredCat,     setHoveredCat]     = useState(null);
  const [isMobile,       setIsMobile]       = useState(window.innerWidth < 768);

  // Auto-rotate banner every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner(b => (b + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filtered products
  const filtered = activeCategory === "All"
    ? products
    : products.filter(p => p.category === activeCategory);

  // Featured = first 4 products with a badge
  const featured = products.filter(p => p.badge).slice(0, 4);

  const banner = BANNERS[activeBanner];

  return (
    <div style={{ backgroundColor: BG, minHeight: "100vh", fontFamily: "'Georgia', serif" }}>

      {/* ══════════════════════════════════════════════════════════
          HERO BANNER — compact, auto-rotating
      ══════════════════════════════════════════════════════════ */}
      <div style={{
        backgroundColor: banner.bg,
        padding: isMobile ? "40px 6%" : "52px 8%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
        transition: "background-color 0.6s ease",
        flexWrap: "wrap",
        minHeight: isMobile ? "auto" : "220px",
      }}>

        {/* Left — text */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <span style={{
            display: "inline-block",
            backgroundColor: banner.accent,
            color: banner.bg,
            fontSize: "0.72rem", fontWeight: "800",
            letterSpacing: "2px", textTransform: "uppercase",
            padding: "3px 10px", borderRadius: "2px",
            marginBottom: "14px", fontFamily: "sans-serif",
          }}>
            {banner.tag}
          </span>

          <h1 style={{
            margin: "0 0 10px",
            fontSize: isMobile ? "clamp(1.6rem, 6vw, 2rem)" : "clamp(1.8rem, 3vw, 2.6rem)",
            fontWeight: "900",
            color: "white",
            lineHeight: 1.15,
            whiteSpace: "pre-line",
            letterSpacing: "-0.5px",
          }}>
            {banner.headline}
          </h1>

          <p style={{
            margin: "0 0 20px",
            color: "rgba(255,255,255,0.65)",
            fontSize: "0.85rem",
            fontFamily: "sans-serif",
            lineHeight: 1.6,
          }}>
            {banner.sub}
          </p>

          <button
            onClick={() => {
              setActiveCategory(banner.filter);
              // Smooth scroll to products
              document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              padding: "11px 28px",
              backgroundColor: banner.accent,
              color: banner.bg,
              border: "none",
              fontSize: "0.85rem",
              fontWeight: "700",
              letterSpacing: "1px",
              cursor: "pointer",
              fontFamily: "sans-serif",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            {banner.cta} →
          </button>
        </div>

        {/* Right — banner dots + slide indicator */}
        {!isMobile && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              {BANNERS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveBanner(i)}
                  style={{
                    width: i === activeBanner ? "24px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: i === activeBanner ? banner.accent : "rgba(255,255,255,0.3)",
                    transition: "all 0.3s",
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════
          FEATURED HIGHLIGHTS — 4 cards in a horizontal scroll row
      ══════════════════════════════════════════════════════════ */}
      <div style={{ padding: "28px 6% 0" }}>
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", marginBottom: "16px",
        }}>
          <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "900", color: "#1a1a1a" }}>
            Featured Deals
          </h2>
          <span
            onClick={() => { setActiveCategory("All"); document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" }); }}
            style={{ fontSize: "0.82rem", color: "#8b7355", cursor: "pointer", fontFamily: "sans-serif", textDecoration: "underline" }}
          >
            View all
          </span>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gap: "14px",
        }}>
          {featured.map(product => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              style={{
                backgroundColor: "white",
                border: "1px solid #e8e4df",
                cursor: "pointer",
                overflow: "hidden",
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.09)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ position: "relative" }}>
                <img src={product.image} alt={product.name}
                  style={{ width: "100%", height: isMobile ? "130px" : "160px", objectFit: "cover", display: "block" }} />
                {product.badge && (
                  <span style={{
                    position: "absolute", top: "8px", left: "8px",
                    backgroundColor: product.badge === "Sale" ? "#8b0000" : "#8b7355",
                    color: "white", fontSize: "0.65rem", fontWeight: "700",
                    padding: "2px 8px", letterSpacing: "0.5px",
                  }}>
                    {product.badge}
                  </span>
                )}
              </div>
              <div style={{ padding: "12px" }}>
                <p style={{ margin: "0 0 4px", fontSize: "0.82rem", fontWeight: "700", color: "#1a1a1a", fontFamily: "'Georgia', serif", lineHeight: 1.3 }}>
                  {product.name}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#8b7355", fontFamily: "sans-serif" }}>
                    ₦{(product.price * 1600).toLocaleString("en-NG")}
                  </span>
                  {product.originalPrice && (
                    <span style={{ fontSize: "0.75rem", color: "#aaa", textDecoration: "line-through", fontFamily: "sans-serif" }}>
                      ₦{(product.originalPrice * 1600).toLocaleString("en-NG")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          CATEGORY QUICK FILTERS
      ══════════════════════════════════════════════════════════ */}
      <div id="products-section" style={{ padding: "32px 6% 0" }}>
        <h2 style={{ margin: "0 0 16px", fontSize: "1.1rem", fontWeight: "900", color: "#1a1a1a" }}>
          Shop by Category
        </h2>
        <div style={{
          display: "flex", gap: "10px",
          overflowX: "auto", paddingBottom: "4px",
          scrollbarWidth: "none",
        }}>
          {CATEGORIES.map(({ label, emoji }) => (
            <button
              key={label}
              onClick={() => setActiveCategory(label)}
              onMouseEnter={() => setHoveredCat(label)}
              onMouseLeave={() => setHoveredCat(null)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "8px 16px",
                backgroundColor: activeCategory === label ? "#8b7355" : hoveredCat === label ? "#f4f0eb" : "white",
                color: activeCategory === label ? "white" : "#1a1a1a",
                border: `1.5px solid ${activeCategory === label ? "#8b7355" : "#e8e4df"}`,
                borderRadius: "24px",
                fontSize: "0.82rem",
                fontWeight: activeCategory === label ? "700" : "500",
                cursor: "pointer",
                fontFamily: "sans-serif",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.15s",
              }}
            >
              <span>{emoji}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          PRODUCT GRID — loads immediately, filters on category click
      ══════════════════════════════════════════════════════════ */}
      <div style={{ padding: "20px 6% 60px" }}>

        {/* Product count */}
        <p style={{ margin: "0 0 16px", fontSize: "0.82rem", color: "#7a6e68", fontFamily: "sans-serif" }}>
          Showing <strong style={{ color: "#1a1a1a" }}>{filtered.length}</strong> products
          {activeCategory !== "All" && (
            <> in <strong style={{ color: "#1a1a1a" }}>{activeCategory}</strong>
              <span
                onClick={() => setActiveCategory("All")}
                style={{ marginLeft: "8px", color: "#8b7355", cursor: "pointer", textDecoration: "underline" }}>
                Clear
              </span>
            </>
          )}
        </p>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "repeat(2, 1fr)"
            : "repeat(auto-fill, minmax(220px, 1fr))",
          gap: isMobile ? "12px" : "20px",
        }}>
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          TRUST STRIP
      ══════════════════════════════════════════════════════════ */}
      <div style={{
        backgroundColor: "#2d1a0e",
        padding: "28px 6%",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
        gap: "20px",
        textAlign: "center",
      }}>
        {[
          { icon: "🚚", title: "Free Delivery",   sub: "On orders over ₦199,000" },
          { icon: "↩️", title: "Free Returns",     sub: "30-day hassle-free returns" },
          { icon: "🔒", title: "Secure Checkout",  sub: "Protected by Paystack" },
          { icon: "⭐", title: "4.9 Star Rated",   sub: "50,000+ happy customers" },
        ].map(item => (
          <div key={item.title}>
            <div style={{ fontSize: "1.6rem", marginBottom: "6px" }}>{item.icon}</div>
            <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "white", fontFamily: "sans-serif", marginBottom: "3px" }}>
              {item.title}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#9a9088", fontFamily: "sans-serif" }}>
              {item.sub}
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}