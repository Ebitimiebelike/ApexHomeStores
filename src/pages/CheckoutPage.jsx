import { useState} from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatNaira } from "../Utils/currency";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

// ── Your Paystack public key ──────────────────────────────────────
const PAYSTACK_PUBLIC_KEY = "pk_test_da9bcf205759a17389cdd47a91202dbe1f66fd39";

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
// STEP 1 — Welcome
// ════════════════════════════════════════════════════════════════
function StepWelcome({ formData, setFormData, onNext }) {
  const [error, setError] = useState("");

  const handleContinue = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
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
      {error && <p style={{ margin: "8px 0 0", color: "#8b0000", fontSize: "0.82rem", fontFamily: "sans-serif" }}>⚠ {error}</p>}

      <button onClick={handleContinue}
        style={{ width: "100%", padding: "15px", backgroundColor: "#8b7355", color: "white", border: "none", fontSize: "0.95rem", fontWeight: "700", letterSpacing: "1px", cursor: "pointer", marginTop: "24px", fontFamily: "sans-serif" }}>
        CONTINUE
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// STEP 2 — Delivery Details (FIXED)
// ════════════════════════════════════════════════════════════════
function StepDelivery({ formData, setFormData, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    // Updated regex to fix the "Invalid email format" error seen in your screenshot
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

  // The actual UI for Step 2
  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "48px 20px" }}>
      <h2 style={{ fontFamily: "'Georgia', serif", fontWeight: "900", marginBottom: "20px" }}>
        Delivery Details
      </h2>
      
      <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
        <input 
          placeholder="First Name" 
          value={formData.firstName} 
          style={{ flex: 1, padding: "12px", border: `1.5px solid ${errors.firstName ? "#8b0000" : "#c8c2bb"}` }}
          onChange={e => setFormData({...formData, firstName: e.target.value})} 
        />
        <input 
          placeholder="Last Name" 
          value={formData.lastName} 
          style={{ flex: 1, padding: "12px", border: `1.5px solid ${errors.lastName ? "#8b0000" : "#c8c2bb"}` }}
          onChange={e => setFormData({...formData, lastName: e.target.value})} 
        />
      </div>

      <input 
        placeholder="Address" 
        value={formData.address} 
        style={{ width: "100%", padding: "12px", boxSizing: "border-box", marginBottom: "12px", border: `1.5px solid ${errors.address ? "#8b0000" : "#c8c2bb"}` }}
        onChange={e => setFormData({...formData, address: e.target.value})} 
      />
      
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input 
          placeholder="City" 
          value={formData.city} 
          style={{ flex: 1, padding: "12px", border: `1.5px solid ${errors.city ? "#8b0000" : "#c8c2bb"}` }}
          onChange={e => setFormData({...formData, city: e.target.value})} 
        />
        <input 
          placeholder="Postcode" 
          value={formData.postcode} 
          style={{ flex: 1, padding: "12px", border: "#c8c2bb 1.5px solid" }}
          onChange={e => setFormData({...formData, postcode: e.target.value})} 
        />
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button onClick={onBack} style={{ flex: 1, padding: "14px", border: "2px solid #1a1a1a", background: "none", cursor: "pointer" }}>
          BACK
        </button>
        <button onClick={handleNext} style={{ flex: 1, padding: "14px", backgroundColor: "#1a1a1a", color: "white", border: "none", cursor: "pointer" }}>
          REVIEW ORDER
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// STEP 3 — Review & Pay
// ════════════════════════════════════════════════════════════════
function StepReview({ formData, onBack, onPlaceOrder }) {
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
        onSuccess: (t) => onPlaceOrder(t.reference),
        onCancel: () => { setIsLoading(false); }
      });
    } catch (_err) {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "48px 20px" }}>
       <h2 style={{ fontFamily: "'Georgia', serif", fontWeight: "900" }}>Review & Pay</h2>
       <div style={{ backgroundColor: "white", padding: "20px", border: "1px solid #e8e4df", marginTop: "20px" }}>
          {cartItems.map(item => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f4f0eb" }}>
              <span>{item.name} (x{item.quantity})</span>
              <span>{formatNaira(item.price * item.quantity)}</span>
            </div>
          ))}
          <div style={{ marginTop: "20px", fontWeight: "700", fontSize: "1.2rem", display: "flex", justifyContent: "space-between" }}>
            <span>Total</span>
            <span>₦{grandTotalNaira.toLocaleString("en-NG")}</span>
          </div>
       </div>
       <button onClick={handlePay} disabled={isLoading} style={{ width: "100%", padding: "16px", backgroundColor: "#2d6a2d", color: "white", border: "none", marginTop: "20px", fontWeight: "700", cursor: "pointer" }}>
         {isLoading ? "PROCESSING..." : `PAY ₦${grandTotalNaira.toLocaleString("en-NG")}`}
       </button>
       <button onClick={onBack} style={{ width: "100%", background: "none", border: "none", marginTop: "10px", cursor: "pointer", textDecoration: "underline" }}>Back to Delivery</button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// MAIN CHECKOUT PAGE
// ════════════════════════════════════════════════════════════════
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(user ? 2 : 1);
  const [formData, setFormData] = useState({
    email: user?.email || "",
    guestOrAccount: "No (Continue as a guest)",
    firstName: "", lastName: "", address: "", city: "", postcode: "", delivery: "standard",
  });

  const handlePlaceOrder = (ref) => {
    navigate("/order-confirmed", { state: { ...formData, ref, items: cartItems } });
  };

  if (cartItems.length === 0) return <div style={{ textAlign: "center", padding: "100px" }}>Basket is empty.</div>;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#eae6e1" }}>
      <div style={{ backgroundColor: "white", padding: "16px 6%", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e8e4df" }}>
        <div style={{ fontWeight: "900", fontFamily: "'Georgia', serif" }}>Apex Home</div>
        <div>🔒 Secure Checkout</div>
      </div>
      <StepBar currentStep={currentStep} />
      {currentStep === 1 && <StepWelcome formData={formData} setFormData={setFormData} onNext={() => setCurrentStep(2)} />}
      {currentStep === 2 && <StepDelivery formData={formData} setFormData={setFormData} onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />}
      {currentStep === 3 && <StepReview formData={formData} onBack={() => setCurrentStep(2)} onPlaceOrder={handlePlaceOrder} />}
      <Footer />
    </div>
  );
}