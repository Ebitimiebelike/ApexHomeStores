import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function ReturnsPolicyPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <main style={styles.content}>
        <button type="button" onClick={() => navigate(-1)} style={styles.back}>Back</button>
        <p style={styles.eyebrow}>Apex Home</p>
        <h1 style={styles.title}>7-day returns policy</h1>
        <p style={styles.lead}>We want your new furniture to feel right at home. You can request a return within seven days of delivery.</p>

        <section style={styles.panel}>
          <h2 style={styles.heading}>How it works</h2>
          <ol style={styles.list}>
            <li>Contact us within seven days of delivery through our <button type="button" onClick={() => navigate("/contact")} style={styles.link}>Contact Us</button> page.</li>
            <li>Tell us your order number and why you would like to return the item.</li>
            <li>Keep the item unused, clean, and in its original packaging where possible.</li>
            <li>Our team will confirm the collection or return instructions.</li>
          </ol>
        </section>

        <section style={styles.panel}>
          <h2 style={styles.heading}>Important details</h2>
          <p style={styles.text}>Items must be returned in their original condition. Custom-made, personalised, or damaged items may not qualify unless they arrived damaged or faulty. Return delivery charges may apply for change-of-mind returns.</p>
          <p style={styles.text}>Once we receive and inspect your item, approved refunds are sent to the original payment method.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#eae6e1", color: "#1a1a1a", fontFamily: "sans-serif" },
  content: { maxWidth: "760px", margin: "0 auto", padding: "44px 6% 76px" },
  back: { background: "transparent", border: "1px solid #8b7355", padding: "9px 16px", cursor: "pointer", marginBottom: "42px" },
  eyebrow: { color: "#8b7355", letterSpacing: "2px", textTransform: "uppercase", fontSize: "0.72rem", margin: "0 0 8px" },
  title: { fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", margin: "0 0 16px" },
  lead: { color: "#625951", lineHeight: 1.7, fontSize: "1.05rem", margin: "0 0 30px" },
  panel: { backgroundColor: "white", border: "1px solid #e8e4df", padding: "26px", marginBottom: "18px" },
  heading: { margin: "0 0 16px", fontFamily: "Georgia, serif", fontSize: "1.25rem" },
  list: { margin: 0, paddingLeft: "22px", color: "#625951", lineHeight: 1.8 },
  text: { color: "#625951", lineHeight: 1.8, margin: "0 0 14px" },
  link: { border: 0, background: "none", color: "#8b7355", textDecoration: "underline", cursor: "pointer", padding: 0, font: "inherit" },
};
