import { useState } from "react";

const Navbar = () => {
  const [hovered, setHovered] = useState(null);

  const links = ["About Us", "Projects", "Services", "Shop", "Contact"];

  const styles = {
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "28px 6%",
      backgroundColor: "#f5f5f3",
      width: "100%",
      boxSizing: "border-box",
      fontFamily: "'Georgia', serif",
    },
    logo: {
      fontSize: "1.3rem",
      fontWeight: "800",
      color: "#2b2b2b",
      letterSpacing: "-0.5px",
      cursor: "pointer",
      minWidth: "120px",
    },
    navLinks: {
      display: "flex",
      gap: "36px",
      listStyle: "none",
      margin: 0,
      padding: 0,
    },
    link: (name) => ({
      textDecoration: "none",
      color: hovered === name ? "#8e7a6d" : "#333",
      fontWeight: "500",
      fontSize: "0.88rem",
      letterSpacing: "0.3px",
      transition: "color 0.2s ease",
      cursor: "pointer",
      fontFamily: "'Arial', sans-serif",
    }),
    navAuth: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      minWidth: "120px",
      justifyContent: "flex-end",
      cursor: "pointer",
      textDecoration: "none",
      color: hovered === "signup" ? "#8e7a6d" : "#2b2b2b",
      transition: "color 0.2s ease",
    },
    signupText: {
      fontWeight: "700",
      fontSize: "0.88rem",
      letterSpacing: "0.3px",
      fontFamily: "'Arial', sans-serif",
    },
    iconCircle: {
      width: "34px",
      height: "34px",
      borderRadius: "50%",
      border: "2px solid #2b2b2b",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1rem",
      flexShrink: 0,
    },
  };

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={styles.navbar} className="navbar">
      {/* Logo */}
      <div style={styles.logo}>.Furniture</div>

      {/* Mobile menu button */}
      <button
        className="nav-menu-button"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle navigation"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Nav Links */}
      <ul style={{...styles.navLinks, display: menuOpen ? "flex" : "none"}} className={`nav-links ${menuOpen ? "open" : ""}`}>
        {links.map((name) => (
          <li key={name}>
            <a
              href="#"
              style={styles.link(name)}
              onMouseEnter={() => setHovered(name)}
              onMouseLeave={() => setHovered(null)}
            >
              {name}
            </a>
          </li>
        ))}
      </ul>

      {/* Sign Up */}
      <a
        href="#"
        style={styles.navAuth}
        className="nav-auth"
        onMouseEnter={() => setHovered("signup")}
        onMouseLeave={() => setHovered(null)}
      >
        <span style={styles.signupText}>Sign Up</span>
        <div style={styles.iconCircle}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </a>
    </nav>
  );
};

export default Navbar;