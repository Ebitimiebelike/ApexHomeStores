import Footer from "./Footer";

// Layout wraps every page — add it to your route definitions in App.jsx
// by wrapping all <Route> elements inside <Route element={<Layout />}>
// OR simply import and use <Footer /> at the bottom of each page.
// The simplest approach: just import Footer in each page file.

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}