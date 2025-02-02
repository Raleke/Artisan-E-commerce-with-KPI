import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  // Load initial state from localStorage or use default state
  const [auth, setAuth] = useState(() => {
    const storedState = localStorage.getItem("authState");
    return storedState ? JSON.parse(storedState) : {};
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("authState", JSON.stringify(auth));
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
