import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#eae6e1",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Georgia', serif", textAlign: "center",
      padding: "40px" }}>

      {/* Big 404 */}
      <div style={{ fontSize: "clamp(6rem, 20vw, 10rem)", fontWeight: "900",
        color: "#d4cfc9", lineHeight: 1, marginBottom: "8px",
        letterSpacing: "-4px" }}>
        404
      </div>

      <h1 style={{ margin: "0 0 12px", fontSize: "1.6rem",
        fontWeight: "900", color: "#1a1a1a" }}>
        This page doesn't exist
      </h1>

      <p style={{ margin: "0 0 32px", color: "#7a6e68",
        fontFamily: "sans-serif", maxWidth: "380px",
        lineHeight: 1.7, fontSize: "0.95rem" }}>
        The page you're looking for may have been moved, deleted,
        or never existed. Let's get you back on track.
      </p>

      {/* Quick links */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap",
        justifyContent: "center", marginBottom: "40px" }}>
        <button onClick={() => navigate("/")}
          style={{ padding: "13px 32px", backgroundColor: "#8b7355",
            color: "white", border: "none", fontSize: "0.88rem",
            fontWeight: "600", cursor: "pointer",
            fontFamily: "sans-serif" }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6b5a50"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#8b7355"}>
          Go to Homepage
        </button>
        <button onClick={() => navigate("/shop")}
          style={{ padding: "13px 32px", backgroundColor: "transparent",
            color: "#1a1a1a", border: "2px solid #1a1a1a",
            fontSize: "0.88rem", fontWeight: "600",
            cursor: "pointer", fontFamily: "sans-serif" }}>
          Browse Furniture
        </button>
      </div>

      {/* Helpful links */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap",
        justifyContent: "center" }}>
        {[
          { label: "About Us",    path: "/about" },
          { label: "Contact",     path: "/contact" },
          { label: "My Basket",   path: "/cart" },
        ].map(link => (
          <span key={link.path}
            onClick={() => navigate(link.path)}
            style={{ fontSize: "0.85rem", color: "#8b7355",
              fontFamily: "sans-serif", cursor: "pointer",
              textDecoration: "underline" }}>
            {link.label}
          </span>
        ))}
      </div>
    </div>
  );
}