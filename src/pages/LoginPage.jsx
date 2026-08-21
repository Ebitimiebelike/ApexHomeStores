import { SignIn } from "@clerk/clerk-react";
import Footer from "../components/Footer";

export default function LoginPage() {
  return (
    <div style={{
      minHeight: "100vh", backgroundColor: "#eae6e1",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "60px 20px 80px",
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
            card:        { boxShadow: "none", border: "1px solid #e8e4df" },
            headerTitle: { fontFamily: "Georgia, serif" },
          },
        }}
      />
      <Footer />
    </div>
  );
}