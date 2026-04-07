import { Routes, Route } from "react-router-dom";

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
import Verify from "./pages/Verify";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmed" element={<OrderConfirmed />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about"   element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*"        element={<NotFound />} />  {/* the * catches everything else */}
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
    </>
  );
}

export default App;