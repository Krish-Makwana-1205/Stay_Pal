import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../StyleSheets/UserCard.css";

export default function UserCard() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
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
  if(user.istenant){
    navigate("/dashboard");
  }
  const handleTenantClick = () => {
    navigate("/tenantForm");
  };

  const handlePropertyOwnerClick = () => {
    navigate("/propertyForm");
  };

  const handleRoommateClick = () => {
    navigate("/RoommateForm1")
  }
  return (
    <div className="usercard-container">
      {/* Header */}
      <header className="usercard-header">
        <h2 className="usercard-greeting">Hi, {user.name || "User"} 👋</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Main Section */}
      <main className="usercard-main">
        <h3 className="usercard-title">Who are You?</h3>

        <div className="options">
          {/* Tenant Option */}
          <div
            className="option-card clickable-card"
            onClick={handleTenantClick}
            tabIndex={0}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/4140/4140037.png"
              alt="Tenant"
              className="option-img"
            />
            <p className="option-desc">
              Looking for a new nest? Find your next perfect home.
            </p>
            {/* stopPropagation prevents double trigger */}
            <button
              className="option-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleTenantClick();
              }}
            >
              Tenant
            </button>
          </div>

          {/* Property Owner Option */}
          <div
            className="option-card clickable-card"
            onClick={handlePropertyOwnerClick}
            tabIndex={0}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/619/619034.png"
              alt="Property Owner"
              className="option-img"
            />
            <p className="option-desc">
              Have a space to offer? Connect with the right tenants.
            </p>
            <button
              className="option-btn"
              onClick={(e) => {
                e.stopPropagation();
                handlePropertyOwnerClick();
              }}
            >
              Property Owner
            </button>
          </div>
           {/* Roommate Option */}
          <div
            className="option-card clickable-card"
            onClick={handleRoommateClick}
            tabIndex={0}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/2065/2065665.png" // You can choose another image
              alt="Roommate"
              className="option-img"
            />
            <p className="option-desc">
              Looking for a roommate? Share a space and save on rent!
            </p>
            <button
              className="option-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleRoommateClick();
              }}
            >
              Roommate
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}