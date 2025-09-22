import axios from "axios";
import { useEffect, useState } from "react";

export default function UserCard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8002/user/me", {
          withCredentials: true, // ✅ important for cookies
        });
        setUser(res.data.user); // access the user returned by backend
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
        </div>
      ) : (
        <p>User not logged in.</p>
      )}
    </div>
  );
}
