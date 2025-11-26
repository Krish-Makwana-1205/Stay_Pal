import React, { useState } from "react";
import "../StyleSheets/RentPredictor.css"; 
import { City } from "country-state-city";


// All Indian cities
const ALL_CITIES = City.getCitiesOfCountry("IN").map((c) => c.name);

export default function RentPredictor() {
  const [city, setCity] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [bhk, setBhk] = useState("");
  const [areaSize, setAreaSize] = useState("");
  const [furnishingType, setFurnishingType] = useState("Fully Furnished");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const filteredCities =
    city.length >= 1
      ? ALL_CITIES.filter((c) =>
          c.toLowerCase().includes(city.toLowerCase())
        ).slice(0, 25)
      : [];

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCity(value);
    setShowCityDropdown(value.length >= 1);
  };

  const handleCitySelect = (cityName) => {
    setCity(cityName);
    setShowCityDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!city || !bhk || !areaSize || !furnishingType) {
      setError("Please fill all fields before predicting.");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        city: city.trim(),
        BHK: bhk,
        areaSize,
        furnishingType,
      });

      const response = await fetch(
        `http://localhost:8002/prediction/predict-rent?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Error predicting rent");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong while predicting rent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="est-page-wrapper">
      <div className="est-card">
        <h1 className="est-heading">Predict Monthly Rent</h1>
        <p className="est-subheading">
          Enter details below to get an estimated rent range based on current market data.
        </p>

        <form onSubmit={handleSubmit}>
          
          {/* CITY */}
          <div className="est-form-group">
            <label className="est-label">City *</label>
            <input
              type="text"
              className="est-input"
              value={city}
              onChange={handleCityChange}
              onBlur={() => setTimeout(() => setShowCityDropdown(false), 150)}
              onFocus={() => { if (city.length >= 1) setShowCityDropdown(true); }}
              placeholder="e.g. Mumbai"
              autoComplete="off"
            />
            {showCityDropdown && filteredCities.length > 0 && (
              <ul className="est-dropdown-list">
                {filteredCities.map((c) => (
                  <li
                    key={c}
                    className="est-dropdown-item"
                    onMouseDown={() => handleCitySelect(c)}
                  >
                    {c}
                  </li>
                ))}
              </ul>
            )}
            <p className="est-helper-text">Select city from the dropdown list.</p>
          </div>

          {/* BHK & AREA ROW */}
          <div className="est-row">
            <div className="est-col est-form-group">
              <label className="est-label">BHK *</label>
              <input
                type="number"
                min="1"
                max="100"
                className="est-input"
                value={bhk}
                onChange={(e) => setBhk(e.target.value)}
              />
            </div>

            <div className="est-col est-form-group">
              <label className="est-label">Area (sq ft) *</label>
              <input
                type="number"
                min="0"
                className="est-input"
                value={areaSize}
                onChange={(e) => setAreaSize(e.target.value)}
                placeholder="e.g. 1200"
              />
            </div>
          </div>

          {/* FURNISHING TYPE */}
          <div className="est-form-group">
            <label className="est-label">Furnishing Type *</label>
            <select
              className="est-select"
              value={furnishingType}
              onChange={(e) => setFurnishingType(e.target.value)}
            >
              <option value="Fully Furnished">Fully Furnished</option>
              <option value="Semi Furnished">Semi Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>

          {/* SUBMIT BUTTON */}
          <button type="submit" className="est-submit-btn" disabled={loading}>
            {loading ? "Calculating..." : "Get Rent Estimate"}
          </button>

          {/* ERROR MESSAGE */}
          {error && <div className="est-error-msg">{error}</div>}

        </form>

        {/* RESULTS SECTION */}
        {result && (
          <div className="est-result-box">
            {result.status === "ok" ? (
              <>
                <h2 className="est-result-heading">Estimated Rent Range</h2>
                <div className="est-price-range">
                  ₹{result.min.toLocaleString("en-IN")} – ₹{result.max.toLocaleString("en-IN")}
                </div>
                <p className="est-meta-info">
                  Based on {result.sampleSize} similar properties found in the database.
                </p>
              </>
            ) : result.status === "insufficient data" ? (
              <>
                <h2 className="est-result-heading">Insufficient Data</h2>
                <p className="est-meta-info">
                  Only found {result.sampleSize} similar propert{result.sampleSize === 1 ? 'y' : 'ies'}. 
                  Try adjusting your search criteria.
                </p>
              </>
            ) : (
              <p className="est-meta-info">Unexpected server response.</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}