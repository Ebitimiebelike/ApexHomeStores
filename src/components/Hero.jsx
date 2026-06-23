import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

// ── Mega-menu data ────────────────────────────────────────────────
const SofaIcon = () => (
  <svg width="24" height="18" viewBox="0 0 60 40" fill="none">
    <rect x="4" y="18" width="52" height="14" rx="3" fill="#8b7355"/>
    <rect x="2" y="12" width="10" height="20" rx="3" fill="#a08060"/>
    <rect x="48" y="12" width="10" height="20" rx="3" fill="#a08060"/>
    <rect x="12" y="8" width="36" height="14" rx="3" fill="#a08060"/>
    <rect x="14" y="32" width="5" height="6" rx="1" fill="#7a6040"/>
    <rect x="41" y="32" width="5" height="6" rx="1" fill="#7a6040"/>
  </svg>
);
const ArmchairIcon = () => (
  <svg width="24" height="18" viewBox="0 0 60 40" fill="none">
    <rect x="12" y="18" width="36" height="14" rx="3" fill="#4a7c6f"/>
    <rect x="4" y="12" width="10" height="20" rx="3" fill="#5a9080"/>
    <rect x="46" y="12" width="10" height="20" rx="3" fill="#5a9080"/>
    <rect x="14" y="8" width="32" height="14" rx="3" fill="#5a9080"/>
    <rect x="16" y="32" width="5" height="6" rx="1" fill="#3a6050"/>
    <rect x="39" y="32" width="5" height="6" rx="1" fill="#3a6050"/>
  </svg>
);
const BedIcon = () => (
  <svg width="24" height="18" viewBox="0 0 60 40" fill="none">
    <rect x="4" y="20" width="52" height="12" rx="2" fill="#c8a882"/>
    <rect x="4" y="14" width="8" height="16" rx="2" fill="#b89060"/>
    <rect x="12" y="16" width="36" height="12" rx="2" fill="#e8d8c0"/>
    <ellipse cx="20" cy="20" rx="5" ry="4" fill="#d4b896"/>
    <ellipse cx="40" cy="20" rx="5" ry="4" fill="#d4b896"/>
  </svg>
);
const DiningIcon = () => (
  <svg width="24" height="18" viewBox="0 0 60 40" fill="none">
    <rect x="10" y="14" width="40" height="6" rx="2" fill="#8b7355"/>
    <rect x="14" y="20" width="4" height="14" rx="1" fill="#7a6040"/>
    <rect x="42" y="20" width="4" height="14" rx="1" fill="#7a6040"/>
    <rect x="6" y="22" width="6" height="12" rx="2" fill="#a08060"/>
    <rect x="48" y="22" width="6" height="12" rx="2" fill="#a08060"/>
  </svg>
);
const CabinetIcon = () => (
  <svg width="24" height="18" viewBox="0 0 60 40" fill="none">
    <rect x="6" y="6" width="48" height="30" rx="2" fill="#c8a882"/>
    <rect x="6" y="6" width="48" height="4" rx="1" fill="#b89060"/>
    <line x1="30" y1="10" x2="30" y2="36" stroke="#b89060" strokeWidth="2"/>
    <circle cx="24" cy="23" r="2" fill="#8b7355"/>
    <circle cx="36" cy="23" r="2" fill="#8b7355"/>
  </svg>
);
const FootstoolIcon = () => (
  <svg width="24" height="18" viewBox="0 0 60 40" fill="none">
    <rect x="8" y="14" width="44" height="16" rx="4" fill="#c08060"/>
    <rect x="12" y="30" width="5" height="8" rx="1" fill="#a07050"/>
    <rect x="43" y="30" width="5" height="8" rx="1" fill="#a07050"/>
  </svg>
);

const CATEGORIES = [
  { label: "Sofas & Chairs", icon: <SofaIcon />,    path: "/shop?category=Sofas%20%26%20Chairs" },
  { label: "Dining",         icon: <DiningIcon />,    path: "/shop?category=Dining" },
  { label: "Living Room",    icon: <ArmchairIcon />,  path: "/shop?category=Living%20Room" },
  { label: "Beds & Bedroom", icon: <BedIcon />,       path: "/shop?category=Beds%20%26%20Bedroom" },
  { label: "Accessories",    icon: <FootstoolIcon />, path: "/shop?category=Accessories" },
  { label: "About Us",       icon: <CabinetIcon />,   path: "/about" },
  { label: "Contact",        icon: <CabinetIcon />,   path: "/contact" },
];

function Logo({ size = "normal", onClick }) {
  const big = size === "normal";
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", flexShrink: 0 }}>
      <div style={{
        width: big ? "40px" : "32px",
        height: big ? "40px" : "32px",
        backgroundColor: "#8b7355",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, transition: "all 0.2s ease",
        borderRadius: "4px"
      }}>
        <svg width={big ? "20" : "16"} height={big ? "20" : "16"} viewBox="0 0 24 24" fill="none"
          stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{
          fontWeight: "800",
          fontSize: big ? "1.1rem" : "0.95rem",
          color: "#1a1a1a",
          lineHeight: 1,
          fontFamily: "'Georgia', serif",
          transition: "font-size 0.2s ease",
        }}>
          Apex Home
        </div>
        <div style={{
          fontWeight: "400",
          fontSize: big ? "0.55rem" : "0.48rem",
          color: "#8b7355",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          fontFamily: "'Georgia', serif",
          marginTop: "2px"
        }}>
          Furnishings
        </div>
      </div>
    </div>
  );
}

function MobileDrawer({ onClose, onNavigate }) {
  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)", zIndex: 998,
      }} />
      <div style={{
        position: "fixed", top: 0, left: 0,
        width: "280px", height: "100%",
        backgroundColor: "white", zIndex: 999,
        overflowY: "auto",
        boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
        animation: "slideInLeft 0.2s ease-out",
      }}>
        <style>{`@keyframes slideInLeft { from { transform:translateX(-100%); } to { transform:translateX(0); } }`}</style>

        <div style={{
          backgroundColor: "#8b7355", padding: "16px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <Logo size="small" onClick={() => { onNavigate("/"); onClose(); }} />
          <button onClick={onClose} style={{ background: "none", border: "none", color: "white", fontSize: "1.6rem", cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: "10px 0" }}>
          <p style={{ margin: "10px 16px", fontSize: "0.7rem", color: "#a0958d", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>
            Categories
          </p>
          {CATEGORIES.map(cat => (
            <div key={cat.label}
              onClick={() => { onNavigate(cat.path); onClose(); }}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 16px", cursor: "pointer",
                borderBottom: "1px solid #f8f5f2",
              }}
            >
              <div style={{ flexShrink: 0, opacity: 0.8 }}>{cat.icon}</div>
              <span style={{ fontSize: "0.88rem", fontWeight: "500", fontFamily: "sans-serif", color: "#222" }}>
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function Hero() {
  const navigate        = useNavigate();
  const { totalItems }  = useCart();
  const { user }        = useAuth();
  const isLoggedIn = !!user;

  const [searchVal, setSearchVal] = useState("");
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile]   = useState(window.innerWidth < 900);
  const [hoveredCat, setHoveredCat] = useState(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 45);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal("");
    }
  };

  return (
    <>
      {mobileOpen && (
        <MobileDrawer onClose={() => setMobileOpen(false)} onNavigate={navigate} />
      )}

      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        backgroundColor: "white",
        boxShadow: scrolled ? "0 4px 12px rgba(0,0,0,0.08)" : "0 1px 0px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.2s ease",
      }}>

        {/* ── MAIN NAV BODY ── */}
        <div style={{
          padding: isMobile ? "10px 3%" : "14px 4%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: isMobile ? "8px" : "24px",
          maxWidth: "1400px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            {isMobile && (
              <button
                onClick={() => setMobileOpen(true)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "6px 4px 4px 0", flexShrink: 0 }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="3" y1="6"  x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
            )}

            <Logo 
              size={scrolled && !isMobile ? "small" : "normal"} 
              onClick={() => navigate("/")} 
            />
          </div>

          <form onSubmit={handleSearch} style={{ 
            flex: 1, 
            display: "flex", 
            maxWidth: isMobile ? "100%" : "650px",
            margin: "0 4px"
          }}>
            <div style={{ position: "relative", flex: 1 }}>
              <svg style={{
                position: "absolute", left: "12px", top: "50%",
                transform: "translateY(-50%)", pointerEvents: "none",
              }}
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="#757575" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search products, brands and categories"
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "10px 12px 10px 38px",
                  border: "1.5px solid #8b7355",
                  borderRight: "none",
                  borderRadius: "4px 0 0 4px",
                  fontSize: "0.85rem",
                  fontFamily: "sans-serif",
                  color: "#1a1a1a",
                  outline: "none",
                }}
              />
            </div>
            <button type="submit" style={{
              padding: isMobile ? "0 14px" : "0 24px",
              backgroundColor: "#8b7355",
              color: "white",
              border: "none",
              borderRadius: "0 4px 4px 0",
              fontSize: "0.85rem",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "sans-serif",
            }}>
              {isMobile ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              ) : "SEARCH"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "12px" : "20px", flexShrink: 0 }}>
            
            <div
              onClick={() => isLoggedIn ? navigate("/account") : navigate("/login")}
              style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              {!isMobile && (
                <span style={{ fontSize: "0.82rem", fontWeight: "600", fontFamily: "sans-serif", color: "#333" }}>
                  {isLoggedIn ? user.name.split(" ")[0] : "Account"}
                </span>
              )}
            </div>

            <div
              onClick={() => navigate("/cart")}
              style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
            >
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                {totalItems > 0 && (
                  <div style={{
                    position: "absolute", top: "-6px", right: "-8px",
                    backgroundColor: "#8b7355", color: "white",
                    borderRadius: "50%", width: "16px", height: "16px",
                    fontSize: "0.62rem", fontWeight: "700",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {totalItems}
                  </div>
                )}
              </div>
              {!isMobile && (
                <span style={{ fontSize: "0.82rem", fontWeight: "600", fontFamily: "sans-serif", color: "#333" }}>
                  Cart
                </span>
              )}
            </div>
            
          </div>
        </div>

        {/* ── SUB-HEADER CATEGORY BAR ── */}
        <div style={{
          backgroundColor: "white",
          borderTop: "1px solid #f3ede6",
          overflow: "hidden",
          maxHeight: scrolled ? "0px" : "44px",
          opacity: scrolled ? 0 : 1,
          transition: "max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s linear",
          display: isMobile ? "none" : "block",
        }}>
          <div style={{
            padding: "0 4%",
            display: "flex",
            alignItems: "center",
            height: "44px",
            maxWidth: "1400px",
            margin: "0 auto",
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.label}
                onClick={() => navigate(cat.path)}
                onMouseEnter={() => setHoveredCat(cat.label)}
                onMouseLeave={() => setHoveredCat(null)}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: hoveredCat === cat.label ? "3px solid #8b7355" : "3px solid transparent",
                  padding: "0 14px",
                  height: "100%",
                  fontSize: "0.82rem",
                  fontWeight: "600",
                  color: hoveredCat === cat.label ? "#8b7355" : "#4a4a4a",
                  cursor: "pointer",
                  transition: "color 0.15s, border-color 0.15s",
                  fontFamily: "sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}