import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatNaira } from "../Utils/currency";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

// ── Your Paystack public key ──────────────────────────────────────
const PAYSTACK_PUBLIC_KEY = "pk_test_da9bcf205759a17389cdd47a91202dbe1f66fd39";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function StepBar({ currentStep, isMobile }) {
  const steps = ["Welcome", "Delivery", "Review & Pay"];
  return (
    <div style={{
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      padding: isMobile ? "16px 4%" : "28px 6%", 
      backgroundColor: "white",
      borderBottom: "1px solid #e8e4df", 
      flexWrap: "wrap", 
      gap: isMobile ? "12px" : "8px",
      boxSizing: "border-box"
    }}>
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isDone = stepNum < currentStep;
        
        // On mobile, hide names of non-active steps to save extreme horizontal space
        if (isMobile && !isActive && !isDone) return null;

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
                {step} {isMobile && isDone && "✓"}
              </span>
            </div>
            {index < steps.length - 1 && !isMobile && (
              <div style={{ width: "60px", borderTop: "2px dotted #ddd", margin: "0 12px" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// STEP 1 — Welcome
// ════════════════════════════════════════════════════════════════
function StepWelcome({ formData, setFormData, onNext, isMobile }) {
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleContinue = async () => {
    const cleanEmail = formData.email.trim().toLowerCase();

    // 1. Quick Initial Syntax Check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      setError("Please enter a valid email address structure.");
      return;
    }

    setIsVerifying(true);
    setError("Verifying email legitimacy...");

    // 2. Call YOUR OWN Backend Proxy Route instead of Abstract API directly
    try {
      // Replace with your local URL or your Render backend domain URL
      const BACKEND_URL = "https://apex-backend-adrb.onrender.com"; 
      
      const response = await fetch(
        `${BACKEND_URL}/api/validate-checkout-email?email=${encodeURIComponent(cleanEmail)}`
      );
      
      if (!response.ok) {
        throw new Error("Backend validation endpoint failed");
      }

      const data = await response.json();

      // Your backend returns { valid: true/false, reason: "..." }
      if (!data.valid) {
        setError(data.reason);
        setIsVerifying(false);
        return;
      }

      // If valid, proceed smoothly
      setFormData(prev => ({ ...prev, email: cleanEmail }));
      setError("");
      onNext(); 

    } catch (err) {
      console.error("Email verification fallback:", err);
      // Safety net: let them pass if your backend route fails
      setFormData(prev => ({ ...prev, email: cleanEmail }));
      setError("");
      onNext();
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: "480px", 
      margin: "0 auto", 
      padding: isMobile ? "32px 5%" : "48px 20px",
      boxSizing: "border-box",
      width: "100%"
    }}>
      <h2 style={{ margin: "0 0 6px", fontSize: isMobile ? "1.35rem" : "1.5rem", fontWeight: "900", color: "#1a1a1a", fontFamily: "'Georgia', serif" }}>
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
        disabled={isVerifying}
        value={formData.email}
        onChange={e => {
          setError(""); // Clear error when user changes input values
          setFormData(prev => ({ ...prev, email: e.target.value }));
        }}
        placeholder="you@example.com"
        style={{
          width: "100%", boxSizing: "border-box", padding: "13px 16px",
          border: `1.5px solid ${error && !error.includes("Verifying") ? "#8b0000" : "#c8c2bb"}`,
          fontSize: "0.9rem", fontFamily: "sans-serif", color: "#1a1a1a", outline: "none",
        }}
      />
      {error && (
        <p style={{ 
          margin: "8px 0 0", 
          color: error.includes("Verifying") ? "#8b7355" : "#8b0000", 
          fontSize: "0.82rem", 
          fontFamily: "sans-serif",
          fontWeight: "600"
        }}>
          ⚠ {error}
        </p>
      )}

      <button 
        onClick={handleContinue}
        disabled={isVerifying}
        style={{ 
          width: "100%", padding: "15px", 
          backgroundColor: isVerifying ? "#a8998a" : "#8b7355", 
          color: "white", border: "none", fontSize: "0.95rem", 
          fontWeight: "700", letterSpacing: "1px", 
          cursor: isVerifying ? "not-allowed" : "pointer", 
          marginTop: "24px", fontFamily: "sans-serif" 
        }}>
        {isVerifying ? "VERIFYING..." : "CONTINUE"}
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// STEP 2 — Delivery Details
// ════════════════════════════════════════════════════════════════
function StepDelivery({ formData, setFormData, onNext, onBack, showBackButton, isMobile }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.firstName?.trim()) e.firstName = "First name is required.";
    if (!formData.lastName?.trim()) e.lastName = "Last name is required.";
    
    if (!formData.email) {
      e.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      e.email = "Please enter a valid email address.";
    }

    if (!formData.address?.trim()) e.address = "Address is required.";
    if (!formData.city?.trim()) e.city = "City is required.";
    
    return e;
  };

  const handleNext = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    onNext();
  };

  return (
    <div style={{ 
      maxWidth: "500px", 
      margin: "0 auto", 
      padding: isMobile ? "32px 5%" : "48px 20px",
      boxSizing: "border-box",
      width: "100%"
    }}>
      <h2 style={{ fontFamily: "'Georgia', serif", fontWeight: "900", marginBottom: "20px", fontSize: isMobile ? "1.4rem" : "1.7rem" }}>
        Delivery Details
      </h2>
      
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "12px", marginBottom: "12px" }}>
        <input 
          placeholder="First Name" 
          value={formData.firstName} 
          style={{ flex: 1, padding: "12px", border: `1.5px solid ${errors.firstName ? "#8b0000" : "#c8c2bb"}`, boxSizing: "border-box", width: "100%" }}
          onChange={e => setFormData({...formData, firstName: e.target.value})} 
        />
        <input 
          placeholder="Last Name" 
          value={formData.lastName} 
          style={{ flex: 1, padding: "12px", border: `1.5px solid ${errors.lastName ? "#8b0000" : "#c8c2bb"}`, boxSizing: "border-box", width: "100%" }}
          onChange={e => setFormData({...formData, lastName: e.target.value})} 
        />
      </div>

      <input 
        placeholder="Address" 
        value={formData.address} 
        style={{ width: "100%", padding: "12px", boxSizing: "border-box", marginBottom: "12px", border: `1.5px solid ${errors.address ? "#8b0000" : "#c8c2bb"}` }}
        onChange={e => setFormData({...formData, address: e.target.value})} 
      />
      
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "12px", marginBottom: "20px" }}>
        <input 
          placeholder="City" 
          value={formData.city} 
          style={{ flex: 1, padding: "12px", border: `1.5px solid ${errors.city ? "#8b0000" : "#c8c2bb"}`, boxSizing: "border-box", width: "100%" }}
          onChange={e => setFormData({...formData, city: e.target.value})} 
        />
        <input 
          placeholder="Postcode" 
          value={formData.postcode} 
          style={{ flex: 1, padding: "12px", border: "#c8c2bb 1.5px solid", boxSizing: "border-box", width: "100%" }}
          onChange={e => setFormData({...formData, postcode: e.target.value})} 
        />
      </div>

      <div style={{ display: "flex", flexDirection: isMobile ? "column-reverse" : "row", gap: "12px" }}>
        {showBackButton && (
          <button onClick={onBack} style={{ width: "100%", padding: "14px", border: "2px solid #1a1a1a", background: "none", cursor: "pointer", fontWeight: "700" }}>
            BACK
          </button>
        )}
        <button onClick={handleNext} style={{ width: "100%", padding: "14px", backgroundColor: "#1a1a1a", color: "white", border: "none", cursor: "pointer", fontWeight: "700" }}>
          REVIEW ORDER
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// STEP 3 — Review & Pay
// ════════════════════════════════════════════════════════════════
function StepReview({ formData, onBack, onPlaceOrder, isMobile }) {
  const { cartItems, totalPrice } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const USD_TO_NGN = 1600;
  const totalNaira = totalPrice * USD_TO_NGN;
  const deliveryCost = formData.delivery === "express" ? 23900 : totalNaira >= 199000 ? 0 : 15900;
  const grandTotalNaira = Math.round(totalNaira + deliveryCost);

  const handlePay = async () => {
    setIsLoading(true);
    try {
      const PaystackPop = (await import("@paystack/inline-js")).default;
      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: PAYSTACK_PUBLIC_KEY,
        email: formData.email,
        amount: grandTotalNaira * 100,
        currency: "NGN",
        onSuccess: async (t) => {
          await onPlaceOrder(t.reference);
          setIsLoading(false);
        },
        onCancel: () => {
          setIsLoading(false);
        }
      });
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: "600px", 
      margin: "0 auto", 
      padding: isMobile ? "32px 5%" : "48px 20px",
      boxSizing: "border-box",
      width: "100%"
    }}>
       <h2 style={{ fontFamily: "'Georgia', serif", fontWeight: "900", fontSize: isMobile ? "1.4rem" : "1.7rem" }}>Review & Pay</h2>
       <div style={{ backgroundColor: "white", padding: "16px", border: "1px solid #e8e4df", marginTop: "20px", boxSizing: "border-box" }}>
          {cartItems.map(item => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f4f0eb", fontSize: "0.9rem" }}>
              <span style={{ paddingRight: "8px" }}>{item.name} (x{item.quantity})</span>
              <span style={{ flexShrink: 0 }}>{formatNaira(item.price * item.quantity)}</span>
            </div>
          ))}
          <div style={{ marginTop: "20px", fontWeight: "700", fontSize: isMobile ? "1.1rem" : "1.2rem", display: "flex", justifyContent: "space-between" }}>
            <span>Total</span>
            <span>₦{grandTotalNaira.toLocaleString("en-NG")}</span>
          </div>
       </div>
       <button onClick={handlePay} disabled={isLoading} style={{ width: "100%", padding: "16px", backgroundColor: "#2d6a2d", color: "white", border: "none", marginTop: "20px", fontWeight: "700", cursor: "pointer" }}>
         {isLoading ? "PROCESSING..." : `PAY ₦${grandTotalNaira.toLocaleString("en-NG")}`}
       </button>
       <button onClick={onBack} style={{ width: "100%", background: "none", border: "none", marginTop: "16px", cursor: "pointer", textDecoration: "underline", padding: "8px 0" }}>
         Back to Delivery
       </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// MAIN CHECKOUT PAGE
// ════════════════════════════════════════════════════════════════
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user, getToken } = useAuth();
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [currentStep, setCurrentStep] = useState(user ? 2 : 1);
  const [formData, setFormData] = useState({
    email: user?.email || "",
    guestOrAccount: user ? "Account Holder" : "No (Continue as a guest)",
    firstName: "", lastName: "", address: "", city: "", postcode: "", delivery: "standard",
  });

  const handlePlaceOrder = async (ref) => {
    try {
      if (!user) {
        navigate("/login");
        return;
      }

      const token = await getToken();

      if (!token) {
        throw new Error("Authentication token unavailable.");
      }

      const USD_TO_NGN = 1600;
      const totalNaira = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ) * USD_TO_NGN;

      const deliveryCost =
        formData.delivery === "express"
          ? 23900
          : totalNaira >= 199000
            ? 0
            : 15900;

      const grandTotalNaira = Math.round(totalNaira + deliveryCost);

      const orderNumber =
        "AHF-" +
        Math.random().toString(36).substring(2, 8).toUpperCase();

      const orderItems = cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const response = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderNumber,
          items: orderItems,
          total: grandTotalNaira,
          delivery: formData.delivery,
          address: formData.address,
          city: formData.city,
          postcode: formData.postcode,
          paystackRef: ref,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save order.");
      }

      navigate("/order-confirmed", {
        state: {
          ...formData,
          ref,
          orderNumber,
          items: cartItems,
          total: grandTotalNaira,
        },
      });
    } catch (err) {
      console.error("Order creation error:", err);
      alert(
        err.message ||
          "Payment succeeded, but we could not save your order. Please contact support."
      );
    }
  };

  if (cartItems.length === 0) return <div style={{ textAlign: "center", padding: "100px" }}>Basket is empty.</div>;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#eae6e1", overflowX: "hidden" }}>
      <div style={{ 
        backgroundColor: "white", 
        padding: isMobile ? "16px 4%" : "16px 6%", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        borderBottom: "1px solid #e8e4df",
        boxSizing: "border-box"
      }}>
        <div style={{ fontWeight: "900", fontFamily: "'Georgia', serif", fontSize: isMobile ? "1.1rem" : "1.2rem" }}>Apex Home</div>
        <div style={{ fontSize: isMobile ? "0.85rem" : "0.95rem" }}>🔒 Secure</div>
      </div>
      
      <StepBar currentStep={currentStep} isMobile={isMobile} />
      
      {currentStep === 1 && (
        <StepWelcome formData={formData} setFormData={setFormData} onNext={() => setCurrentStep(2)} isMobile={isMobile} />
      )}
      
      {currentStep === 2 && (
        <StepDelivery 
          formData={formData} 
          setFormData={setFormData} 
          onNext={() => setCurrentStep(3)} 
          onBack={() => setCurrentStep(1)} 
          showBackButton={!user} 
          isMobile={isMobile}
        />
      )}
      
      {currentStep === 3 && (
        <StepReview formData={formData} onBack={() => setCurrentStep(2)} onPlaceOrder={handlePlaceOrder} isMobile={isMobile} />
      )}
      <Footer />
    </div>
  );
}