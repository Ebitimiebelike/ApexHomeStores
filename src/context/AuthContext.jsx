import { createContext, useContext, useState, useEffect } from "react";

const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API = API_ROOT.endsWith("/api")
  ? API_ROOT
  : `${API_ROOT}/api`;
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(false); // NEW — checking token on load

  // On app load, check if there's a saved token and validate it
  // This is how "stay logged in" works — the token is saved in localStorage,
  // and we verify it's still valid with the backend on every page load
  useEffect(() => {
    const token = localStorage.getItem("apexToken");
    if (!token) return;

    setLoading(true);
    fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
        else localStorage.removeItem("apexToken"); // token expired or invalid
      })
      .catch(() => localStorage.removeItem("apexToken"))
      .finally(() => setLoading(false));
  }, []);

  // REGISTER — calls your backend, saves the token
  const register = async (name, email, password) => {
    const res  = await fetch(`${API}/auth/register`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed.");

    localStorage.setItem("apexToken", data.token);
    setUser(data.user);
    return data;
  };

  // LOGIN — calls your backend, saves the token
  const login = async (email, password) => {
    const res  = await fetch(`${API}/auth/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message };

    localStorage.setItem("apexToken", data.token);
    setUser(data.user);
    return { success: true };
  };

  // LOGOUT — clears token and user state
  const logout = () => {
    localStorage.removeItem("apexToken");
    setUser(null);
  };

  // Helper — returns the token for use in API calls from other components
  const getToken = () => localStorage.getItem("apexToken");

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, getToken }}>
      {/* Don't render the app until we've checked the token — 
          prevents a flash of "logged out" state on refresh */}
      {!loading && children}
    </AuthContext.Provider>
  );
}