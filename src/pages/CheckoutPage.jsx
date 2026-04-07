import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatNaira } from "../utils/currency";
import Footer from "../components/Footer";

// ── Your Paystack public key ──────────────────────────────────────
// IMPORTANT: This is your TEST key — safe to use here.
// When you go live, replace with your LIVE key (pk_live_...).
// NEVER put your SECRET key (sk_test_...) in React — that stays on your backend.
const PAYSTACK_PUBLIC_KEY = "pk_test_da9bcf205759a17389cdd47a91202dbe1f66fd39";

// ── Luhn Algorithm — validates card numbers mathematically ────────
// Every real Visa, Mastercard, and Verve card passes this check.
// It catches typos and completely fake numbers instantly.
// HOW IT WORKS: Walk digits right-to-left, double every second digit,
// subtract 9 if the doubled result > 9, then sum everything.
// A valid card number produces a sum divisible by 10.
function luhnCheck(cardNumber) {
  const digits = cardNumber.replace(/\s/g, "");
  if (digits.length < 13 || digits.length > 19) return false;
  if (!/^\d+$/.test(digits)) return false; // must be all digits

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

// ── Detect card brand from first digits ───────────────────────────
// This is purely cosmetic — shows the user which card type they have.
function detectCardBrand(number) {
  const n = number.replace(/\s/g, "");
  if (/^4/.test(n))           return "Visa";
  if (/^5[1-5]/.test(n))      return "Mastercard";
  if (/^2[2-7]/.test(n))      return "Mastercard";
  if (/^(6011|65|64[4-9])/.test(n)) return "Discover";
  if (/^3[47]/.test(n))       return "Amex";
  if (/^(5061|650002|6500)/.test(n)) return "Verve"; // Nigerian card
  return null;
}

// ── Format card number with spaces every 4 digits ────────────────
function formatCardNumber(val) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

// ── Format expiry as MM/YY ────────────────────────────────────────
function formatExpiry(val) {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

// ── Step progress bar ─────────────────────────────────────────────
function StepBar({ currentStep }) {
  const steps = ["Welcome", "Delivery", "Review & Pay"];
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "28px 6%", backgroundColor: "white",
      borderBottom: "1px solid #e8e4df", flexWrap: "wrap", gap: "8px",
    }}>
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isDone = stepNum < currentStep;
        return (
          <div key={step} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.8rem", fontWeight: "700", fontFamily: "sans-serif",
                backgroundColor: isDone ? "#2d6a2d" : isActive ? "#8b7355" : "white",
                color: isDone || isActive ? "white" : "#aaa",
                border: isDone || isActive ? "none" : "2px solid #ddd",
              }}>
                {isDone ? "✓" : stepNum}
              </div>
              <span style={{
                fontSize: "0.85rem", fontFamily: "sans-serif",
                fontWeight: isActive ? "700" : "400",
                color: isActive ? "#1a1a1a" : "#aaa",
              }}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div style={{ width: "60px", borderTop: "2px dotted #ddd", margin: "0 12px" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// STEP 1 — Welcome (email + guest/account choice)
// ════════════════════════════════════════════════════════════════
function StepWelcome({ formData, setFormData, onNext }) {
  const [error, setError] = useState("");

  const handleContinue = () => {
    // Stricter regex than just checking for "@"
    // This catches missing TLD, double dots etc.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address (e.g. name@example.com).");
      return;
    }
    setError("");
    onNext();
  };

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "48px 20px" }}>
      <h2 style={{ margin: "0 0 6px", fontSize: "1.5rem", fontWeight: "900", color: "#1a1a1a", fontFamily: "'Georgia', serif" }}>
        Welcome to Secure Checkout
      </h2>
      <p style={{ margin: "0 0 32px", color: "#7a6e68", fontSize: "0.88rem", fontFamily: "sans-serif" }}>
        Your order is protected by 256-bit SSL encryption.
      </p>

      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#1a1a1a", fontFamily: "sans-serif", marginBottom: "8px" }}>
        Enter your email address
      </label>
      <input
        type="email"
        value={formData.email}
        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
        placeholder="you@example.com"
        style={{
          width: "100%", boxSizing: "border-box", padding: "13px 16px",
          border: `1.5px solid ${error ? "#8b0000" : "#c8c2bb"}`,
          fontSize: "0.9rem", fontFamily: "sans-serif", color: "#1a1a1a", outline: "none",
        }}
      />
      <p style={{ margin: "6px 0 20px", fontSize: "0.78rem", color: "#7a6e68", fontFamily: "sans-serif" }}>
        We'll send your order confirmation to this address
      </p>

      {error && (
        <p style={{ margin: "0 0 16px", color: "#8b0000", fontSize: "0.82rem", fontFamily: "sans-serif" }}>
          ⚠ {error}
        </p>
      )}

      <p style={{ margin: "0 0 10px", fontSize: "0.85rem", fontWeight: "600", color: "#1a1a1a", fontFamily: "sans-serif" }}>
        Do you have a password?
      </p>
      {["No (Continue as a guest)", "Yes"].map(option => (
        <label key={option} style={{
          display: "flex", alignItems: "center", gap: "10px",
          marginBottom: "10px", cursor: "pointer",
          fontSize: "0.88rem", fontFamily: "sans-serif", color: "#1a1a1a",
        }}>
          <input
            type="radio"
            name="guestOrAccount"
            value={option}
            checked={formData.guestOrAccount === option}
            onChange={e => setFormData(prev => ({ ...prev, guestOrAccount: e.target.value }))}
            style={{ accentColor: "#8b7355", width: "16px", height: "16px" }}
          />
          {option}
        </label>
      ))}

      <button onClick={handleContinue}
        style={{ width: "100%", padding: "15px", backgroundColor: "#8b7355", color: "white", border: "none", fontSize: "0.95rem", fontWeight: "700", letterSpacing: "1px", cursor: "pointer", marginTop: "24px", fontFamily: "sans-serif" }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6b5a50"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#8b7355"}>
        CONTINUE
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// STEP 2 — Delivery details
// ════════════════════════════════════════════════════════════════
function StepDelivery({ formData, setFormData, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!formData.firstName.trim()) e.firstName = "Required";
    if (!formData.lastName.trim())  e.lastName  = "Required";
    if (!formData.address.trim())   e.address   = "Required";
    if (!formData.city.trim())      e.city      = "Required";
    if (!formData.postcode.trim())  e.postcode  = "Required";
    return e;
  };

  const handleContinue = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({});
    onNext();
  };

  const Field = ({ label, field, placeholder, half }) => (
    <div style={{ flex: half ? "1 1 45%" : "1 1 100%" }}>
      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: "#1a1a1a", fontFamily: "sans-serif", marginBottom: "6px" }}>
        {label}
      </label>
      <input
        type="text"
        value={formData[field]}
        onChange={e => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
        placeholder={placeholder}
        style={{
          width: "100%", boxSizing: "border-box", padding: "12px 14px",
          border: `1.5px solid ${errors[field] ? "#8b0000" : "#c8c2bb"}`,
          fontSize: "0.88rem", fontFamily: "sans-serif", color: "#1a1a1a", outline: "none",
        }}
      />
      {errors[field] && <p style={{ margin: "4px 0 0", color: "#8b0000", fontSize: "0.75rem", fontFamily: "sans-serif" }}>{errors[field]}</p>}
    </div>
  );

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "48px 20px" }}>
      <h2 style={{ margin: "0 0 6px", fontSize: "1.5rem", fontWeight: "900", color: "#1a1a1a", fontFamily: "'Georgia', serif" }}>
        Delivery Details
      </h2>
      <p style={{ margin: "0 0 32px", color: "#7a6e68", fontSize: "0.88rem", fontFamily: "sans-serif" }}>
        Where should we deliver your order?
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        <Field label="First name" field="firstName" placeholder="John"            half />
        <Field label="Last name"  field="lastName"  placeholder="Smith"           half />
        <Field label="Address"    field="address"   placeholder="123 Victoria Island"  />
        <Field label="City"       field="city"      placeholder="Lagos"           half />
        <Field label="Postcode"   field="postcode"  placeholder="100001"          half />
      </div>

      <p style={{ margin: "28px 0 12px", fontSize: "0.85rem", fontWeight: "700", color: "#1a1a1a", fontFamily: "sans-serif" }}>
        Delivery method
      </p>
      {[
        { value: "standard", label: "Standard Delivery", detail: "3-5 business days", price: "FREE over ₦199,000" },
        { value: "express",  label: "Express Delivery",  detail: "Next business day",  price: "₦23,900" },
      ].map(opt => (
        <label key={opt.value} style={{
          display: "flex", alignItems: "center", gap: "12px", padding: "14px", marginBottom: "10px",
          border: `1.5px solid ${formData.delivery === opt.value ? "#8b7355" : "#e8e4df"}`,
          backgroundColor: formData.delivery === opt.value ? "#f9f6f2" : "white", cursor: "pointer",
        }}>
          <input type="radio" name="delivery" value={opt.value}
            checked={formData.delivery === opt.value}
            onChange={e => setFormData(prev => ({ ...prev, delivery: e.target.value }))}
            style={{ accentColor: "#8b7355" }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: "600", fontSize: "0.88rem", fontFamily: "sans-serif", color: "#1a1a1a" }}>{opt.label}</span>
            <span style={{ fontSize: "0.78rem", color: "#7a6e68", fontFamily: "sans-serif", marginLeft: "8px" }}>{opt.detail}</span>
          </div>
          <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#8b7355", fontFamily: "sans-serif" }}>{opt.price}</span>
        </label>
      ))}

      <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
        <button onClick={onBack}
          style={{ flex: 1, padding: "14px", backgroundColor: "transparent", border: "2px solid #1a1a1a", fontSize: "0.88rem", fontWeight: "600", cursor: "pointer", fontFamily: "sans-serif" }}>
          ← Back
        </button>
        <button onClick={handleContinue}
          style={{ flex: 2, padding: "14px", backgroundColor: "#8b7355", color: "white", border: "none", fontSize: "0.95rem", fontWeight: "700", letterSpacing: "1px", cursor: "pointer", fontFamily: "sans-serif" }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6b5a50"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#8b7355"}>
          CONTINUE
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// STEP 3 — Review & Pay (Paystack + Luhn)
// ════════════════════════════════════════════════════════════════
function StepReview({ formData, onBack, onPlaceOrder }) {
  const { cartItems, totalPrice } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState("");

  const USD_TO_NGN    = 1600;
  const totalNaira    = totalPrice * USD_TO_NGN;
  const deliveryCost  = formData.delivery === "express"
    ? 23900
    : totalNaira >= 199000 ? 0 : 15900;
  const grandTotalNaira = Math.round(totalNaira + deliveryCost);

  const handlePay = async () => {
    setError("");
    setIsLoading(true);

    try {
      const PaystackPop = (await import("@paystack/inline-js")).default;
      const paystack = new PaystackPop();

      paystack.newTransaction({
        key:      PAYSTACK_PUBLIC_KEY,
        email:    formData.email,
        amount:   grandTotalNaira * 100, // kobo
        currency: "NGN",
        metadata: {
          custom_fields: [
            { display_name: "Customer",  variable_name: "customer",  value: `${formData.firstName} ${formData.lastName}` },
            { display_name: "Address",   variable_name: "address",   value: `${formData.address}, ${formData.city}` },
          ],
        },

        onSuccess: (transaction) => {
          setIsLoading(false);
          onPlaceOrder(transaction.reference);
        },

        onCancel: () => {
          setIsLoading(false);
          setError("Payment was cancelled. Click the button below to try again.");
        },
      });

    } catch (err) {
      setIsLoading(false);
      setError("Could not connect to payment provider. Please try again.");
      console.error("Paystack error:", err);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "48px 20px" }}>
      <h2 style={{ margin: "0 0 8px", fontSize: "1.5rem", fontWeight: "900",
        color: "#1a1a1a", fontFamily: "'Georgia', serif" }}>
        Review & Pay
      </h2>
      <p style={{ margin: "0 0 28px", color: "#7a6e68",
        fontSize: "0.88rem", fontFamily: "sans-serif" }}>
        Check your order then choose how you want to pay.
      </p>

      {/* ── Order summary ── */}
      <div style={{ backgroundColor: "white", border: "1px solid #e8e4df",
        padding: "20px", marginBottom: "20px" }}>
        <h3 style={{ margin: "0 0 14px", fontSize: "0.95rem",
          fontWeight: "700", fontFamily: "sans-serif", color: "#1a1a1a" }}>
          Order Summary
        </h3>
        {cartItems.map(item => (
          <div key={item.id} style={{
            display: "flex", gap: "14px", alignItems: "center",
            padding: "10px 0", borderBottom: "1px solid #f4f0eb",
          }}>
            <img src={item.image} alt={item.name}
              style={{ width: "52px", height: "44px",
                objectFit: "cover", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 2px", fontSize: "0.88rem",
                fontWeight: "600", color: "#1a1a1a",
                fontFamily: "sans-serif" }}>
                {item.name}
              </p>
              <p style={{ margin: 0, fontSize: "0.78rem",
                color: "#7a6e68", fontFamily: "sans-serif" }}>
                Qty: {item.quantity}
              </p>
            </div>
            <span style={{ fontWeight: "600", fontFamily: "sans-serif",
              fontSize: "0.88rem", color: "#1a1a1a" }}>
              {formatNaira(item.price * item.quantity)}
            </span>
          </div>
        ))}

        {/* Totals */}
        <div style={{ paddingTop: "14px", display: "flex",
          flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between",
            fontSize: "0.85rem", fontFamily: "sans-serif", color: "#5a5550" }}>
            <span>Delivery</span>
            <span style={{ color: deliveryCost === 0 ? "#2d6a2d" : "#1a1a1a",
              fontWeight: deliveryCost === 0 ? "700" : "400" }}>
              {deliveryCost === 0 ? "FREE" : `₦${deliveryCost.toLocaleString("en-NG")}`}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between",
            fontWeight: "700", fontSize: "1.05rem",
            fontFamily: "sans-serif", color: "#1a1a1a",
            paddingTop: "8px", borderTop: "1px solid #e8e4df" }}>
            <span>Total</span>
            <span style={{ color: "#8b7355" }}>
              ₦{grandTotalNaira.toLocaleString("en-NG")}
            </span>
          </div>
        </div>
      </div>

      {/* ── Delivery address summary ── */}
      <div style={{ backgroundColor: "white", border: "1px solid #e8e4df",
        padding: "20px", marginBottom: "20px" }}>
        <h3 style={{ margin: "0 0 10px", fontSize: "0.95rem",
          fontWeight: "700", fontFamily: "sans-serif", color: "#1a1a1a" }}>
          Delivering to
        </h3>
        <p style={{ margin: 0, fontSize: "0.88rem",
          color: "#5a5550", fontFamily: "sans-serif", lineHeight: 1.7 }}>
          {formData.firstName} {formData.lastName}<br />
          {formData.address}<br />
          {formData.city}, {formData.postcode}
        </p>
        <button onClick={onBack}
          style={{ marginTop: "10px", background: "none", border: "none",
            color: "#8b7355", cursor: "pointer", fontSize: "0.82rem",
            fontFamily: "sans-serif", textDecoration: "underline",
            padding: 0 }}>
          Edit delivery details
        </button>
      </div>

      {/* ── Payment options info ── */}
      <div style={{ backgroundColor: "#f9f6f2", border: "1px solid #e8e4df",
        padding: "16px 20px", marginBottom: "20px",
        display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>💳</span>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: "0.85rem",
            fontWeight: "700", color: "#1a1a1a", fontFamily: "sans-serif" }}>
            Multiple payment options available
          </p>
          <p style={{ margin: 0, fontSize: "0.8rem",
            color: "#7a6e68", fontFamily: "sans-serif", lineHeight: 1.6 }}>
            Pay with card, bank transfer, USSD, or mobile money.
            Your payment is secured by Paystack.
          </p>
        </div>
      </div>

      {/* ── Error message ── */}
      {error && (
        <div style={{ padding: "12px 16px", backgroundColor: "#fff0f0",
          border: "1px solid #f5c0c0", marginBottom: "16px" }}>
          <p style={{ margin: 0, color: "#8b0000",
            fontSize: "0.85rem", fontFamily: "sans-serif" }}>
            ⚠ {error}
          </p>
        </div>
      )}

      {/* ── Buttons ── */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button onClick={onBack} disabled={isLoading}
          style={{ flex: 1, padding: "14px", backgroundColor: "transparent",
            border: "2px solid #1a1a1a", fontSize: "0.88rem",
            fontWeight: "600", cursor: "pointer",
            fontFamily: "sans-serif", opacity: isLoading ? 0.5 : 1 }}>
          ← Back
        </button>
        <button
          onClick={handlePay}
          disabled={isLoading}
          style={{
            flex: 2, padding: "14px",
            backgroundColor: isLoading ? "#aaa" : "#2d6a2d",
            color: "white", border: "none", fontSize: "0.95rem",
            fontWeight: "700", letterSpacing: "1px",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontFamily: "sans-serif",
            display: "flex", alignItems: "center",
            justifyContent: "center", gap: "8px",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={e => { if (!isLoading) e.currentTarget.style.backgroundColor = "#1e4e1e"; }}
          onMouseLeave={e => { if (!isLoading) e.currentTarget.style.backgroundColor = isLoading ? "#aaa" : "#2d6a2d"; }}
        >
          {isLoading ? (
            <>
              <span style={{ animation: "spin 1s linear infinite",
                display: "inline-block" }}>⟳</span>
              Opening payment...
            </>
          ) : (
            <>🔒 Pay ₦{grandTotalNaira.toLocaleString("en-NG")}</>
          )}
        </button>
      </div>

      <p style={{ margin: "14px 0 0", textAlign: "center",
        fontSize: "0.75rem", color: "#9a9088", fontFamily: "sans-serif" }}>
        🔒 Secured by Paystack · Card · Bank Transfer · USSD · Mobile Money
      </p>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// MAIN CHECKOUT PAGE — manages all 3 steps + shared form state
// ════════════════════════════════════════════════════════════════
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // currentStep is the ONE piece of state that controls everything visible
  // Think of it as a TV remote — same screen, different channel
  const [currentStep, setCurrentStep] = useState(1);

  // ALL form data lives here in the parent — never inside individual steps.
  // This is "lifting state up": steps read and update it via props.
  // This means going Back from step 2 to step 1 never loses your email.
  const [formData, setFormData] = useState({
    email:          "",
    guestOrAccount: "No (Continue as a guest)",
    firstName:      "",
    lastName:       "",
    address:        "",
    city:           "",
    postcode:       "",
    delivery:       "standard",
  });

  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#eae6e1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif", gap: "16px" }}>
        <h2 style={{ margin: 0 }}>Your basket is empty</h2>
        <button onClick={() => navigate("/shop")}
          style={{ padding: "13px 36px", backgroundColor: "#8b7355", color: "white", border: "none", cursor: "pointer", fontFamily: "sans-serif", fontSize: "0.9rem" }}>
          Browse Furniture
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (paystackReference) => {
  const orderNumber = "AHF-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const token = getToken(); // from useAuth

  const orderData = {
    orderNumber,
    paystackRef:  paystackReference,
    email:        formData.email,
    firstName:    formData.firstName,
    address:      formData.address,
    city:         formData.city,
    postcode:     formData.postcode,
    delivery:     formData.delivery,
    items:        cartItems.map(item => ({
      name:     item.name,
      price:    item.price,
      quantity: item.quantity,
      image:    item.image,
    })),
    total: cartItems.reduce((s, i) => s + i.price * i.quantity, 0),
  };

  // Save order to backend if user is logged in
  // If guest, we skip saving and just show the confirmation
  if (token) {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/orders`, {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
    } catch (err) {
      console.error("Could not save order:", err);
      // Don't block the user — order still shows on confirmation page
    }
  }

  navigate("/order-confirmed", { state: orderData });
};

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#eae6e1", display: "flex", flexDirection: "column" }}>

      {/* Checkout header — simplified navbar with just logo + lock */}
      <div style={{
        backgroundColor: "white", padding: isMobile ? "14px 5%" : "16px 6%",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid #e8e4df",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
          onClick={() => navigate("/")}>
          <div style={{ width: "38px", height: "38px", backgroundColor: "#8b7355", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: "900", fontSize: "0.95rem", color: "#1a1a1a", fontFamily: "'Georgia', serif" }}>Apex Home</div>
            <div style={{ fontSize: "0.58rem", color: "#8b7355", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Georgia', serif" }}>Furnishings</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#7a6e68", fontSize: "0.82rem", fontFamily: "sans-serif" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b7355" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Secure Checkout
        </div>
      </div>

      {/* Step indicator */}
      <StepBar currentStep={currentStep} />

      {/* Render correct step */}
      <div style={{ flex: 1 }}>
        {currentStep === 1 && (
          <StepWelcome
            formData={formData}
            setFormData={setFormData}
            onNext={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 2 && (
          <StepDelivery
            formData={formData}
            setFormData={setFormData}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && (
          <StepReview
            formData={formData}
            onBack={() => setCurrentStep(2)}
            onPlaceOrder={handlePlaceOrder}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}