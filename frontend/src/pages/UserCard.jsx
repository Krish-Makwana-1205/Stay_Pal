import axios from "axios";
import { useEffect, useState } from "react";
import {Link} from "react";
import { useNavigate } from "react-router-dom";

export default function UserCard() {
const navigate=useNavigate();
const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8002/user/logout",
        {},
        { withCredentials: true } 
      );

     navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8002/user/me", {
          withCredentials: true, 
        });
        setUser(res.data.user); 
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading user...</p>;

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.name}</h2>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout} >LogOut</button>
        </div>
      ) : (
        <p>User not logged in.
          <a href="/login">Login</a>
        </p>
      )}
    </div>
  );
}
