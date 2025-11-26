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
  const userKey = user ? user.email : "guest";

  // --- Initialize all state from localStorage ---
  const [selectedCity, setSelectedCity] = useState(null);
  const [rentLower, setRentLower] = useState("0");
  const [rentUpper, setRentUpper] = useState("100000");
  const [locality, setLocality] = useState("");
  const [BHK, setBHK] = useState("");
  const [furnishingType, setFurnishingType] = useState("");
  const [areaSize, setAreaSize] = useState("");
  const [transportAvailability, setTransportAvailability] = useState("Any");
  const [houseType, setHouseType] = useState("");
  const [nearbyPlaces, setNearbyPlaces] = useState("");
  const [description, setDescription] = useState("");
  const [googleLink, setGoogleLink] = useState("");

  // Load saved filters on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");

      if (saved.city) setSelectedCity({ value: saved.city, label: saved.city });
      if (saved.rentLower !== undefined) setRentLower(String(saved.rentLower));
      if (saved.rentUpper !== undefined) setRentUpper(String(saved.rentUpper));
      if (saved.locality) setLocality(saved.locality);
      if (saved.BHK !== undefined) setBHK(String(saved.BHK));
      if (saved.furnishingType) setFurnishingType(saved.furnishingType);
      if (saved.areaSize !== undefined) setAreaSize(String(saved.areaSize));
      if (saved.transportAvailability !== undefined)
        setTransportAvailability(saved.transportAvailability);
      if (saved.houseType) setHouseType(saved.houseType);
      if (saved.nearbyPlaces !== undefined) setNearbyPlaces(saved.nearbyPlaces);
      if (saved.description) setDescription(saved.description);
      if (saved.googleLink) setGoogleLink(saved.googleLink);
      // If there's no saved city but a parent provided defaultCity, use it
      if (!saved.city && defaultCity) {
        setSelectedCity({ value: defaultCity, label: defaultCity });
        // try per-city default locality
        const perCityKey = `defaultLocality_${userKey}_${defaultCity}`;
        const perSaved = localStorage.getItem(perCityKey);
        if (perSaved) setLocality(perSaved);
      }
    } catch (e) {
      console.error("Error loading saved filters:", e);
    }
  }, [storageKey]);

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
      googleLink,
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {}
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
    googleLink,
  ]);

  // ---------- city loader ----------
  const loadCityOptions = (inputValue, callback) => {
    const allCities = City.getCitiesOfCountry("IN");
    const filtered = allCities
      .filter((c) =>
        c.name.toLowerCase().includes((inputValue || "").toLowerCase())
      )
      .slice(0, 20)
      .map((c) => ({ label: c.name, value: c.name }));
    callback(filtered);
  };

  // ---------- validation ----------
  const parsedLower = Number(rentLower === "" ? NaN : rentLower);
  const parsedUpper = Number(rentUpper === "" ? NaN : rentUpper);
  const rentLowerIsValid =
    !isNaN(parsedLower) && parsedLower >= 0 && parsedLower <= MAX_RENT;
  const rentUpperIsValid =
    !isNaN(parsedUpper) && parsedUpper >= 0 && parsedUpper <= MAX_RENT;

  const rentRangeError =
    rentLower !== "" &&
    rentUpper !== "" &&
    rentLowerIsValid &&
    rentUpperIsValid &&
    parsedLower > parsedUpper
      ? "Minimum rent cannot be greater than maximum rent."
      : "";

  // ---------- apply ----------
  const handleApply = () => {
    if (!selectedCity?.value) {
      alert("Please select a city before applying filters.");
      return;
    }

    if (!rentLowerIsValid || !rentUpperIsValid) {
      alert("Please enter valid rent values.");
      return;
    }

    if (rentRangeError) return;

    const filters = {
      city: selectedCity.value.trim(),
      locality: locality || undefined,
      BHK: BHK ? Number(BHK) : undefined,
      rentLowerBound: parsedLower,
      rentUpperBound: parsedUpper,
      furnishingType: furnishingType || undefined,
      areaSize: areaSize ? Number(areaSize) : undefined,
      transportAvailability:
        transportAvailability === null ? undefined : transportAvailability,
      houseType: houseType || undefined,
      nearbyPlaces: nearbyPlaces || undefined,
      description: description || undefined,
      googleLink: googleLink || undefined,
      page: 1,
      limit: 20,
    };

    // store new city globally
    localStorage.setItem("defaultCity", selectedCity.value.trim());

    onApply(filters);
  };

  // ---------- reset ----------
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
    setGoogleLink("");

    try {
      localStorage.removeItem(storageKey);
    } catch {}
  };

  // ---------- convert nearby ----------
  const nearbyValue = Array.isArray(nearbyPlaces)
    ? nearbyPlaces.map((p) => ({ label: p, value: p }))
    : nearbyPlaces
    ? nearbyPlaces
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((p) => ({ label: p, value: p }))
    : [];

  return (
    <div className="filters-container">
      <h2>Property Filters</h2>

      {/* Apply button at top */}
      <div style={{ marginBottom: 10 }}>
        <button
          className="apply-btn"
          onClick={handleApply}
          disabled={
            !selectedCity || !!rentRangeError || !rentLowerIsValid || !rentUpperIsValid
          }
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#060e66ff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          Apply Filters
        </button>
      </div>

      {/* ★★★★★ FIXED CITY LOGIC ★★★★★ */}
      <div className="filter-group">
        <label>City *</label>
        <AsyncSelect
          cacheOptions
          loadOptions={loadCityOptions}
          defaultOptions
          value={selectedCity}
          onChange={(val) => {
            setSelectedCity(val);
            setLocality("");

            // ⭐ THE FIXED CORRECT LOGIC YOU ASKED FOR:
            if (val?.value) {
              localStorage.setItem("defaultCity", val.value.trim());
              // If user previously saved a default locality for this city, apply it
              try {
                const perCityKey = `defaultLocality_${userKey}_${val.value}`;
                const savedLoc = localStorage.getItem(perCityKey);
                if (savedLoc) setLocality(savedLoc);
              } catch (e) {}
            }
          }}
          placeholder="Search for a city..."
        />
      </div>
      {/* ★★★★★ END FIX ★★★★★ */}

      {/* LOCALITY */}
      <div className="filter-group">
        <label>Locality</label>
        <LocalitySelector
          city={selectedCity?.value}
          value={locality}
          onChange={(val) => {
            setLocality(val);
            // persist per-city default locality for this user
            if (selectedCity?.value) {
              try {
                const perCityKey = `defaultLocality_${userKey}_${selectedCity.value}`;
                if (val) localStorage.setItem(perCityKey, val);
                else localStorage.removeItem(perCityKey);
              } catch (e) {}
            }
          }}
        />
      </div>

      {/* BHK + AREA */}
      <div
        className="filter-group"
        style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
      >
        <div style={{ flex: 1 }}>
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

        <div style={{ width: 150 }}>
          <label>Area Size (sq ft)</label>
          <input
            type="number"
            min="0"
            value={areaSize}
            onChange={(e) => setAreaSize(e.target.value)}
            placeholder="sq ft"
          />
        </div>
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

        <div className="rent-inputs">
          <div className="range-wrapper">
            <input
              type="range"
              min={0}
              max={MAX_RENT}
              step={500}
              value={isNaN(Number(rentLower)) ? 0 : Number(rentLower)}
              onChange={(e) => setRentLower(e.target.value)}
            />
            <span>
              Min: ₹
              {(isNaN(Number(rentLower)) ? 0 : Number(rentLower)).toLocaleString()}
            </span>
          </div>

          <div className="range-wrapper">
            <input
              type="range"
              min={0}
              max={MAX_RENT}
              step={500}
              value={isNaN(Number(rentUpper)) ? MAX_RENT : Number(rentUpper)}
              onChange={(e) => setRentUpper(e.target.value)}
            />
            <span>
              Max: ₹
              {(isNaN(Number(rentUpper)) ? MAX_RENT : Number(rentUpper)).toLocaleString()}
            </span>
          </div>
        </div>

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
        <select
          value={furnishingType}
          onChange={(e) => setFurnishingType(e.target.value)}
        >
          <option value="">Any</option>
          <option value="Fully Furnished">Fully Furnished</option>
          <option value="Semi Furnished">Semi Furnished</option>
          <option value="Unfurnished">Unfurnished</option>
        </select>
      </div>

      {/* TRANSPORT */}
      <div className="filter-group">
        <label>Transport Availability</label>
        <select
          value={transportAvailability === null ? "" : transportAvailability}
          onChange={(e) => {
            if (e.target.value === "") setTransportAvailability(null);
            else setTransportAvailability(e.target.value === "true");
          }}
        >
          <option value="">Select</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      {/* HOUSE TYPE */}
      <div className="filter-group">
        <label>House Type</label>
        <select value={houseType} onChange={(e) => setHouseType(e.target.value)}>
          <option value="">Any</option>
          <option value="Apartment">Apartment</option>
          <option value="Independent House">Independent House</option>
          <option value="Villa">Villa</option>
          <option value="PG / Hostel">PG / Hostel</option>
        </select>
      </div>

      {/* NEARBY */}
      <div className="filter-group">
        <label>Nearby Places</label>
        <CreatableSelect
          isMulti
          value={nearbyValue}
          onChange={(vals) =>
            setNearbyPlaces((vals || []).map((v) => v.value))
          }
          options={[
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
          ]}
        />
      </div>

      {/* DESCRIPTION */}
      <div className="filter-group">
        <label>Describe your dream property</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the kind of property you want..."
          rows="3"
        />
      </div>

      {/* GOOGLE LINK */}
      <div className="filter-group">
        <label>Location near which you want your home</label>
        <input
          type="text"
          value={googleLink}
          onChange={(e) => setGoogleLink(e.target.value)}
          placeholder="Paste Google Maps or listing URL (optional)"
        />
      </div>

      {/* APPLY & RESET */}
      <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
        <button
          className="apply-btn"
          onClick={handleApply}
          disabled={
            !selectedCity || !!rentRangeError || !rentLowerIsValid || !rentUpperIsValid
          }
        >
          Apply Filters
        </button>
        <button
          className="reset-btn"
          onClick={handleReset}
          style={{
            flex: 1,
            padding: "10px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
