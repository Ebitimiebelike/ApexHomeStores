// AuthContext.jsx
// Thin compatibility wrapper around Clerk.
// ClerkProvider in main.jsx handles the actual authentication.

import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";

/* eslint-disable react-refresh/only-export-components */

export function AuthProvider({ children }) {
  // Kept for backward compatibility.
  // ClerkProvider in main.jsx handles authentication.
  return children;
}

// This is the hook your app uses.
// It maps Clerk's data to the shape your app already expects.
export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut, getToken } = useClerkAuth();

  return {
    // Map Clerk's user to your existing user shape
    user:
      isSignedIn && user
        ? {
            id: user.id,
            name: user.fullName || user.firstName || "User",
            email: user.primaryEmailAddress?.emailAddress || "",
          }
        : null,

    loading: !isLoaded,
    isLoggedIn: !!isSignedIn,

    // Used to authenticate API calls to your backend
    getToken: () => getToken(),

    // Logout
    logout: () => signOut(),

    // Kept for backward compatibility
    // Clerk handles login/register now.
    login: async () => ({ success: true }),
    register: async () => ({}),
  };
}