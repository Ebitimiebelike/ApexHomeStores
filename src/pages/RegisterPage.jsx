import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing again
    setErrors(prev => ({ ...prev, [field]: null }));
  }, []);

  const validate = () => {
    const e = {};
    // Standard Regex to fix the "Invalid email format" bug
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.name.trim()) e.name = "Please enter your name.";
    
    if (!formData.email) {
      e.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email)) {
      e.email = "Please enter a valid email address.";
    }

    if (formData.password.length < 6)
      e.password = "Password must be at least 6 characters.";
    
    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = "Passwords do not match.";
    
    return e;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Call the register function from AuthContext
      await register(formData.name, formData.email, formData.password);
      
      // 2. If successful, go to home or dashboard
      navigate("/");
    } catch (err) {
      // Handle errors from the backend (e.g., "Email already in use")
      setErrors({ server: err.message || "Registration failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    { label: "Full name", field: "name", type: "text", placeholder: "John Smith" },
    { label: "Email address", field: "email", type: "email", placeholder: "you@example.com" },
    { label: "Password", field: "password", type: "password", placeholder: "Min. 6 characters" },
    { label: "Confirm password", field: "confirmPassword", type: "password", placeholder: "Repeat your password" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#eae6e1", fontFamily: "'Georgia', serif" }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ backgroundColor: "white", padding: "48px 40px", width: "100%", maxWidth: "440px", border: "1px solid #e8e4df" }}>
          
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "32px", cursor: "pointer" }} onClick={() => navigate("/")}>
            <div style={{ width: "44px", height: "44px", backgroundColor: "#8b7355", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div style={{ fontWeight: "900", fontSize: "1rem", color: "#1a1a1a" }}>Apex Home</div>
            <div style={{ fontSize: "0.6rem", color: "#8b7355", letterSpacing: "2px", textTransform: "uppercase" }}>Furnishings</div>
          </div>

          <h2 style={{ margin: "0 0 6px", fontSize: "1.4rem", fontWeight: "900", color: "#1a1a1a", textAlign: "center" }}>
            Create an account
          </h2>
          <p style={{ margin: "0 0 28px", textAlign: "center", color: "#7a6e68", fontSize: "0.85rem", fontFamily: "sans-serif" }}>
            Join Apex Home for faster checkout and order tracking
          </p>

          {/* Server Error Message */}
          {errors.server && (
            <div style={{ backgroundColor: "#fdecea", color: "#8b0000", padding: "10px", borderRadius: "4px", marginBottom: "20px", fontSize: "0.85rem", textAlign: "center", fontFamily: "sans-serif" }}>
              {errors.server}
            </div>
          )}

          {fields.map(({ label, field, type, placeholder }) => (
            <div key={field} style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: "#1a1a1a", fontFamily: "sans-serif", marginBottom: "6px" }}>
                {label}
              </label>
              <input
                type={type}
                value={formData[field]}
                onChange={e => update(field, e.target.value)}
                placeholder={placeholder}
                autoComplete={type === "password" ? "new-password" : undefined}
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "12px 14px", fontSize: "0.9rem",
                  fontFamily: "sans-serif", color: "#1a1a1a", outline: "none",
                  border: `1.5px solid ${errors[field] ? "#8b0000" : "#c8c2bb"}`,
                }}
              />
              {errors[field] && (
                <p style={{ margin: "4px 0 0", color: "#8b0000", fontSize: "0.76rem", fontFamily: "sans-serif" }}>
                  {errors[field]}
                </p>
              )}
            </div>
          ))}

          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{ 
              width: "100%", padding: "14px", 
              backgroundColor: isSubmitting ? "#a8998a" : "#8b7355", 
              color: "white", border: "none", fontSize: "0.95rem", 
              fontWeight: "700", letterSpacing: "1px", cursor: isSubmitting ? "not-allowed" : "pointer", 
              marginTop: "8px", fontFamily: "sans-serif" 
            }}
          >
            {isSubmitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>

          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.85rem", fontFamily: "sans-serif", color: "#7a6e68" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#8b7355", fontWeight: "700", textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}