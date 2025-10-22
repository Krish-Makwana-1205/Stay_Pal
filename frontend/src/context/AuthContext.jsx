import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('start');
        const res = await axios.get("http://localhost:8002/user/me", {
          withCredentials: true,
        });
        console.log(res);
        if(res == 1){
          console.log('here');
          setUser(null);
        }
        else{
          console.log('hi');
          setUser(res.data.user);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        console.log('hello');
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
