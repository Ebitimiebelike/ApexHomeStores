import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();

  const values = [
    { icon: "🪵", title: "Crafted to Last",     desc: "Every piece is built from sustainably sourced solid wood and premium fabrics — designed to be handed down, not thrown out." },
    { icon: "🚚", title: "Delivered with Care",  desc: "White-glove delivery to any room in your home. Our team assembles everything and takes all packaging away." },
    { icon: "↩️", title: "Hassle-Free Returns",  desc: "Not quite right? Return any item within 30 days, no questions asked. We'll collect it free of charge." },
    { icon: "🌱", title: "Sustainably Sourced",  desc: "We work only with suppliers who meet our strict environmental standards. Every purchase plants one tree." },
  ];

  const team = [
    { name: "Ebitimi Ebelike", role: "Founder & CEO",       initial: "E" },
    { name: "Sarah Okonkwo",   role: "Head of Design",       initial: "S" },
    { name: "James Whitfield", role: "Operations Director",  initial: "J" },
    { name: "Amara Cole",      role: "Customer Experience",  initial: "A" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#eae6e1",
      fontFamily: "'Georgia', serif" }}>

      {/* Hero banner */}
      <div style={{ backgroundColor: "#2d1a0e", padding: "80px 6%",
        textAlign: "center" }}>
        <p style={{ margin: "0 0 12px", fontSize: "0.78rem",
          color: "#f5d98b", letterSpacing: "3px",
          textTransform: "uppercase", fontFamily: "sans-serif" }}>
          Our Story
        </p>
        <h1 style={{ margin: "0 0 20px", fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: "900", color: "white", lineHeight: 1.2 }}>
          Furniture made for<br />real homes, real lives.
        </h1>
        <p style={{ margin: "0 auto", maxWidth: "560px",
          color: "#d4c9bc", fontSize: "1rem",
          fontFamily: "sans-serif", lineHeight: 1.8 }}>
          Apex Home Furnishings was founded in 2018 with one belief —
          beautiful furniture shouldn't cost the earth, and cheap furniture
          shouldn't cost the planet.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ backgroundColor: "#8b7355", padding: "32px 6%",
        display: "flex", justifyContent: "space-around",
        flexWrap: "wrap", gap: "20px" }}>
        {[
          { number: "50,000+", label: "Homes furnished" },
          { number: "4.9★",    label: "Average rating" },
          { number: "200+",    label: "Products in stock" },
          { number: "30 days", label: "Free returns" },
        ].map(stat => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.8rem", fontWeight: "900",
              color: "white", lineHeight: 1.1 }}>
              {stat.number}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#f5ede4",
              fontFamily: "sans-serif", marginTop: "4px",
              letterSpacing: "1px", textTransform: "uppercase" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Our values */}
      <div style={{ padding: "72px 6%" }}>
        <h2 style={{ margin: "0 0 10px", fontSize: "1.6rem",
          fontWeight: "900", color: "#1a1a1a", textAlign: "center" }}>
          What we stand for
        </h2>
        <p style={{ margin: "0 auto 48px", textAlign: "center",
          color: "#7a6e68", fontFamily: "sans-serif",
          maxWidth: "480px", lineHeight: 1.7 }}>
          These four principles guide every decision we make —
          from the factories we work with to the way we pack your order.
        </p>
        <div style={{ display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "24px" }}>
          {values.map(v => (
            <div key={v.title} style={{ backgroundColor: "white",
              padding: "28px", border: "1px solid #e8e4df" }}>
              <div style={{ fontSize: "2rem", marginBottom: "14px" }}>
                {v.icon}
              </div>
              <h3 style={{ margin: "0 0 10px", fontSize: "1rem",
                fontWeight: "700", color: "#1a1a1a" }}>
                {v.title}
              </h3>
              <p style={{ margin: 0, fontSize: "0.87rem",
                color: "#5a5550", fontFamily: "sans-serif", lineHeight: 1.7 }}>
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div style={{ backgroundColor: "white", padding: "72px 6%",
        borderTop: "1px solid #e8e4df" }}>
        <h2 style={{ margin: "0 0 10px", fontSize: "1.6rem",
          fontWeight: "900", color: "#1a1a1a", textAlign: "center" }}>
          Meet the team
        </h2>
        <p style={{ margin: "0 auto 48px", textAlign: "center",
          color: "#7a6e68", fontFamily: "sans-serif", maxWidth: "400px" }}>
          A small team with a big obsession for great furniture.
        </p>
        <div style={{ display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "24px", maxWidth: "900px", margin: "0 auto" }}>
          {team.map(person => (
            <div key={person.name} style={{ textAlign: "center" }}>
              {/* Avatar circle with initial */}
              <div style={{ width: "80px", height: "80px",
                borderRadius: "50%", backgroundColor: "#eae6e1",
                display: "flex", alignItems: "center",
                justifyContent: "center", margin: "0 auto 14px",
                fontSize: "1.6rem", fontWeight: "900",
                color: "#8b7355", border: "3px solid #8b7355" }}>
                {person.initial}
              </div>
              <p style={{ margin: "0 0 4px", fontWeight: "700",
                fontSize: "0.95rem", color: "#1a1a1a" }}>
                {person.name}
              </p>
              <p style={{ margin: 0, fontSize: "0.8rem",
                color: "#7a6e68", fontFamily: "sans-serif" }}>
                {person.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "72px 6%", textAlign: "center" }}>
        <h2 style={{ margin: "0 0 12px", fontSize: "1.5rem",
          fontWeight: "900", color: "#1a1a1a" }}>
          Ready to find your perfect piece?
        </h2>
        <p style={{ margin: "0 0 28px", color: "#7a6e68",
          fontFamily: "sans-serif" }}>
          Browse over 200 handpicked furniture pieces, delivered to your door.
        </p>
        <button onClick={() => navigate("/shop")}
          style={{ padding: "15px 48px", backgroundColor: "#8b7355",
            color: "white", border: "none", fontSize: "0.95rem",
            fontWeight: "700", letterSpacing: "1px",
            cursor: "pointer", fontFamily: "sans-serif" }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6b5a50"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#8b7355"}>
          Shop Now
        </button>
      </div>
    </div>
  );
}