import React, { useState } from "react";
import "../StyleSheets/NearestProperties.css";
import { useNavigate } from "react-router-dom";

export default function NearestProperties() {
  const [addressLink, setAddressLink] = useState("");
  const [radiusKm, setRadiusKm] = useState(10); // default 10 km
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [properties, setProperties] = useState([]);
  const [infoMessage, setInfoMessage] = useState("");

  const navigate = useNavigate();

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
      const params = new URLSearchParams({
        addressLink: addressLink.trim(),
        radius: radiusKm.toString(), // km
      });

      const res = await fetch(
        `http://localhost:8002/radiussearch?${params.toString()}`,
        {
          method: "GET",
          credentials: "include", // because route is protected
        }
      );

      if (res.status === 401 || res.status === 403) {
        throw new Error("You must be logged in to use this feature.");
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error finding nearby properties.");
      }

      if (!data.properties || data.properties.length === 0) {
        setInfoMessage("No nearby properties found within the selected radius.");
      } else {
        setProperties(data.properties);
        setInfoMessage(
          `${data.properties.length} properties found within ~${radiusKm} km.`
        );
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nearest-page-bg">
      <div className="nearest-card">
        <h1 className="nearest-title">Find Nearest Properties</h1>
        <p className="nearest-subtitle">
          Paste a Google Maps link and choose a radius to discover properties
          stored near that location.
        </p>

        {/* SEARCH FORM */}
        <form className="nearest-form" onSubmit={handleSubmit}>
          {/* Address link */}
          <div className="field-block">
            <div className="field-label-bar">
              <span className="field-label-main">Google Maps Link *</span>
            </div>
            <div className="field-input-wrapper">
              <textarea
                className="field-input textarea-input"
                rows={2}
                placeholder="Paste Google Maps URL containing the location..."
                value={addressLink}
                onChange={(e) => setAddressLink(e.target.value)}
              />
            </div>
            <p className="field-help">
              Example: https://www.google.com/maps/place/...
            </p>
          </div>

          {/* Radius */}
          <div className="field-block">
            <div className="field-label-bar">
              <span className="field-label-main">Radius (km)</span>
            </div>
            <div className="radius-row">
              <input
                type="range"
                min="1"
                max="50"
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="radius-slider"
              />
              <span className="radius-value">{radiusKm} km</span>
            </div>
            <p className="field-help">
              Backend converts this to meters and searches within that distance.
            </p>
          </div>

          {/* Button + messages */}
          <div className="button-row">
            <button className="nearest-btn" type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search Nearby Properties"}
            </button>
          </div>

          {error && <div className="error-banner">{error}</div>}
          {infoMessage && !error && (
            <div className="info-banner">{infoMessage}</div>
          )}
        </form>

        {/* RESULTS */}
        <div className="nearest-results">
          {properties.length === 0 && !loading && !error && !infoMessage && (
            <p className="no-results-hint">
              Results will appear here after you search.
            </p>
          )}

          {properties.map((p) => (
            <div
              key={`${p.email}-${p.name}-${p._id}`}
              className="nearest-result-card"
              onClick={() => navigate(`/property/${p.email}/${p.name}`)}
            >
              <div className="result-img-wrapper">
                {p.imgLink && p.imgLink.length > 0 ? (
                  <img src={p.imgLink[0]} alt={p.name} />
                ) : (
                  <div className="result-img-placeholder" />
                )}
              </div>

              <div className="result-content">
                <h2 className="result-title">
                  {p.BHK} BHK • {p.houseType}
                </h2>
                <p className="result-location">
                  {p.locality}, {p.city}
                </p>
                <p className="result-rent">₹{p.rent} / month</p>

                <div className="result-meta-row">
                  <span>
                    Furnishing: <strong>{p.furnishingType}</strong>
                  </span>
                  <span>
                    Area: <strong>{p.areaSize || "—"} sq ft</strong>
                  </span>
                  <span>
                    Parking: <strong>{p.parkingArea}</strong>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}