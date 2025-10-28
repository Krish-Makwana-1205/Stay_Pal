import React, { useState } from "react";
import "../StyleSheets/TenantForm.css"; 
import { form2 } from "../api/tenantform"; 

export default function TenantForm2() {
  const [formData, setFormData] = useState({
    foodPreference: "",
    religion: "",
    alcohol: false,
    smoker: false,
    nightOwl: false,
    hobbies: [],
    professional_status: "",
    workingshifts: "",
    havePet: false,
    workPlace: "",
    descriptions: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleHobbiesChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      hobbies: value.split(",").map((h) => h.trim()),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await form2(formData);
      if (res.status === 200) {
        setMessage("Preferences saved successfully!");
      }
    } catch (error) {
      console.error("Error submitting preferences:", error);
      if (error.response) {
        setMessage(error.response.data.message || "Server error.");
      } else {
        setMessage("Network error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tenant-form-container">
      <h2 className="form-title">Tenant Preferences</h2>
      <form onSubmit={handleSubmit} className="tenant-form">

        <label>Food Preference</label>
        <input
          type="text"
          name="foodPreference"
          value={formData.foodPreference}
          onChange={handleChange}
        />

        <label>Religion</label>
        <input
          type="text"
          name="religion"
          value={formData.religion}
          onChange={handleChange}
        />

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="alcohol"
              checked={formData.alcohol}
              onChange={handleChange}
            />{" "}
            Drinks Alcohol
          </label>

          <label>
            <input
              type="checkbox"
              name="smoker"
              checked={formData.smoker}
              onChange={handleChange}
            />{" "}
            Smoker
          </label>

          <label>
            <input
              type="checkbox"
              name="nightOwl"
              checked={formData.nightOwl}
              onChange={handleChange}
            />{" "}
            Night Owl
          </label>

          <label>
            <input
              type="checkbox"
              name="havePet"
              checked={formData.havePet}
              onChange={handleChange}
            />{" "}
            Has Pet
          </label>
        </div>

        <label>Hobbies (comma separated)</label>
        <input
          type="text"
          name="hobbies"
          value={formData.hobbies.join(", ")}
          onChange={handleHobbiesChange}
        />

        <label>Professional Status</label>
        <input
          type="text"
          name="professional_status"
          value={formData.professional_status}
          onChange={handleChange}
        />

        <label>Working Shifts</label>
        <input
          type="text"
          name="workingshifts"
          value={formData.workingshifts}
          onChange={handleChange}
        />

        <label>Workplace</label>
        <input
          type="text"
          name="workPlace"
          value={formData.workPlace}
          onChange={handleChange}
        />

        <label>Additional Description</label>
        <textarea
          name="descriptions"
          value={formData.descriptions}
          onChange={handleChange}
          rows="4"
        />

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Preferences"}
        </button>
      </form>

      {message && <p className="response-message">{message}</p>}
    </div>
  );
}
