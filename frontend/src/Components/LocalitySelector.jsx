import React, { useState, useEffect } from "react";
import Select from "react-select";

const LocalitySelector = ({ city, value, onChange }) => {
  const [localityList, setLocalityList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMsg, setFetchingMsg] = useState(false);
  
  const cacheKey = `localities_${city}`;

  const fetchLocalities = async (cityName) => {
    if (!cityName) return;
    
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setLocalityList(JSON.parse(cached));
      return;
    }
    
    setLoading(true);
    setFetchingMsg(true);
    
    try {
      const res = await fetch(
        `https://api.geonames.org/postalCodeSearchJSON?placename=${cityName}&maxRows=500&username=Namra`
      );
      const data = await res.json();
      const localityObjects = data.postalCodes.map((p) => ({
        locality: p.placeName,
        postalCode: p.postalCode,
      }));
      const uniqueLocalities = Array.from(
        new Map(localityObjects.map((item) => [item.locality, item])).values()
      );
      setLocalityList(uniqueLocalities);
      localStorage.setItem(cacheKey, JSON.stringify(uniqueLocalities));
    } catch (err) {
      console.error("Error fetching locality:", err);
      setLocalityList([]);
    }
    
    setLoading(false);
    setTimeout(() => setFetchingMsg(false), 2000);
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
            fontWeight: "600"
          }}
        >
          Fetching localities…
        </div>
      )}
      
      <Select
        isLoading={loading}
        isDisabled={!city || fetchingMsg || loading}
        placeholder={city ? "Select locality" : "Select city first"}
        options={localityList.map((loc) => ({
          label: loc.locality,
          value: loc.locality
        }))}
        value={selectValue}
        onChange={(selected) => onChange(selected ? selected.value : "")}
        isClearable
      />
    </div>
  );
};

export default LocalitySelector;