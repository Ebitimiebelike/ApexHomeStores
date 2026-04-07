import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    setTimeout(async () => {
      const result = await login(formData.email, formData.password);
      setLoading(false);
      if (!result.success) {
        setError(result.message || "Sign in failed.");
      } else {
        navigate("/");
      }
    }, 800);
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#eae6e1",
      display: "flex", 
      flexDirection: "column", // Ensures Footer stays at bottom
      alignItems: "center",
      justifyContent: "center", 
      fontFamily: "'Georgia', serif",
      padding: isMobile ? "10px" : "20px" 
    }}>

      <div style={{ 
        backgroundColor: "white", 
        padding: isMobile ? "32px 24px" : "48px 40px",
        width: "90%", // Relative width for small screens
        maxWidth: "420px",
        border: "1px solid #e8e4df",
        boxSizing: "border-box" // Critical for padding alignment
      }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px", cursor: "pointer" }} onClick={() => navigate("/")}>
          <div style={{ 
            width: "48px", height: "48px",
            backgroundColor: "#8b7355", display: "flex",
            alignItems: "center", justifyContent: "center",
            margin: "0 auto 12px" 
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div style={{ fontWeight: "900", fontSize: "1.1rem", color: "#1a1a1a" }}>Apex Home</div>
          <div style={{ fontSize: "0.62rem", color: "#8b7355", letterSpacing: "2px", textTransform: "uppercase" }}>Furnishings</div>
        </div>

        <h2 style={{ margin: "0 0 6px", fontSize: isMobile ? "1.2rem" : "1.4rem", fontWeight: "900", color: "#1a1a1a", textAlign: "center" }}>
          Welcome back
        </h2>
        <p style={{ margin: "0 0 28px", color: "#7a6e68", fontSize: "0.88rem", fontFamily: "sans-serif", textAlign: "center" }}>
          Sign in to your account
        </p>

        {/* Email */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: "#1a1a1a", fontFamily: "sans-serif", marginBottom: "6px" }}>
            Email address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            style={{ 
              width: "100%", boxSizing: "border-box", padding: "12px 14px", 
              border: "1.5px solid #c8c2bb", fontSize: "16px", // 16px prevents iOS auto-zoom on focus
              fontFamily: "sans-serif", color: "#1a1a1a", outline: "none" 
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "8px" }}>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: "#1a1a1a", fontFamily: "sans-serif", marginBottom: "6px" }}>
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            style={{ 
              width: "100%", boxSizing: "border-box", padding: "12px 14px", 
              border: "1.5px solid #c8c2bb", fontSize: "16px", 
              fontFamily: "sans-serif", color: "#1a1a1a", outline: "none" 
            }}
          />
        </div>

        {error && (
          <p style={{ margin: "10px 0", color: "#8b0000", fontSize: "0.82rem", fontFamily: "sans-serif" }}>
            ⚠️ {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ 
            width: "100%", padding: "14px",
            backgroundColor: loading ? "#b8a898" : "#8b7355",
            color: "white", border: "none", fontSize: "0.95rem", fontWeight: "700",
            letterSpacing: "1px", cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "sans-serif", marginTop: "16px"
          }}
        >
          {loading ? "Signing in..." : "SIGN IN"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
          <div style={{ flex: 1, borderTop: "1px solid #e8e4df" }} />
          <span style={{ fontSize: "0.78rem", color: "#aaa", fontFamily: "sans-serif" }}>or</span>
          <div style={{ flex: 1, borderTop: "1px solid #e8e4df" }} />
        </div>

        <p style={{ margin: 0, textAlign: "center", fontSize: "0.85rem", fontFamily: "sans-serif", color: "#5a5550" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#8b7355", fontWeight: "700", textDecoration: "none" }}>
            Create one
          </Link>
        </p>
      </div>
      
      <div style={{ marginTop: "40px", width: "100%" }}>
        <Footer />
      </div>
    </div>
  );
}