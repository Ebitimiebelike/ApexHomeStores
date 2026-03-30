import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ContactPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", email: "", subject: "", message: "",
  });
  const [errors,    setErrors]    = useState({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const validate = () => {
    const e = {};
    if (!formData.name.trim())    e.name    = "Please enter your name.";
    if (!formData.email.includes("@")) e.email = "Please enter a valid email.";
    if (!formData.subject.trim()) e.subject = "Please enter a subject.";
    if (!formData.message.trim()) e.message = "Please enter a message.";
    return e;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // In a real app you'd send this to an API
    // For now just show the success message
    setSubmitted(true);
  };

  // Success state
  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#eae6e1",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Georgia', serif", gap: "16px",
        textAlign: "center", padding: "40px" }}>
        <div style={{ width: "70px", height: "70px",
          borderRadius: "50%", backgroundColor: "#2d6a2d",
          display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "2rem",
          color: "white", margin: "0 auto" }}>
          ✓
        </div>
        <h2 style={{ margin: 0, fontSize: "1.5rem",
          fontWeight: "900", color: "#1a1a1a" }}>
          Message sent!
        </h2>
        <p style={{ margin: 0, color: "#7a6e68",
          fontFamily: "sans-serif", maxWidth: "360px", lineHeight: 1.7 }}>
          Thanks for reaching out, {formData.name}. We'll get back to you
          at {formData.email} within 24 hours.
        </p>
        <button onClick={() => navigate("/")}
          style={{ marginTop: "8px", padding: "13px 36px",
            backgroundColor: "#8b7355", color: "white",
            border: "none", cursor: "pointer",
            fontFamily: "sans-serif", fontSize: "0.9rem",
            fontWeight: "600" }}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#eae6e1",
      fontFamily: "'Georgia', serif" }}>

      {/* Header */}
      <div style={{ backgroundColor: "#2d1a0e", padding: "60px 6%",
        textAlign: "center" }}>
        <p style={{ margin: "0 0 10px", fontSize: "0.78rem",
          color: "#f5d98b", letterSpacing: "3px",
          textTransform: "uppercase", fontFamily: "sans-serif" }}>
          Get in touch
        </p>
        <h1 style={{ margin: "0 0 16px", fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
          fontWeight: "900", color: "white" }}>
          We'd love to hear from you
        </h1>
        <p style={{ margin: 0, color: "#d4c9bc",
          fontFamily: "sans-serif", fontSize: "0.95rem" }}>
          Questions about an order, a product, or just need advice?
          Our team replies within 24 hours.
        </p>
      </div>

      <div style={{ display: "flex", gap: "40px", padding: "60px 6%",
        flexWrap: "wrap", alignItems: "flex-start" }}>

        {/* LEFT — Contact info */}
        <div style={{ flex: "0 0 260px" }}>
          <h2 style={{ margin: "0 0 24px", fontSize: "1.1rem",
            fontWeight: "900", color: "#1a1a1a" }}>
            Contact details
          </h2>
          {[
            { icon: "📧", label: "Email",   value: "hello@apexhome.com" },
            { icon: "📞", label: "Phone",   value: "0345 646 1701" },
            { icon: "🕐", label: "Hours",   value: "Mon–Sat, 9am–6pm" },
            { icon: "📍", label: "Address", value: "12 Furnishing Lane\nLondon, EC1A 1BB" },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", gap: "14px",
              marginBottom: "20px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>
                {item.icon}
              </span>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: "0.78rem",
                  fontWeight: "700", color: "#1a1a1a",
                  fontFamily: "sans-serif", textTransform: "uppercase",
                  letterSpacing: "1px" }}>
                  {item.label}
                </p>
                <p style={{ margin: 0, fontSize: "0.88rem",
                  color: "#5a5550", fontFamily: "sans-serif",
                  lineHeight: 1.6, whiteSpace: "pre-line" }}>
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT — Form */}
        <div style={{ flex: 1, minWidth: "280px",
          backgroundColor: "white", padding: "36px",
          border: "1px solid #e8e4df" }}>
          <h2 style={{ margin: "0 0 24px", fontSize: "1.1rem",
            fontWeight: "900", color: "#1a1a1a" }}>
            Send us a message
          </h2>

          {/* Name + Email side by side */}
          <div style={{ display: "flex", gap: "16px",
            flexWrap: "wrap", marginBottom: "16px" }}>
            {[
              { label: "Your name",     field: "name",  type: "text",  placeholder: "John Smith" },
              { label: "Email address", field: "email", type: "email", placeholder: "you@example.com" },
            ].map(({ label, field, type, placeholder }) => (
              <div key={field} style={{ flex: "1 1 200px" }}>
                <label style={{ display: "block", fontSize: "0.82rem",
                  fontWeight: "600", color: "#1a1a1a",
                  fontFamily: "sans-serif", marginBottom: "6px" }}>
                  {label}
                </label>
                <input type={type} value={formData[field]}
                  onChange={e => update(field, e.target.value)}
                  placeholder={placeholder}
                  style={{ width: "100%", boxSizing: "border-box",
                    padding: "12px 14px", fontSize: "0.88rem",
                    fontFamily: "sans-serif", color: "#1a1a1a",
                    outline: "none",
                    border: `1.5px solid ${errors[field] ? "#8b0000" : "#c8c2bb"}` }}
                />
                {errors[field] && (
                  <p style={{ margin: "4px 0 0", color: "#8b0000",
                    fontSize: "0.75rem", fontFamily: "sans-serif" }}>
                    {errors[field]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Subject */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "0.82rem",
              fontWeight: "600", color: "#1a1a1a",
              fontFamily: "sans-serif", marginBottom: "6px" }}>
              Subject
            </label>
            <input type="text" value={formData.subject}
              onChange={e => update("subject", e.target.value)}
              placeholder="e.g. Question about my order"
              style={{ width: "100%", boxSizing: "border-box",
                padding: "12px 14px", fontSize: "0.88rem",
                fontFamily: "sans-serif", color: "#1a1a1a",
                outline: "none",
                border: `1.5px solid ${errors.subject ? "#8b0000" : "#c8c2bb"}` }}
            />
            {errors.subject && (
              <p style={{ margin: "4px 0 0", color: "#8b0000",
                fontSize: "0.75rem", fontFamily: "sans-serif" }}>
                {errors.subject}
              </p>
            )}
          </div>

          {/* Message */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "0.82rem",
              fontWeight: "600", color: "#1a1a1a",
              fontFamily: "sans-serif", marginBottom: "6px" }}>
              Message
            </label>
            <textarea value={formData.message}
              onChange={e => update("message", e.target.value)}
              placeholder="Tell us how we can help..."
              rows={5}
              style={{ width: "100%", boxSizing: "border-box",
                padding: "12px 14px", fontSize: "0.88rem",
                fontFamily: "sans-serif", color: "#1a1a1a",
                outline: "none", resize: "vertical",
                border: `1.5px solid ${errors.message ? "#8b0000" : "#c8c2bb"}` }}
            />
            {errors.message && (
              <p style={{ margin: "4px 0 0", color: "#8b0000",
                fontSize: "0.75rem", fontFamily: "sans-serif" }}>
                {errors.message}
              </p>
            )}
          </div>

          <button onClick={handleSubmit}
            style={{ width: "100%", padding: "14px",
              backgroundColor: "#8b7355", color: "white",
              border: "none", fontSize: "0.95rem",
              fontWeight: "700", letterSpacing: "1px",
              cursor: "pointer", fontFamily: "sans-serif",
              transition: "background-color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6b5a50"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#8b7355"}>
            SEND MESSAGE
          </button>
        </div>
      </div>
    </div>
  );
}