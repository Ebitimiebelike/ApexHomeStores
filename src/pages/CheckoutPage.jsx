import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { formatNaira } from "../Utils/currency";
import { useAuth } from "../context/AuthContext";

import Footer from "../components/Footer";

const PAYSTACK_PUBLIC_KEY =
  import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ||
  "pk_test_da9bcf205759a17389cdd47a91202dbe1f66fd39";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const USD_TO_NGN = 1600;

// ============================================================
// STEP BAR
// ============================================================

function StepBar({ currentStep, isMobile }) {
  const steps = [
    "Delivery",
    "Review & Pay",
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "16px 4%" : "28px 6%",
        backgroundColor: "white",
        borderBottom: "1px solid #e8e4df",
        gap: isMobile ? "12px" : "8px",
        boxSizing: "border-box",
      }}
    >
      {steps.map((step, index) => {
        const stepNum = index + 1;

        const isActive = stepNum === currentStep;
        const isDone = stepNum < currentStep;

        return (
          <div
            key={step}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  fontFamily: "sans-serif",
                  backgroundColor: isDone
                    ? "#2d6a2d"
                    : isActive
                    ? "#8b7355"
                    : "white",
                  color:
                    isDone || isActive
                      ? "white"
                      : "#aaa",
                  border:
                    isDone || isActive
                      ? "none"
                      : "2px solid #ddd",
                }}
              >
                {isDone ? "✓" : stepNum}
              </div>

              <span
                style={{
                  fontSize: "0.85rem",
                  fontFamily: "sans-serif",
                  fontWeight: isActive ? "700" : "400",
                  color: isActive ? "#1a1a1a" : "#aaa",
                }}
              >
                {step}
              </span>
            </div>

            {index < steps.length - 1 && !isMobile && (
              <div
                style={{
                  width: "60px",
                  borderTop: "2px dotted #ddd",
                  margin: "0 12px",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// STEP 1 — DELIVERY
// ============================================================

function StepDelivery({
  formData,
  setFormData,
  onNext,
  isMobile,
}) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName =
        "First name is required.";
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName =
        "Last name is required.";
    }

    if (!formData.address?.trim()) {
      newErrors.address =
        "Address is required.";
    }

    if (!formData.city?.trim()) {
      newErrors.city =
        "City is required.";
    }

    if (!formData.postcode?.trim()) {
      newErrors.postcode =
        "Postcode is required.";
    }

    return newErrors;
  };

  const handleNext = () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  const updateField = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: isMobile
          ? "32px 5%"
          : "48px 20px",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <h2
        style={{
          fontFamily: "'Georgia', serif",
          fontWeight: "900",
          marginBottom: "20px",
          fontSize: isMobile
            ? "1.4rem"
            : "1.7rem",
        }}
      >
        Delivery Details
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: isMobile
            ? "column"
            : "row",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        <div style={{ flex: 1 }}>
          <input
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) =>
              updateField(
                "firstName",
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "12px",
              border: `1.5px solid ${
                errors.firstName
                  ? "#8b0000"
                  : "#c8c2bb"
              }`,
              boxSizing: "border-box",
            }}
          />

          {errors.firstName && (
            <p
              style={{
                color: "#8b0000",
                fontSize: "0.75rem",
                margin: "5px 0 0",
                fontFamily: "sans-serif",
              }}
            >
              {errors.firstName}
            </p>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <input
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) =>
              updateField(
                "lastName",
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "12px",
              border: `1.5px solid ${
                errors.lastName
                  ? "#8b0000"
                  : "#c8c2bb"
              }`,
              boxSizing: "border-box",
            }}
          />

          {errors.lastName && (
            <p
              style={{
                color: "#8b0000",
                fontSize: "0.75rem",
                margin: "5px 0 0",
                fontFamily: "sans-serif",
              }}
            >
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <input
          placeholder="Address"
          value={formData.address}
          onChange={(e) =>
            updateField(
              "address",
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "12px",
            boxSizing: "border-box",
            border: `1.5px solid ${
              errors.address
                ? "#8b0000"
                : "#c8c2bb"
            }`,
          }}
        />

        {errors.address && (
          <p
            style={{
              color: "#8b0000",
              fontSize: "0.75rem",
              margin: "5px 0 0",
              fontFamily: "sans-serif",
            }}
          >
            {errors.address}
          </p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: isMobile
            ? "column"
            : "row",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div style={{ flex: 1 }}>
          <input
            placeholder="City"
            value={formData.city}
            onChange={(e) =>
              updateField(
                "city",
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "12px",
              border: `1.5px solid ${
                errors.city
                  ? "#8b0000"
                  : "#c8c2bb"
              }`,
              boxSizing: "border-box",
            }}
          />

          {errors.city && (
            <p
              style={{
                color: "#8b0000",
                fontSize: "0.75rem",
                margin: "5px 0 0",
                fontFamily: "sans-serif",
              }}
            >
              {errors.city}
            </p>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <input
            placeholder="Postcode"
            value={formData.postcode}
            onChange={(e) =>
              updateField(
                "postcode",
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "12px",
              border: `1.5px solid ${
                errors.postcode
                  ? "#8b0000"
                  : "#c8c2bb"
              }`,
              boxSizing: "border-box",
            }}
          />

          {errors.postcode && (
            <p
              style={{
                color: "#8b0000",
                fontSize: "0.75rem",
                margin: "5px 0 0",
                fontFamily: "sans-serif",
              }}
            >
              {errors.postcode}
            </p>
          )}
        </div>
      </div>

      <label
        style={{
          display: "block",
          fontSize: "0.85rem",
          fontWeight: "700",
          marginBottom: "8px",
          fontFamily: "sans-serif",
        }}
      >
        Delivery
      </label>

      <select
        value={formData.delivery}
        onChange={(e) =>
          updateField(
            "delivery",
            e.target.value
          )
        }
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          border: "1.5px solid #c8c2bb",
          backgroundColor: "white",
        }}
      >
        <option value="standard">
          Standard Delivery
        </option>

        <option value="express">
          Express Delivery
        </option>
      </select>

      <button
        onClick={handleNext}
        style={{
          width: "100%",
          padding: "14px",
          backgroundColor: "#1a1a1a",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontWeight: "700",
        }}
      >
        REVIEW ORDER
      </button>
    </div>
  );
}

// ============================================================
// STEP 2 — REVIEW & PAY
// ============================================================

function StepReview({
  formData,
  onBack,
  onPlaceOrder,
  isMobile,
}) {
  const { cartItems, totalPrice } =
    useCart();

  const [isLoading, setIsLoading] =
    useState(false);

  const totalNaira =
    totalPrice * USD_TO_NGN;

  const deliveryCost =
    formData.delivery === "express"
      ? 23900
      : totalNaira >= 199000
      ? 0
      : 15900;

  const grandTotalNaira = Math.round(
    totalNaira + deliveryCost
  );

  const handlePay = async () => {
    if (isLoading) return;

    if (!formData.email) {
      alert(
        "Your account does not have an email address."
      );
      return;
    }

    setIsLoading(true);

    try {
      const PaystackPop =
        (
          await import(
            "@paystack/inline-js"
          )
        ).default;

      const paystack =
        new PaystackPop();

      paystack.newTransaction({
        key: PAYSTACK_PUBLIC_KEY,

        email: formData.email,

        amount:
          grandTotalNaira * 100,

        currency: "NGN",

        onSuccess: async (transaction) => {
          try {
            await onPlaceOrder(
              transaction.reference
            );
          } catch (error) {
            console.error(
              "Order creation failed:",
              error
            );

            alert(
              error.message ||
                "Payment succeeded, but we could not create your order. Please contact support."
            );
          } finally {
            setIsLoading(false);
          }
        },

        onCancel: () => {
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error(
        "Paystack error:",
        error
      );

      setIsLoading(false);

      alert(
        "Could not initialize payment. Please try again."
      );
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: isMobile
          ? "32px 5%"
          : "48px 20px",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <h2
        style={{
          fontFamily: "'Georgia', serif",
          fontWeight: "900",
          fontSize: isMobile
            ? "1.4rem"
            : "1.7rem",
        }}
      >
        Review & Pay
      </h2>

      <div
        style={{
          backgroundColor: "white",
          padding: "16px",
          border:
            "1px solid #e8e4df",
          marginTop: "20px",
          boxSizing: "border-box",
        }}
      >
        {cartItems.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              padding: "12px 0",
              borderBottom:
                "1px solid #f4f0eb",
              fontSize: "0.9rem",
            }}
          >
            <span
              style={{
                paddingRight: "8px",
              }}
            >
              {item.name}{" "}
              (x{item.quantity})
            </span>

            <span
              style={{
                flexShrink: 0,
              }}
            >
              {formatNaira(
                item.price *
                  item.quantity
              )}
            </span>
          </div>
        ))}

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent:
              "space-between",
            fontSize: "0.95rem",
            fontFamily: "sans-serif",
          }}
        >
          <span>Delivery</span>

          <span>
            {deliveryCost === 0
              ? "FREE"
              : `₦${deliveryCost.toLocaleString(
                  "en-NG"
                )}`}
          </span>
        </div>

        <div
          style={{
            marginTop: "15px",
            paddingTop: "15px",
            borderTop:
              "1px solid #e8e4df",
            fontWeight: "700",
            fontSize: isMobile
              ? "1.1rem"
              : "1.2rem",
            display: "flex",
            justifyContent:
              "space-between",
          }}
        >
          <span>Total</span>

          <span>
            ₦
            {grandTotalNaira.toLocaleString(
              "en-NG"
            )}
          </span>
        </div>
      </div>

      <button
        onClick={handlePay}
        disabled={isLoading}
        style={{
          width: "100%",
          padding: "16px",
          backgroundColor: isLoading
            ? "#888"
            : "#2d6a2d",
          color: "white",
          border: "none",
          marginTop: "20px",
          fontWeight: "700",
          cursor: isLoading
            ? "not-allowed"
            : "pointer",
        }}
      >
        {isLoading
          ? "PROCESSING..."
          : `PAY ₦${grandTotalNaira.toLocaleString(
              "en-NG"
            )}`}
      </button>

      <button
        onClick={onBack}
        disabled={isLoading}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          marginTop: "16px",
          cursor: isLoading
            ? "not-allowed"
            : "pointer",
          textDecoration:
            "underline",
          padding: "8px 0",
        }}
      >
        Back to Delivery
      </button>
    </div>
  );
}

// ============================================================
// MAIN CHECKOUT
// ============================================================

export default function CheckoutPage() {
  const navigate = useNavigate();

  const {
    cartItems,
    clearCart,
  } = useCart();

  const {
    user,
    getToken,
    loading: authLoading,
  } = useAuth();

  const [isMobile, setIsMobile] =
    useState(
      window.innerWidth < 768
    );

  const [currentStep, setCurrentStep] =
    useState(1);

  const [formData, setFormData] =
    useState({
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      postcode: "",
      delivery: "standard",
    });

  const [orderError, setOrderError] =
    useState("");

  // ----------------------------------------------------------
  // Responsive
  // ----------------------------------------------------------

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(
        window.innerWidth < 768
      );
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  // ----------------------------------------------------------
  // Populate user email
  // ----------------------------------------------------------

  useEffect(() => {
    if (!user) return;

    setFormData((previous) => ({
      ...previous,
      email:
        previous.email ||
        user.email ||
        "",
    }));
  }, [user]);

  // ----------------------------------------------------------
  // Empty cart
  // ----------------------------------------------------------

  if (!authLoading && cartItems.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#eae6e1",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "100px 20px",
            flex: 1,
          }}
        >
          <h2>Basket is empty.</h2>

          <button
            onClick={() =>
              navigate("/shop")
            }
            style={{
              padding: "12px 28px",
              backgroundColor:
                "#8b7355",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Continue Shopping
          </button>
        </div>

        <Footer />
      </div>
    );
  }

  // ----------------------------------------------------------
  // Authentication loading
  // ----------------------------------------------------------

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        Checking your account...
      </div>
    );
  }

  // ----------------------------------------------------------
  // ONLY LOGGED-IN USERS CAN CHECKOUT
  // ----------------------------------------------------------

  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#eae6e1",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "48px 30px",
              maxWidth: "450px",
              width: "100%",
              textAlign: "center",
              border:
                "1px solid #e8e4df",
            }}
          >
            <div
              style={{
                fontSize: "2.5rem",
                marginBottom: "15px",
              }}
            >
              🔐
            </div>

            <h2
              style={{
                fontFamily:
                  "'Georgia', serif",
                margin:
                  "0 0 10px",
              }}
            >
              Sign in to checkout
            </h2>

            <p
              style={{
                color: "#7a6e68",
                fontFamily:
                  "sans-serif",
                fontSize:
                  "0.9rem",
                lineHeight: 1.6,
              }}
            >
              Please sign in to your
              account before completing
              your purchase.
            </p>

            <button
              onClick={() =>
                navigate("/login")
              }
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "15px",
                backgroundColor:
                  "#1a1a1a",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontWeight: "700",
              }}
            >
              SIGN IN
            </button>

            <button
              onClick={() =>
                navigate("/shop")
              }
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "10px",
                background: "none",
                border:
                  "1px solid #1a1a1a",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              BACK TO SHOP
            </button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // ----------------------------------------------------------
  // PLACE ORDER
  // ----------------------------------------------------------

  const handlePlaceOrder = async (
    paystackReference
  ) => {
    setOrderError("");

    try {
      const token =
        await getToken();

      if (!token) {
        throw new Error(
          "Authentication token unavailable."
        );
      }

      const orderItems =
        cartItems.map((item) => ({
          productId:
            item.id ||
            item._id ||
            null,
          name: item.name,
          price: Number(
            item.price
          ),
          quantity: Number(
            item.quantity
          ),
          image: item.image,
        }));

      const response =
        await fetch(
          `${API}/orders`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              orderNumber:
                `AHS-${Date.now()}`,

              items: orderItems,

              total: Number(
                cartItems.reduce(
                  (sum, item) =>
                    sum +
                    Number(item.price) *
                      Number(item.quantity),
                  0
                ).toFixed(2)
              ),

              delivery:
                formData.delivery,

              address:
                formData.address,

              city:
                formData.city,

              postcode:
                formData.postcode,

              paystackRef:
                paystackReference,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Could not save order."
        );
      }

      /*
       * IMPORTANT:
       * Only clear the cart AFTER the backend
       * confirms that the order was successfully
       * created.
       */

      clearCart();

      navigate(
        "/order-confirmed",
        {
          state: {
            ...formData,

            ref:
              paystackReference,

            orderNumber:
              data.order?.orderNumber,

            items: cartItems,

            total:
              data.order?.total,
          },
        }
      );

      return data;
    } catch (error) {
      console.error(
        "Order creation error:",
        error
      );

      setOrderError(
        error.message ||
          "Payment succeeded, but we could not save your order."
      );

      throw error;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor:
          "#eae6e1",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: isMobile
            ? "16px 4%"
            : "16px 6%",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          borderBottom:
            "1px solid #e8e4df",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontWeight: "900",
            fontFamily:
              "'Georgia', serif",
            fontSize: isMobile
              ? "1.1rem"
              : "1.2rem",
          }}
        >
          Apex Home
        </div>

        <div
          style={{
            fontSize: isMobile
              ? "0.85rem"
              : "0.95rem",
          }}
        >
          🔒 Secure
        </div>
      </div>

      <StepBar
        currentStep={currentStep}
        isMobile={isMobile}
      />

      {orderError && (
        <div
          style={{
            maxWidth: "600px",
            margin: "20px auto 0",
            padding: "14px 20px",
            backgroundColor: "#fff1f1",
            color: "#8b0000",
            border:
              "1px solid #e5bcbc",
            fontFamily:
              "sans-serif",
            fontSize: "0.85rem",
          }}
        >
          {orderError}
        </div>
      )}

      {currentStep === 1 && (
        <StepDelivery
          formData={formData}
          setFormData={
            setFormData
          }
          onNext={() =>
            setCurrentStep(2)
          }
          isMobile={isMobile}
        />
      )}

      {currentStep === 2 && (
        <StepReview
          formData={formData}
          onBack={() =>
            setCurrentStep(1)
          }
          onPlaceOrder={
            handlePlaceOrder
          }
          isMobile={isMobile}
        />
      )}

      <Footer />
    </div>
  );
}