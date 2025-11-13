import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { City } from "country-state-city";
import NumberInput from "../Components/NumberInput";
import LocalitySelector from "../Components/LocalitySelector";

const Filters = ({ onApply, defaultCity }) => {
  const [selectedCity, setSelectedCity] = useState(() => {
    const saved = defaultCity || localStorage.getItem("defaultCity") || "";
    return saved ? { value: saved, label: saved } : null;
  });

  const [locality, setLocality] = useState("");
  const [BHK, setBHK] = useState("");
  const [rentLowerBound, setRentLowerBound] = useState(0);
  const [rentUpperBound, setRentUpperBound] = useState(10000000);
  const [furnishingType, setFurnishingType] = useState("");
  const [areaSize, setAreaSize] = useState("");
  const [transportAvailability, setTransportAvailability] = useState(null);
  const [houseType, setHouseType] = useState("");
  const [nearbyPlaces, setNearbyPlaces] = useState("");
  const [description, setDescription] = useState("");

  const furnishingOptions = ["Fully Furnished", "Semi Furnished", "Unfurnished"];
  const houseTypeOptions = ["Apartment", "Independent House", "Villa", "PG / Hostel"];

  // -------- CITY SEARCH --------
  const loadCityOptions = (inputValue, callback) => {
    const allCities = City.getCitiesOfCountry("IN");
    const filtered = allCities
      .filter((c) => c.name.toLowerCase().includes(inputValue.toLowerCase()))
      .slice(0, 20)
      .map((c) => ({
        label: c.name,
        value: c.name,
      }));

    callback(filtered);
  };

  // -------- APPLY FILTERS --------
  const handleApply = () => {
    if (!selectedCity?.value?.trim()) {
      alert("Please select a city before applying filters.");
      return;
    }

    const filters = {
      city: selectedCity.value.trim(),
      locality: locality || undefined,
      BHK: BHK ? Number(BHK) : undefined,
      rentLowerBound: rentLowerBound || undefined,
      rentUpperBound: rentUpperBound || undefined,
      furnishingType: furnishingType || undefined,
      areaSize: areaSize || undefined,
      transportAvailability:
        transportAvailability === null ? undefined : transportAvailability,
      houseType: houseType || undefined,
      nearbyPlaces: nearbyPlaces || undefined,
      description: description || undefined,
      page: 1,
      limit: 20,
    };

    onApply(filters);
  };

  // Sync default city from Dashboard
  useEffect(() => {
    if (defaultCity && selectedCity?.value !== defaultCity) {
      setSelectedCity({ value: defaultCity, label: defaultCity });
    }
  }, [defaultCity]);

  return (
    <div className="filters-container">
      <h2>Property Filters</h2>

      {/* CITY */}
      <div className="filter-group">
        <label>City *</label>
        <AsyncSelect
          cacheOptions
          loadOptions={loadCityOptions}
          defaultOptions
          value={selectedCity}
          onChange={(val) => {
            setSelectedCity(val);
            setLocality(""); // reset locality when city changes
          }}
          placeholder="Search for a city..."
        />
      </div>

      {/* LOCALITY */}
      <div className="filter-group">
        <label>Locality</label>
        <LocalitySelector
          city={selectedCity?.value}
          value={locality}
          onChange={(loc) => setLocality(loc)}
        />
      </div>

      {/* BHK */}
      <div className="filter-group">
        <label>BHK</label>
        <input
          type="number"
          min="1"
          max="10"
          value={BHK}
          onChange={(e) => setBHK(e.target.value)}
          placeholder="Enter number of BHK"
        />
      </div>

      {/* RENT */}
      <div className="filter-group">
        <label>Rent Budget (₹)</label>

        <div style={{ display: "flex", gap: "12px", marginBottom: "10px" }}>
          <NumberInput
            label="Min"
            value={rentLowerBound}
            min={0}
            onChange={(val) => setRentLowerBound(Number(val))}
          />

          <NumberInput
            label="Max"
            value={rentUpperBound}
            min={0}
            onChange={(val) => setRentUpperBound(Number(val))}
          />
        </div>
      </div>

      {/* FURNISHING */}
      <div className="filter-group">
        <label>Furnishing Type</label>
        <select value={furnishingType} onChange={(e) => setFurnishingType(e.target.value)}>
          <option value="">Any</option>
          {furnishingOptions.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* AREA */}
      <div className="filter-group">
        <label>Area Size (sq ft)</label>
        <input
          type="number"
          min="0"
          value={areaSize}
          onChange={(e) => setAreaSize(e.target.value)}
          placeholder="Enter area size"
        />
      </div>

      {/* TRANSPORT */}
      <div className="filter-group">
        <label>Transport Availability</label>
        <div className="radio-group">
          <label><input type="radio" checked={transportAvailability === true} onChange={() => setTransportAvailability(true)} /> Yes</label>
          <label><input type="radio" checked={transportAvailability === false} onChange={() => setTransportAvailability(false)} /> No</label>
          <label><input type="radio" checked={transportAvailability === null} onChange={() => setTransportAvailability(null)} /> Any</label>
        </div>
      </div>

      {/* HOUSE TYPE */}
      <div className="filter-group">
        <label>House Type</label>
        <select value={houseType} onChange={(e) => setHouseType(e.target.value)}>
          <option value="">Any</option>
          {houseTypeOptions.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* NEARBY */}
      <div className="filter-group">
        <label>Nearby Places</label>
        <input
          type="text"
          value={nearbyPlaces}
          onChange={(e) => setNearbyPlaces(e.target.value)}
        />
      </div>

      {/* DESCRIPTION */}
      <div className="filter-group">
        <label>Description Match</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the kind of property you want..."
          rows="3"
        />
      </div>

      {/* APPLY */}
      <button className="apply-btn" onClick={handleApply}>Apply Filters</button>
    </div>
  );
};

export default Filters;
