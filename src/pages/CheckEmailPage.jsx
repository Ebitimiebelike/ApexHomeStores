import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";

export default function CheckEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // If RegisterPage passes the email via state we can show it
  // e.g. navigate("/check-email", { state: { email: formData.email } })
  const email = location.state?.email;

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
          width: "100%", maxWidth: "480px",
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
            <div style={{ fontWeight: "900", fontSize: "1rem", color: "#1a1a1a" }}>
              Apex Home
            </div>
            <div style={{ fontSize: "0.6rem", color: "#8b7355", letterSpacing: "2px", textTransform: "uppercase" }}>
              Furnishings
            </div>
          </div>

          {/* Email icon */}
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%",
            backgroundColor: "#f9f6f2", border: "3px solid #8b7355",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px", fontSize: "2rem",
          }}>
            📧
          </div>

          <h2 style={{ margin: "0 0 12px", fontSize: "1.4rem", fontWeight: "900", color: "#1a1a1a" }}>
            Check your inbox
          </h2>

          <p style={{ margin: "0 0 8px", color: "#5a5550", fontSize: "0.9rem", fontFamily: "sans-serif", lineHeight: 1.7 }}>
            We've sent a verification link to
          </p>

          {email && (
            <p style={{ margin: "0 0 16px", fontWeight: "700", color: "#8b7355", fontSize: "0.95rem", fontFamily: "sans-serif" }}>
              {email}
            </p>
          )}

          <p style={{ margin: "0 0 28px", color: "#7a6e68", fontSize: "0.85rem", fontFamily: "sans-serif", lineHeight: 1.7 }}>
            Click the link in the email to activate your account.
            The link expires in <strong>24 hours</strong>.
          </p>

          {/* Tips */}
          <div style={{
            backgroundColor: "#f9f6f2", border: "1px solid #e8e4df",
            padding: "16px", marginBottom: "28px", textAlign: "left",
          }}>
            <p style={{ margin: "0 0 8px", fontSize: "0.82rem", fontWeight: "700", color: "#1a1a1a", fontFamily: "sans-serif" }}>
              Can't find the email?
            </p>
            <ul style={{ margin: 0, padding: "0 0 0 18px", fontSize: "0.82rem", color: "#7a6e68", fontFamily: "sans-serif", lineHeight: 1.8 }}>
              <li>Check your <strong>spam</strong> or <strong>junk</strong> folder</li>
              <li>Make sure you typed your email correctly</li>
              <li>Allow a few minutes for delivery</li>
            </ul>
          </div>

          <button
            onClick={() => navigate("/login")}
            style={{
              width: "100%", padding: "13px",
              backgroundColor: "#8b7355", color: "white",
              border: "none", fontSize: "0.9rem",
              fontWeight: "700", letterSpacing: "1px",
              cursor: "pointer", fontFamily: "sans-serif",
              marginBottom: "12px",
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6b5a50"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#8b7355"}
          >
            Go to Login
          </button>

          <button
            onClick={() => navigate("/register")}
            style={{
              width: "100%", padding: "11px",
              backgroundColor: "transparent", color: "#1a1a1a",
              border: "2px solid #1a1a1a", fontSize: "0.88rem",
              fontWeight: "600", cursor: "pointer", fontFamily: "sans-serif",
            }}
          >
            Back to Register
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}