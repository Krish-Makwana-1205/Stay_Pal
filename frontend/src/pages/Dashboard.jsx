import React, { useEffect, useState } from "react";
import Select from "react-select";
import { City } from "country-state-city";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { fetchproperty } from "../api/filters";
import "../StyleSheets/Dashboard.css";

import Header from '../Components/Header';
import FeaturedProperties from "../Components/FeaturedProperties";


const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const [defaultCity, setDefaultCity] = useState(() => {
    return localStorage.getItem("defaultCity") || "";
  });

  const [properties, setProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(false);
  const [error, setError] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
    const allCities = City.getCitiesOfCountry("IN");
    const formattedCities = allCities.map((c) => ({
      value: c.name,
      label: c.name,
    }));
    setCityOptions(formattedCities);
  }, []);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
    else if (!loading && user?.istenant === false) navigate("/usercard");
  }, [loading, user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      localStorage.removeItem("defaultCity");
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith("filters_")) {
          localStorage.removeItem(key);
        }
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const fetchProperties = async (selectedCity) => {
    if (!selectedCity) return;
    setLoadingProps(true);
    setError(null);
    try {
      const { data } = await fetchproperty({ city: selectedCity });
      setProperties(data?.data || []);
    } catch (err) {
      console.error("City fetch error:", err);
      setError("Could not fetch properties for this city.");
      setProperties([]);
    } finally {
      setLoadingProps(false);
    }
  };

  useEffect(() => {
    if (defaultCity) {
      fetchProperties(defaultCity);
    }
  }, [defaultCity]);

  const handleCityChange = (selectedOption) => {
    const selected = selectedOption.value;
    setDefaultCity(selected);
    localStorage.setItem("defaultCity", selected);
    fetchProperties(selected);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Header user={user} onNavigate={navigate} onLogout={handleLogout} active="home" />
      <div className="dashboard-container">

        <div className="dashboard-main">
          <hr className="dashboard-hr" />

          <div className="city-select-section">
            <h2>Select a City</h2>
           <Select
  options={cityOptions}
  placeholder="Choose your city..."
  value={
    defaultCity
      ? { value: defaultCity, label: defaultCity }
      : null
  }
  onChange={handleCityChange}
  className="city-dropdown"
  isSearchable
  menuPortalTarget={document.body}   // <-- ADD THIS
  styles={{
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),  // <-- ADD THIS
  }}
/>

          </div>


          <FeaturedProperties
            loading={loadingProps}
            error={error}
            properties={properties}
            onPropertyClick={(p) => navigate(`/property/${p.email}/${p.name}`)}
          />

          {/* {<div className="featured-properties">
          {loadingProps ? (
            <p>Loading properties…</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : properties.length > 0 ? (
            properties.slice(0, 4).map((p, idx) => {
              const imgSrc = p.img || (p.imgLink?.length > 0 ? p.imgLink[0] : null);
              return (
                <div key={p._id || idx} className="property-card" onClick={() => navigate(`/property/${p.email}/${p.name}`)}>
                  {imgSrc ? (
                    <img src={imgSrc} alt={p.city} className="property-img" />
                  ) : (
                    <div className="property-img-placeholder" />
                  )}
                  <div className="card-body">
                    <h2>{p.name}</h2>
                    <h3>{p.city} — {p.BHK} BHK</h3>
                    <p>Rent: ₹{p.rent}</p>
                    <div><img
                      src="/location-icon.png"
                      alt="Clickable"
                      style={{ width: "20px", cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (p?.addressLink) {
                          window.open(p.addressLink, "_blank", "noopener,noreferrer");
                        } 
                      }}
                      role="button"
                      tabIndex={0}
                    /></div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Select a city to view available properties.</p>
          )}
        </div>} */}
          {properties.length > 0 && (
            <div className="see-more-wrap">
              <button
                className="see-more-btn"
                onClick={() => navigate("/dashboard/properties", { state: { defaultCity } })}
              >
                See More Properties
              </button>
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default Dashboard;
