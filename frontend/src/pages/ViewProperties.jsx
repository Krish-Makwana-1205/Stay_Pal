import React, { useEffect, useState } from "react";
import Filters from "../Components/Filters";
import { fetchproperty } from "../api/filters";
import "../StyleSheets/Dashboard.css";
import { useNavigate, useLocation } from "react-router-dom";

const ViewProperties = ({ defaultCity }) => {
  const [houses, setHouses] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get default city ONCE from state or props
  const initialCity = location.state?.defaultCity || defaultCity;

  const [currentCity, setCurrentCity] = useState(initialCity);

  // Handle filter updates
  const handleFilters = async (filters) => {
    setLoadingResults(true);

    try {
      // If the user enters a new city in Filters, update currentCity
      if (filters.city) {
        setCurrentCity(filters.city);
      }

      const finalFilters = {
        ...filters,
        city: filters.city || currentCity,
      };

      const { data } = await fetchproperty(finalFilters);
      setHouses(data.data || []);
    } catch (err) {
      console.error("Filter error:", err);
      setHouses([]);
    } finally {
      setLoadingResults(false);
    }
  };

  // Run initial load ONCE with default city
  useEffect(() => {
    if (initialCity) {
      handleFilters({ city: initialCity });
    }
  }, []); // <-- run only once

  return (
    <div className="view-properties">

      {/* LEFT FILTERS */}
      <div className="dashboard-filters">
        <h2 className="filters-title">Filters</h2>
        <Filters
          onApply={handleFilters}
          defaultCity={currentCity}  // Shows correct value in UI
        />
      </div>

      {/* RIGHT RESULTS */}
      <div className="properties-results">
        <h2>
          Results {loadingResults ? "(loading...)" : `for city: ${currentCity || "All"}`}
        </h2>

        {houses.length === 0 ? (
          <p>No results found</p>
        ) : (
          houses.map((item, i) => (
            <div
              key={i}
              className="result-item"
              onClick={() => navigate(`/property/${item.email}/${item.name}`)}
            >

              {/* LEFT IMAGE */}
              {item.imgLink?.length > 0 ? (
                <img src={item.imgLink[0]} alt="Property" />
              ) : (
                <img src="/placeholder.png" alt="No Image" />
              )}

              <div style={{ flex: 1 }}>
                <h3>{item.BHK} BHK</h3>

                <div className="extra-info-grid">
                  <p>
                    <strong>Rent:</strong> ₹{item.rentLowerBound} - ₹{item.rentUpperBound}
                  </p>
                  <p><strong>Furnishing:</strong> {item.furnishingType}</p>
                  <p style={{ fontWeight: 600 }}>{item.city}</p>
                  <p><strong>House Type:</strong> {item.houseType}</p>
                  <p>{item.locality}</p>
                  <p><strong>Parking:</strong> {item.parkingArea}</p>
                  <p><strong>Area Size:</strong> {item.areaSize || "—"}</p>
                  <p><strong>Transport:</strong> {item.transportAvailability ? "Yes" : "No"}</p>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewProperties;
