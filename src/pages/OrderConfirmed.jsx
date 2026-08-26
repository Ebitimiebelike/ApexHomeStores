import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { formatNaira } from "../Utils/currency";

// How long the customer gets to read their order number before we
// send them back to the shop.
const REDIRECT_SECONDS = 8;

export default function OrderConfirmed() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { clearCart } = useCart();

  // Read the order data that was passed from CheckoutPage.
  // location.state holds everything we passed in navigate() — but it is
  // lost on a refresh or a full page load, so fall back to the copy
  // CheckoutPage cached before navigating.
  const [order] = useState(() => {
    if (location.state) return location.state;

    try {
      const cached = sessionStorage.getItem("apex_last_order");
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error("Could not read cached order:", error);
      return null;
    }
  });

  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  // React Router can be left out of sync by the Paystack popup's direct
  // history writes, which is what made these buttons look dead. Navigate
  // normally, then check the URL actually changed and force a full page
  // load if it did not.
  const goTo = useCallback((path) => {
    navigate(path);

    setTimeout(() => {
      if (window.location.pathname !== path) {
        window.location.assign(path);
      }
    }, 300);
  }, [navigate]);

  // Clear the cart once the order is confirmed
  // useEffect runs AFTER the page renders — perfect for side effects like this
  useEffect(() => {
    if (order) {
      clearCart();
    }
    // clearCart is recreated on every CartProvider render, so keying this
    // on the order alone keeps it from re-firing in a loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  // Count down, then head back to the shop
  useEffect(() => {
    if (!order) return;

    const tick = setInterval(() => {
      setSecondsLeft(current => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => clearInterval(tick);
  }, [order]);

  useEffect(() => {
    if (!order || secondsLeft > 0) return;

    goTo("/shop");
  }, [order, secondsLeft, goTo]);

  // Guard — if someone navigates directly to /order-confirmed with no data
  if (!order) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#eae6e1",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Georgia', serif", gap: "16px" }}>
        <h2 style={{ margin: 0, color: "#1a1a1a" }}>No order found</h2>
        <p style={{ margin: 0, color: "#7a6e68", fontFamily: "sans-serif" }}>
          It looks like you navigated here directly.
        </p>
        <button onClick={() => goTo("/shop")}
          style={{ padding: "13px 36px", backgroundColor: "#8b7355",
            color: "white", border: "none", cursor: "pointer",
            fontFamily: "sans-serif", fontSize: "0.9rem", fontWeight: "600" }}>
          Browse Furniture
        </button>
      </div>
    );
  }

const USD_TO_NGN = 1600;
const totalNaira = order.total * USD_TO_NGN;
const deliveryCostNaira = order.delivery === "express" ? 23900
  : totalNaira >= 199000 ? 0 : 15900;
const grandTotalNaira = Math.round(totalNaira + deliveryCostNaira);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#eae6e1",
      fontFamily: "'Georgia', serif" }}>

      {/* Compact header */}
      <div style={{ backgroundColor: "white", padding: "16px 6%",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", borderBottom: "1px solid #e8e4df" }}>
        <div style={{ display: "flex", alignItems: "center",
          gap: "10px", cursor: "pointer" }}
          onClick={() => goTo("/")}>
          <div style={{ width: "38px", height: "38px",
            backgroundColor: "#8b7355", display: "flex",
            alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: "900", fontSize: "0.95rem",
              color: "#1a1a1a", fontFamily: "'Georgia', serif" }}>
              Apex Home
            </div>
            <div style={{ fontSize: "0.58rem", color: "#8b7355",
              letterSpacing: "2px", textTransform: "uppercase",
              fontFamily: "'Georgia', serif" }}>
              Furnishings
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "60px 20px" }}>

        {/* Success icon + heading */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ width: "70px", height: "70px", borderRadius: "50%",
            backgroundColor: "#2d6a2d", display: "flex",
            alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px", fontSize: "2rem" }}>
            ✓
          </div>
          <h1 style={{ margin: "0 0 8px", fontSize: "1.8rem",
            fontWeight: "900", color: "#1a1a1a" }}>
            Order Confirmed!
          </h1>
          <p style={{ margin: 0, color: "#7a6e68",
            fontSize: "0.95rem", fontFamily: "sans-serif" }}>
            Thank you, {order.firstName}. Your order has been placed successfully.
          </p>
        </div>

        {/* Order number + email notice */}
        <div style={{ backgroundColor: "#f9f6f2", border: "1px solid #e8e4df",
          padding: "20px", marginBottom: "24px", textAlign: "center" }}>
          <p style={{ margin: "0 0 6px", fontSize: "0.82rem",
            color: "#7a6e68", fontFamily: "sans-serif",
            letterSpacing: "1px", textTransform: "uppercase" }}>
            Order Number
          </p>
          <p style={{ margin: "0 0 14px", fontSize: "1.4rem",
            fontWeight: "900", color: "#8b7355",
            fontFamily: "'Georgia', serif", letterSpacing: "1px" }}>
            {order.orderNumber}
          </p>
          <p style={{ margin: 0, fontSize: "0.82rem",
            color: "#7a6e68", fontFamily: "sans-serif" }}>
            A confirmation has been sent to{" "}
            <strong style={{ color: "#1a1a1a" }}>{order.email}</strong>
          </p>
        </div>

        {/* Items ordered */}
        <div style={{ backgroundColor: "white", border: "1px solid #e8e4df",
          padding: "20px", marginBottom: "24px" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "0.95rem",
            fontWeight: "700", fontFamily: "sans-serif", color: "#1a1a1a" }}>
            Items Ordered
          </h3>
          {order.items.map(item => (
            <div key={item.id} style={{ display: "flex", gap: "14px",
              paddingBottom: "14px", marginBottom: "14px",
              borderBottom: "1px solid #f0ebe4",
              alignItems: "center" }}>
              <img src={item.image} alt={item.name}
                style={{ width: "64px", height: "54px",
                  objectFit: "cover", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 2px", fontSize: "0.9rem",
                  fontWeight: "700", color: "#1a1a1a",
                  fontFamily: "'Georgia', serif" }}>
                  {item.name}
                </p>
                <p style={{ margin: 0, fontSize: "0.78rem",
                  color: "#7a6e68", fontFamily: "sans-serif" }}>
                  Qty: {item.quantity}
                </p>
              </div>
              <span style={{ fontWeight: "700", fontFamily: "sans-serif",
                color: "#1a1a1a", fontSize: "0.9rem" }}>
                {formatNaira(item.price * item.quantity)}
              </span>
            </div>
          ))}

          {/* Totals */}
          <div style={{ display: "flex", justifyContent: "space-between",
            fontSize: "0.85rem", fontFamily: "sans-serif",
            color: "#5a5550", marginBottom: "8px" }}>
            <span>Delivery</span>
            <span style={{ color: deliveryCostNaira === 0 ? "#2d6a2d" : "#1a1a1a",
              fontWeight: deliveryCostNaira === 0 ? "700" : "400" }}>
              {deliveryCostNaira === 0 ? "FREE" : `₦${deliveryCostNaira.toLocaleString("en-NG")}`}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between",
            fontWeight: "700", fontSize: "1rem",
            fontFamily: "sans-serif", color: "#1a1a1a",
            paddingTop: "10px", borderTop: "1px solid #e8e4df" }}>
            <span>Total Paid</span>
            <span>₦{grandTotalNaira.toLocaleString("en-NG")}</span>
          </div>
        </div>

        {/* Delivery address */}
        <div style={{ backgroundColor: "white", border: "1px solid #e8e4df",
          padding: "20px", marginBottom: "32px" }}>
          <h3 style={{ margin: "0 0 10px", fontSize: "0.95rem",
            fontWeight: "700", fontFamily: "sans-serif", color: "#1a1a1a" }}>
            Delivering to
          </h3>
          <p style={{ margin: 0, fontSize: "0.88rem",
            color: "#5a5550", fontFamily: "sans-serif", lineHeight: 1.8 }}>
            {order.firstName}<br />
            {order.address}<br />
            {order.city}, {order.postcode}
          </p>
          <p style={{ margin: "10px 0 0", fontSize: "0.82rem",
            color: "#8b7355", fontFamily: "sans-serif", fontWeight: "600" }}>
            {order.delivery === "express"
              ? "🚀 Express delivery — arrives next business day"
              : "🚚 Standard delivery — arrives in 3-5 business days"}
          </p>
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => goTo("/")}
            style={{ flex: 1, padding: "14px",
              backgroundColor: "transparent", border: "2px solid #1a1a1a",
              fontSize: "0.88rem", fontWeight: "600",
              cursor: "pointer", fontFamily: "sans-serif" }}>
            Back to Home
          </button>
          <button onClick={() => goTo("/shop")}
            style={{ flex: 1, padding: "14px",
              backgroundColor: "#8b7355", color: "white",
              border: "none", fontSize: "0.88rem",
              fontWeight: "600", cursor: "pointer", textAlign: "center",
              fontFamily: "sans-serif" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6b5a50"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#8b7355"}>
            Continue Shopping
          </button>
        </div>

        {/* Auto-redirect notice */}
        <p style={{ margin: "16px 0 0", textAlign: "center",
          fontSize: "0.82rem", color: "#7a6e68",
          fontFamily: "sans-serif" }}>
          {secondsLeft > 0
            ? `Taking you back to the shop in ${secondsLeft} second${secondsLeft === 1 ? "" : "s"}...`
            : "Taking you back to the shop..."}
        </p>
      </div>
    </div>
  );
}