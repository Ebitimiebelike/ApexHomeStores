import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const cols = [
    {
      heading: "Shop",
      links: [
        { label: "Sofas & Chairs",  path: "/shop?category=Sofas%20%26%20Chairs" },
        { label: "Dining",          path: "/shop?category=Dining" },
        { label: "Living Room",     path: "/shop?category=Living%20Room" },
        { label: "Beds & Bedroom",  path: "/shop?category=Beds%20%26%20Bedroom" },
        { label: "Accessories",     path: "/shop?category=Accessories" },
        { label: "All Products",    path: "/shop" },
      ],
    },
    {
      heading: "Help",
      links: [
        { label: "Track My Order",    path: "/" },
        { label: "Returns Policy",    path: "/" },
        { label: "Delivery Info",     path: "/" },
        { label: "FAQs",              path: "/" },
        { label: "Contact Us",        path: "/contact" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About Us",          path: "/about" },
        { label: "Careers",           path: "/" },
        { label: "Press",             path: "/" },
        { label: "Sustainability",    path: "/" },
        { label: "Store Finder",      path: "/" },
      ],
    },
  ];

  return (
    <footer style={{
      backgroundColor: "#1a1412",
      color: "#d4cfc9",
      fontFamily: "sans-serif",
      marginTop: "auto",
    }}>

      {/* ── Top section ── */}
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        padding: "56px 6% 40px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "40px",
      }}>

        {/* Brand column */}
        <div style={{ gridColumn: "span 1" }}>
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginBottom: "16px" }}
          >
            <div style={{ width: "40px", height: "40px", backgroundColor: "#8b7355", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: "900", fontSize: "0.95rem", color: "white", lineHeight: 1.1, fontFamily: "'Georgia', serif" }}>Apex Home</div>
              <div style={{ fontSize: "0.56rem", color: "#8b7355", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Georgia', serif" }}>Furnishings</div>
            </div>
          </div>

          <p style={{ fontSize: "0.82rem", lineHeight: "1.7", color: "#9a9088", marginBottom: "20px", maxWidth: "220px" }}>
            Premium handcrafted furniture delivered to your door. Trusted by 50,000+ homes across Nigeria.
          </p>

          {/* Social icons */}
          <div style={{ display: "flex", gap: "12px" }}>
            {[
              { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
              { label: "Facebook",  path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
              { label: "Twitter/X", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.857L1.252 2.25H8.08l4.26 5.635 5.905-5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
            ].map(s => (
              <a key={s.label} href="#" aria-label={s.label}
                style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: "#2d2420", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#8b7355"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2d2420"}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#d4cfc9">
                  <path d={s.path}/>
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {cols.map(col => (
          <div key={col.heading}>
            <h4 style={{ margin: "0 0 16px", fontSize: "0.78rem", fontWeight: "700", color: "white", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              {col.heading}
            </h4>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {col.links.map(link => (
                <li key={link.label}>
                  <span
                    onClick={() => navigate(link.path)}
                    style={{ fontSize: "0.85rem", color: "#9a9088", cursor: "pointer", transition: "color 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#d4cfc9"}
                    onMouseLeave={e => e.currentTarget.style.color = "#9a9088"}
                  >
                    {link.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter */}
        <div>
          <h4 style={{ margin: "0 0 10px", fontSize: "0.78rem", fontWeight: "700", color: "white", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Newsletter
          </h4>
          <p style={{ fontSize: "0.82rem", color: "#9a9088", lineHeight: 1.6, marginBottom: "14px" }}>
            Get exclusive deals and new arrivals straight to your inbox.
          </p>
          {subscribed ? (
            <p style={{ fontSize: "0.82rem", color: "#00b67a", fontWeight: "600" }}>✓ You're subscribed!</p>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  padding: "10px 14px", backgroundColor: "#2d2420",
                  border: "1px solid #3d3028", color: "white",
                  fontSize: "0.85rem", outline: "none", borderRadius: "3px",
                  fontFamily: "sans-serif",
                }}
              />
              <button type="submit" style={{
                padding: "10px 14px", backgroundColor: "#8b7355",
                color: "white", border: "none", fontSize: "0.82rem",
                fontWeight: "700", letterSpacing: "1px", cursor: "pointer",
                textTransform: "uppercase", borderRadius: "3px",
                transition: "background-color 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6b5a50"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#8b7355"}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ borderTop: "1px solid #2d2420", margin: "0 6%" }} />

      {/* ── Bottom bar ── */}
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        padding: "20px 6%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
      }}>
        <p style={{ margin: 0, fontSize: "0.78rem", color: "#6b6460" }}>
          © {new Date().getFullYear()} Apex Home Furnishings. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: "20px" }}>
          {["Privacy Policy", "Terms of Use", "Cookie Policy"].map(t => (
            <span key={t} style={{ fontSize: "0.75rem", color: "#6b6460", cursor: "pointer", transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#9a9088"}
              onMouseLeave={e => e.currentTarget.style.color = "#6b6460"}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}