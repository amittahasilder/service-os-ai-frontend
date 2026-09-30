
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================
  // CHECK AUTHENTICATION
  // =========================================

  const checkAuth = async () => {
    try {
      const response = await api.get("/auth/me");

      const userData =
        response.data?.user ||
        response.data?.data?.user ||
        response.data?.data ||
        null;

      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // INITIAL AUTH CHECK
  // =========================================

  useEffect(() => {
    checkAuth();
  }, []);

  // =========================================
  // LOGIN
  // =========================================

  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);

    const userData =
      response.data?.user ||
      response.data?.data?.user ||
      response.data?.data ||
      null;

    if (userData) {
      setUser(userData);
    } else {
      await checkAuth();
    }

    return response.data;
  };

  // =========================================
  // SIGNUP
  // =========================================

  const signup = async (userData) => {
    const response = await api.post("/auth/signup", userData);

    await checkAuth();

    return response.data;
  };

  // =========================================
  // LOGOUT
  // =========================================

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  // =========================================
  // CONTEXT VALUE
  // =========================================

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    signup,
    logout,
    refreshUser: checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// =========================================
// USE AUTH HOOK
// =========================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}