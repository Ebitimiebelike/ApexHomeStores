import { SignIn } from "@clerk/clerk-react";
import Footer from "../components/Footer";

export default function LoginPage() {
  return (
    <div style={{
      minHeight: "100vh", backgroundColor: "#eae6e1",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "32px 12px 60px", boxSizing: "border-box",
    }}>
      <SignIn
        routing="path"
        path="/login"
        signUpUrl="/register"
        afterSignInUrl="/"
        appearance={{
          variables: {
            colorPrimary:    "#8b7355",
            colorBackground: "#ffffff",
            fontFamily:      "Georgia, serif",
          },
          elements: {
            rootBox:     { width: "100%", maxWidth: "420px" },
            card:        { width: "100%", boxShadow: "none", border: "1px solid #e8e4df" },
            headerTitle: { fontFamily: "Georgia, serif" },
          },
        }}
      />
      <Footer />
    </div>
  );
}