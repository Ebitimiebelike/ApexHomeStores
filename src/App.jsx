import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmed from "./pages/OrderConfirmed";
import RegisterPage from "./pages/RegisterPage";
import AboutPage   from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound    from "./pages/NotFound";
import AccountPage from "./pages/AccountPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import CheckmailPage from "./pages/CheckmailPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import ReturnsPolicyPage from "./pages/ReturnsPolicyPage";
import FaqPage from "./pages/FaqPage";

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmed" element={<OrderConfirmed />} />
        <Route path="/orders" element={<OrderTrackingPage />} />
        <Route path="/returns" element={<ReturnsPolicyPage />} />
        <Route path="/faqs" element={<FaqPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login/*"    element={<LoginPage />} />
        <Route path="/register/*" element={<RegisterPage />} />
        <Route path="/about"   element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/account"      element={<AccountPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/check-email"  element={<CheckmailPage />} />
        <Route path="*"             element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;