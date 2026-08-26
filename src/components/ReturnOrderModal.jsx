import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const API = `${(
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "")}/api`.replace("/api/api", "/api");

const REASON_HINTS = [
  "Changed my mind",
  "Item arrived damaged",
  "Wrong item delivered",
  "Item doesn't match the description",
  "Ordered by mistake",
  "Found a better price elsewhere",
  "No longer needed",
];

// order: { _id, orderNumber } — the order being deleted/returned
// onClose: called to dismiss without deleting
// onDeleted(orderId): called after the backend confirms deletion
export default function ReturnOrderModal({ order, onClose, onDeleted }) {
  const { getToken } = useAuth();

  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleHintClick = (hint) => {
    setReason((current) => (current.trim() ? current : hint));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!reason.trim()) {
      setError("Please tell us why you're returning this item.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const token = await getToken();

      const response = await fetch(`${API}/orders/${order._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: reason.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete order.");
      }

      onDeleted(order._id);
    } catch (submitError) {
      setError(submitError.message || "Could not delete order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        style={styles.card}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="return-order-heading"
      >
        <h2 id="return-order-heading" style={styles.heading}>
          Delete this order?
        </h2>

        <p style={styles.subtext}>
          Order <strong>{order.orderNumber}</strong> will be removed and treated
          as a return request. Let us know why so our team can follow up.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={styles.hintRow}>
            {REASON_HINTS.map((hint) => (
              <button
                type="button"
                key={hint}
                onClick={() => handleHintClick(hint)}
                style={{
                  ...styles.hintChip,
                  ...(reason === hint ? styles.hintChipActive : {}),
                }}
              >
                {hint}
              </button>
            ))}
          </div>

          <label style={styles.label} htmlFor="return-reason">
            Reason for return
          </label>

          <textarea
            id="return-reason"
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
              setError("");
            }}
            placeholder="Tap a suggestion above, or tell us in your own words..."
            rows={4}
            style={styles.textarea}
          />

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.buttonRow}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={styles.cancelButton}
            >
              Keep Order
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...styles.deleteButton,
                ...(isSubmitting ? styles.buttonDisabled : {}),
              }}
            >
              {isSubmitting ? "Deleting..." : "Delete Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(26, 20, 16, 0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 1000,
  },
  card: {
    backgroundColor: "white",
    maxWidth: "480px",
    width: "100%",
    padding: "28px",
    boxSizing: "border-box",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  heading: {
    margin: "0 0 8px",
    fontFamily: "'Georgia', serif",
    fontSize: "1.25rem",
    color: "#1a1a1a",
  },
  subtext: {
    margin: "0 0 20px",
    fontSize: "0.88rem",
    color: "#7a6e68",
    fontFamily: "sans-serif",
    lineHeight: 1.6,
  },
  hintRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "16px",
  },
  hintChip: {
    padding: "7px 12px",
    border: "1.5px solid #c8c2bb",
    backgroundColor: "#f9f6f2",
    color: "#5a5550",
    fontSize: "0.78rem",
    fontFamily: "sans-serif",
    cursor: "pointer",
    borderRadius: "20px",
  },
  hintChipActive: {
    borderColor: "#8b7355",
    backgroundColor: "#8b7355",
    color: "white",
  },
  label: {
    display: "block",
    fontSize: "0.78rem",
    fontWeight: "600",
    color: "#5a5550",
    fontFamily: "sans-serif",
    marginBottom: "6px",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    border: "1.5px solid #c8c2bb",
    fontFamily: "sans-serif",
    fontSize: "0.88rem",
    boxSizing: "border-box",
    resize: "vertical",
  },
  error: {
    margin: "10px 0 0",
    fontSize: "0.8rem",
    color: "#8b0000",
    fontFamily: "sans-serif",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },
  cancelButton: {
    flex: 1,
    padding: "12px",
    backgroundColor: "transparent",
    border: "2px solid #1a1a1a",
    color: "#1a1a1a",
    fontWeight: "600",
    fontFamily: "sans-serif",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
  deleteButton: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#8b0000",
    border: "none",
    color: "white",
    fontWeight: "600",
    fontFamily: "sans-serif",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
  buttonDisabled: {
    backgroundColor: "#b98a8a",
    cursor: "not-allowed",
  },
};
