import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import { City } from "country-state-city";
import { useEffect } from "react";

const Filters = ({ onApply,defaultCity }) => {
const [selectedCity, setSelectedCity] = useState(() => {
    const cityName = defaultCity || localStorage.getItem("defaultCity") || "";
    return cityName ? { value: cityName, label: cityName } : null;
  });  const [locality, setLocality] = useState("");
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

  const loadCityOptions = (inputValue, callback) => {
    const allCities = City.getCitiesOfCountry("IN");
    const filtered = allCities
      .filter((c) =>
        c.name.toLowerCase().includes(inputValue.toLowerCase())
      )
      .slice(0, 20)
      .map((c) => ({
        label: c.name,
        value: c.name,
      }));
    callback(filtered);
  };

  const handleChange = (selectedOption) => {
    setSelectedCity(selectedOption); 
  };

  const handleApply = () => {
    if (!selectedCity?.value?.trim()) {
      alert("Please select a city before applying filters.");
      return;
    }

    const filters = {
      city: selectedCity.value.trim(), 
      locality: locality.trim() || undefined,
      BHK: BHK ? Number(BHK) : undefined,
      rentLowerBound: rentLowerBound ? Number(rentLowerBound) : undefined,
      rentUpperBound: rentUpperBound ? Number(rentUpperBound) : undefined,
      furnishingType: furnishingType || undefined,
      areaSize: areaSize ? Number(areaSize) : undefined,
      transportAvailability:
        transportAvailability === null ? undefined : Boolean(transportAvailability),
      houseType: houseType || undefined,
      nearbyPlaces: nearbyPlaces.trim() || undefined,
      description: description.trim() || undefined,
      page: 1,
      limit: 20,
    };

    console.log("Filters sent to backend:", filters);
    onApply(filters);
  };
useEffect(() => {
  if (defaultCity && (!selectedCity || selectedCity.value !== defaultCity)) {
    setSelectedCity({ value: defaultCity, label: defaultCity });
  }
}, [defaultCity]);
  return (
    <div className="filters-container">
      <h2>Property Filters</h2>

      {/* City Selector */}
      <div className="filter-group">
        <label>City *</label>
        <AsyncSelect
          cacheOptions
          loadOptions={loadCityOptions}
          defaultOptions
          value={selectedCity} 
          onChange={handleChange}
          placeholder="Search for a city..."
          styles={{
            control: (provided) => ({
              ...provided,
              borderRadius: "8px",
              borderColor: "#ccc",
              boxShadow: "none",
              "&:hover": { borderColor: "#007bff" },
            }),
          }}
        />
      </div>

      {/* Locality */}
      <div className="filter-group">
        <label>Locality</label>
        <input
          type="text"
          value={locality}
          onChange={(e) => setLocality(e.target.value)}
          placeholder="Enter locality (optional)"
        />
      </div>

      {/* BHK */}
      <div className="filter-group">
        <label>BHK</label>
        <input
          type="number"
          min="1"
          max="10"
          placeholder="Enter number of BHK"
          value={BHK}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= 1 || e.target.value === "") {
              setBHK(e.target.value);
            }
          }}
        />
      </div>

      {/* Rent Range */}
      <div className="filter-group rent-range">
        <label>Rent Range (₹)</label>
        <div className="rent-inputs">
          <div className="range-wrapper">
            <input
              type="range"
              min="0"
              max="100000"
              step="500"
              value={rentLowerBound}
              onChange={(e) => setRentLowerBound(Number(e.target.value))}
              className="slider"
            />
            <span>Min: ₹{rentLowerBound.toLocaleString()}</span>
          </div>

          <div className="range-wrapper">
            <input
              type="range"
              min="0"
              max="100000"
              step="500"
              value={rentUpperBound}
              onChange={(e) => setRentUpperBound(Number(e.target.value))}
              className="slider"
            />
            <span>Max: ₹{rentUpperBound.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Furnishing Type */}
      <div className="filter-group">
        <label>Furnishing Type</label>
        <select
          value={furnishingType}
          onChange={(e) => setFurnishingType(e.target.value)}
        >
          <option value="">Any</option>
          {furnishingOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Area Size */}
      <div className="filter-group">
        <label>Area Size (sq ft)</label>
        <input
          type="number"
          min="0"
          value={areaSize}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= 0 || e.target.value === "") {
              setAreaSize(e.target.value);
            }
          }}
          placeholder="Enter area size"
        />
      </div>

      {/* Transport Availability */}
      <div className="filter-group transport-group">
        <label>Transport Availability</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="transport"
              checked={transportAvailability === true}
              onChange={() => setTransportAvailability(true)}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="transport"
              checked={transportAvailability === false}
              onChange={() => setTransportAvailability(false)}
            />
            No
          </label>
          <label>
            <input
              type="radio"
              name="transport"
              checked={transportAvailability === null}
              onChange={() => setTransportAvailability(null)}
            />
            Any
          </label>
        </div>
      </div>

      {/* House Type */}
      <div className="filter-group">
        <label>House Type</label>
        <select
          value={houseType}
          onChange={(e) => setHouseType(e.target.value)}
        >
          <option value="">Any</option>
          {houseTypeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Nearby Places */}
      <div className="filter-group">
        <label>Nearby Places</label>
        <input
          type="text"
          value={nearbyPlaces}
          onChange={(e) => setNearbyPlaces(e.target.value)}
          placeholder="e.g. Metro, School, Hospital"
        />
        <div className="popular-places">
          {[
            "Metro Station",
            "Bus Stop",
            "Hospital",
            "School",
            "College",
            "Grocery Store",
            "Supermarket (e.g. Dmart, Big Bazaar)",
            "Park",
            "Mall",
            "Restaurant",
            "Pharmacy",
            "ATM",
            "Gym",
          ].map((place) => (
            <button
              key={place}
              type="button"
              className={`place-option ${nearbyPlaces.includes(place) ? "selected" : ""}`}
              onClick={() => {
                if (nearbyPlaces.includes(place)) {
                  setNearbyPlaces(
                    nearbyPlaces
                      .split(", ")
                      .filter((p) => p !== place)
                      .join(", ")
                  );
                } else {
                  setNearbyPlaces(
                    nearbyPlaces ? `${nearbyPlaces}, ${place}` : place
                  );
                }
              }}
            >
              {place}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="filter-group">
        <label>Property Description Match</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the kind of property you are looking for..."
          rows="3"
        />
      </div>

      {/* Apply Button */}
      <button className="apply-btn" onClick={handleApply}>
        Apply Filters
      </button>
    </div>
  );
};

export default Filters;
