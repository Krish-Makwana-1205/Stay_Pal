import React, { useEffect, useState } from "react";
import Filters from "../Components/Filters";
import { fetchproperty } from "../api/filters";
import "../StyleSheets/ViewProperty.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ViewProperties = ({ defaultCity }) => {
  const [houses, setHouses] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // INITIAL CITY SELECTION
  const initialCity =
    location.state?.city ||
    defaultCity ||
    localStorage.getItem("defaultCity") ||
    "";

  const [currentCity, setCurrentCity] = useState(initialCity);

  // APPLY FILTERS
  const handleFilters = async (filters) => {
    setLoadingResults(true);

    try {
      // Always use filters.city
      setCurrentCity(filters.city);

      // Save default city globally
      localStorage.setItem("defaultCity", filters.city);

      const finalFilters = {
        ...filters,
        city: filters.city,
      };

      const { data } = await fetchproperty(finalFilters);
      setHouses(data?.data || []);
    } catch (err) {
      console.error("Filter error:", err);
      setHouses([]);
    } finally {
      setLoadingResults(false);
    }

    window.scrollTo(0, 0);
  };

  // INITIAL LOAD
  useEffect(() => {
    const run = async () => {
      if (!initialCity) return;

      // attempt to pick up a per-city default locality for this user
      const userKey = user ? user.email : "guest";
      const perCityKey = `defaultLocality_${userKey}_${initialCity}`;
      const savedLocality = localStorage.getItem(perCityKey);

      const initialFilters = { city: initialCity };
      if (savedLocality) initialFilters.locality = savedLocality;

      await handleFilters(initialFilters);
    };

    run();
  }, []);

  return (
    <div className="view-properties">
      <div className="view-content-wrapper">

        {/* FILTERS */}
        <div className="dashboard-filters">
          <h2 className="filters-title">Filters</h2>
          <Filters onApply={handleFilters} defaultCity={currentCity} />
        </div>

        {/* RESULTS */}
        <div className="properties-results">
          <div className="results-card">
            <h2>
              Results {loadingResults ? "(loading...)" : `for: ${currentCity}`}
            </h2>

            {houses.length === 0 ? (
              <p>No results found</p>
            ) : (
              houses.map((item, index) => (
                <div
                  key={index}
                  className="result-item"
                  onClick={() =>
                    navigate(`/property/${item.email}/${item.name}`, {
                      state: { city: currentCity },
                    })
                  }
                >
                  {/* IMAGE */}
                  <img
                    src={item.imgLink?.[0] || "/placeholder.png"}
                    alt="Property"
                  />

                  {/* FULL INFO (from first version) */}
                  <div style={{ flex: 1 }}>
                    <h3>{item.BHK} BHK</h3>

                    <div className="extra-info-grid">
                      <p><strong>Rent:</strong> ₹{item.rent}</p>
                      <p><strong>Furnishing:</strong> {item.furnishingType}</p>
                      <p style={{ fontWeight: 600 }}>{item.city}</p>
                      <p><strong>House Type:</strong> {item.houseType}</p>
                      <p>{item.locality}</p>
                      <p><strong>Parking:</strong> {item.parkingArea}</p>
                      <p><strong>Area Size (Sq ft):</strong> {item.areaSize || "—"}</p>
                      <p><strong>Transport:</strong> {item.transportAvailability ? "Yes" : "No"}</p>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewProperties;
