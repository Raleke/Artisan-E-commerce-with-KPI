import { useContext, useDebugValue } from "react";
import AuthContext from "../contexts/AuthContext";

const useAuth = () => {
  const context = useContext(AuthContext);

  // Add debug value for React DevTools
  useDebugValue(context.isLoggedIn ? "Logged In" : "Logged Out");

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return {
    auth: context.authState,
    isLoggedIn: context.isLoggedIn,
    user: context.user,
    setAuth: context.setAuth,
    user_type: context.user_type,
  };
};

export default useAuth;
