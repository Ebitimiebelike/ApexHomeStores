import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    // If not logged in, redirect to login
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const tabs = ["Overview", "Orders", "Settings"];
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#eae6e1", fontFamily: "'Georgia', serif" }}>

      {/* Page header */}
      <div style={{ backgroundColor: "#2d1a0e", padding: isMobile ? "40px 6%" : "52px 6%" }}>
        <p style={{ margin: "0 0 8px", fontSize: "0.75rem", color: "#f5d98b", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "sans-serif" }}>
          My Account
        </p>
        <h1 style={{ margin: "0 0 6px", fontSize: isMobile ? "1.6rem" : "2rem", fontWeight: "900", color: "white" }}>
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p style={{ margin: 0, color: "#9a9088", fontSize: "0.88rem", fontFamily: "sans-serif" }}>
          {user.email}
        </p>
      </div>

      {/* Tab bar */}
      <div style={{ backgroundColor: "white", borderBottom: "2px solid #e8e4df", padding: "0 6%", display: "flex" }}>
        {tabs.map(tab => (
          <button key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: "none", border: "none",
              borderBottom: activeTab === tab ? "3px solid #8b7355" : "3px solid transparent",
              padding: "14px 20px", fontSize: "0.87rem",
              fontWeight: activeTab === tab ? "700" : "400",
              color: activeTab === tab ? "#8b7355" : "#5a5550",
              cursor: "pointer", fontFamily: "sans-serif",
              marginBottom: "-2px", whiteSpace: "nowrap",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, padding: isMobile ? "32px 6%" : "48px 6%", maxWidth: "860px" }}>

        {/* ── OVERVIEW ── */}
        {activeTab === "Overview" && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "20px" }}>

            {[
              {
                icon: "📦", title: "My Orders",
                desc: "Track, manage and view your order history.",
                action: () => setActiveTab("Orders"),
                btn: "View Orders",
              },
              {
                icon: "❤️", title: "Shortlist",
                desc: "Items you've saved for later.",
                action: () => navigate("/shop"),
                btn: "Browse Products",
              },
              {
                icon: "📍", title: "Delivery Addresses",
                desc: "Manage your saved delivery addresses.",
                action: () => setActiveTab("Settings"),
                btn: "Manage Addresses",
              },
              {
                icon: "🔒", title: "Security",
                desc: "Update your password and account settings.",
                action: () => setActiveTab("Settings"),
                btn: "Account Settings",
              },
            ].map(card => (
              <div key={card.title} style={{ backgroundColor: "white", border: "1px solid #e8e4df", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ fontSize: "1.8rem" }}>{card.icon}</div>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "700", color: "#1a1a1a" }}>{card.title}</h3>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#7a6e68", fontFamily: "sans-serif", lineHeight: 1.6 }}>{card.desc}</p>
                <button onClick={card.action}
                  style={{ marginTop: "auto", padding: "10px 20px", backgroundColor: "transparent", border: "2px solid #8b7355", color: "#8b7355", fontSize: "0.82rem", fontWeight: "600", cursor: "pointer", fontFamily: "sans-serif", alignSelf: "flex-start" }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#8b7355"; e.currentTarget.style.color = "white"; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#8b7355"; }}>
                  {card.btn}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── ORDERS ── */}
        {activeTab === "Orders" && (
          <div>
            <h2 style={{ margin: "0 0 24px", fontSize: "1.2rem", fontWeight: "900", color: "#1a1a1a" }}>Order History</h2>
            {/* Right now orders only persist during a session since we have no backend.
                When you build the backend in the next step, real orders will appear here. */}
            <div style={{ backgroundColor: "white", border: "1px solid #e8e4df", padding: "48px", textAlign: "center" }}>
              <p style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📦</p>
              <h3 style={{ margin: "0 0 8px", color: "#1a1a1a", fontSize: "1.1rem" }}>No orders yet</h3>
              <p style={{ margin: "0 0 24px", color: "#7a6e68", fontFamily: "sans-serif", fontSize: "0.88rem" }}>
                When you place an order, it will appear here. Order history will persist once the backend is connected.
              </p>
              <button onClick={() => navigate("/shop")}
                style={{ padding: "12px 32px", backgroundColor: "#8b7355", color: "white", border: "none", cursor: "pointer", fontFamily: "sans-serif", fontWeight: "600" }}>
                Start Shopping
              </button>
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {activeTab === "Settings" && (
          <div style={{ maxWidth: "480px" }}>
            <h2 style={{ margin: "0 0 24px", fontSize: "1.2rem", fontWeight: "900", color: "#1a1a1a" }}>Account Settings</h2>

            <div style={{ backgroundColor: "white", border: "1px solid #e8e4df", padding: "28px", marginBottom: "16px" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: "0.95rem", fontWeight: "700", color: "#1a1a1a" }}>Personal Details</h3>
              {[
                { label: "Full Name", value: user.name },
                { label: "Email",     value: user.email },
              ].map(field => (
                <div key={field.label} style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "600", color: "#7a6e68", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
                    {field.label}
                  </label>
                  <div style={{ padding: "11px 14px", border: "1.5px solid #e8e4df", backgroundColor: "#f9f6f2", fontSize: "0.9rem", fontFamily: "sans-serif", color: "#1a1a1a" }}>
                    {field.value}
                  </div>
                </div>
              ))}
              <p style={{ margin: "8px 0 0", fontSize: "0.75rem", color: "#9a9088", fontFamily: "sans-serif" }}>
                To update your details, you'll need to connect the backend — coming in the next step!
              </p>
            </div>

            {/* Logout */}
            <div style={{ backgroundColor: "white", border: "1px solid #e8e4df", padding: "28px" }}>
              <h3 style={{ margin: "0 0 8px", fontSize: "0.95rem", fontWeight: "700", color: "#1a1a1a" }}>Sign Out</h3>
              <p style={{ margin: "0 0 16px", fontSize: "0.85rem", color: "#7a6e68", fontFamily: "sans-serif" }}>
                You'll be signed out and returned to the homepage.
              </p>
              <button onClick={handleLogout}
                style={{ padding: "11px 28px", backgroundColor: "#8b0000", color: "white", border: "none", cursor: "pointer", fontFamily: "sans-serif", fontWeight: "600", fontSize: "0.88rem" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6b0000"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#8b0000"}>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}