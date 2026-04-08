// src/pages/VerifyPage.jsx (or VerifyEmailPage.jsx)
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API = API_ROOT.endsWith("/api") ? API_ROOT : `${API_ROOT}/api`;

export default function VerifyEMailPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [status, setStatus] = useState("Verifying your email...");
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("Missing verification token.");
      setError("Verification token is missing.");
      return;
    }

    const verify = async () => {
      try {
        setStatus("Verifying your email...");
        setError(null);

        const res = await fetch(
          `${API}/auth/verify-email?token=${encodeURIComponent(token)}`
        );

        const data = await res.json();
        if (!res.ok) {
          setStatus("Verification failed.");
          setError(data.message || "Could not verify email.");
          return;
        }

        setStatus("Email verified! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1200);
      } catch (e) {
        setStatus("Verification failed.");
        setError("Network error. Please try again.");
      }
    };

    verify();
  }, [location.search, navigate]);

  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <h2 style={{ marginBottom: 8 }}>Email Verification</h2>
      <p style={{ color: "#6b5f57" }}>{status}</p>

      {error && (
        <div style={{ marginTop: 12, color: "#8b0000", background: "#fdecea", padding: 12, borderRadius: 6, maxWidth: 520, textAlign: "center" }}>
          {error}
        </div>
      )}
    </div>
  );
}