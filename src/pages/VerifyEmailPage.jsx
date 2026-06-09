import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = API_ROOT.endsWith("/api") ? API_ROOT : `${API_ROOT}/api`;

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate  = useNavigate();

  // "pending" | "success" | "error"
  const [status, setStatus] = useState("pending");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token  = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Verification link is invalid. Please register again.");
      return;
    }

    const verify = async () => {
      try {
        // ── IMPORTANT: your backend uses POST /api/auth/verify-email ──
        // Your previous VerifyEmailPage was using GET which is why it failed.
        // The token is sent in the request body, not the URL.
        const res  = await fetch(`${API}/auth/verify-email`, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMessage(data.message || "Verification failed. The link may have expired.");
          return;
        }

        setStatus("success");
        setMessage(data.message || "Email verified successfully!");

        // Redirect to login after 2 seconds
        setTimeout(() => navigate("/login"), 2000);

      } catch {
        setStatus("error");
        setMessage("Network error. Please check your connection and try again.");
      }
    };

    verify();
  }, [location.search, navigate]);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      backgroundColor: "#eae6e1", fontFamily: "'Georgia', serif",
    }}>
      <div style={{
        flex: 1, display: "flex", alignItems: "center",
        justifyContent: "center", padding: "40px 20px",
      }}>
        <div style={{
          backgroundColor: "white", padding: "48px 40px",
          width: "100%", maxWidth: "440px",
          border: "1px solid #e8e4df", textAlign: "center",
        }}>

          {/* Logo */}
          <div style={{ cursor: "pointer", marginBottom: "28px" }}
            onClick={() => navigate("/")}>
            <div style={{
              width: "44px", height: "44px", backgroundColor: "#8b7355",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 10px",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div style={{ fontWeight: "900", fontSize: "1rem", color: "#1a1a1a" }}>Apex Home</div>
            <div style={{ fontSize: "0.6rem", color: "#8b7355", letterSpacing: "2px", textTransform: "uppercase" }}>Furnishings</div>
          </div>

          {/* ── PENDING ── */}
          {status === "pending" && (
            <>
              <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>⏳</div>
              <h2 style={{ margin: "0 0 12px", fontSize: "1.3rem", fontWeight: "900", color: "#1a1a1a" }}>
                Verifying your email
              </h2>
              <p style={{ margin: 0, color: "#7a6e68", fontSize: "0.88rem", fontFamily: "sans-serif" }}>
                Please wait a moment...
              </p>
            </>
          )}

          {/* ── SUCCESS ── */}
          {status === "success" && (
            <>
              <div style={{
                width: "72px", height: "72px", borderRadius: "50%",
                backgroundColor: "#e8f5e9", border: "3px solid #2d6a2d",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px", fontSize: "2rem", color: "#2d6a2d",
              }}>
                ✓
              </div>
              <h2 style={{ margin: "0 0 12px", fontSize: "1.3rem", fontWeight: "900", color: "#1a1a1a" }}>
                Email Verified!
              </h2>
              <p style={{ margin: "0 0 20px", color: "#5a5550", fontSize: "0.9rem", fontFamily: "sans-serif", lineHeight: 1.7 }}>
                {message}
              </p>
              <p style={{ margin: "0 0 24px", color: "#7a6e68", fontSize: "0.82rem", fontFamily: "sans-serif" }}>
                Redirecting you to login...
              </p>
              <button
                onClick={() => navigate("/login")}
                style={{
                  width: "100%", padding: "13px",
                  backgroundColor: "#8b7355", color: "white",
                  border: "none", fontSize: "0.9rem", fontWeight: "700",
                  letterSpacing: "1px", cursor: "pointer", fontFamily: "sans-serif",
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6b5a50"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#8b7355"}
              >
                Go to Login Now
              </button>
            </>
          )}

          {/* ── ERROR ── */}
          {status === "error" && (
            <>
              <div style={{
                width: "72px", height: "72px", borderRadius: "50%",
                backgroundColor: "#fdecea", border: "3px solid #8b0000",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px", fontSize: "2rem",
              }}>
                ✗
              </div>
              <h2 style={{ margin: "0 0 12px", fontSize: "1.3rem", fontWeight: "900", color: "#1a1a1a" }}>
                Verification Failed
              </h2>
              <p style={{ margin: "0 0 24px", color: "#8b0000", fontSize: "0.88rem", fontFamily: "sans-serif", lineHeight: 1.7 }}>
                {message}
              </p>
              <button
                onClick={() => navigate("/register")}
                style={{
                  width: "100%", padding: "13px",
                  backgroundColor: "#8b7355", color: "white",
                  border: "none", fontSize: "0.9rem", fontWeight: "700",
                  letterSpacing: "1px", cursor: "pointer", fontFamily: "sans-serif",
                  marginBottom: "12px",
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6b5a50"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#8b7355"}
              >
                Register Again
              </button>
              <button
                onClick={() => navigate("/login")}
                style={{
                  width: "100%", padding: "11px",
                  backgroundColor: "transparent", color: "#1a1a1a",
                  border: "2px solid #1a1a1a", fontSize: "0.88rem",
                  fontWeight: "600", cursor: "pointer", fontFamily: "sans-serif",
                }}
              >
                Back to Login
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}