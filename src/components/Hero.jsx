import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

const BG = "#eae6e1";

// ── Responsive breakpoint ─────────────────────────────────────────
// Below this width: show hamburger, hide category bar
const MOBILE_BREAKPOINT = 768;

// ── Furniture category SVG icons ─────────────────────────────────
const SofaIcon = () => (
  <svg width="36" height="28" viewBox="0 0 60 40" fill="none">
    <rect x="4" y="18" width="52" height="14" rx="3" fill="#8b7355"/>
    <rect x="2" y="12" width="10" height="20" rx="3" fill="#a08060"/>
    <rect x="48" y="12" width="10" height="20" rx="3" fill="#a08060"/>
    <rect x="12" y="8" width="36" height="14" rx="3" fill="#a08060"/>
    <rect x="14" y="32" width="5" height="6" rx="1" fill="#7a6040"/>
    <rect x="41" y="32" width="5" height="6" rx="1" fill="#7a6040"/>
  </svg>
);
const ArmchairIcon = () => (
  <svg width="36" height="28" viewBox="0 0 60 40" fill="none">
    <rect x="12" y="18" width="36" height="14" rx="3" fill="#4a7c6f"/>
    <rect x="4" y="12" width="10" height="20" rx="3" fill="#5a9080"/>
    <rect x="46" y="12" width="10" height="20" rx="3" fill="#5a9080"/>
    <rect x="14" y="8" width="32" height="14" rx="3" fill="#5a9080"/>
    <rect x="16" y="32" width="5" height="6" rx="1" fill="#3a6050"/>
    <rect x="39" y="32" width="5" height="6" rx="1" fill="#3a6050"/>
  </svg>
);
const BedIcon = () => (
  <svg width="36" height="28" viewBox="0 0 60 40" fill="none">
    <rect x="4" y="20" width="52" height="12" rx="2" fill="#c8a882"/>
    <rect x="4" y="28" width="52" height="6" rx="1" fill="#b89060"/>
    <rect x="4" y="14" width="8" height="16" rx="2" fill="#b89060"/>
    <rect x="12" y="16" width="36" height="12" rx="2" fill="#e8d8c0"/>
    <ellipse cx="20" cy="20" rx="5" ry="4" fill="#d4b896"/>
    <ellipse cx="40" cy="20" rx="5" ry="4" fill="#d4b896"/>
  </svg>
);
const DiningIcon = () => (
  <svg width="36" height="28" viewBox="0 0 60 40" fill="none">
    <rect x="10" y="14" width="40" height="6" rx="2" fill="#8b7355"/>
    <rect x="14" y="20" width="4" height="14" rx="1" fill="#7a6040"/>
    <rect x="42" y="20" width="4" height="14" rx="1" fill="#7a6040"/>
    <rect x="22" y="20" width="16" height="4" rx="1" fill="#a08060"/>
    <rect x="6" y="22" width="6" height="12" rx="2" fill="#a08060"/>
    <rect x="48" y="22" width="6" height="12" rx="2" fill="#a08060"/>
  </svg>
);
const CabinetIcon = () => (
  <svg width="36" height="28" viewBox="0 0 60 40" fill="none">
    <rect x="6" y="6" width="48" height="30" rx="2" fill="#c8a882"/>
    <rect x="6" y="6" width="48" height="4" rx="1" fill="#b89060"/>
    <line x1="30" y1="10" x2="30" y2="36" stroke="#b89060" strokeWidth="2"/>
    <circle cx="24" cy="23" r="2" fill="#8b7355"/>
    <circle cx="36" cy="23" r="2" fill="#8b7355"/>
  </svg>
);
const FootstoolIcon = () => (
  <svg width="36" height="28" viewBox="0 0 60 40" fill="none">
    <rect x="8" y="14" width="44" height="16" rx="4" fill="#c08060"/>
    <rect x="12" y="30" width="5" height="8" rx="1" fill="#a07050"/>
    <rect x="43" y="30" width="5" height="8" rx="1" fill="#a07050"/>
  </svg>
);

// ── Mega-menu data ────────────────────────────────────────────────
const MENUS = {
  "Sofas & Chairs": [
    {
      icon: <SofaIcon />, title: "Sofas",
      sections: [
        { label: "Shop by size:", items: ["2 Seater sofas", "3 Seater sofas", "4 Seater sofas", "Corner sofas"] },
        { label: "Shop by type:", items: ["Sofa beds", "Recliner sofas", "Chesterfield sofas"] },
      ],
    },
    {
      icon: <ArmchairIcon />, title: "Armchairs",
      sections: [
        { label: "Shop by material:", items: ["Fabric armchairs", "Leather armchairs"] },
        { label: "Shop by type:", items: ["Recliner armchairs", "Accent chairs", "Reading chairs"] },
      ],
    },
    {
      icon: <FootstoolIcon />, title: "Footstools",
      sections: [
        { label: "Shop by material:", items: ["Leather footstools", "Fabric footstools", "Storage footstools"] },
      ],
    },
  ],
  "Dining": [
    {
      icon: <DiningIcon />, title: "Dining Tables",
      sections: [
        { label: "Shop by size:", items: ["2-4 seat tables", "4-6 seat tables", "6-8 seat tables", "Extendable tables"] },
        { label: "Shop by material:", items: ["Solid wood tables", "Glass tables", "Marble tables"] },
      ],
    },
    {
      icon: <ArmchairIcon />, title: "Dining Chairs",
      sections: [
        { label: "Shop by style:", items: ["Upholstered chairs", "Wooden chairs", "Bench seating"] },
        { label: "Shop by material:", items: ["Fabric chairs", "Leather chairs", "Metal chairs"] },
      ],
    },
    {
      icon: <CabinetIcon />, title: "Sideboards",
      sections: [
        { label: "Shop by size:", items: ["Small sideboards", "Large sideboards", "Corner units"] },
      ],
    },
  ],
  "Living Room": [
    {
      icon: <SofaIcon />, title: "Sofas",
      sections: [{ label: "Featured:", items: ["Corner sofas", "Sofa beds", "Modular sofas"] }],
    },
    {
      icon: <CabinetIcon />, title: "TV Units & Media",
      sections: [
        { label: "Shop by type:", items: ["TV stands", "Media units", "Floating shelves"] },
        { label: "Shop by style:", items: ["Modern", "Rustic", "Minimalist"] },
      ],
    },
    {
      icon: <CabinetIcon />, title: "Coffee Tables",
      sections: [
        { label: "Shop by material:", items: ["Wood coffee tables", "Glass coffee tables", "Marble coffee tables"] },
      ],
    },
  ],
  "Beds & Bedroom": [
    {
      icon: <BedIcon />, title: "Beds",
      sections: [
        { label: "Shop by size:", items: ["Single beds", "Double beds", "King size beds", "Super king beds"] },
        { label: "Shop by type:", items: ["Ottoman beds", "Divan beds", "Wooden beds", "Upholstered beds"] },
      ],
    },
    {
      icon: <CabinetIcon />, title: "Wardrobes",
      sections: [
        { label: "Shop by type:", items: ["Sliding wardrobes", "Fitted wardrobes", "Freestanding wardrobes"] },
      ],
    },
    {
      icon: <CabinetIcon />, title: "Bedroom Storage",
      sections: [
        { label: "Shop by type:", items: ["Bedside tables", "Chest of drawers", "Blanket boxes"] },
      ],
    },
  ],
  "Accessories": [
    {
      icon: <FootstoolIcon />, title: "Soft Furnishings",
      sections: [{ label: "Shop by type:", items: ["Cushions", "Throws & blankets", "Rugs"] }],
    },
    {
      icon: <CabinetIcon />, title: "Lighting",
      sections: [
        { label: "Shop by type:", items: ["Floor lamps", "Table lamps", "Pendant lights", "Wall lights"] },
      ],
    },
    {
      icon: <CabinetIcon />, title: "Mirrors & Artwork",
      sections: [
        { label: "Shop by type:", items: ["Wall mirrors", "Floor mirrors", "Canvas art", "Photo frames"] },
      ],
    },
  ],
};

const PAGE_LINKS = [
  { label: "About Us", path: "/about" },
  { label: "Contact",  path: "/contact" },
];

// ── Trustpilot star ───────────────────────────────────────────────
const TrustStar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#00b67a">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

// ── Mobile slide-in drawer ────────────────────────────────────────
function MobileDrawer({ categories, onClose, onNavigate }) {
  return (
    <>
      {/* Dark backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          zIndex: 998,
        }}
      />
      {/* Drawer panel slides in from right */}
      <div style={{
        position: "fixed", top: 0, right: 0,
        width: "min(320px, 88vw)", height: "100%",
        backgroundColor: "white", zIndex: 999,
        overflowY: "auto", boxShadow: "-4px 0 24px rgba(0,0,0,0.15)",
        animation: "slideIn 0.22s ease",
      }}>
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to   { transform: translateX(0); }
          }
        `}</style>

        {/* Drawer header */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid #e8e4df",
          backgroundColor: "#8b7355",
        }}>
          <span style={{
            fontWeight: "700", fontSize: "0.95rem",
            fontFamily: "sans-serif", color: "white",
          }}>
            Browse Categories
          </span>
          <button onClick={onClose} style={{
            background: "none", border: "none",
            fontSize: "1.5rem", cursor: "pointer",
            color: "white", lineHeight: 1, padding: "0 4px",
          }}>×</button>
        </div>

        {/* Category list */}
        <div style={{ padding: "12px 0" }}>
          {categories.map(cat => (
            <div key={cat}
              onClick={() => { onNavigate(`/shop?category=${encodeURIComponent(cat)}`); onClose(); }}
              style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "14px 20px", cursor: "pointer",
                borderBottom: "1px solid #f4f0eb",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#faf7f4"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <div style={{ flexShrink: 0 }}>{MENUS[cat][0].icon}</div>
              <span style={{
                fontSize: "0.92rem", fontWeight: "600",
                fontFamily: "sans-serif", color: "#1a1a1a",
              }}>
                {cat}
              </span>
              <svg style={{ marginLeft: "auto" }} width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          ))}
        </div>

        {/* Page links */}
        <div style={{
          borderTop: "2px solid #e8e4df",
          padding: "16px 20px",
          display: "flex", flexDirection: "column", gap: "12px",
        }}>
          {PAGE_LINKS.map(({ label, path }) => (
            <span key={label}
              onClick={() => { onNavigate(path); onClose(); }}
              style={{
                fontSize: "0.88rem", color: "#8b7355",
                fontFamily: "sans-serif", cursor: "pointer",
                textDecoration: "underline",
              }}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Main Hero component ───────────────────────────────────────────
export default function Hero() {
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [openMenu,    setOpenMenu]    = useState(null);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [searchVal,   setSearchVal]   = useState("");
  const [scrolled,    setScrolled]    = useState(false);
  const [isMobile,    setIsMobile]    = useState(window.innerWidth < MOBILE_BREAKPOINT);
  const closeTimer = useRef(null);

  const navigate       = useNavigate();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  // Track window width for responsive hiding/showing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu when screen grows back to desktop
  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  const categories = Object.keys(MENUS);

  const handleCatEnter = (cat) => { clearTimeout(closeTimer.current); setOpenMenu(cat); };
  const handleCatLeave = ()    => { closeTimer.current = setTimeout(() => setOpenMenu(null), 120); };
  const handleMenuEnter = ()   => clearTimeout(closeTimer.current);
  const handleMenuLeave = ()   => { closeTimer.current = setTimeout(() => setOpenMenu(null), 120); };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal("");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, fontFamily: "'Georgia', serif" }}>

      {/* Mobile drawer — only renders when open */}
      {mobileOpen && (
        <MobileDrawer
          categories={categories}
          onClose={() => setMobileOpen(false)}
          onNavigate={navigate}
        />
      )}

      {/* ══════════════════════════════════════════════════════════
          STICKY NAVBAR
      ══════════════════════════════════════════════════════════ */}
      <div style={{
        position: "sticky", top: 0, zIndex: 200,
        boxShadow: scrolled ? "0 2px 14px rgba(0,0,0,0.10)" : "none",
        transition: "box-shadow 0.3s",
      }}>

        {/* ── LAYER 1: Trustpilot ─────────────────────────────── */}
        <div style={{
          backgroundColor: "white",
          borderBottom: "1px solid #e8e4df",
          padding: "6px 4%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}>
          <div style={{ display: "flex", gap: "2px" }}>
            {[1,2,3,4,5].map(i => <TrustStar key={i} />)}
          </div>
          <span style={{ fontSize: "0.88rem", fontFamily: "sans-serif", color: "#1a1a1a", fontWeight: "700" }}>
            Trustpilot
          </span>
          <span style={{ fontSize: "0.8rem", color: "#5a5550", fontFamily: "sans-serif" }}>
            4.9 · Based on 50,000+ reviews
          </span>
        </div>

        {/* ── LAYER 2: Red promo banner ────────────────────────── */}
        <div style={{
          backgroundColor: "#8b0000",
          padding: isMobile ? "10px 4%" : "8px 4%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "6px",
          textAlign: "center",
        }}>
          <span style={{
            color: "white", fontWeight: "800",
            fontSize: isMobile ? "0.82rem" : "0.88rem",
            fontFamily: "sans-serif", letterSpacing: "1px",
            textTransform: "uppercase",
          }}>
            🐣 Easter Sale + Early Bird Offers &nbsp;·&nbsp; Use code
          </span>
          <span style={{
            backgroundColor: "white", color: "#8b0000",
            padding: "1px 10px", borderRadius: "3px",
            fontWeight: "900", fontSize: isMobile ? "0.82rem" : "0.88rem",
            fontFamily: "sans-serif", letterSpacing: "1px",
          }}>
            EASTER30
          </span>
          <span style={{
            color: "white", fontWeight: "800",
            fontSize: isMobile ? "0.82rem" : "0.88rem",
            fontFamily: "sans-serif", letterSpacing: "1px",
            textTransform: "uppercase",
          }}>
            at checkout &nbsp;·&nbsp; Ends 21 Apr
          </span>
        </div>

        {/* ── LAYER 3: Main navbar bar ─────────────────────────── */}
        <div style={{
          backgroundColor: "white",
          padding: "10px 4%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          borderBottom: "1px solid #e8e4df",
        }}>

          {/* Logo */}
          <div onClick={() => navigate("/")} style={{
            display: "flex", alignItems: "center", gap: "10px",
            cursor: "pointer", flexShrink: 0,
          }}>
            <div style={{
              width: "44px", height: "44px", backgroundColor: "#8b7355",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: "900", fontSize: "1rem", color: "#1a1a1a", lineHeight: 1.1, fontFamily: "'Georgia', serif" }}>
                Apex Home
              </div>
              <div style={{ fontWeight: "400", fontSize: "0.6rem", color: "#8b7355", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Georgia', serif" }}>
                Furnishings
              </div>
            </div>
          </div>

          {/* Right icons */}
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "16px" : "22px", flexShrink: 0 }}>

            {/* Account */}
            <div
              onClick={() => isLoggedIn ? logout() : navigate("/login")}
              onMouseEnter={() => setHoveredIcon("account")}
              onMouseLeave={() => setHoveredIcon(null)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", cursor: "pointer" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke={isLoggedIn ? "#8b7355" : hoveredIcon === "account" ? "#8b7355" : "#1a1a1a"}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span style={{ fontSize: "0.58rem", fontFamily: "sans-serif", color: isLoggedIn ? "#8b7355" : hoveredIcon === "account" ? "#8b7355" : "#5a5550" }}>
                {isLoggedIn ? user.name.split(" ")[0] : "Account"}
              </span>
            </div>

            {/* Basket */}
            <div
              onClick={() => navigate("/cart")}
              onMouseEnter={() => setHoveredIcon("basket")}
              onMouseLeave={() => setHoveredIcon(null)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", cursor: "pointer" }}
            >
              <div style={{ position: "relative" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke={hoveredIcon === "basket" ? "#8b7355" : "#1a1a1a"}
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                {totalItems > 0 && (
                  <div style={{
                    position: "absolute", top: "-7px", right: "-8px",
                    backgroundColor: "#8b0000", color: "white",
                    borderRadius: "50%", width: "16px", height: "16px",
                    fontSize: "0.6rem", fontWeight: "700",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {totalItems}
                  </div>
                )}
              </div>
              <span style={{ fontSize: "0.58rem", fontFamily: "sans-serif", color: hoveredIcon === "basket" ? "#8b7355" : "#5a5550" }}>
                Basket
              </span>
            </div>

            {/* Hamburger — ONLY visible on mobile */}
            {isMobile && (
              <div
                onClick={() => setMobileOpen(true)}
                onMouseEnter={() => setHoveredIcon("menu")}
                onMouseLeave={() => setHoveredIcon(null)}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", cursor: "pointer" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke={hoveredIcon === "menu" ? "#8b7355" : "#1a1a1a"}
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6"  x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
                <span style={{ fontSize: "0.58rem", fontFamily: "sans-serif", color: hoveredIcon === "menu" ? "#8b7355" : "#5a5550" }}>
                  Menu
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── LAYER 4: Full-width search bar ──────────────────── */}
        <div style={{ backgroundColor: "white", padding: "10px 4%", borderBottom: "1px solid #e8e4df" }}>
          <form onSubmit={handleSearch} style={{ position: "relative" }}>
            <svg style={{
              position: "absolute", left: "16px", top: "50%",
              transform: "translateY(-50%)", pointerEvents: "none",
            }}
              width="17" height="17" viewBox="0 0 24 24" fill="none"
              stroke="#888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Search for a product or brand"
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "12px 16px 12px 46px",
                border: "2px solid #00b67a",
                borderRadius: "6px",
                backgroundColor: "white",
                fontSize: "0.92rem",
                fontFamily: "sans-serif",
                color: "#1a1a1a",
                outline: "none",
              }}
            />
          </form>
        </div>

        {/* ── LAYER 5: Category nav — HIDDEN on mobile ─────────── */}
        {!isMobile && (
          <div style={{ position: "relative" }}>
            <div style={{
              backgroundColor: "white",
              borderBottom: "2px solid #e8e4df",
              padding: "0 4%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              {/* Category buttons */}
              <div style={{ display: "flex" }}>
                {categories.map(cat => (
                  <button key={cat}
                    onMouseEnter={() => handleCatEnter(cat)}
                    onMouseLeave={handleCatLeave}
                    onClick={() => navigate(`/shop?category=${encodeURIComponent(cat)}`)}
                    style={{
                      background: "none", border: "none",
                      borderBottom: openMenu === cat ? "3px solid #8b7355" : "3px solid transparent",
                      padding: "12px 16px", fontSize: "0.87rem",
                      fontWeight: openMenu === cat ? "700" : "500",
                      color: openMenu === cat ? "#8b7355" : "#1a1a1a",
                      cursor: "pointer", transition: "all 0.15s",
                      fontFamily: "sans-serif", marginBottom: "-2px", whiteSpace: "nowrap",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* About / Contact */}
              <div style={{ display: "flex" }}>
                {PAGE_LINKS.map(({ label, path }) => (
                  <button key={label}
                    onClick={() => navigate(path)}
                    onMouseEnter={() => setHoveredIcon(label)}
                    onMouseLeave={() => setHoveredIcon(null)}
                    style={{
                      background: "none", border: "none",
                      borderBottom: "3px solid transparent",
                      padding: "12px 16px", fontSize: "0.87rem",
                      fontWeight: "500",
                      color: hoveredIcon === label ? "#8b7355" : "#5a5550",
                      cursor: "pointer", transition: "color 0.15s",
                      fontFamily: "sans-serif", marginBottom: "-2px", whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mega menu dropdown */}
            {openMenu && MENUS[openMenu] && (
              <div
                onMouseEnter={handleMenuEnter}
                onMouseLeave={handleMenuLeave}
                style={{
                  position: "absolute", top: "100%", left: 0, right: 0,
                  backgroundColor: "white",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
                  padding: "28px 4%",
                  display: "grid",
                  gridTemplateColumns: `repeat(${MENUS[openMenu].length}, 1fr)`,
                  borderTop: "3px solid #8b7355",
                  zIndex: 300,
                  animation: "fadeDown 0.15s ease",
                }}
              >
                <style>{`
                  @keyframes fadeDown {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
                {MENUS[openMenu].map((col, i) => (
                  <div key={col.title} style={{
                    padding: "0 28px 0 0",
                    borderRight: i < MENUS[openMenu].length - 1 ? "1px solid #e8e4df" : "none",
                    marginRight: i < MENUS[openMenu].length - 1 ? "28px" : "0",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #e8e4df" }}>
                      <div style={{ flexShrink: 0 }}>{col.icon}</div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                        <span style={{ fontWeight: "700", fontSize: "0.95rem", color: "#1a1a1a", fontFamily: "sans-serif" }}>
                          {col.title}
                        </span>
                        <span
                          onClick={() => { navigate(`/shop?category=${encodeURIComponent(openMenu)}`); setOpenMenu(null); }}
                          style={{ fontSize: "0.78rem", color: "#8b7355", textDecoration: "underline", fontFamily: "sans-serif", whiteSpace: "nowrap", marginLeft: "12px", cursor: "pointer" }}>
                          View all
                        </span>
                      </div>
                    </div>
                    {col.sections.map(sec => (
                      <div key={sec.label} style={{ marginBottom: "14px" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: "700", color: "#1a1a1a", fontFamily: "sans-serif", marginBottom: "6px" }}>
                          {sec.label}
                        </div>
                        {sec.items.map(item => (
                          <span key={item}
                            onClick={() => { navigate(`/shop?category=${encodeURIComponent(openMenu)}`); setOpenMenu(null); }}
                            style={{ display: "block", fontSize: "0.83rem", color: "#4a4540", fontFamily: "sans-serif", padding: "3px 0", lineHeight: 1.5, transition: "color 0.15s", cursor: "pointer" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#8b7355"}
                            onMouseLeave={e => e.currentTarget.style.color = "#4a4540"}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════════ */}
      <div style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "stretch",
        minHeight: isMobile ? "auto" : "calc(100vh - 220px)",
        padding: isMobile ? "32px 6% 40px" : "0 0 0 6%",
        gap: isMobile ? "28px" : "0",
      }}>

        {/* Text content */}
        <div style={{
          flex: isMobile ? "unset" : "0 0 440px",
          display: "flex", flexDirection: "column",
          justifyContent: "center",
          paddingRight: isMobile ? "0" : "40px",
          paddingBottom: isMobile ? "0" : "60px",
          zIndex: 2,
          order: isMobile ? 1 : 0,
        }}>
          <span style={{ fontSize: "0.78rem", color: "#7a6e68", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "14px", fontFamily: "sans-serif" }}>
            Free shipping on orders over $199
          </span>

          <h1 style={{
            fontSize: isMobile ? "clamp(2rem, 8vw, 2.6rem)" : "clamp(2.2rem, 4vw, 2.6rem)",
            fontWeight: "700", color: "#1a1a1a",
            margin: "0 0 20px 0", lineHeight: 1.15,
            letterSpacing: "-1px", fontFamily: "'Georgia', serif",
          }}>
            Find the Perfect<br/>
            <span style={{ color: "#8b7355" }}>Piece</span> for Every<br/>
            Room in Your Home.
          </h1>

          <p style={{ color: "#5a5550", lineHeight: "1.75", fontSize: "0.9rem", marginBottom: "28px", maxWidth: "340px", fontFamily: "sans-serif" }}>
            Shop premium handcrafted furniture delivered straight to your door.
            Thousands of styles in stock — from sofas to dining sets.
            Easy returns. Secure checkout. Trusted by 50,000+ homes.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onMouseEnter={() => setHoveredIcon("btn")}
              onMouseLeave={() => setHoveredIcon(null)}
              onClick={() => navigate("/shop")}
              style={{ backgroundColor: hoveredIcon === "btn" ? "#6b5a50" : "#8b7355", color: "white", border: "none", padding: "13px 32px", fontSize: "0.85rem", fontWeight: "600", letterSpacing: "1px", cursor: "pointer", transition: "background-color 0.25s", fontFamily: "sans-serif" }}>
              Shop Now
            </button>
            <button
              onMouseEnter={() => setHoveredIcon("btn2")}
              onMouseLeave={() => setHoveredIcon(null)}
              onClick={() => navigate("/shop")}
              style={{ backgroundColor: "transparent", color: hoveredIcon === "btn2" ? "#8b7355" : "#1a1a1a", border: "2px solid #1a1a1a", padding: "11px 24px", fontSize: "0.85rem", fontWeight: "600", letterSpacing: "1px", cursor: "pointer", transition: "all 0.25s", fontFamily: "sans-serif" }}>
              View Catalogue
            </button>
          </div>

          <div style={{ display: "flex", gap: "18px", marginTop: "20px", flexWrap: "wrap" }}>
            {["⭐ 4.9 Rated", "🚚 Free Returns", "🔒 Secure Pay"].map(b => (
              <span key={b} style={{ fontSize: "0.75rem", color: "#7a6e68", fontFamily: "sans-serif" }}>{b}</span>
            ))}
          </div>
        </div>

        {/* Sofa image
            Desktop: fills the right half, blends at edges
            Mobile: full-width below the text, no blend effect
        */}
        {isMobile ? (
          <div style={{ width: "100%", order: 0 }}>
            <img
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80"
              alt="Green velvet sofa"
              style={{
                width: "100%", height: "220px",
                objectFit: "cover", objectPosition: "center",
                display: "block", borderRadius: "4px",
              }}
            />
          </div>
        ) : (
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <img
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80"
              alt="Green velvet sofa"
              style={{
                width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center",
                display: "block",
                // Blend left edge into background — right/top/bottom stay sharp
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 15%, black 30%)",
                maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 15%, black 30%)",
              }}
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}