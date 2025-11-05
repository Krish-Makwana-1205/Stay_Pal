import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Filters from "../Components/Filters";
import { fetchproperty } from "../api/filters";  // ✅ import your API

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
    console.log(user);
  }, [loading, user, navigate]);

  const handleFilters = async (filters) => {
    console.log("Filters:", filters);

    try {
      const { data } = await fetchproperty(filters);

      console.log("API Response:", data);

      setHouses(data.data || []);   
    } catch (err) {
      console.error("Filter error:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Left sidebar for filters */}
      <div
        style={{
          width: "300px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRight: "1px solid #dee2e6",
          overflowY: "auto",
          position: "fixed",
          height: "100%",
        }}
      >
        <h2 style={{ marginBottom: "20px", fontSize: "1.5rem" }}>Filters</h2>
        <Filters onApply={handleFilters} />
      </div>

      {/* Main content area for results */}
      <div
        style={{
          marginLeft: "300px",
          flex: 1,
          padding: "20px",
          overflowY: "auto",
        }}
      >
        <button onClick={logout} style={{ marginBottom: "20px" }}>Logout</button>
        <h1>Dashboard</h1>
        <h2>Results</h2>
        {houses.length === 0 ? (
          <p>No results found</p>
        ) : (
          houses.map((item, i) => (
            <div key={i} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
              <h3>{item.city} — {item.BHK} BHK</h3>
              <p>Rent: ₹{item.rentLowerBound} - ₹{item.rentUpperBound}</p>
              <p>Furnishing: {item.furnishingType}</p>
              <p>Transport: {item.transportAvailability ? "Available" : "No"}</p>
              {item.imgLink?.length > 0 && (
                <img src={item.imgLink[0]} alt="Property" width="250" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;