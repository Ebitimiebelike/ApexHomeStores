import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import products from "../data/products";
import Footer from "../components/Footer";

const featuredProducts = products.slice(0, 4);

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Hero />
      <main style={{ backgroundColor: "#f7f1e9", minHeight: "100vh", paddingTop: "24px" }}>
        <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 4%" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "32px", alignItems: "center", textAlign: "center" }}>
            <div style={{ maxWidth: "820px" }}>
              <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: "2px", color: "#8b7355", fontSize: "0.8rem", fontWeight: "700", fontFamily: "sans-serif" }}>
                Welcome to Apex Home Furnishings
              </p>
              <h1 style={{ margin: "16px 0 0", fontSize: "clamp(2.4rem, 4vw, 4.5rem)", lineHeight: 1.02, fontWeight: "900", color: "#1a1a1a", fontFamily: "'Georgia', serif" }}>
                Furniture designed for living beautifully.
              </h1>
              <p style={{ margin: "22px 0 0", color: "#5a5550", fontSize: "1rem", lineHeight: 1.8, fontFamily: "sans-serif" }}>
                Discover handcrafted couches, dining sets, bedroom essentials and accessories that bring warmth, comfort, and timeless style into every room.
              </p>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px" }}>
              <button onClick={() => navigate("/shop")} style={{ minWidth: "160px", padding: "14px 18px", border: "none", backgroundColor: "#8b7355", color: "white", fontWeight: "700", cursor: "pointer", borderRadius: "6px", fontFamily: "sans-serif" }}>
                Shop the Collection
              </button>
              <button onClick={() => navigate("/about")} style={{ minWidth: "160px", padding: "14px 18px", border: "2px solid #8b7355", background: "transparent", color: "#1a1a1a", fontWeight: "700", cursor: "pointer", borderRadius: "6px", fontFamily: "sans-serif" }}>
                Learn More
              </button>
            </div>
          </div>

          <div style={{ marginTop: "48px", display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {[
              { title: "Free Delivery", detail: "Fast, safe delivery across Nigeria." },
              { title: "Premium Materials", detail: "Built with durable hardwood and artisanal finishes." },
              { title: "Secure Checkout", detail: "Safe online payment with secure verification." },
            ].map((item) => (
              <div key={item.title} style={{ padding: "24px", background: "white", border: "1px solid #e8e4df", borderRadius: "16px", minHeight: "120px" }}>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "700", color: "#1a1a1a", fontFamily: "'Georgia', serif" }}>{item.title}</h3>
                <p style={{ margin: "12px 0 0", color: "#5a5550", fontSize: "0.92rem", fontFamily: "sans-serif", lineHeight: 1.6 }}>{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: "60px", padding: "0 4% 40px" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "18px", flexWrap: "wrap" }}>
              <div>
                <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: "2px", color: "#8b7355", fontSize: "0.75rem", fontWeight: "700", fontFamily: "sans-serif" }}>
                  Featured Products
                </p>
                <h2 style={{ margin: "10px 0 0", fontSize: "2rem", fontWeight: "900", color: "#1a1a1a", fontFamily: "'Georgia', serif" }}>
                  Handpicked for your home.
                </h2>
              </div>
              <button onClick={() => navigate("/shop")} style={{ padding: "12px 18px", borderRadius: "6px", border: "2px solid #8b7355", background: "transparent", color: "#1a1a1a", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif" }}>
                Browse all products
              </button>
            </div>

            <div style={{ marginTop: "28px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
