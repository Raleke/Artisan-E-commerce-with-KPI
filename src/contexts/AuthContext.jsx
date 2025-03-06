import { createContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  // Load initial state from localStorage or use default state
  const [authState, setAuthState] = useState(() => {
    try {
      const storedState = localStorage.getItem("authState");
      return storedState ? JSON.parse(storedState) : {};
    } catch (err) {
      return {};
    }
  });
  const setAuth = useCallback((auth) => {
    console.log("Setting auth", auth);
    setAuthState(auth);
  }, []);

  const isLoggedIn = !!authState.employer?.id;
  const user_type = authState?.type;
  const user = authState?.employer;

  const value = {
    authState,
    setAuth,
    isLoggedIn,
    user,
    user_type,
  };
  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("authState", JSON.stringify(authState));
  }, [authState]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
