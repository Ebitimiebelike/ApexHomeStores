import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { formatNaira } from "../Utils/currency";
import Footer from "../components/Footer";

const API = `${(
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "")}/api`.replace("/api/api", "/api");

const DELIVERY_TIME = 7 * 24 * 60 * 60 * 1000;

function getDeliveryState(createdAt, now) {
  const deliveryDate = new Date(createdAt).getTime() + DELIVERY_TIME;
  const remaining = Math.max(0, deliveryDate - now);
  const elapsed = now - new Date(createdAt).getTime();

  if (remaining === 0) {
    return { label: "Delivered", color: "#2d6a2d", remaining, deliveryDate };
  }

  if (elapsed < 2 * 24 * 60 * 60 * 1000) {
    return { label: "Processing", color: "#a15c00", remaining, deliveryDate };
  }

  return { label: "In transit", color: "#2563a6", remaining, deliveryDate };
}

function formatCountdown(milliseconds) {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export default function OrderTrackingPage() {
  const { user, getToken, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (authLoading || !userId) return undefined;

    let cancelled = false;

    async function loadOrders() {
      try {
        const token = await getToken();
        const response = await fetch(`${API}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load your orders.");
        }

        if (!cancelled) {
          setOrders(Array.isArray(data.orders) ? data.orders : []);
        }
      } catch (requestError) {
        if (!cancelled) setError(requestError.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadOrders();
    return () => {
      cancelled = true;
    };
  }, [authLoading, userId, getToken]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (authLoading || (!user && !error)) {
    return <div style={styles.center}>Checking your account...</div>;
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button type="button" onClick={() => navigate(-1)} style={styles.backButton}>
          Back
        </button>
        <div>
          <p style={styles.eyebrow}>Apex Home</p>
          <h1 style={styles.title}>Track your order</h1>
        </div>
      </header>

      <main style={styles.content}>
        <p style={styles.intro}>
          Every order is prepared and delivered within seven days. Your latest status updates automatically.
        </p>

        {loading && <div style={styles.panel}>Loading your orders...</div>}
        {error && <div style={styles.error}>{error}</div>}

        {!loading && !error && orders.length === 0 && (
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>No orders yet</h2>
            <p style={styles.muted}>Your confirmed orders will appear here.</p>
            <button type="button" onClick={() => navigate("/shop")} style={styles.primaryButton}>
              Shop furniture
            </button>
          </div>
        )}

        <div style={styles.orderList}>
          {orders.map((order) => {
            const status = getDeliveryState(order.createdAt, now);
            return (
              <article key={order._id || order.orderNumber} style={styles.orderCard}>
                <div style={styles.orderTop}>
                  <div>
                    <p style={styles.orderLabel}>Order number</p>
                    <h2 style={styles.orderNumber}>{order.orderNumber}</h2>
                  </div>
                  <span style={{ ...styles.status, color: status.color, borderColor: status.color }}>
                    {status.label}
                  </span>
                </div>

                <div style={styles.progressTrack}>
                  <div
                    style={{
                      ...styles.progressBar,
                      width: `${Math.min(100, Math.max(8, ((DELIVERY_TIME - status.remaining) / DELIVERY_TIME) * 100))}%`,
                      backgroundColor: status.color,
                    }}
                  />
                </div>

                <div style={styles.deliveryRow}>
                  <div>
                    <p style={styles.orderLabel}>{status.remaining ? "Estimated delivery in" : "Delivered"}</p>
                    <strong style={styles.countdown}>
                      {status.remaining ? formatCountdown(status.remaining) : "Your order has arrived"}
                    </strong>
                  </div>
                  <div style={styles.alignRight}>
                    <p style={styles.orderLabel}>Estimated date</p>
                    <strong>{new Date(status.deliveryDate).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</strong>
                  </div>
                </div>

                <div style={styles.summary}>
                  <span>{order.items?.length || 0} item{order.items?.length === 1 ? "" : "s"}</span>
                  <strong>{formatNaira(Number(order.total) || 0)}</strong>
                </div>
              </article>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#eae6e1", color: "#1a1a1a", fontFamily: "sans-serif" },
  center: { minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "sans-serif" },
  header: { backgroundColor: "#2d1a0e", color: "white", padding: "34px 6%", display: "flex", alignItems: "center", gap: "24px" },
  backButton: { background: "transparent", border: "1px solid #c9a66b", color: "#f5d98b", padding: "9px 16px", cursor: "pointer" },
  eyebrow: { margin: "0 0 8px", color: "#f5d98b", letterSpacing: "2px", textTransform: "uppercase", fontSize: "0.72rem" },
  title: { margin: 0, fontFamily: "Georgia, serif", fontSize: "clamp(1.7rem, 4vw, 2.5rem)" },
  content: { maxWidth: "820px", margin: "0 auto", padding: "42px 6% 70px" },
  intro: { color: "#625951", lineHeight: 1.7, margin: "0 0 28px" },
  panel: { backgroundColor: "white", border: "1px solid #e8e4df", padding: "36px", textAlign: "center" },
  panelTitle: { margin: "0 0 8px", fontFamily: "Georgia, serif" },
  muted: { color: "#7a6e68", lineHeight: 1.6 },
  primaryButton: { marginTop: "16px", padding: "12px 24px", border: 0, backgroundColor: "#8b7355", color: "white", cursor: "pointer", fontWeight: 700 },
  error: { backgroundColor: "#fff1f1", border: "1px solid #e5bcbc", color: "#8b0000", padding: "16px", marginBottom: "18px" },
  orderList: { display: "grid", gap: "18px" },
  orderCard: { backgroundColor: "white", border: "1px solid #e8e4df", padding: "24px" },
  orderTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" },
  orderLabel: { margin: "0 0 6px", color: "#7a6e68", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "1px" },
  orderNumber: { margin: 0, fontFamily: "Georgia, serif", fontSize: "1.15rem" },
  status: { border: "1px solid", padding: "6px 10px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" },
  progressTrack: { height: "8px", backgroundColor: "#eee9e3", margin: "24px 0 20px", overflow: "hidden" },
  progressBar: { height: "100%", transition: "width 0.5s linear" },
  deliveryRow: { display: "flex", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" },
  countdown: { fontSize: "1.25rem", fontFamily: "Georgia, serif" },
  alignRight: { textAlign: "right" },
  summary: { borderTop: "1px solid #eee9e3", marginTop: "22px", paddingTop: "16px", display: "flex", justifyContent: "space-between", color: "#625951" },
};
