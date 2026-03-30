import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  // null means nobody is logged in
  // When logged in it will look like: { name: "John", email: "john@email.com" }
  const [user, setUser] = useState(null);

  // Fake user database — in a real app this lives on a server
  const fakeUsers = [
    { name: "John Smith",  email: "john@email.com",  password: "password123" },
    { name: "Jane Doe",    email: "jane@email.com",   password: "mypassword"  },
  ];

  // LOGIN — check if email + password match a user
  // Returns an error message if it fails, null if it succeeds
  const login = (email, password) => {
    const found = fakeUsers.find(
      u => u.email === email && u.password === password
    );
    if (found) {
      // Save user to state — strip out the password, never store that
      setUser({ name: found.name, email: found.email });
      return null; // null means no error
    }
    return "Incorrect email or password.";
  };

  // REGISTER — check email isn't already taken, then add them
  const register = (name, email, password) => {
    const exists = fakeUsers.find(u => u.email === email);
    if (exists) {
      return "An account with this email already exists.";
    }
    // In a real app you'd send this to a server
    // For now just log them in immediately after registering
    setUser({ name, email });
    return null;
  };

  // LOGOUT — wipe the user from state
  const logout = () => setUser(null);

  // isLoggedIn is derived — we calculate it, not store it separately
  const isLoggedIn = user !== null;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — same pattern as useCart()
export function useAuth() {
  return useContext(AuthContext);
}