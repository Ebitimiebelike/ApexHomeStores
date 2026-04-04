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

  // Delivery cost in Naira
  const USD_TO_NGN = 1600;
  const totalNaira = totalPrice * USD_TO_NGN;
  const deliveryCost = formData.delivery === "express"
    ? 23900
    : totalNaira >= 199000 ? 0 : 15900;
  const grandTotalNaira = Math.round(totalNaira + deliveryCost);

  // Card state
  const [cardNumber, setCardNumber] = useState("");
  const [expiry,     setExpiry]     = useState("");
  const [cvv,        setCvv]        = useState("");
  const [cardName,   setCardName]   = useState("");
  const [cardError,  setCardError]  = useState("");
  const [isLoading,  setIsLoading]  = useState(false);

  // Live card brand detection as user types
  const cardBrand = detectCardBrand(cardNumber);

  // Live Luhn feedback — only show once 16 digits are entered
  const rawDigits = cardNumber.replace(/\s/g, "");
  const luhnValid = rawDigits.length >= 13 ? luhnCheck(rawDigits) : null;

  // ── Paystack handler ────────────────────────────────────────────
  // HOW PAYSTACK WORKS:
  // 1. We import PaystackPop from the package you installed
  // 2. We create a new transaction with your public key + amount in kobo
  //    (Naira × 100 = kobo, e.g. ₦1,500 = 150,000 kobo)
  // 3. Paystack opens its own secure popup — their servers handle the card
  //    This means card details NEVER touch your code at all
  // 4. On success, Paystack gives you a `reference` string
  //    In production: send this reference to your backend to verify
  //    Your backend calls Paystack's /verify endpoint using your SECRET key
  const handlePaystackPayment = async () => {
    setCardError("");

    // Validate card fields before opening Paystack
    if (!cardName.trim()) {
      setCardError("Please enter the name on the card.");
      return;
    }
    if (rawDigits.length < 16) {
      setCardError("Please enter a valid 16-digit card number.");
      return;
    }
    if (!luhnCheck(rawDigits)) {
      setCardError("This card number is not valid. Please check and try again.");
      return;
    }
    if (expiry.length < 5) {
      setCardError("Please enter a valid expiry date (MM/YY).");
      return;
    }
    if (cvv.length < 3) {
      setCardError("Please enter a valid CVV (3 digits).");
      return;
    }

    setIsLoading(true);

    try {
      // Dynamically import Paystack — this loads the library only when needed
      // This is better than importing at the top because Paystack's script
      // is large and we only need it at payment time
      const PaystackPop = (await import("@paystack/inline-js")).default;
      const paystack = new PaystackPop();

      paystack.newTransaction({
        key:    PAYSTACK_PUBLIC_KEY,
        email:  formData.email,
        amount: grandTotalNaira * 100,        // Convert Naira → kobo (×100)
        currency: "NGN",

        // Transaction metadata — useful for your records
        metadata: {
          custom_fields: [
            { display_name: "Customer Name",    variable_name: "customer_name",    value: `${formData.firstName} ${formData.lastName}` },
            { display_name: "Delivery Address", variable_name: "delivery_address", value: `${formData.address}, ${formData.city}` },
          ],
        },

        // ── SUCCESS: Paystack closed after successful payment ───────
        // `transaction` contains: reference, status, trans, trxref
        // PRODUCTION TODO: Send transaction.reference to your backend
        // Your backend calls: GET https://api.paystack.co/transaction/verify/{reference}
        // with Authorization: Bearer YOUR_SECRET_KEY
        // Only mark the order as paid after backend verification
        onSuccess: (transaction) => {
          setIsLoading(false);
          console.log("✅ Payment successful. Reference:", transaction.reference);
          // Pass the reference along so the confirmation page can show it
          onPlaceOrder(transaction.reference);
        },

        // ── CANCEL: User closed the Paystack popup ─────────────────
        onCancel: () => {
          setIsLoading(false);
          setCardError("Payment was cancelled. You can try again.");
        },
      });

    } catch (err) {
      setIsLoading(false);
      setCardError("Could not connect to payment provider. Please try again.");
      console.error("Paystack error:", err);
    }
  };

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "48px 20px" }}>
      <h2 style={{ margin: "0 0 32px", fontSize: "1.5rem", fontWeight: "900", color: "#1a1a1a", fontFamily: "'Georgia', serif" }}>
        Review & Pay
      </h2>

      {/* Order summary */}
      <div style={{ backgroundColor: "#f9f6f2", padding: "20px", marginBottom: "28px", border: "1px solid #e8e4df" }}>
        <h3 style={{ margin: "0 0 14px", fontSize: "0.95rem", fontWeight: "700", fontFamily: "sans-serif", color: "#1a1a1a" }}>
          Order Summary
        </h3>
        {cartItems.map(item => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #e8e4df", fontSize: "0.85rem", fontFamily: "sans-serif", color: "#5a5550" }}>
            <span>{item.name} × {item.quantity}</span>
            <span>{formatNaira(item.price * item.quantity)}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "12px", fontSize: "0.85rem", fontFamily: "sans-serif", color: "#5a5550" }}>
          <span>Delivery</span>
          <span style={{ color: deliveryCost === 0 ? "#2d6a2d" : "#1a1a1a", fontWeight: deliveryCost === 0 ? "700" : "400" }}>
            {deliveryCost === 0 ? "FREE" : formatNaira(deliveryCost / 1600)}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px", fontWeight: "700", fontSize: "1rem", fontFamily: "sans-serif", color: "#1a1a1a" }}>
          <span>Total</span>
          <span style={{ color: "#8b7355" }}>₦{grandTotalNaira.toLocaleString("en-NG")}</span>
        </div>
      </div>

      {/* Delivery address summary */}
      <div style={{ marginBottom: "28px" }}>
        <h3 style={{ margin: "0 0 8px", fontSize: "0.95rem", fontWeight: "700", fontFamily: "sans-serif", color: "#1a1a1a" }}>
          Delivering to
        </h3>
        <p style={{ margin: 0, fontSize: "0.88rem", color: "#5a5550", fontFamily: "sans-serif", lineHeight: 1.7 }}>
          {formData.firstName} {formData.lastName}<br />
          {formData.address}<br />
          {formData.city}, {formData.postcode}
        </p>
      </div>

      {/* ── Card details ──────────────────────────────────────────── */}
      {/* NOTE: In production, Paystack's popup handles card entry securely.
          These fields are for display/validation only — we validate before
          opening the Paystack popup, but Paystack re-collects card info
          in their own secure iframe so your server never sees card numbers. */}
      <h3 style={{ margin: "0 0 16px", fontSize: "0.95rem", fontWeight: "700", fontFamily: "sans-serif", color: "#1a1a1a" }}>
        Card Details
      </h3>

      <div style={{ backgroundColor: "#f9f6f2", border: "1px solid #e8e4df", padding: "20px", marginBottom: "20px" }}>
        <p style={{ margin: "0 0 14px", fontSize: "0.78rem", color: "#7a6e68", fontFamily: "sans-serif", lineHeight: 1.6 }}>
          🔒 Your card details are processed securely by Paystack. We never store your card number.
        </p>

        {/* Name on card */}
        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", fontFamily: "sans-serif", color: "#1a1a1a", marginBottom: "6px" }}>
            Name on card
          </label>
          <input
            value={cardName}
            onChange={e => setCardName(e.target.value)}
            placeholder="John Smith"
            style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", border: "1.5px solid #c8c2bb", fontSize: "0.9rem", fontFamily: "sans-serif", outline: "none" }}
          />
        </div>

        {/* Card number with live Luhn feedback */}
        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", fontFamily: "sans-serif", color: "#1a1a1a", marginBottom: "6px" }}>
            Card Number
            {/* Show card brand once detected */}
            {cardBrand && (
              <span style={{ marginLeft: "8px", fontSize: "0.75rem", color: "#8b7355", fontWeight: "600" }}>
                {cardBrand === "Visa" ? "💳 Visa" :
                 cardBrand === "Mastercard" ? "💳 Mastercard" :
                 cardBrand === "Verve" ? "💳 Verve" : `💳 ${cardBrand}`}
              </span>
            )}
          </label>
          <div style={{ position: "relative" }}>
            <input
              value={cardNumber}
              onChange={e => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              style={{
                width: "100%", boxSizing: "border-box", padding: "12px 44px 12px 14px",
                border: `1.5px solid ${
                  luhnValid === null ? "#c8c2bb" :
                  luhnValid ? "#2d6a2d" : "#8b0000"
                }`,
                fontSize: "0.9rem", fontFamily: "sans-serif",
                letterSpacing: "1px", outline: "none",
              }}
            />
            {/* Live tick/cross as the user types */}
            {luhnValid !== null && (
              <span style={{
                position: "absolute", right: "12px", top: "50%",
                transform: "translateY(-50%)",
                fontSize: "1rem",
                color: luhnValid ? "#2d6a2d" : "#8b0000",
              }}>
                {luhnValid ? "✓" : "✗"}
              </span>
            )}
          </div>
          {/* Explain invalid Luhn immediately — don't wait for submit */}
          {luhnValid === false && (
            <p style={{ margin: "4px 0 0", color: "#8b0000", fontSize: "0.75rem", fontFamily: "sans-serif" }}>
              This card number doesn't look valid. Please double-check it.
            </p>
          )}
        </div>

        {/* Expiry + CVV side by side */}
        <div style={{ display: "flex", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", fontFamily: "sans-serif", color: "#1a1a1a", marginBottom: "6px" }}>
              Expiry Date
            </label>
            <input
              value={expiry}
              onChange={e => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY"
              maxLength={5}
              style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", border: "1.5px solid #c8c2bb", fontSize: "0.9rem", fontFamily: "sans-serif", outline: "none" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", fontFamily: "sans-serif", color: "#1a1a1a", marginBottom: "6px" }}>
              CVV
              <span style={{ marginLeft: "4px", fontSize: "0.72rem", color: "#7a6e68", fontWeight: "400" }}>(3 digits on back)</span>
            </label>
            <input
              value={cvv}
              onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
              placeholder="123"
              maxLength={3}
              type="password"
              style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", border: "1.5px solid #c8c2bb", fontSize: "0.9rem", fontFamily: "sans-serif", outline: "none" }}
            />
          </div>
        </div>

        {/* Test card hint — remove this in production */}
        <div style={{ marginTop: "14px", padding: "10px 14px", backgroundColor: "#fff8e1", border: "1px solid #ffe082", borderRadius: "3px" }}>
          <p style={{ margin: 0, fontSize: "0.75rem", fontFamily: "sans-serif", color: "#5a4a00" }}>
            <strong>🧪 Test mode:</strong> Use Paystack test card <code>4084084084084081</code>, expiry <code>01/99</code>, CVV <code>408</code>, PIN <code>0000</code>
          </p>
        </div>
      </div>

      {/* Error message */}
      {cardError && (
        <p style={{ margin: "0 0 16px", color: "#8b0000", fontSize: "0.85rem", fontFamily: "sans-serif", padding: "10px", backgroundColor: "#fff0f0", border: "1px solid #f5c0c0" }}>
          ⚠ {cardError}
        </p>
      )}

      {/* Buttons */}
      <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
        <button onClick={onBack} disabled={isLoading}
          style={{ flex: 1, padding: "14px", backgroundColor: "transparent", border: "2px solid #1a1a1a", fontSize: "0.88rem", fontWeight: "600", cursor: "pointer", fontFamily: "sans-serif", opacity: isLoading ? 0.5 : 1 }}>
          ← Back
        </button>
        <button
          onClick={handlePaystackPayment}
          disabled={isLoading || luhnValid === false}
          style={{
            flex: 2, padding: "14px",
            backgroundColor: isLoading ? "#aaa" : luhnValid === false ? "#ccc" : "#2d6a2d",
            color: "white", border: "none", fontSize: "0.95rem",
            fontWeight: "700", letterSpacing: "1px",
            cursor: isLoading || luhnValid === false ? "not-allowed" : "pointer",
            fontFamily: "sans-serif", transition: "background-color 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          }}
          onMouseEnter={e => { if (!isLoading && luhnValid !== false) e.currentTarget.style.backgroundColor = "#1e4e1e"; }}
          onMouseLeave={e => { if (!isLoading && luhnValid !== false) e.currentTarget.style.backgroundColor = "#2d6a2d"; }}
        >
          {isLoading ? (
            <>
              <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span>
              Processing...
            </>
          ) : (
            <>🔒 PAY ₦{grandTotalNaira.toLocaleString("en-NG")}</>
          )}
        </button>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
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

  const handlePlaceOrder = (paystackReference) => {
    const orderNumber = "AHF-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate("/order-confirmed", {
      state: {
        orderNumber,
        paystackReference,         // Store Paystack ref for display
        email:     formData.email,
        firstName: formData.firstName,
        address:   formData.address,
        city:      formData.city,
        postcode:  formData.postcode,
        delivery:  formData.delivery,
        items:     cartItems,
        total:     cartItems.reduce((s, i) => s + i.price * i.quantity, 0),
      },
    });
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