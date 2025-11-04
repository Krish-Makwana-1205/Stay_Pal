import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); 
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:8002/user/me", {
        withCredentials: true,
      });
      setUser(data?.user || null);
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async () => {
    await fetchUser();
  };

const logout = async () => {
  try {
    await axios.post(
      "http://localhost:8002/user/logout",
      {},
      { withCredentials: true }
    );
    setUser(null);        
  } catch (error) {
    console.error("Logout failed:", error);
  }
};


  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
