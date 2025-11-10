import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Alert from "../Components/Alert";
import { savePreferences } from "../api/propertyform";
import "../StyleSheets/PropertyForm.css";
import CreatableSelect from "react-select/creatable";
import NumberInput from "../Components/NumberInput";

export default function PropertyForm2() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    gender: "Any",
    minAge: "",
    maxAge: "",
    occupation: "",
    maritalStatus: "Any",
    family: "Any",
    foodPreference: "Any",
    smoking: "Any",
    alcohol: "Any",
    pets: false,
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

  const handleOccupationChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      occupation: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!formData.name) {
      setMessage({ text: "Property name is required.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        minAge: formData.minAge ? Number(formData.minAge) : undefined,
        maxAge: formData.maxAge ? Number(formData.maxAge) : undefined,
        minStayDuration: formData.minStayDuration
          ? Number(formData.minStayDuration)
          : undefined,
        maxPeopleAllowed: formData.maxPeopleAllowed
          ? Number(formData.maxPeopleAllowed)
          : undefined,
      };

      const res = await savePreferences(payload);
      if (res.status === 200) {
        setMessage({
          text: res.data.message || "Preferences saved successfully!",
          type: "success",
        });
        // Optionally redirect
        // navigate("/usercard");
      } else {
        setMessage({
          text: res.data?.message || "Unexpected response from server.",
          type: "error",
        });
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to save preferences.",
        type: "error",
      });
      console.error("Save preferences error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Predefined Occupation Options (editable + user can add)
  const occupationOptions = [
    { value: "IT", label: "IT" },
    { value: "Hospital", label: "Hospital / Healthcare" },
    { value: "Government", label: "Government Employee" },
    { value: "Lawyer", label: "Lawyer" },
    { value: "Businessman", label: "Businessman" },
    { value: "Teacher", label: "Teacher" },
    { value: "Engineer", label: "Engineer" },
    { value: "Accountant", label: "Accountant" },
    { value: "Banker", label: "Banker" },
    { value: "Police", label: "Police / Security" },
    { value: "Student", label: "Student" },
    { value: "Freelancer", label: "Freelancer" },
    { value: "Artist", label: "Artist / Designer" },
    { value: "Chef", label: "Chef" },
    { value: "Other", label: "Other" },
  ];

  return (
    <div className="property-form-container">
      <h2 className="form-title">Tenant Preferences for Property</h2>

      <Alert
        message={message.text}
        type={message.type}
        onClose={() => setMessage({ text: "", type: "" })}
      />

      <form onSubmit={handleSubmit} className="property-form">
        <label>Gender Preference</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="Any">Any</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        {/* ✅ Age Range Split Inputs */}
        <label>Age Range</label>
        <div style={{ display: "flex", gap: "10px" }}>
          <NumberInput
            name="minAge"
            placeholder="Min Age"
            value={formData.minAge}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, minAge: e.target.value }))
            }
            min="0"
          />
          <NumberInput
            name="maxAge"
            placeholder="Max Age"
            value={formData.maxAge}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, maxAge: e.target.value }))
            }
            min="0"
          />
        </div>

        {/* ✅ Occupation with Predefined + Custom */}
        <label>Occupation</label>
        <CreatableSelect
          options={occupationOptions}
          value={
            formData.occupation
              ? { value: formData.occupation, label: formData.occupation }
              : null
          }
          onChange={handleOccupationChange}
          placeholder="Select or type occupation"
          isClearable
        />

        <label>Marital Status</label>
        <select
          name="maritalStatus"
          value={formData.maritalStatus}
          onChange={handleChange}
        >
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
        <select
          name="foodPreference"
          value={formData.foodPreference}
          onChange={handleChange}
        >
          <option value="Any">Any</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Non-Vegetarian">Non-Vegetarian</option>
        </select>

        <label>Smoking</label>
        <select
          name="smoking"
          value={formData.smoking}
          onChange={handleChange}
        >
          <option value="Any">Any</option>
          <option value="Allowed">Allowed</option>
          <option value="Not Allowed">Not Allowed</option>
        </select>

        <label>Alcohol</label>
        <select
          name="alcohol"
          value={formData.alcohol}
          onChange={handleChange}
        >
          <option value="Any">Any</option>
          <option value="Allowed">Allowed</option>
          <option value="Not Allowed">Not Allowed</option>
        </select>

         <label>Pet</label>
        <select
          name="pets"
          value={formData.pets ? "Allowed" : "Not Allowed"}
          onChange={handleChange}
        >
          <option value="Any">Any</option>
          <option value="Allowed">Allowed</option>
          <option value="Not Allowed">Not Allowed</option>
        </select>

        {/* <label>Nationality</label>
        <input
          name="nationality"
          type="text"
          value={formData.nationality}
          onChange={handleChange}
        /> */}

        <label>Working Shift</label>
        <select
          name="workingShift"
          value={formData.workingShift}
          onChange={handleChange}
        >
          <option value="Any">Any</option>
          <option value="Day Shift">Day Shift</option>
          <option value="Night Shift">Night Shift</option>
        </select>

        <label>Professional Status</label>
        <select
          name="professionalStatus"
          value={formData.professionalStatus}
          onChange={handleChange}
        >
          <option value="Any">Any</option>
          <option value="Student">Student</option>
          <option value="Employed">Employed</option>
          <option value="Self-Employed">Self-Employed</option>
        </select>

        <label>Minimum Stay Duration (months)</label>
        <NumberInput
          name="minStayDuration"
          min="0"
          value={formData.minStayDuration}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              minStayDuration: e.target.value,
            }))
          }
        />

        <label>Max People Allowed</label>
        <NumberInput
          name="maxPeopleAllowed"
          min="0"
          value={formData.maxPeopleAllowed}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              maxPeopleAllowed: e.target.value,
            }))
          }
        />

        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Preferences"}
        </button>
      </form>
    </div>
  );
}
