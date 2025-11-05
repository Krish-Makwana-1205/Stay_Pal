import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Alert from "../Components/Alert";
import { savePreferences } from "../api/propertyform";
import "../StyleSheets/PropertyForm.css";

export default function PropertyForm2() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    gender: "Any",
    ageRange: "",
    occupation: "",
    maritalStatus: "Any",
    family: "Any",
    foodPreference: "Any",
    smoking: "Any",
    alcohol: "Any",
    pets: false,
    nationality: "",
    workingShift: "Any",
    professionalStatus: "Any",
    minStayDuration: "",
    maxPeopleAllowed: "",
    notes: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((f) => ({
        ...f,
        email: user.email || f.email,
        name: user.name || f.name,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    // basic validation
    if (!formData.email || !formData.name) {
      setMessage({ text: "Owner email and name are required.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        minStayDuration: formData.minStayDuration ? Number(formData.minStayDuration) : undefined,
        maxPeopleAllowed: formData.maxPeopleAllowed ? Number(formData.maxPeopleAllowed) : undefined,
      };
      const res = await savePreferences(payload);
      if (res.status === 200) {
        setMessage({ text: res.data.message || "Preferences saved", type: "success" });
        // optionally redirect back to owner page
        // navigate("/usercard");
      } else {
        setMessage({ text: res.data?.message || "Unexpected response", type: "error" });
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Failed to save preferences", type: "error" });
      console.error("Save preferences error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="property-form-container">
      <h2 className="form-title">Tenant Preferences for Property</h2>

      <Alert message={message.text} type={message.type} onClose={() => setMessage({ text: "", type: "" })} />

      <form onSubmit={handleSubmit} className="property-form">
        <label>Owner Email *</label>
        <input name="email" type="email" value={formData.email} onChange={handleChange} required />

        <label>Property Name *</label>
        <input name="name" type="text" value={formData.name} onChange={handleChange} required />

        <label>Gender Preference</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="Any">Any</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label>Age Range</label>
        <input name="ageRange" type="text" placeholder="eg. 21-30" value={formData.ageRange} onChange={handleChange} />

        <label>Occupation</label>
        <input name="occupation" type="text" value={formData.occupation} onChange={handleChange} />

        <label>Marital Status</label>
        <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
          <option value="Any">Any</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
        </select>

        <label>Family</label>
        <select name="family" value={formData.family} onChange={handleChange}>
          <option value="Any">Any</option>
          <option value="Allowed">Allowed</option>
          <option value="Not Allowed">Not Allowed</option>
        </select>

        <label>Food Preference</label>
        <select name="foodPreference" value={formData.foodPreference} onChange={handleChange}>
          <option value="Any">Any</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Non-Vegetarian">Non-Vegetarian</option>
        </select>

        <label>Smoking</label>
        <select name="smoking" value={formData.smoking} onChange={handleChange}>
          <option value="Any">Any</option>
          <option value="Allowed">Allowed</option>
          <option value="Not Allowed">Not Allowed</option>
        </select>

        <label>Alcohol</label>
        <select name="alcohol" value={formData.alcohol} onChange={handleChange}>
          <option value="Any">Any</option>
          <option value="Allowed">Allowed</option>
          <option value="Not Allowed">Not Allowed</option>
        </select>

        <label>
          <input name="pets" type="checkbox" checked={formData.pets} onChange={handleChange} /> Pets allowed
        </label>

        <label>Nationality</label>
        <input name="nationality" type="text" value={formData.nationality} onChange={handleChange} />

        <label>Working Shift</label>
        <select name="workingShift" value={formData.workingShift} onChange={handleChange}>
          <option value="Any">Any</option>
          <option value="Day Shift">Day Shift</option>
          <option value="Night Shift">Night Shift</option>
        </select>

        <label>Professional Status</label>
        <select name="professionalStatus" value={formData.professionalStatus} onChange={handleChange}>
          <option value="Any">Any</option>
          <option value="Student">Student</option>
          <option value="Employed">Employed</option>
          <option value="Self-Employed">Self-Employed</option>
        </select>

        <label>Minimum Stay Duration (months)</label>
        <input name="minStayDuration" type="number" min="0" value={formData.minStayDuration} onChange={handleChange} />

        <label>Max People Allowed</label>
        <input name="maxPeopleAllowed" type="number" min="0" value={formData.maxPeopleAllowed} onChange={handleChange} />

        <label>Notes</label>
        <textarea name="notes" value={formData.notes} onChange={handleChange} />

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Preferences"}
        </button>
      </form>
    </div>
  );
}