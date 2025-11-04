// ../Components/Filters.js
import React, { useState } from "react";

const Filters = ({ onApply }) => {
  const [city, setCity] = useState("");
  const [selectedBHK, setSelectedBHK] = useState([]);
  const [minRent, setMinRent] = useState(0);
  const [maxRent, setMaxRent] = useState(100000);
  const [selectedFurnishing, setSelectedFurnishing] = useState([]);
  const [transportAvailability, setTransportAvailability] = useState(null);

  // Predefined rent ranges for quick selection
  const rentRanges = [
    { label: "Under ₹10,000", min: 0, max: 10000 },
    { label: "₹10,000 - ₹20,000", min: 10000, max: 20000 },
    { label: "₹20,000 - ₹30,000", min: 20000, max: 30000 },
    { label: "₹30,000 - ₹50,000", min: 30000, max: 50000 },
    { label: "Above ₹50,000", min: 50000, max: 100000 },
  ];

  // Predefined BHK options
  const bhkOptions = ["1", "2", "3", "4+"];

  // Predefined furnishing options
  const furnishingOptions = ["Fully Furnished", "Semi Furnished", "Unfurnished"];

  const handleBHKChange = (bhk) => {
    setSelectedBHK((prev) =>
      prev.includes(bhk) ? prev.filter((b) => b !== bhk) : [...prev, bhk]
    );
  };

  const handleFurnishingChange = (type) => {
    setSelectedFurnishing((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleRentRangeSelect = (min, max) => {
    setMinRent(min);
    setMaxRent(max);
  };

  const handleApply = () => {
    const filters = {
      city,
      bhk: selectedBHK,
      minRent,
      maxRent,
      furnishing: selectedFurnishing,
      transportAvailability,
    };
    onApply(filters);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* City Input */}
      <div>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>City</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ced4da",
            borderRadius: "4px",
          }}
        />
      </div>

      {/* BHK Checkboxes */}
      <div>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>BHK</label>
        {bhkOptions.map((bhk) => (
          <div key={bhk} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
            <input
              type="checkbox"
              id={`bhk-${bhk}`}
              checked={selectedBHK.includes(bhk)}
              onChange={() => handleBHKChange(bhk)}
            />
            <label htmlFor={`bhk-${bhk}`} style={{ marginLeft: "10px" }}>{bhk} BHK</label>
          </div>
        ))}
      </div>

      {/* Rent Range */}
      <div>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Rent Range</label>
        {/* Predefined ranges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
          {rentRanges.map((range, index) => (
            <button
              key={index}
              onClick={() => handleRentRangeSelect(range.min, range.max)}
              style={{
                padding: "5px 10px",
                backgroundColor: minRent === range.min && maxRent === range.max ? "#007bff" : "#e9ecef",
                color: minRent === range.min && maxRent === range.max ? "#fff" : "#000",
                border: "1px solid #ced4da",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {range.label}
            </button>
          ))}
        </div>
        {/* Manual inputs */}
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="number"
            value={minRent}
            onChange={(e) => setMinRent(Number(e.target.value))}
            placeholder="Min Rent"
            style={{
              width: "50%",
              padding: "10px",
              border: "1px solid #ced4da",
              borderRadius: "4px",
            }}
          />
          <input
            type="number"
            value={maxRent}
            onChange={(e) => setMaxRent(Number(e.target.value))}
            placeholder="Max Rent"
            style={{
              width: "50%",
              padding: "10px",
              border: "1px solid #ced4da",
              borderRadius: "4px",
            }}
          />
        </div>
        {/* Simple slider for visual adjustment */}
        <input
          type="range"
          min={0}
          max={100000}
          value={minRent}
          onChange={(e) => setMinRent(Number(e.target.value))}
          style={{ width: "100%", marginTop: "10px" }}
        />
        <input
          type="range"
          min={0}
          max={100000}
          value={maxRent}
          onChange={(e) => setMaxRent(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      {/* Furnishing Checkboxes */}
      <div>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Furnishing Type</label>
        {furnishingOptions.map((type) => (
          <div key={type} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
            <input
              type="checkbox"
              id={`furnishing-${type}`}
              checked={selectedFurnishing.includes(type)}
              onChange={() => handleFurnishingChange(type)}
            />
            <label htmlFor={`furnishing-${type}`} style={{ marginLeft: "10px" }}>{type}</label>
          </div>
        ))}
      </div>

      {/* Transport Availability */}
      <div>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Transport Availability</label>
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="radio"
              id="transport-yes"
              checked={transportAvailability === true}
              onChange={() => setTransportAvailability(true)}
            />
            <label htmlFor="transport-yes" style={{ marginLeft: "10px" }}>Yes</label>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="radio"
              id="transport-no"
              checked={transportAvailability === false}
              onChange={() => setTransportAvailability(false)}
            />
            <label htmlFor="transport-no" style={{ marginLeft: "10px" }}>No</label>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="radio"
              id="transport-any"
              checked={transportAvailability === null}
              onChange={() => setTransportAvailability(null)}
            />
            <label htmlFor="transport-any" style={{ marginLeft: "10px" }}>Any</label>
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApply}
        style={{
          padding: "10px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "1rem",
        }}
      >
        Apply Filters
      </button>
    </div>
  );
};

export default Filters;