import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";

/* eslint-disable react-refresh/only-export-components */

export function AuthProvider({ children }) {
  return children;
}

export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut, getToken } = useClerkAuth();

  return {
    user:
      isSignedIn && user
        ? {
            id: user.id,
            name: user.fullName || user.firstName || "User",
            email: user.primaryEmailAddress?.emailAddress || "",
          }
        : null,

    loading: !isLoaded,

    isLoggedIn: Boolean(isSignedIn && user),

    getToken,

    logout: () => signOut(),

    // Kept for compatibility with older parts of the application.
    login: async () => ({
      success: true,
    }),

    register: async () => ({}),
  };
}