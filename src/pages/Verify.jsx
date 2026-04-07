import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function Verify() {
  const { token } = useParams(); // Grabs the token from the URL
  const navigate = useNavigate();
  
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', or 'error'
  const [message, setMessage] = useState("Please wait while we verify your account...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Replace with your actual backend URL if deployed
        const response = await fetch(`http://localhost:5000/api/auth/verify/${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Your email has been verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed. The link may be expired.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Connection error. Please try again later.");
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#eae6e1", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      fontFamily: "'Georgia', serif",
      padding: "20px"
    }}>
      <div style={{ 
        backgroundColor: "white", 
        padding: "48px 40px", 
        width: "100%", 
        maxWidth: "450px", 
        textAlign: "center",
        border: "1px solid #e8e4df" 
      }}>
        
        {/* Icon based on status */}
        <div style={{ fontSize: "3rem", marginBottom: "20px" }}>
          {status === "verifying" && "⏳"}
          {status === "success" && "✅"}
          {status === "error" && "❌"}
        </div>

        <h2 style={{ color: "#1a1a1a", fontWeight: "900", marginBottom: "16px" }}>
          {status === "verifying" && "Verifying..."}
          {status === "success" && "Verification Complete"}
          {status === "error" && "Verification Failed"}
        </h2>

        <p style={{ 
          color: "#7a6e68", 
          fontFamily: "sans-serif", 
          fontSize: "0.95rem", 
          lineHeight: "1.6",
          marginBottom: "32px" 
        }}>
          {message}
        </p>

        {status === "success" && (
          <button
            onClick={() => navigate("/login")}
            style={{ 
              width: "100%", 
              padding: "14px", 
              backgroundColor: "#8b7355", 
              color: "white", 
              border: "none", 
              fontWeight: "700", 
              cursor: "pointer",
              fontFamily: "sans-serif"
            }}
          >
            GO TO LOGIN
          </button>
        )}

        {status === "error" && (
          <Link 
            to="/register" 
            style={{ 
              color: "#8b7355", 
              fontWeight: "700", 
              textDecoration: "none",
              fontFamily: "sans-serif" 
            }}
          >
            Try registering again
          </Link>
        )}
      </div>
    </div>
  );
}