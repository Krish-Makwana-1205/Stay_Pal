import React, { useState } from "react";
import "../StyleSheets/RentPredictor.css";
import { City } from "country-state-city";

// All Indian cities (same source as your PropertyForm)
const ALL_CITIES = City.getCitiesOfCountry("IN").map((c) => c.name);

export default function RentPredictor() {
  const [city, setCity] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [bhk, setBhk] = useState("");
  const [areaSize, setAreaSize] = useState("");
  const [furnishingType, setFurnishingType] = useState("Fully Furnished"); // visible select

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
        furnishingType, // will be one of: Fully Furnished, Semi Furnished, Unfurnished, Any
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
    <div className="rent-page-bg">
      <div className="prediction-card">
        <h1 className="page-title">Predict Monthly Rent</h1>
        <p className="page-subtitle">
          Enter details similar to your property listings and get an estimated
          rent range based on existing properties in the database.
        </p>

        <form className="prediction-form" onSubmit={handleSubmit}>
          {/* CITY */}
          <div className="field-block">
            <div className="field-label-bar">
              <span className="field-label-main">City *</span>
            </div>
            <div className="field-input-wrapper city-wrapper">
              <input
                id="city"
                type="text"
                value={city}
                onChange={handleCityChange}
                onBlur={() => {
                  setTimeout(() => setShowCityDropdown(false), 150);
                }}
                onFocus={() => {
                  if (city.length >= 1) setShowCityDropdown(true);
                }}
                className="field-input"
                placeholder="Type and choose city (e.g. Ahmedabad)"
                autoComplete="off"
              />
              {showCityDropdown && filteredCities.length > 0 && (
                <ul className="city-dropdown">
                  {filteredCities.map((c) => (
                    <li
                      key={c}
                      className="city-option"
                      onMouseDown={() => handleCitySelect(c)}
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p className="field-help">
              Type 1–2 letters and choose the correct city; it must match the
              city name stored in your properties.
            </p>
          </div>

          {/* BHK + AREA row */}
          <div className="field-row">
            <div className="field-block">
              <div className="field-label-bar">
                <span className="field-label-main">BHK *</span>
              </div>
              <div className="field-input-wrapper">
                <input
                  id="bhk"
                  type="number"
                  min="1"
                  max="100"
                  step="1"
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="field-input"
                />
              </div>
              <p className="field-help">
                Use the arrows to increase or decrease BHK. This value is used
                with ±1 BHK tolerance.
              </p>
            </div>

            <div className="field-block">
              <div className="field-label-bar">
                <span className="field-label-main">Area Size (sq ft) *</span>
              </div>
              <div className="field-input-wrapper">
                <input
                  id="area"
                  type="number"
                  min="0"
                  value={areaSize}
                  onChange={(e) => setAreaSize(e.target.value)}
                  className="field-input"
                  placeholder="e.g. 1000"
                />
              </div>
              <p className="field-help">
                Backend uses ±30% of this area to find similar properties.
              </p>
            </div>
          </div>

          {/* FURNISHING TYPE */}
          <div className="field-block">
            <div className="field-label-bar">
              <span className="field-label-main">Furnishing Type *</span>
            </div>
            <div className="field-input-wrapper">
              <select
  id="furnishing"
  value={furnishingType}
  onChange={(e) => setFurnishingType(e.target.value)}
  className="field-input select-input"
>
  <option value="Fully Furnished">Fully Furnished</option>
  <option value="Semi Furnished">Semi Furnished</option>
  <option value="Unfurnished">Unfurnished</option>
</select>
            </div>
            <p className="field-help">
              These values must match how furnishing type is stored in your
              properties.
            </p>
          </div>

          {/* BUTTON + ERROR */}
          <div className="button-row">
            <button
              className="predict-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Predicting..." : "Get Rent Estimate"}
            </button>
          </div>
          {error && <div className="error-banner">{error}</div>}
        </form>

        {/* RESULT */}
        {result && (
          <div className="result-panel">
            {result.status === "ok" ? (
              <>
                <h2 className="result-title">Estimated Rent Range</h2>
                <p className="result-range">
                  ₹{result.min.toLocaleString("en-IN")} – ₹
                  {result.max.toLocaleString("en-IN")}
                </p>
                <p className="result-meta">
                  Based on {result.sampleSize} similar properties in the
                  database.
                </p>
              </>
            ) : result.status === "insufficient data" ? (
              <>
                <h2 className="result-title">Insufficient Data</h2>
                <p className="result-meta">
                  Only {result.sampleSize} similar property
                  {result.sampleSize === 1 ? "" : "ies"} found. Try a different
                  combination or add more listings.
                </p>
              </>
            ) : (
              <p className="result-meta">Unexpected response from server.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}