import React, { useEffect, useState } from "react";
import Filters from "../Components/Filters";
import { fetchproperty } from "../api/filters";
import "../StyleSheets/Dashboard.css";
import { useNavigate } from "react-router-dom";
const ViewProperties = ({defaultCity}) => {
  const [houses, setHouses] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const navigate = useNavigate();
  const handleFilters = async (filters) => {
    setLoadingResults(true);
    try {
      const finalFilters = { city: filters.city || defaultCity, ...filters };
      const { data } = await fetchproperty(finalFilters);
      setHouses(data.data || []);
    } catch (err) {
      console.error("Filter error:", err);
      setHouses([]);
    } finally {
      setLoadingResults(false);
    }
  };
// console.log(houses);
  useEffect(() => {
    if (defaultCity) handleFilters({ city: defaultCity });
  }, [defaultCity]);

  return (
    <div className="view-properties">
      <div className="dashboard-filters">
        <h2 className="filters-title">Filters</h2>
        <Filters onApply={handleFilters} defaultCity={defaultCity} />
      </div>

      <div className="properties-results">
        <h2>
          Results {loadingResults ? " (loading...)" : `for city: ${defaultCity || "All"}`}
        </h2>

        {houses.length === 0 ? (
          <p>No results found</p>
        ) : (
          houses.map((item, i) => (
            <div key={i} className="result-item"  onClick={() => navigate(`/property/${item.email}/${item.name}`)}>
              
              <h3>{item.city} — {item.BHK} BHK</h3>
              <p>Rent: ₹{item.rentLowerBound} - ₹{item.rentUpperBound}</p>
              <p>Furnishing: {item.furnishingType}</p>
              {item.imgLink?.length > 0 && <img src={item.imgLink[0]} alt="Property" width="250" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewProperties;
