import React, { useState, useRef, useEffect } from "react";


import "./Header.css";

const Header = ({ user, onNavigate, onLogout, active }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);


  //For drop down closing
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }

    // Listen for all clicks
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div className="dashboard-header">
      <div>
        <h1>Stay Pal</h1>
        <p>Welcome, {user?.username || 'User'}</p>
      </div>
      <div className="dashboard-actions">
        <button
          className={`btn ${active === "properties" ? "active" : ""}`}
          onClick={() => onNavigate("/dashboard/properties")}
        >Search Properties</button>
        <button
          className={`btn ${active === "roommate" ? "active" : ""}`}
          onClick={() => onNavigate("/dashboard/roommates")}
        >Search Roommates</button>
        <button
          className={`btn ${active === "shared" ? "active" : ""}`}
          onClick={() => onNavigate("/dashboard/shared")}
        >Search Shared Properties</button>
        <button
          className={`btn ${active === "home" ? "active" : ""}`}
          onClick={() => onNavigate("/dashboard")}
        >Home</button>
        <div className="header-profile-wrapper">
          <img
            src={user?.profilePhoto || "/profile-pic.jpg"}
            alt="profile"
            className="header-profile-pic"
            onClick={() => setDropdownOpen(prev => !prev)}
          />

          {dropdownOpen && (
            <div className="header-dropdown" ref={dropdownRef}>
              <button onClick={() => { onNavigate("/profile"); setDropdownOpen(false); }}>
                Profile
              </button>

              <button onClick={() => { onNavigate("/myproperties"); setDropdownOpen(false); }}>
                Your Properties
              </button>

              <button onClick={() => { onNavigate("/tenant/my-applications"); setDropdownOpen(false); }}>
                Applied Properties
              </button>

              <button className="add-action" onClick={() => { onNavigate("/propertyForm"); setDropdownOpen(false); }}>
                Add Property
              </button>

              <button className="add-action" onClick={() => { onNavigate("/roommateForm"); setDropdownOpen(false); }}>
                List as Roommate
              </button>

              <button className="logout" onClick={() => { onLogout(); setDropdownOpen(false); }}>
                Logout
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};


export default Header;