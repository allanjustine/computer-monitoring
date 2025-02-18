import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRequiredChangePassword, setIsRequiredChangePassword] =
    useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setIsAdmin(false);
        setLoading(false);
        setIsAuthenticated(false);
        return;
      }
      if (isLogin) {
        setLoading(true);
      }
      try {
        const response = await api.get("/profile");

        const data = response.data.data;

        if (response.status === 200) {
          setUser(data);
          setIsAuthenticated(true);

          if (data.role === "admin") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }

          if (data.request_new_password === 1) {
            setIsRequiredChangePassword(true);
          } else {
            setIsRequiredChangePassword(false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
        if (error.response && error.response.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Session Expired",
            confirmButtonColor: "#1e88e5",
            showCloseButton: true,
            confirmButtonText: "Go to login page",
            html: "Session Expired, You will be redirected to the Login page <br>Thank you!",
          }).then(() => {
            logout();
            setIsAuthenticated(false);
          });
        }
      } finally {
        setLoading(false);
        setIsLogin(false);
      }
    };
    fetchUserProfile();
  }, [isRefresh, isLogin]);

  const login = (token) => {
    Cookies.set("token", token);
    setIsLogin(true);
  };

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
  };
  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        isRequiredChangePassword,
        setIsRefresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
