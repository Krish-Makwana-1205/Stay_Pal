import React, { useState } from "react";
import "../StyleSheets/TenantForm.css";
import { form1 } from "../api/tenantform";
import { useNavigate } from "react-router-dom";
import Alert from "../Components/Alert";
import { useAuth } from "../context/AuthContext";         
import AsyncSelect from "react-select/async";              
import { Country, City } from "country-state-city";     
import { useEffect } from "react";   

export default function TenantForm() {
  const { user ,fetchUser} = useAuth();
  const navigate = useNavigate();

    useEffect(() => {
      if (!user) navigate("/login");
    }, [ user, navigate]);
  const [formData, setFormData] = useState({
    nationality: "",
    hometown: "",
    gender: "",
    dob: "",
  });

  const [selectedCountryCode, setSelectedCountryCode] = useState(null); 
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const loadCountryOptions = (inputValue, callback) => {
    if (!inputValue || inputValue.length < 1) {
      callback([]);
      return;
    }

    const allCountries = Country.getAllCountries();

    const filtered = allCountries
      .filter((country) =>
        country.name.toLowerCase().includes(inputValue.toLowerCase())
      )
      .slice(0, 20)
      .map((country) => ({
        value: country.isoCode,
        label: country.name,
      }));

    callback(filtered);
  };
  const loadCityOptions = (inputValue, callback) => {
    if (!selectedCountryCode) {
      callback([]);
      return;
    }

    if (!inputValue || inputValue.length < 2) {
      callback([]);
      return;
    }

    const allCities = City.getCitiesOfCountry(selectedCountryCode) || [];

    const filtered = allCities
      .filter((city) =>
        city.name.toLowerCase().includes(inputValue.toLowerCase())
      )
      .slice(0, 20)
      .map((city) => ({
        value: city.name,
        label: city.name,
      }));

    if (filtered.length === 0) {
      filtered.push({ value: "Other", label: "Other" });
    }

    callback(filtered);
  };

  if (loading || user === undefined) {
    return <p className="loading-text">Loading user...</p>;
  }

  console.log(user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedCountryCode(
        selectedOption.value === "OTHER" ? null : selectedOption.value
      );
      setFormData({
        ...formData,
        nationality: selectedOption.label,
        hometown: "", // clear previous city if country changes
      });
    } else {
      setSelectedCountryCode(null);
      setFormData({ ...formData, nationality: "", hometown: "" });
    }
  };
  const handleCityChange = (selectedOption) => {
    setFormData({
      ...formData,
      hometown: selectedOption ? selectedOption.value : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await form1(formData);

      if (res.status === 200) {
        setMessage({
          text: "Profile created successfully!",
          type: "success",
        });
        await fetchUser();
        navigate("/tenantForm2");
      }
    } catch (error) {
      console.error("Error submitting tenant form:", error);
      if (error.response) {
        setMessage({
          text: error.response.data.message || "Server error.",
          type: "error",
        });
      } else {
        setMessage({ text: "Network error.", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tenant-form-container">
      <h2 className="form-title">Tenant Profile</h2>
      <form onSubmit={handleSubmit} className="tenant-form">
        <label>
          Country <span className="required">*</span>
        </label>
        <AsyncSelect
          cacheOptions
          loadOptions={loadCountryOptions}
          onChange={handleCountryChange}
          placeholder="Type to search your country..."
          isClearable
        />

        <label>
          Hometown <span className="required">*</span>
        </label>
        {/* ✅ UPDATED: City search enabled only after country is selected */}
        <AsyncSelect
          cacheOptions
          loadOptions={loadCityOptions}
          onChange={handleCityChange}
          placeholder={
            selectedCountryCode
              ? "Type to search your city..."
              : "Select country first"
          }
          isDisabled={!selectedCountryCode} // ✅ disable until country chosen
          isClearable
        />

        <label>
          Gender <span className="required">*</span>
        </label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label>
          Date of Birth <span className="required">*</span>
        </label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Save Profile"}
        </button>
      </form>

      <Alert
        message={message.text}
        type={message.type}
        onClose={() => setMessage({ text: "", type: "" })}
      />
    </div>
  );
}
