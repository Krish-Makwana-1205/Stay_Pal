import React, { useState, useEffect } from "react";
import Select from "react-select";

const LocalitySelector = ({ city, value, onChange }) => {
  const [localityList, setLocalityList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMsg, setFetchingMsg] = useState(false);
  const [error, setError] = useState("");
  
  const cacheKey = `localities_${city}`;

  const fetchLocalities = async (cityName) => {
    if (!cityName) return;
    
    // Check cache first
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsedCache = JSON.parse(cached);
        setLocalityList(parsedCache);
        return;
      } catch (e) {
        localStorage.removeItem(cacheKey);
      }
    }
    
    setLoading(true);
    setFetchingMsg(true);
    setError("");
    
    try {
      // Use HTTP instead of HTTPS to avoid certificate issues
      const res = await fetch(
        `http://api.geonames.org/postalCodeSearchJSON?placename=${encodeURIComponent(cityName)}&maxRows=500&username=Namra&country=IN`
      );
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      // Check for GeoNames API errors
      if (data.status) {
        throw new Error(data.status.message || "GeoNames API error");
      }
      
      if (!data.postalCodes || data.postalCodes.length === 0) {
        setError("No localities found for this city");
        setLocalityList([]);
        return;
      }
      
      const localityObjects = data.postalCodes.map((p) => ({
        locality: p.placeName,
        postalCode: p.postalCode,
      }));
      
      const uniqueLocalities = Array.from(
        new Map(localityObjects.map((item) => [item.locality, item])).values()
      );
      
      setLocalityList(uniqueLocalities);
      
      // Cache the results
      try {
        localStorage.setItem(cacheKey, JSON.stringify(uniqueLocalities));
      } catch (e) {
        console.warn("Failed to cache localities:", e);
      }
      
    } catch (err) {
      console.error("Error fetching locality:", err);
      setError(err.message || "Failed to fetch localities");
      setLocalityList([]);
    } finally {
      setLoading(false);
      setTimeout(() => setFetchingMsg(false), 2000);
    }
  };

  useEffect(() => {
    if (city) {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) {
        setLocalityList([]);
      }
      fetchLocalities(city);
    } else {
      setLocalityList([]);
      setError("");
      onChange("");
    }
  }, [city]);

  const selectValue = value ? { label: value, value: value } : null;

  return (
    <div style={{ position: "relative" }}>
      
      {/* Message Overlay */}
      {fetchingMsg && (
        <div
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
            height: "100%",
            background: "rgba(255,255,255,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
            borderRadius: "5px",
            fontWeight: "600",
            fontSize: "14px"
          }}
        >
          Fetching localities…
        </div>
      )}
      
      <Select
        isLoading={loading}
        isDisabled={!city || fetchingMsg || loading}
        placeholder={city ? "Select or type locality" : "Select city first"}
        options={localityList.map((loc) => ({
          label: loc.locality,
          value: loc.locality
        }))}
        value={selectValue}
        onChange={(selected) => onChange(selected ? selected.value : "")}
        isClearable
        noOptionsMessage={() => error || "No localities available"}
      />
      
      {error && !fetchingMsg && (
        <div style={{ color: 'crimson', fontSize: '12px', marginTop: '4px' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default LocalitySelector;