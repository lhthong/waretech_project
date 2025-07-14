import { createContext, useContext, useEffect, useState } from "react";
import { checkAuth } from "../services/AuthApi";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      checkAuth()
        .then((user) => {
          if (user) {
            setIsAuthenticated(true);
            setRole(user.permission || localStorage.getItem("role") || null);
          } else {
            setIsAuthenticated(false);
            setRole(null);
          }
        })
        .catch(() => {
          setIsAuthenticated(false);
          setRole(null);
        });
    } else {
      setIsAuthenticated(false);
      setRole(null);
    }
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => {
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      logout();
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    };

    window.addEventListener("sessionExpired", handleSessionExpired);
    return () => {
      window.removeEventListener("sessionExpired", handleSessionExpired);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, role, setRole, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
