import React, { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import CreatableSelect from "react-select/creatable";
import { City } from "country-state-city";
import NumberInput from "../Components/NumberInput";
import LocalitySelector from "../Components/LocalitySelector";
import { useAuth } from "../context/AuthContext";

const MAX_RENT = 10000000; // 1 crore

export default function Filters({ onApply, defaultCity }) {
  const { user } = useAuth();
  const storageKey = user ? `filters_${user.email}` : "filters_guest";

  // --- Initialize all state from localStorage ---
  const [selectedCity, setSelectedCity] = useState(null);
  const [rentLower, setRentLower] = useState("0");
  const [rentUpper, setRentUpper] = useState("100000");
  const [locality, setLocality] = useState("");
  const [BHK, setBHK] = useState("");
  const [furnishingType, setFurnishingType] = useState("");
  const [areaSize, setAreaSize] = useState("");
  const [transportAvailability, setTransportAvailability] = useState(null);
  const [houseType, setHouseType] = useState("");
  const [nearbyPlaces, setNearbyPlaces] = useState("");
  const [description, setDescription] = useState("");

  // Load saved filters on component mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
      
      if (saved.city) {
        setSelectedCity({ value: saved.city, label: saved.city });
      }
      if (saved.rentLower !== undefined) setRentLower(String(saved.rentLower));
      if (saved.rentUpper !== undefined) setRentUpper(String(saved.rentUpper));
      if (saved.locality) setLocality(saved.locality);
      if (saved.BHK !== undefined) setBHK(String(saved.BHK));
      if (saved.furnishingType) setFurnishingType(saved.furnishingType);
      if (saved.areaSize !== undefined) setAreaSize(String(saved.areaSize));
      if (saved.transportAvailability !== undefined) setTransportAvailability(saved.transportAvailability);
      if (saved.houseType) setHouseType(saved.houseType);
      if (saved.nearbyPlaces) setNearbyPlaces(saved.nearbyPlaces);
      if (saved.description) setDescription(saved.description);
    } catch (e) {
      console.error("Error loading saved filters:", e);
    }
  }, [storageKey]);

  // Override city if defaultCity prop is provided
 useEffect(() => {
  if (defaultCity) {
    // overwrite local cache to force fresh locality fetch
    localStorage.removeItem(`localities_${defaultCity}`);
    setSelectedCity({ value: defaultCity, label: defaultCity });
    setLocality(""); // reset locality
  }
}, [defaultCity]);


  const furnishingOptions = ["Fully Furnished", "Semi Furnished", "Unfurnished"];
  const houseTypeOptions = ["Apartment", "Independent House", "Villa", "PG / Hostel"];
  const nearbyOptions = [
    { value: "Market", label: "Market" },
    { value: "Bus Stop", label: "Bus Stop" },
    { value: "School", label: "School" },
    { value: "Hospital", label: "Hospital" },
    { value: "Metro Station", label: "Metro Station" },
    { value: "Grocery Store", label: "Grocery Store" },
    { value: "Super Market (e.g. Dmart)", label: "Super Market (e.g. Dmart)" },
    { value: "Park", label: "Park" },
    { value: "Mall", label: "Mall" },
    { value: "Restaurant", label: "Restaurant" },
    { value: "Pharmacy", label: "Pharmacy" },
    { value: "ATM", label: "ATM" },
    { value: "Gym", label: "Gym" },
  ];

  // ---------- persist filters as user types ----------
  useEffect(() => {
    const payload = {
      city: selectedCity?.value || "",
      locality,
      BHK,
      rentLower,
      rentUpper,
      furnishingType,
      areaSize,
      transportAvailability,
      houseType,
      nearbyPlaces,
      description,
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (e) {
      // ignore storage errors
    }
  }, [
    storageKey,
    selectedCity,
    locality,
    BHK,
    rentLower,
    rentUpper,
    furnishingType,
    areaSize,
    transportAvailability,
    houseType,
    nearbyPlaces,
    description,
  ]);

  // ---------- city loader (unchanged) ----------
  const loadCityOptions = (inputValue, callback) => {
    const allCities = City.getCitiesOfCountry("IN");
    const filtered = allCities
      .filter((c) => c.name.toLowerCase().includes((inputValue || "").toLowerCase()))
      .slice(0, 20)
      .map((c) => ({ label: c.name, value: c.name }));
    callback(filtered);
  };

  // ---------- helpers & validation ----------
  const parsedLower = Number(rentLower === "" ? NaN : rentLower);
  const parsedUpper = Number(rentUpper === "" ? NaN : rentUpper);
  const rentLowerIsValid = !isNaN(parsedLower) && parsedLower >= 0 && parsedLower <= MAX_RENT;
  const rentUpperIsValid = !isNaN(parsedUpper) && parsedUpper >= 0 && parsedUpper <= MAX_RENT;
  const rentRangeError =
    (rentLower !== "" && rentUpper !== "" && rentLowerIsValid && rentUpperIsValid && parsedLower > parsedUpper)
      ? "Minimum rent cannot be greater than maximum rent."
      : "";

  // We'll show typed values in inputs and use numbers for API
  const handleApply = () => {
    if (!selectedCity?.value) {
      alert("Please select a city before applying filters.");
      return;
    }

    if (!rentLowerIsValid || !rentUpperIsValid) {
      alert("Please enter valid numeric rent values within allowed limits.");
      return;
    }

    if (rentRangeError) {
      // show inline error and prevent apply
      return;
    }

    const filters = {
      city: selectedCity.value.trim(),
      locality: locality || undefined,
      BHK: BHK ? Number(BHK) : undefined,
      rentLowerBound: parsedLower,
      rentUpperBound: parsedUpper,
      furnishingType: furnishingType || undefined,
      areaSize: areaSize ? Number(areaSize) : undefined,
      transportAvailability: transportAvailability === null ? undefined : transportAvailability,
      houseType: houseType || undefined,
      nearbyPlaces: nearbyPlaces || undefined,
      description: description || undefined,
      page: 1,
      limit: 20,
    };

    onApply(filters);
  };

  // Reset all filters
  const handleReset = () => {
    setSelectedCity(null);
    setLocality("");
    setBHK("");
    setRentLower("0");
    setRentUpper("100000");
    setFurnishingType("");
    setAreaSize("");
    setTransportAvailability(null);
    setHouseType("");
    setNearbyPlaces("");
    setDescription("");
    
    // Clear localStorage
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      // ignore
    }
  };

  // ---------- slider handlers keep strings in sync ----------
  const handleLowerSlider = (val) => {
    // ensure it never goes above parsedUpper (if set)
    const num = Number(val);
    if (!isNaN(parsedUpper) && parsedUpper < num) {
      setRentLower(String(parsedUpper));
    } else {
      setRentLower(String(num));
    }
  };
  const handleUpperSlider = (val) => {
    const num = Number(val);
    if (!isNaN(parsedLower) && parsedLower > num) {
      setRentUpper(String(parsedLower));
    } else {
      setRentUpper(String(num));
    }
  };

  // convert nearbyPlaces string <-> CreatableSelect value:
  const nearbyValue = Array.isArray(nearbyPlaces)
    ? nearbyPlaces.map((p) => ({ label: p, value: p }))
    : (nearbyPlaces ? nearbyPlaces.split(",").map(s => s.trim()).filter(Boolean).map(p => ({ label: p, value: p })) : []);

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
            setLocality(""); // reset locality on city change
          }}
          placeholder="Search for a city..."
        />
      </div>

      {/* LOCALITY */}
      <div className="filter-group">
        <label>Locality</label>
        <LocalitySelector city={selectedCity?.value} value={locality} onChange={setLocality} />
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
        <label>Rent (₹)</label>

        <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
          <NumberInput
            name="rentLower"
            value={rentLower}
            min={0}
            onChange={(e) => {
              // accept raw typing; clamp to max
              const v = e.target.value.replace(/[^\d]/g, "");
              if (v === "") setRentLower("");
              else {
                let n = Number(v);
                if (n > MAX_RENT) n = MAX_RENT;
                setRentLower(String(n));
              }
            }}
          />

          <NumberInput
            name="rentUpper"
            value={rentUpper}
            min={0}
            onChange={(e) => {
              const v = e.target.value.replace(/[^\d]/g, "");
              if (v === "") setRentUpper("");
              else {
                let n = Number(v);
                if (n > MAX_RENT) n = MAX_RENT;
                setRentUpper(String(n));
              }
            }}
          />
        </div>

        {/* sliders */}
        <div className="rent-inputs">
          <div className="range-wrapper">
            <input
              type="range"
              min={0}
              max={MAX_RENT}
              step={500}
              value={isNaN(Number(rentLower)) ? 0 : Number(rentLower)}
              onChange={(e) => handleLowerSlider(e.target.value)}
            />
            <span>Min: ₹{(isNaN(Number(rentLower)) ? 0 : Number(rentLower)).toLocaleString()}</span>
          </div>

          <div className="range-wrapper">
            <input
              type="range"
              min={0}
              max={MAX_RENT}
              step={500}
              value={isNaN(Number(rentUpper)) ? MAX_RENT : Number(rentUpper)}
              onChange={(e) => handleUpperSlider(e.target.value)}
            />
            <span>Max: ₹{(isNaN(Number(rentUpper)) ? MAX_RENT : Number(rentUpper)).toLocaleString()}</span>
          </div>
        </div>

        {/* inline validation */}
        {(!rentLowerIsValid || !rentUpperIsValid) && (
          <p style={{ color: "crimson", marginTop: 8 }}>
            Enter valid numeric rent values (0 - {MAX_RENT.toLocaleString()}).
          </p>
        )}
        {rentRangeError && (
          <p style={{ color: "crimson", marginTop: 8 }}>{rentRangeError}</p>
        )}
      </div>

      {/* FURNISHING */}
      <div className="filter-group">
        <label>Furnishing Type</label>
        <select value={furnishingType} onChange={(e) => setFurnishingType(e.target.value)}>
          <option value="">Any</option>
          {furnishingOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* AREA */}
      <div className="filter-group">
        <label>Area Size (sq ft)</label>
        <input type="number" min="0" value={areaSize} onChange={(e) => setAreaSize(e.target.value)} placeholder="Enter area size" />
      </div>

      {/* TRANSPORT */}
      <div className="filter-group">
        <label>Transport Availability</label>
        <div className="radio-group">
          <label>
            <input type="radio" name="transport" checked={transportAvailability === true} onChange={() => setTransportAvailability(true)} /> Yes
          </label>
          <label>
            <input type="radio" name="transport" checked={transportAvailability === false} onChange={() => setTransportAvailability(false)} /> No
          </label>
          <label>
            <input type="radio" name="transport" checked={transportAvailability === null} onChange={() => setTransportAvailability(null)} /> Any
          </label>
        </div>
      </div>

      {/* HOUSE TYPE */}
      <div className="filter-group">
        <label>House Type</label>
        <select value={houseType} onChange={(e) => setHouseType(e.target.value)}>
          <option value="">Any</option>
          {houseTypeOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* NEARBY (creatable multi) */}
      <div className="filter-group">
        <label>Nearby Places</label>
        <CreatableSelect
          isMulti
          options={nearbyOptions}
          value={nearbyValue}
          onChange={(vals) => {
            const arr = (vals || []).map((v) => v.value);
            setNearbyPlaces(arr);
          }}
          placeholder="Select or add nearby places"
        />
      </div>

      {/* DESCRIPTION */}
      <div className="filter-group">
        <label>Description Match</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the kind of property you want..." rows="3" />
      </div>

      {/* APPLY & RESET */}
      <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
        <button
          className="apply-btn"
          onClick={handleApply}
          disabled={!selectedCity || !!rentRangeError || !rentLowerIsValid || !rentUpperIsValid}
        >
          Apply Filters
        </button>
        <button
          className="reset-btn"
          onClick={handleReset}
          style={{ flex: 1, padding: "10px", backgroundColor: "#e74c3c", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
