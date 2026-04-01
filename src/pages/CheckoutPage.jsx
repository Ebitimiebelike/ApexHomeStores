import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

// ── Step indicator at the top ─────────────────────────────────
function StepBar({ currentStep }) {
  const steps = ["Welcome", "Delivery", "Review & Pay"];

  return (
    <div style={{
      display: "flex", alignItems: "center",
      justifyContent: "center", padding: "28px 6%",
      backgroundColor: "white", borderBottom: "1px solid #e8e4df",
    }}>
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isDone = stepNum < currentStep;

        return (
          <div key={step} style={{ display: "flex", alignItems: "center" }}>

            {/* Circle + label */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.8rem", fontWeight: "700", fontFamily: "sans-serif",
                backgroundColor: isDone ? "#8b7355" : isActive ? "#8b7355" : "white",
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

            {/* Dotted line between steps */}
            {index < steps.length - 1 && (
              <div style={{
                width: "80px", borderTop: "2px dotted #ddd",
                margin: "0 16px",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── STEP 1: Welcome ───────────────────────────────────────────
function StepWelcome({ formData, setFormData, onNext }) {
  const [error, setError] = useState("");

  const handleContinue = () => {
    // Basic validation — don't proceed if email is empty or invalid
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    onNext(); // move to step 2
  };

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "48px 20px" }}>
      <h2 style={{ margin: "0 0 6px", fontSize: "1.5rem",
        fontWeight: "900", color: "#1a1a1a", fontFamily: "'Georgia', serif" }}>
        Welcome to Secure Checkout
      </h2>
      <p style={{ margin: "0 0 32px", color: "#7a6e68",
        fontSize: "0.88rem", fontFamily: "sans-serif" }}>
        Your order is protected by 256-bit SSL encryption.
      </p>

      {/* Email input */}
      <label style={{ display: "block", fontSize: "0.85rem",
        fontWeight: "600", color: "#1a1a1a",
        fontFamily: "sans-serif", marginBottom: "8px" }}>
        Enter your email address
      </label>
      <input
        type="email"
        value={formData.email}
        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
        placeholder="you@example.com"
        style={{
          width: "100%", boxSizing: "border-box",
          padding: "13px 16px", border: "1.5px solid #c8c2bb",
          fontSize: "0.9rem", fontFamily: "sans-serif",
          color: "#1a1a1a", outline: "none",
          borderColor: error ? "#8b0000" : "#c8c2bb",
        }}
      />
      <p style={{ margin: "6px 0 20px", fontSize: "0.78rem",
        color: "#7a6e68", fontFamily: "sans-serif" }}>
        We'll send your order confirmation to this address
      </p>

      {/* Error message */}
      {error && (
        <p style={{ margin: "0 0 16px", color: "#8b0000",
          fontSize: "0.82rem", fontFamily: "sans-serif" }}>
          {error}
        </p>
      )}

      {/* Guest vs account */}
      <p style={{ margin: "0 0 10px", fontSize: "0.85rem",
        fontWeight: "600", color: "#1a1a1a", fontFamily: "sans-serif" }}>
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

      <button
        onClick={handleContinue}
        style={{
          width: "100%", padding: "15px",
          backgroundColor: "#8b7355", color: "white",
          border: "none", fontSize: "0.95rem",
          fontWeight: "700", letterSpacing: "1px",
          cursor: "pointer", marginTop: "24px",
          fontFamily: "sans-serif", transition: "background-color 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6b5a50"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#8b7355"}
      >
        CONTINUE
      </button>
    </div>
  );
}

// ── STEP 2: Delivery ──────────────────────────────────────────
function DeliveryField({ label, field, placeholder, half, formData, setFormData, errors }) {
  return (
    <div style={{ flex: half ? "1 1 45%" : "1 1 100%" }}>
      <label style={{ display: "block", fontSize: "0.82rem",
        fontWeight: "600", color: "#1a1a1a",
        fontFamily: "sans-serif", marginBottom: "6px" }}>
        {label}
      </label>
      <input
        type="text"
        value={formData[field]}
        onChange={e => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
        placeholder={placeholder}
        style={{
          width: "100%", boxSizing: "border-box",
          padding: "12px 14px", border: "1.5px solid",
          borderColor: errors[field] ? "#8b0000" : "#c8c2bb",
          fontSize: "0.88rem", fontFamily: "sans-serif",
          color: "#1a1a1a", outline: "none",
        }}
      />
      {errors[field] && (
        <p style={{ margin: "4px 0 0", color: "#8b0000",
          fontSize: "0.75rem", fontFamily: "sans-serif" }}>
          {errors[field]}
        </p>
      )}
    </div>
  );
}

function StepDelivery({ formData, setFormData, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim())  newErrors.lastName  = "Required";
    if (!formData.address.trim())   newErrors.address   = "Required";
    if (!formData.city.trim())      newErrors.city      = "Required";
    if (!formData.postcode.trim())  newErrors.postcode  = "Required";
    return newErrors;
  };

  const handleContinue = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    onNext();
  };

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "48px 20px" }}>
      <h2 style={{ margin: "0 0 6px", fontSize: "1.5rem",
        fontWeight: "900", color: "#1a1a1a", fontFamily: "'Georgia', serif" }}>
        Delivery Details
      </h2>
      <p style={{ margin: "0 0 32px", color: "#7a6e68",
        fontSize: "0.88rem", fontFamily: "sans-serif" }}>
        Where should we deliver your order?
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        <DeliveryField label="First name"   field="firstName" placeholder="John"           half formData={formData} setFormData={setFormData} errors={errors} />
        <DeliveryField label="Last name"    field="lastName"  placeholder="Smith"          half formData={formData} setFormData={setFormData} errors={errors} />
        <DeliveryField label="Address"      field="address"   placeholder="123 High Street"     formData={formData} setFormData={setFormData} errors={errors} />
        <DeliveryField label="City"         field="city"      placeholder="London"         half formData={formData} setFormData={setFormData} errors={errors} />
        <DeliveryField label="Postcode"     field="postcode"  placeholder="SW1A 1AA"       half formData={formData} setFormData={setFormData} errors={errors} />
      </div>

      {/* Delivery method */}
      <p style={{ margin: "28px 0 12px", fontSize: "0.85rem",
        fontWeight: "700", color: "#1a1a1a", fontFamily: "sans-serif" }}>
        Delivery method
      </p>
      {[
        { value: "standard", label: "Standard Delivery", detail: "3-5 business days", price: "FREE over $199" },
        { value: "express",  label: "Express Delivery",  detail: "Next business day",  price: "$14.99" },
      ].map(opt => (
        <label key={opt.value} style={{
          display: "flex", alignItems: "center", gap: "12px",
          padding: "14px", marginBottom: "10px",
          border: `1.5px solid ${formData.delivery === opt.value ? "#8b7355" : "#e8e4df"}`,
          backgroundColor: formData.delivery === opt.value ? "#f9f6f2" : "white",
          cursor: "pointer",
        }}>
          <input
            type="radio" name="delivery" value={opt.value}
            checked={formData.delivery === opt.value}
            onChange={e => setFormData(prev => ({ ...prev, delivery: e.target.value }))}
            style={{ accentColor: "#8b7355" }}
          />
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: "600", fontSize: "0.88rem",
              fontFamily: "sans-serif", color: "#1a1a1a" }}>
              {opt.label}
            </span>
            <span style={{ fontSize: "0.78rem", color: "#7a6e68",
              fontFamily: "sans-serif", marginLeft: "8px" }}>
              {opt.detail}
            </span>
          </div>
          <span style={{ fontSize: "0.85rem", fontWeight: "700",
            color: "#8b7355", fontFamily: "sans-serif" }}>
            {opt.price}
          </span>
        </label>
      ))}

      {/* Buttons */}
      <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
        <button onClick={onBack}
          style={{ flex: 1, padding: "14px", backgroundColor: "transparent",
            border: "2px solid #1a1a1a", fontSize: "0.88rem",
            fontWeight: "600", cursor: "pointer", fontFamily: "sans-serif" }}>
          ← Back
        </button>
        <button onClick={handleContinue}
          style={{ flex: 2, padding: "14px", backgroundColor: "#8b7355",
            color: "white", border: "none", fontSize: "0.95rem",
            fontWeight: "700", letterSpacing: "1px", cursor: "pointer",
            fontFamily: "sans-serif" }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6b5a50"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#8b7355"}>
          CONTINUE
        </button>
      </div>
    </div>
  );
}

// ── STEP 3: Review & Pay ──────────────────────────────────────
function StepReview({ formData, onBack, onPlaceOrder }) {
  const { cartItems, totalPrice } = useCart();
  const deliveryCost = formData.delivery === "express" ? 14.99 : totalPrice >= 199 ? 0 : 19.99;
  const grandTotal = (totalPrice + deliveryCost).toFixed(2);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry]         = useState("");
  const [cvv, setCvv]               = useState("");
  const [cardError, setCardError]   = useState("");

  const handlePay = () => {
    if (cardNumber.replace(/\s/g, "").length < 16) {
      setCardError("Please enter a valid 16-digit card number.");
      return;
    }
    if (expiry.length < 5) {
      setCardError("Please enter a valid expiry date (MM/YY).");
      return;
    }
    if (cvv.length < 3) {
      setCardError("Please enter a valid CVV.");
      return;
    }
    setCardError("");
    onPlaceOrder();
  };

  // Auto-format card number as user types: 1234 5678 9012 3456
  const formatCard = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  // Auto-format expiry as MM/YY
  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "48px 20px" }}>
      <h2 style={{ margin: "0 0 32px", fontSize: "1.5rem",
        fontWeight: "900", color: "#1a1a1a", fontFamily: "'Georgia', serif" }}>
        Review & Pay
      </h2>

      {/* Order summary */}
      <div style={{ backgroundColor: "#f9f6f2", padding: "20px",
        marginBottom: "28px", border: "1px solid #e8e4df" }}>
        <h3 style={{ margin: "0 0 14px", fontSize: "0.95rem",
          fontWeight: "700", fontFamily: "sans-serif", color: "#1a1a1a" }}>
          Order Summary
        </h3>
        {cartItems.map(item => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between",
            padding: "8px 0", borderBottom: "1px solid #e8e4df",
            fontSize: "0.85rem", fontFamily: "sans-serif", color: "#5a5550" }}>
            <span>{item.name} × {item.quantity}</span>
            <span>${item.price * item.quantity}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between",
          paddingTop: "12px", fontSize: "0.85rem",
          fontFamily: "sans-serif", color: "#5a5550" }}>
          <span>Delivery</span>
          <span>{deliveryCost === 0 ? "FREE" : `$${deliveryCost}`}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between",
          paddingTop: "10px", fontWeight: "700",
          fontSize: "1rem", fontFamily: "sans-serif", color: "#1a1a1a" }}>
          <span>Total</span>
          <span>${grandTotal}</span>
        </div>
      </div>

      {/* Delivery address summary */}
      <div style={{ marginBottom: "28px" }}>
        <h3 style={{ margin: "0 0 8px", fontSize: "0.95rem",
          fontWeight: "700", fontFamily: "sans-serif", color: "#1a1a1a" }}>
          Delivering to
        </h3>
        <p style={{ margin: 0, fontSize: "0.88rem",
          color: "#5a5550", fontFamily: "sans-serif", lineHeight: 1.7 }}>
          {formData.firstName} {formData.lastName}<br />
          {formData.address}<br />
          {formData.city}, {formData.postcode}
        </p>
      </div>

      {/* Payment fields */}
      <h3 style={{ margin: "0 0 16px", fontSize: "0.95rem",
        fontWeight: "700", fontFamily: "sans-serif", color: "#1a1a1a" }}>
        Payment Details
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.82rem",
            fontWeight: "600", fontFamily: "sans-serif",
            color: "#1a1a1a", marginBottom: "6px" }}>
            Card Number
          </label>
          <input
            value={cardNumber}
            onChange={e => setCardNumber(formatCard(e.target.value))}
            placeholder="1234 5678 9012 3456"
            style={{ width: "100%", boxSizing: "border-box",
              padding: "12px 14px", border: "1.5px solid #c8c2bb",
              fontSize: "0.9rem", fontFamily: "sans-serif",
              letterSpacing: "1px", outline: "none" }}
          />
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: "0.82rem",
              fontWeight: "600", fontFamily: "sans-serif",
              color: "#1a1a1a", marginBottom: "6px" }}>
              Expiry Date
            </label>
            <input
              value={expiry}
              onChange={e => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY"
              style={{ width: "100%", boxSizing: "border-box",
                padding: "12px 14px", border: "1.5px solid #c8c2bb",
                fontSize: "0.9rem", fontFamily: "sans-serif", outline: "none" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: "0.82rem",
              fontWeight: "600", fontFamily: "sans-serif",
              color: "#1a1a1a", marginBottom: "6px" }}>
              CVV
            </label>
            <input
              value={cvv}
              onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
              placeholder="123"
              style={{ width: "100%", boxSizing: "border-box",
                padding: "12px 14px", border: "1.5px solid #c8c2bb",
                fontSize: "0.9rem", fontFamily: "sans-serif", outline: "none" }}
            />
          </div>
        </div>
      </div>

      {cardError && (
        <p style={{ margin: "12px 0 0", color: "#8b0000",
          fontSize: "0.82rem", fontFamily: "sans-serif" }}>
          {cardError}
        </p>
      )}

      {/* Buttons */}
      <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
        <button onClick={onBack}
          style={{ flex: 1, padding: "14px", backgroundColor: "transparent",
            border: "2px solid #1a1a1a", fontSize: "0.88rem",
            fontWeight: "600", cursor: "pointer", fontFamily: "sans-serif" }}>
          ← Back
        </button>
        <button onClick={handlePay}
          style={{ flex: 2, padding: "14px", backgroundColor: "#2d6a2d",
            color: "white", border: "none", fontSize: "0.95rem",
            fontWeight: "700", letterSpacing: "1px", cursor: "pointer",
            fontFamily: "sans-serif" }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1e4e1e"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2d6a2d"}>
          🔒 PAY ${grandTotal}
        </button>
      </div>
    </div>
  );
}

// ── MAIN CHECKOUT PAGE ────────────────────────────────────────
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, totalPrice } = useCart();

  // This is the key state — one number controls everything
  const [currentStep, setCurrentStep] = useState(1);

  // All form data lives in ONE object in the parent
  // This is called "lifting state up" — the parent owns the data,
  // child steps just read and update it
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

  // Redirect to shop if cart is empty
  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#eae6e1",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Georgia', serif", gap: "16px" }}>
        <h2 style={{ margin: 0 }}>Your basket is empty</h2>
        <button onClick={() => navigate("/shop")}
          style={{ padding: "13px 36px", backgroundColor: "#8b7355",
            color: "white", border: "none", cursor: "pointer",
            fontFamily: "sans-serif", fontSize: "0.9rem" }}>
          Browse Furniture
        </button>
      </div>
    );
  }

 const handlePlaceOrder = () => {
  // Generate a random order number
  const orderNumber = "AHF-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  // Navigate and pass order data as invisible state
  navigate("/order-confirmed", {
    state: {
      orderNumber,
      email:     formData.email,
      firstName: formData.firstName,
      address:   formData.address,
      city:      formData.city,
      postcode:  formData.postcode,
      delivery:  formData.delivery,
      items:     cartItems,
      total:     totalPrice,
    }
  });
};

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#eae6e1" }}>

      {/* Compact header with logo and secure checkout */}
      <div style={{ backgroundColor: "white", padding: "16px 6%",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", borderBottom: "1px solid #e8e4df" }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center",
          gap: "10px", cursor: "pointer" }}
          onClick={() => navigate("/")}>
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

        {/* Secure checkout badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px",
          color: "#7a6e68", fontSize: "0.82rem", fontFamily: "sans-serif" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#8b7355" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Secure Checkout
        </div>
      </div>

      {/* Step bar */}
      <StepBar currentStep={currentStep} />

      {/* Render the correct step */}
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
  );
}