import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { formatNaira } from "../Utils/currency";

import Footer from "../components/Footer";

const API = `${(
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "")}/api`.replace("/api/api", "/api");

export default function AccountPage() {
  const {
    user,
    logout,
    getToken,
    loading: authLoading,
  } = useAuth();

  const navigate = useNavigate();

  const [isMobile, setIsMobile] =
    useState(
      window.innerWidth < 768
    );

  const [activeTab, setActiveTab] =
    useState("Overview");

  const [orders, setOrders] =
    useState([]);

  const [ordersLoading, setOrdersLoading] =
    useState(false);

  const [ordersError, setOrdersError] =
    useState("");

  const [expandedOrder, setExpandedOrder] =
    useState(null);

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
  // Protect account page
  // ----------------------------------------------------------

  useEffect(() => {
    if (
      !authLoading &&
      !user
    ) {
      navigate("/login", {
        replace: true,
      });
    }
  }, [
    authLoading,
    user,
    navigate,
  ]);

  // ----------------------------------------------------------
  // Fetch orders
  // ----------------------------------------------------------

  useEffect(() => {
    if (
      activeTab !== "Orders" ||
      !user ||
      authLoading
    ) {
      return;
    }

    let cancelled = false;

    const fetchOrders = async () => {
      setOrdersLoading(true);
      setOrdersError("");

      try {
        const token =
          await getToken();

        if (!token) {
          throw new Error(
            "No authentication token available."
          );
        }

        const response =
          await fetch(
            `${API}/orders`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Could not load orders."
          );
        }

        if (!cancelled) {
          setOrders(
            Array.isArray(
              data.orders
            )
              ? data.orders
              : []
          );
        }
      } catch (error) {
        console.error(
          "Could not load orders:",
          error
        );

        if (!cancelled) {
          setOrdersError(
            error.message ||
              "Could not load your orders."
          );

          setOrders([]);
        }
      } finally {
        if (!cancelled) {
          setOrdersLoading(
            false
          );
        }
      }
    };

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, [
    activeTab,
    user,
    authLoading,
    getToken,
  ]);

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "center",
          fontFamily:
            "sans-serif",
        }}
      >
        Loading account...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  };

  const formatDate = (
    dateString
  ) => {
    if (!dateString) {
      return "Unknown date";
    }

    return new Date(
      dateString
    ).toLocaleDateString(
      "en-NG",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  const tabs = [
    "Overview",
    "Orders",
    "Settings",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor:
          "#eae6e1",
        fontFamily:
          "'Georgia', serif",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          backgroundColor:
            "#2d1a0e",
          padding: isMobile
            ? "40px 6%"
            : "52px 6%",
        }}
      >
        <p
          style={{
            margin:
              "0 0 8px",
            fontSize:
              "0.75rem",
            color:
              "#f5d98b",
            letterSpacing:
              "3px",
            textTransform:
              "uppercase",
            fontFamily:
              "sans-serif",
          }}
        >
          My Account
        </p>

        <h1
          style={{
            margin:
              "0 0 6px",
            fontSize: isMobile
              ? "1.6rem"
              : "2rem",
            fontWeight:
              "900",
            color:
              "white",
          }}
        >
          Welcome back,{" "}
          {
            user.name.split(
              " "
            )[0]
          }
        </h1>

        <p
          style={{
            margin: 0,
            color:
              "#9a9088",
            fontSize:
              "0.88rem",
            fontFamily:
              "sans-serif",
          }}
        >
          {user.email}
        </p>
      </div>

      {/* TABS */}

      <div
        style={{
          backgroundColor:
            "white",
          borderBottom:
            "2px solid #e8e4df",
          padding: "0 6%",
          display: "flex",
          overflowX:
            "auto",
        }}
      >
        {tabs.map(
          (tab) => (
            <button
              key={tab}
              onClick={() =>
                setActiveTab(
                  tab
                )
              }
              style={{
                background:
                  "none",
                border: "none",
                borderBottom:
                  activeTab ===
                  tab
                    ? "3px solid #8b7355"
                    : "3px solid transparent",
                padding:
                  "14px 20px",
                fontSize:
                  "0.87rem",
                fontWeight:
                  activeTab ===
                  tab
                    ? "700"
                    : "400",
                color:
                  activeTab ===
                  tab
                    ? "#8b7355"
                    : "#5a5550",
                cursor:
                  "pointer",
                fontFamily:
                  "sans-serif",
                marginBottom:
                  "-2px",
                whiteSpace:
                  "nowrap",
              }}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* CONTENT */}

      <div
        style={{
          flex: 1,
          padding: isMobile
            ? "32px 6%"
            : "48px 6%",
          maxWidth:
            "900px",
          width:
            "100%",
          boxSizing:
            "border-box",
        }}
      >
        {/* OVERVIEW */}

        {activeTab ===
          "Overview" && (
          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                isMobile
                  ? "1fr"
                  : "1fr 1fr",
              gap: "20px",
            }}
          >
            {[
              {
                icon: "📦",
                title:
                  "My Orders",
                desc:
                  "Track and view your order history.",
                btn:
                  "View Orders",
                action: () =>
                  setActiveTab(
                    "Orders"
                  ),
              },

              {
                icon: "❤️",
                title:
                  "Shortlist",
                desc:
                  "Items you have saved for later.",
                btn:
                  "Browse Products",
                action: () =>
                  navigate(
                    "/shop"
                  ),
              },

              {
                icon: "📍",
                title:
                  "Delivery Addresses",
                desc:
                  "Manage your saved delivery addresses.",
                btn:
                  "Manage",
                action: () =>
                  setActiveTab(
                    "Settings"
                  ),
              },

              {
                icon: "🔒",
                title:
                  "Security",
                desc:
                  "Update your account settings.",
                btn:
                  "Account Settings",
                action: () =>
                  setActiveTab(
                    "Settings"
                  ),
              },
            ].map(
              (card) => (
                <div
                  key={
                    card.title
                  }
                  style={{
                    backgroundColor:
                      "white",
                    border:
                      "1px solid #e8e4df",
                    padding:
                      "24px",
                    display:
                      "flex",
                    flexDirection:
                      "column",
                    gap:
                      "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize:
                        "1.8rem",
                    }}
                  >
                    {
                      card.icon
                    }
                  </div>

                  <h3
                    style={{
                      margin: 0,
                      fontSize:
                        "1rem",
                      fontWeight:
                        "700",
                    }}
                  >
                    {
                      card.title
                    }
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      fontSize:
                        "0.85rem",
                      color:
                        "#7a6e68",
                      fontFamily:
                        "sans-serif",
                      lineHeight:
                        1.6,
                    }}
                  >
                    {
                      card.desc
                    }
                  </p>

                  <button
                    onClick={
                      card.action
                    }
                    style={{
                      marginTop:
                        "auto",
                      padding:
                        "10px 20px",
                      backgroundColor:
                        "transparent",
                      border:
                        "2px solid #8b7355",
                      color:
                        "#8b7355",
                      fontSize:
                        "0.82rem",
                      fontWeight:
                        "600",
                      cursor:
                        "pointer",
                      fontFamily:
                        "sans-serif",
                      alignSelf:
                        "flex-start",
                    }}
                  >
                    {
                      card.btn
                    }
                  </button>
                </div>
              )
            )}
          </div>
        )}

        {/* ORDERS */}

        {activeTab ===
          "Orders" && (
          <div>
            <h2
              style={{
                margin:
                  "0 0 24px",
                fontSize:
                  "1.2rem",
                fontWeight:
                  "900",
                color:
                  "#1a1a1a",
              }}
            >
              Order History
            </h2>

            {ordersError && (
              <div
                style={{
                  backgroundColor:
                    "#fff1f1",
                  border:
                    "1px solid #e5bcbc",
                  color:
                    "#8b0000",
                  padding:
                    "15px",
                  marginBottom:
                    "16px",
                  fontFamily:
                    "sans-serif",
                  fontSize:
                    "0.85rem",
                }}
              >
                {ordersError}
              </div>
            )}

            {ordersLoading && (
              <div
                style={{
                  textAlign:
                    "center",
                  padding:
                    "48px",
                  color:
                    "#7a6e68",
                  fontFamily:
                    "sans-serif",
                }}
              >
                Loading your
                orders...
              </div>
            )}

            {!ordersLoading &&
              !ordersError &&
              orders.length ===
                0 && (
                <div
                  style={{
                    backgroundColor:
                      "white",
                    border:
                      "1px solid #e8e4df",
                    padding:
                      "48px",
                    textAlign:
                      "center",
                  }}
                >
                  <p
                    style={{
                      fontSize:
                        "2.5rem",
                      marginBottom:
                        "12px",
                    }}
                  >
                    📦
                  </p>

                  <h3
                    style={{
                      margin:
                        "0 0 8px",
                      fontSize:
                        "1.1rem",
                    }}
                  >
                    No orders yet
                  </h3>

                  <p
                    style={{
                      margin:
                        "0 0 24px",
                      color:
                        "#7a6e68",
                      fontFamily:
                        "sans-serif",
                      fontSize:
                        "0.88rem",
                    }}
                  >
                    When you place
                    an order, it
                    will appear
                    here.
                  </p>

                  <button
                    onClick={() =>
                      navigate(
                        "/shop"
                      )
                    }
                    style={{
                      padding:
                        "12px 32px",
                      backgroundColor:
                        "#8b7355",
                      color:
                        "white",
                      border:
                        "none",
                      cursor:
                        "pointer",
                      fontFamily:
                        "sans-serif",
                      fontWeight:
                        "600",
                    }}
                  >
                    Start
                    Shopping
                  </button>
                </div>
              )}

            {!ordersLoading &&
              orders.length >
                0 && (
                <div
                  style={{
                    display:
                      "flex",
                    flexDirection:
                      "column",
                    gap: "16px",
                  }}
                >
                  {orders.map(
                    (order) => {
                      const isExpanded =
                        expandedOrder ===
                        order._id;

                      return (
                        <div
                          key={
                            order._id
                          }
                          style={{
                            backgroundColor:
                              "white",
                            border:
                              "1px solid #e8e4df",
                          }}
                        >
                          <div
                            onClick={() =>
                              setExpandedOrder(
                                isExpanded
                                  ? null
                                  : order._id
                              )
                            }
                            style={{
                              padding:
                                "20px 24px",
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              alignItems:
                                "center",
                              cursor:
                                "pointer",
                              flexWrap:
                                "wrap",
                              gap:
                                "12px",
                            }}
                          >
                            <div
                              style={{
                                display:
                                  "flex",
                                flexDirection:
                                  "column",
                                gap:
                                  "4px",
                              }}
                            >
                              <span
                                style={{
                                  fontWeight:
                                    "700",
                                  fontSize:
                                    "0.95rem",
                                  fontFamily:
                                    "sans-serif",
                                }}
                              >
                                {
                                  order.orderNumber
                                }
                              </span>

                              <span
                                style={{
                                  fontSize:
                                    "0.8rem",
                                  color:
                                    "#7a6e68",
                                  fontFamily:
                                    "sans-serif",
                                }}
                              >
                                {formatDate(
                                  order.createdAt
                                )}{" "}
                                ·{" "}
                                {
                                  order
                                    .items
                                    ?.length
                                }{" "}
                                {order
                                  .items
                                  ?.length ===
                                1
                                  ? "item"
                                  : "items"}
                              </span>
                            </div>

                            <div
                              style={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                gap:
                                  "20px",
                              }}
                            >
                              <span
                                style={{
                                  padding:
                                    "4px 12px",
                                  backgroundColor:
                                    order.status ===
                                    "confirmed"
                                      ? "#e8f5e9"
                                      : "#fff3e0",
                                  color:
                                    order.status ===
                                    "confirmed"
                                      ? "#2d6a2d"
                                      : "#e65100",
                                  fontSize:
                                    "0.75rem",
                                  fontWeight:
                                    "700",
                                  fontFamily:
                                    "sans-serif",
                                  borderRadius:
                                    "20px",
                                  textTransform:
                                    "uppercase",
                                }}
                              >
                                {
                                  order.status
                                }
                              </span>

                              <span
                                style={{
                                  fontWeight:
                                    "700",
                                  fontFamily:
                                    "sans-serif",
                                  color:
                                    "#8b7355",
                                }}
                              >
                                {formatNaira(
                                  order.total
                                )}
                              </span>

                              <span
                                style={{
                                  transform:
                                    isExpanded
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                  transition:
                                    "transform 0.2s",
                                }}
                              >
                                ▼
                              </span>
                            </div>
                          </div>

                          {isExpanded && (
                            <div
                              style={{
                                borderTop:
                                  "1px solid #e8e4df",
                                padding:
                                  "20px 24px",
                              }}
                            >
                              {order.items?.map(
                                (
                                  item,
                                  index
                                ) => (
                                  <div
                                    key={
                                      index
                                    }
                                    style={{
                                      display:
                                        "flex",
                                      gap:
                                        "14px",
                                      alignItems:
                                        "center",
                                      padding:
                                        "10px 0",
                                      borderBottom:
                                        index <
                                        order
                                          .items
                                          .length -
                                          1
                                          ? "1px solid #f4f0eb"
                                          : "none",
                                    }}
                                  >
                                    {item.image && (
                                      <img
                                        src={
                                          item.image
                                        }
                                        alt={
                                          item.name
                                        }
                                        style={{
                                          width:
                                            "56px",
                                          height:
                                            "48px",
                                          objectFit:
                                            "cover",
                                          flexShrink:
                                            0,
                                        }}
                                      />
                                    )}

                                    <div
                                      style={{
                                        flex:
                                          1,
                                      }}
                                    >
                                      <p
                                        style={{
                                          margin:
                                            "0 0 2px",
                                          fontSize:
                                            "0.88rem",
                                          fontWeight:
                                            "600",
                                          fontFamily:
                                            "sans-serif",
                                        }}
                                      >
                                        {
                                          item.name
                                        }
                                      </p>

                                      <p
                                        style={{
                                          margin:
                                            0,
                                          fontSize:
                                            "0.78rem",
                                          color:
                                            "#7a6e68",
                                          fontFamily:
                                            "sans-serif",
                                        }}
                                      >
                                        Qty:{" "}
                                        {
                                          item.quantity
                                        }
                                      </p>
                                    </div>

                                    <span
                                      style={{
                                        fontWeight:
                                          "600",
                                        fontFamily:
                                          "sans-serif",
                                      }}
                                    >
                                      {formatNaira(
                                        Number(
                                          item.price
                                        ) *
                                          Number(
                                            item.quantity
                                          )
                                      )}
                                    </span>
                                  </div>
                                )
                              )}

                              <div
                                style={{
                                  marginTop:
                                    "20px",
                                  display:
                                    "flex",
                                  gap:
                                    "40px",
                                  flexWrap:
                                    "wrap",
                                }}
                              >
                                <div>
                                  <p
                                    style={{
                                      margin:
                                        "0 0 4px",
                                      fontSize:
                                        "0.75rem",
                                      fontWeight:
                                        "700",
                                      fontFamily:
                                        "sans-serif",
                                      textTransform:
                                        "uppercase",
                                    }}
                                  >
                                    Delivering
                                    to
                                  </p>

                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize:
                                        "0.85rem",
                                      color:
                                        "#5a5550",
                                      fontFamily:
                                        "sans-serif",
                                      lineHeight:
                                        1.6,
                                    }}
                                  >
                                    {
                                      order.address
                                    }
                                    <br />
                                    {
                                      order.city
                                    }
                                    ,{" "}
                                    {
                                      order.postcode
                                    }
                                  </p>
                                </div>

                                {order.paystackRef && (
                                  <div>
                                    <p
                                      style={{
                                        margin:
                                          "0 0 4px",
                                        fontSize:
                                          "0.75rem",
                                        fontWeight:
                                          "700",
                                        fontFamily:
                                          "sans-serif",
                                        textTransform:
                                          "uppercase",
                                      }}
                                    >
                                      Payment
                                      Reference
                                    </p>

                                    <p
                                      style={{
                                        margin: 0,
                                        fontSize:
                                          "0.85rem",
                                        color:
                                          "#5a5550",
                                        fontFamily:
                                          "sans-serif",
                                        wordBreak:
                                          "break-all",
                                      }}
                                    >
                                      {
                                        order.paystackRef
                                      }
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              )}
          </div>
        )}

        {/* SETTINGS */}

        {activeTab ===
          "Settings" && (
          <div
            style={{
              maxWidth:
                "480px",
            }}
          >
            <h2
              style={{
                margin:
                  "0 0 24px",
                fontSize:
                  "1.2rem",
                fontWeight:
                  "900",
              }}
            >
              Account Settings
            </h2>

            <div
              style={{
                backgroundColor:
                  "white",
                border:
                  "1px solid #e8e4df",
                padding:
                  "28px",
                marginBottom:
                  "16px",
              }}
            >
              <h3
                style={{
                  margin:
                    "0 0 16px",
                  fontSize:
                    "0.95rem",
                }}
              >
                Personal Details
              </h3>

              <div
                style={{
                  marginBottom:
                    "16px",
                }}
              >
                <label
                  style={{
                    display:
                      "block",
                    fontSize:
                      "0.78rem",
                    fontWeight:
                      "600",
                    color:
                      "#7a6e68",
                    fontFamily:
                      "sans-serif",
                    marginBottom:
                      "6px",
                  }}
                >
                  Full Name
                </label>

                <div
                  style={{
                    padding:
                      "11px 14px",
                    border:
                      "1.5px solid #e8e4df",
                    backgroundColor:
                      "#f9f6f2",
                    fontFamily:
                      "sans-serif",
                  }}
                >
                  {user.name}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display:
                      "block",
                    fontSize:
                      "0.78rem",
                    fontWeight:
                      "600",
                    color:
                      "#7a6e68",
                    fontFamily:
                      "sans-serif",
                    marginBottom:
                      "6px",
                  }}
                >
                  Email
                </label>

                <div
                  style={{
                    padding:
                      "11px 14px",
                    border:
                      "1.5px solid #e8e4df",
                    backgroundColor:
                      "#f9f6f2",
                    fontFamily:
                      "sans-serif",
                  }}
                >
                  {user.email}
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor:
                  "white",
                border:
                  "1px solid #e8e4df",
                padding:
                  "28px",
              }}
            >
              <h3
                style={{
                  margin:
                    "0 0 8px",
                  fontSize:
                    "0.95rem",
                }}
              >
                Sign Out
              </h3>

              <p
                style={{
                  margin:
                    "0 0 16px",
                  fontSize:
                    "0.85rem",
                  color:
                    "#7a6e68",
                  fontFamily:
                    "sans-serif",
                }}
              >
                You will be signed
                out and returned to
                the homepage.
              </p>

              <button
                onClick={
                  handleLogout
                }
                style={{
                  padding:
                    "11px 28px",
                  backgroundColor:
                    "#8b0000",
                  color:
                    "white",
                  border:
                    "none",
                  cursor:
                    "pointer",
                  fontFamily:
                    "sans-serif",
                  fontWeight:
                    "600",
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}