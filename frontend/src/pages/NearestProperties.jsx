import React, { useState, useEffect } from "react";
import "../StyleSheets/NearestProperties.css";
import { useNavigate } from "react-router-dom";
import { fetchNearestProperties } from "../api/radiusSearchApi";

export default function NearestProperties() {
  const [addressLink, setAddressLink] = useState("");
  const [radiusKm, setRadiusKm] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [properties, setProperties] = useState([]);
  const [infoMessage, setInfoMessage] = useState("");

  const navigate = useNavigate();

  // Auto-fill location on mount
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Your browser does not support location access.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setAddressLink(`https://www.google.com/maps?q=${lat},${lng}`);
      },
      () => {
        setError("Location denied. Please paste a Google Maps link manually.");
      }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");
    setProperties([]);

    if (!addressLink.trim()) {
      setError("Please paste a valid Google Maps link.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetchNearestProperties(addressLink.trim(), radiusKm);
      const data = res.data;

      if (!data.properties || data.properties.length === 0) {
        setInfoMessage("No nearby properties found within the selected radius.");
      } else {
        setProperties(data.properties);
        setInfoMessage(`${data.properties.length} properties found within ~${radiusKm} km.`);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Search failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="np-page-bg">
      <div className="np-card">
        <h1 className="np-title">Find Nearest Properties</h1>
        <p className="np-subtitle">Allow location access or paste a Google Maps link manually.</p>

        <form className="np-form" onSubmit={handleSubmit}>
          {/* Address Link */}
          <div className="np-field-block">
            <div className="np-field-label-bar">
              <span className="np-field-label-main">Google Maps Link *</span>
            </div>

            <div className="np-field-input-wrapper">
              <textarea
                className="np-field-input np-textarea-input"
                rows={2}
                placeholder="Paste Google Maps URL containing the location..."
                value={addressLink}
                onChange={(e) => setAddressLink(e.target.value)}
              />
            </div>

            <p className="np-field-help">Auto-filled if location was granted.</p>
          </div>

          {/* Radius */}
          <div className="np-field-block">
            <div className="np-field-label-bar">
              <span className="np-field-label-main">Radius (km)</span>
            </div>

            <div className="np-radius-row">
              <input
                type="range"
                min="1"
                max="50"
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="np-radius-slider"
              />
              <span className="np-radius-value">{radiusKm} km</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="np-button-row">
            <button className="np-btn" type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search Nearby Properties"}
            </button>
          </div>

          {error && <div className="np-error-banner">{error}</div>}
          {infoMessage && !error && (
            <div className="np-info-banner">{infoMessage}</div>
          )}
        </form>

        {/* Results */}
        <div className="np-results">
          {properties.map((p) => (
            <div
              key={p._id || `${p.email}-${p.name}`}
              className="np-result-card"
              onClick={() => navigate(`/property/${p.email}/${p.name}`)}
            >
              <div className="np-result-img-wrapper">
                {Array.isArray(p.imgLink) && p.imgLink.length > 0 ? (
                  <img src={p.imgLink[0]} alt={p.name} />
                ) : (
                  <div className="np-result-img-placeholder" />
                )}
              </div>

              <div className="np-result-content">
                <h2 className="np-result-title">
                  {p.BHK} BHK • {p.houseType}
                </h2>
                <p className="np-result-location">
                  {p.locality}, {p.city}
                </p>
                <p className="np-result-rent">₹{p.rent} / month</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
