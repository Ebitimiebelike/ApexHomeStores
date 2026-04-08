import { useNavigate } from "react-router-dom";

export default function CheckEmailPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <h2 style={{ marginBottom: 8 }}>Check your inbox</h2>
      <p style={{ maxWidth: 520, textAlign: "center", color: "#6b5f57" }}>
        We sent a verification link to your email. Please click the link to activate your account.
      </p>
      <button
        onClick={() => navigate("/login")}
        style={{ marginTop: 18, padding: "12px 18px", background: "#8b7355", color: "white", border: 0, borderRadius: 6, cursor: "pointer" }}
      >
        Go to Login
      </button>
    </div>
  );
}