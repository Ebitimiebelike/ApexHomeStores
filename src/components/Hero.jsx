import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const BG = "#eae6e1";

// ── Sofa icon SVGs per subcategory ──────────────────────────────
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

// ── Mega-menu data ───────────────────────────────────────────────
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
      sections: [
        { label: "Featured:", items: ["Corner sofas", "Sofa beds", "Modular sofas"] },
      ],
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
      sections: [
        { label: "Shop by type:", items: ["Cushions", "Throws & blankets", "Rugs"] },
      ],
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

// ── These are the simple page links (not category dropdowns) ─────
// Each has a label shown in the nav and a path to navigate to
const PAGE_LINKS = [
  { label: "About Us", path: "/about" },
  { label: "Contact",  path: "/contact" },
];

// ── Icon button ──────────────────────────────────────────────────
const IconBtn = ({ children, label, badge, hovered, id, setHovered }) => (
  <button
    onMouseEnter={() => setHovered(id)}
    onMouseLeave={() => setHovered(null)}
    style={{
      background: "none", border: "none", cursor: "pointer",
      display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
      color: hovered === id ? "#8b7355" : "#1a1a1a",
      transition: "color 0.2s", padding: "0", position: "relative",
    }}
  >
    <div style={{ position: "relative" }}>
      {children}
      {badge !== undefined && (
        <div style={{
          position: "absolute", top: "-6px", right: "-8px",
          backgroundColor: "#8b0000", color: "white",
          borderRadius: "50%", width: "16px", height: "16px",
          fontSize: "0.6rem", fontWeight: "700",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{badge}</div>
      )}
    </div>
    <span style={{ fontSize: "0.6rem", letterSpacing: "0.3px", fontFamily: "sans-serif", whiteSpace: "nowrap" }}>
      {label}
    </span>
  </button>
);

// ── Main component ───────────────────────────────────────────────
export default function Hero() {
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [openMenu, setOpenMenu]       = useState(null);
  const [searchVal, setSearchVal]     = useState("");
  const [scrolled, setScrolled]       = useState(false);
  const closeTimer                    = useRef(null);

  // Zone 2 — router + context hooks
  const navigate        = useNavigate();
  const { totalItems }  = useCart();
  const { user, logout } = useAuth();

  // Derived: is anyone logged in?
  // If user is not null, someone is logged in
  const isLoggedIn = !!user; // !! converts any value to true/false

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    // Cleanup: remove listener when component unmounts
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // All category names from the MENUS object
  const categories = Object.keys(MENUS);

  // Mega menu hover handlers
  const handleCatEnter = (cat) => {
    clearTimeout(closeTimer.current);
    setOpenMenu(cat);
  };
  const handleCatLeave = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };
  const handleMenuEnter = () => clearTimeout(closeTimer.current);
  const handleMenuLeave = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  // Search submit — navigate to shop with search query
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal("");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: BG,
      fontFamily: "'Georgia', serif", display: "flex", flexDirection: "column",
    }}>

      {/* ── STICKY NAVBAR ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 200,
        boxShadow: scrolled ? "0 2px 14px rgba(0,0,0,0.10)" : "none",
        transition: "box-shadow 0.3s",
        backgroundColor: BG,
      }}>

        {/* ── 1. PROMO BAR ── */}
        <div style={{
          backgroundColor: "#2d1a0e", padding: "7px 4%",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          {/* Easter promo — left side */}
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            color: "#f5d98b", fontSize: "0.78rem", fontFamily: "sans-serif",
          }}>
            <span style={{ fontSize: "1.1rem" }}>🐣</span>
            <span>
              <strong>Easter Sale — up to 30% off</strong>
              &nbsp;·&nbsp; Use code &nbsp;
              <span style={{
                backgroundColor: "#f5d98b", color: "#2d1a0e",
                padding: "1px 7px", borderRadius: "3px", fontWeight: "700",
              }}>EASTER30</span>
              &nbsp; at checkout &nbsp;·&nbsp; Ends 21 Apr
            </span>
          </div>

          {/* Track my order — right side */}
          <a
            href="#"
            onMouseEnter={() => setHoveredIcon("track")}
            onMouseLeave={() => setHoveredIcon(null)}
            style={{
              display: "flex", alignItems: "center", gap: "7px",
              textDecoration: "none",
              color: hoveredIcon === "track" ? "#f5d98b" : "#d4c9bc",
              fontSize: "0.78rem", fontFamily: "sans-serif",
              transition: "color 0.2s", whiteSpace: "nowrap",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="1"/>
              <path d="M16 8h4l3 5v3h-7V8z"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            Track my order
          </a>
        </div>

        {/* ── 2. MAIN BAR: Logo | Search | Icons ── */}
        <div style={{
          backgroundColor: BG, padding: "14px 4%",
          display: "flex", alignItems: "center", gap: "20px",
          borderBottom: "1px solid #d4cfc9",
        }}>

          {/* Logo — clicking it goes home */}
          <div
            onClick={() => navigate("/")}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              flexShrink: 0, marginRight: "8px", cursor: "pointer",
            }}
          >
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
              <div style={{
                fontWeight: "900", fontSize: "1rem", color: "#1a1a1a",
                lineHeight: 1.1, fontFamily: "'Georgia', serif",
              }}>
                Apex Home
              </div>
              <div style={{
                fontWeight: "400", fontSize: "0.62rem", color: "#8b7355",
                letterSpacing: "2px", textTransform: "uppercase",
                fontFamily: "'Georgia', serif",
              }}>
                Furnishings
              </div>
            </div>
          </div>

          {/* Search bar — pressing Enter navigates to /shop?search=... */}
          <form onSubmit={handleSearch} style={{ flex: 1, position: "relative" }}>
            <svg
              style={{
                position: "absolute", left: "14px", top: "50%",
                transform: "translateY(-50%)", pointerEvents: "none",
              }}
              width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="#888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
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
                padding: "11px 16px 11px 42px",
                border: "1.5px solid #c8c2bb", borderRadius: "4px",
                backgroundColor: "white", fontSize: "0.87rem",
                fontFamily: "sans-serif", color: "#1a1a1a", outline: "none",
              }}
            />
          </form>

          {/* Right icons — Shortlist, Account, Basket */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: 0 }}>

            {/* Shortlist (heart) — no functionality yet, placeholder */}
            <IconBtn id="heart" label="Shortlist" hovered={hoveredIcon} setHovered={setHoveredIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </IconBtn>

            {/* Account icon:
                - If logged in: shows first name, clicking logs out
                - If logged out: shows "Account", clicking goes to /login */}
            <div
              onClick={() => isLoggedIn ? logout() : navigate("/login")}
              style={{ cursor: "pointer" }}
            >
              <IconBtn
                id="account"
                label={isLoggedIn ? user.name.split(" ")[0] : "Account"}
                hovered={hoveredIcon}
                setHovered={setHoveredIcon}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke={isLoggedIn ? "#8b7355" : "currentColor"}
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </IconBtn>
            </div>

            {/* Basket — shows live item count, clicking goes to /cart */}
            <div onClick={() => navigate("/cart")} style={{ cursor: "pointer" }}>
              <IconBtn
                id="basket"
                label="Basket"
                badge={totalItems}
                hovered={hoveredIcon}
                setHovered={setHoveredIcon}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </IconBtn>
            </div>
          </div>
        </div>

        {/* ── 3. CATEGORY BAR + PAGE LINKS + MEGA MENU ── */}
        <div style={{ position: "relative" }}>
          <div style={{
            backgroundColor: BG, borderBottom: "2px solid #c8c2bb",
            padding: "0 4%", display: "flex",
            justifyContent: "space-between", alignItems: "center",
          }}>

            {/* LEFT SIDE — category buttons (open mega menu on hover, navigate on click) */}
            <div style={{ display: "flex" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onMouseEnter={() => handleCatEnter(cat)}
                  onMouseLeave={handleCatLeave}
                  onClick={() => navigate(`/shop?category=${encodeURIComponent(cat)}`)}
                  style={{
                    background: "none", border: "none",
                    borderBottom: openMenu === cat ? "3px solid #8b7355" : "3px solid transparent",
                    padding: "12px 18px", fontSize: "0.87rem",
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

            {/* RIGHT SIDE — About Us and Contact page links */}
            <div style={{ display: "flex" }}>
              {PAGE_LINKS.map(({ label, path }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  onMouseEnter={() => setHoveredIcon(label)}
                  onMouseLeave={() => setHoveredIcon(null)}
                  style={{
                    background: "none", border: "none",
                    borderBottom: "3px solid transparent",
                    padding: "12px 18px", fontSize: "0.87rem",
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

          {/* MEGA MENU DROPDOWN — appears on category hover */}
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
                gap: "0",
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
                  {/* Column header */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    marginBottom: "16px", paddingBottom: "12px",
                    borderBottom: "1px solid #e8e4df",
                  }}>
                    <div style={{ flexShrink: 0 }}>{col.icon}</div>
                    <div style={{
                      display: "flex", alignItems: "center",
                      justifyContent: "space-between", flex: 1,
                    }}>
                      <span style={{
                        fontWeight: "700", fontSize: "0.95rem",
                        color: "#1a1a1a", fontFamily: "sans-serif",
                      }}>
                        {col.title}
                      </span>
                      {/* View all navigates to shop filtered by the parent category */}
                      <span
                        onClick={() => {
                          navigate(`/shop?category=${encodeURIComponent(openMenu)}`);
                          setOpenMenu(null);
                        }}
                        style={{
                          fontSize: "0.78rem", color: "#8b7355",
                          textDecoration: "underline", fontFamily: "sans-serif",
                          whiteSpace: "nowrap", marginLeft: "12px", cursor: "pointer",
                        }}
                      >
                        View all
                      </span>
                    </div>
                  </div>

                  {/* Sub-items */}
                  {col.sections.map((sec) => (
                    <div key={sec.label} style={{ marginBottom: "14px" }}>
                      <div style={{
                        fontSize: "0.78rem", fontWeight: "700",
                        color: "#1a1a1a", fontFamily: "sans-serif", marginBottom: "6px",
                      }}>
                        {sec.label}
                      </div>
                      {sec.items.map((item) => (
                        <span
                          key={item}
                          onClick={() => {
                            navigate(`/shop?category=${encodeURIComponent(openMenu)}`);
                            setOpenMenu(null);
                          }}
                          style={{
                            display: "block", fontSize: "0.83rem",
                            color: "#4a4540", fontFamily: "sans-serif",
                            textDecoration: "none", padding: "3px 0",
                            lineHeight: 1.5, transition: "color 0.15s",
                            cursor: "pointer",
                          }}
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
      </div>

      {/* ── HERO SECTION ── */}
      <div style={{
        display: "flex", flex: 1, alignItems: "stretch",
        padding: "0 0 0 6%", minHeight: "calc(100vh - 160px)",
      }}>

        {/* LEFT: Text content */}
        <div style={{
          flex: "0 0 440px", display: "flex", flexDirection: "column",
          justifyContent: "center", paddingRight: "40px",
          paddingBottom: "60px", zIndex: 2,
        }}>
          <span style={{
            fontSize: "0.78rem", color: "#7a6e68", letterSpacing: "1.5px",
            textTransform: "uppercase", marginBottom: "18px", fontFamily: "sans-serif",
          }}>
            Free shipping on orders over $199
          </span>

          <h1 style={{
            fontSize: "clamp(2.2rem, 4vw, 2.4rem)", fontWeight: "700",
            color: "#1a1a1a", margin: "0 0 22px 0",
            lineHeight: 1.15, letterSpacing: "-1px", fontFamily: "'Georgia', serif",
          }}>
            Find the Perfect<br/>
            <span style={{ color: "#8b7355" }}>Piece</span> for Every<br/>
            Room in Your Home.
          </h1>

          <p style={{
            color: "#5a5550", lineHeight: "1.75", fontSize: "0.9rem",
            marginBottom: "32px", maxWidth: "320px", fontFamily: "sans-serif",
          }}>
            Shop premium handcrafted furniture delivered straight to your door.
            Thousands of styles in stock — from sofas to dining sets.
            Easy returns. Secure checkout. Trusted by 50,000+ homes.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onMouseEnter={() => setHoveredIcon("btn")}
              onMouseLeave={() => setHoveredIcon(null)}
              onClick={() => navigate("/shop")}
              style={{
                backgroundColor: hoveredIcon === "btn" ? "#6b5a50" : "#8b7355",
                color: "white", border: "none", padding: "13px 32px",
                fontSize: "0.85rem", fontWeight: "600", letterSpacing: "1px",
                cursor: "pointer", transition: "background-color 0.25s",
                fontFamily: "sans-serif",
              }}
            >
              Shop Now
            </button>
            <button
              onMouseEnter={() => setHoveredIcon("btn2")}
              onMouseLeave={() => setHoveredIcon(null)}
              onClick={() => navigate("/shop")}
              style={{
                backgroundColor: "transparent",
                color: hoveredIcon === "btn2" ? "#8b7355" : "#1a1a1a",
                border: "2px solid #1a1a1a", padding: "11px 24px",
                fontSize: "0.85rem", fontWeight: "600", letterSpacing: "1px",
                cursor: "pointer", transition: "all 0.25s", fontFamily: "sans-serif",
              }}
            >
              View Catalogue
            </button>
          </div>

          <div style={{ display: "flex", gap: "18px", marginTop: "24px" }}>
            {["⭐ 4.9 Rated", "🚚 Free Returns", "🔒 Secure Pay"].map(b => (
              <span key={b} style={{ fontSize: "0.75rem", color: "#7a6e68", fontFamily: "sans-serif" }}>
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT: Sofa image — edges fade into background */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <img
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80"
            alt="Green velvet sofa"
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center",
              display: "block",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 22%, black 78%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 14%, black 84%, transparent 100%)",
              maskImage: "linear-gradient(to right, transparent 0%, black 22%, black 78%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 14%, black 84%, transparent 100%)",
              WebkitMaskComposite: "source-in",
              maskComposite: "intersect",
              mixBlendMode: "multiply",
            }}
          />
        </div>
      </div>
    </div>
  );
}