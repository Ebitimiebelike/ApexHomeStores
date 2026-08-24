import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const questions = [
  ["How long does delivery take?", "Every confirmed order is prepared and delivered within seven days. Visit Track My Order to see the live countdown for your order."],
  ["How can I track my order?", "Open Track My Order from the footer or your account page. Your order status changes from processing to in transit and then delivered."],
  ["Can I return an item?", "Yes. Contact us within seven days of delivery. Items should be unused, clean, and in their original packaging where possible."],
  ["How do I change my delivery details?", "Contact our team as soon as possible with your order number. We will confirm whether the order can still be updated."],
  ["What payment methods do you accept?", "Payments are securely processed through Paystack. Available methods are shown during checkout."],
];

export default function FaqPage() {
  const navigate = useNavigate();
  const [openQuestion, setOpenQuestion] = useState(null);

  return (
    <div style={styles.page}>
      <main style={styles.content}>
        <button type="button" onClick={() => navigate(-1)} style={styles.back}>Back</button>
        <p style={styles.eyebrow}>Apex Home</p>
        <h1 style={styles.title}>Frequently asked questions</h1>
        <p style={styles.lead}>Quick answers about delivery, returns, payments, and your order.</p>

        <div style={styles.list}>
          {questions.map(([question, answer], index) => {
            const isOpen = openQuestion === index;
            return (
              <section key={question} style={styles.item}>
                <button type="button" onClick={() => setOpenQuestion(isOpen ? null : index)} style={styles.question} aria-expanded={isOpen}>
                  <span>{question}</span>
                  <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && <p style={styles.answer}>{answer}</p>}
              </section>
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
  content: { maxWidth: "760px", margin: "0 auto", padding: "44px 6% 76px" },
  back: { background: "transparent", border: "1px solid #8b7355", padding: "9px 16px", cursor: "pointer", marginBottom: "42px" },
  eyebrow: { color: "#8b7355", letterSpacing: "2px", textTransform: "uppercase", fontSize: "0.72rem", margin: "0 0 8px" },
  title: { fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", margin: "0 0 16px" },
  lead: { color: "#625951", lineHeight: 1.7, fontSize: "1.05rem", margin: "0 0 30px" },
  list: { display: "grid", gap: "10px" },
  item: { backgroundColor: "white", border: "1px solid #e8e4df" },
  question: { width: "100%", display: "flex", justifyContent: "space-between", gap: "20px", alignItems: "center", textAlign: "left", padding: "20px", border: 0, background: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.95rem", color: "#1a1a1a" },
  answer: { margin: "-4px 20px 20px", color: "#625951", lineHeight: 1.7, fontSize: "0.9rem" },
};
