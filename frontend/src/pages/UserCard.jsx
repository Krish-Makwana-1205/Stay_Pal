import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../StyleSheets/UserCard.css";

export default function UserCard() {
  const navigate = useNavigate();
  const { user, loading, logout } =  useAuth();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8002/user/logout",
        {},
        { withCredentials: true }
      );
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

 if (loading || user === undefined) {
  return <p className="loading-text">Loading user...</p>;
}
  if (!user) {
    return (
      <div className="not-logged">
        <p>User not logged in.</p>
        <a href="/login" className="login-link">
          Login
        </a>
      </div>
    );
  }

  return (
    <div className="usercard-container">
      <header className="usercard-header">
        <h2 className="usercard-greeting">Hi, {user.name || "User"} 👋</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="usercard-main">
        <h3 className="usercard-title">Who are You?</h3>
        <div className="options">
          <button
            className="option-btn"
            onClick={() => navigate("/tenantForm")}
          >
            Tenant
          </button>
          <button
            className="option-btn"
            onClick={() => navigate("/propertyForm")}
          >
            Property Owner
          </button>
        </div>
      </main>
    </div>
  );
}
