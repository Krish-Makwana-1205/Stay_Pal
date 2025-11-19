import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Alert from "../Components/Alert";
import { savePreferences } from "../api/propertyform";
import "../StyleSheets/PropertyForm.css";
import CreatableSelect from "react-select/creatable";
import NumberInput from "../Components/NumberInput";
import ISO6391 from "iso-639-1";
import Select from "react-select";
import { countries } from "countries-list";

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
    smoking: true,
    alcohol: true,
    pets: true,
    nationality: "",
    workingShift: "Any",
    professionalStatus: "Any",
    religion: "",
    language: "",
    minStayDuration: "",
    maxPeopleAllowed: "",
    notes: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("tenantPreferencesFormData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    const lastName = localStorage.getItem("propertyForm_lastName");
    if (lastName) {
      setFormData((prev) => ({
        ...prev,
        name: lastName,
      }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tenantPreferencesFormData", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "smoking" || name === "alcohol" || name === "pets"
          ? value === "true"
          : value,
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

    if (
      formData.minAge &&
      formData.maxAge &&
      Number(formData.minAge) > Number(formData.maxAge)
    ) {
      setMessage({
        text: "Minimum age cannot be greater than maximum age.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email: formData.email,
        name: formData.name,
        gender: formData.gender,
        ageRange:
          formData.minAge && formData.maxAge
            ? `${formData.minAge}-${formData.maxAge}`
            : formData.minAge
            ? `${formData.minAge}+`
            : "",
        occupation: formData.occupation,
        maritalStatus: formData.maritalStatus,
        family: formData.family,
        foodPreference: formData.foodPreference,
        smoking: Boolean(formData.smoking),
        alcohol: Boolean(formData.alcohol),
        pets: Boolean(formData.pets),
        nationality: formData.nationality,
        workingShift: formData.workingShift,
        professionalStatus: formData.professionalStatus,
        religion: formData.religion,
        language: formData.language,
        minStayDuration: formData.minStayDuration
          ? Number(formData.minStayDuration)
          : 0,
        maxPeopleAllowed: formData.maxPeopleAllowed
          ? Number(formData.maxPeopleAllowed)
          : 0,
        notes: formData.notes || "",
      };

      const res = await savePreferences(payload);

      if (res.status === 200) {
        setMessage({
          text: res.data.message || "Tenant preferences saved successfully!",
          type: "success",
        });

        navigate("/dashboard");

        localStorage.removeItem("tenantPreferencesFormData");

        setFormData({
          email: user?.email || "",
          name: user?.name || "",
          gender: "Any",
          minAge: "",
          maxAge: "",
          occupation: "",
          maritalStatus: "Any",
          family: "Any",
          foodPreference: "Any",
          smoking: true,
          alcohol: true,
          pets: true,
          nationality: "",
          workingShift: "Any",
          professionalStatus: "Any",
          religion: "",
          language: "",
          minStayDuration: "",
          maxPeopleAllowed: "",
          notes: "",
        });
      } else {
        setMessage({
          text: res.data?.message || "Unexpected server response.",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Save preferences error:", err);
      setMessage({
        text: err.response?.data?.message || "Failed to save preferences.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

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

      <div className="property-form-wrapper">

        {/* LEFT PANEL */}
        <div className="property-form-left">
          <h2 className="property-form-title">Tenant Preferences</h2>
        </div>

        {/* RIGHT PANEL */}
        <div className="property-form-right">

          <Alert
            message={message.text}
            type={message.type}
            onClose={() => setMessage({ text: "", type: "" })}
          />

          <form onSubmit={handleSubmit} className="property-form">

            <label>Email (auto-filled)</label>
            <input
              type="email"
              value={formData.email}
              readOnly
              disabled
              style={{ backgroundColor: "#f3f3f3", color: "#666" }}
            />

            <label>Property Name *</label>
            <input
              type="text"
              value={formData.name}
              readOnly
              style={{ backgroundColor: "#f3f3f3", color: "#555", cursor: "not-allowed" }}
            />

            <label>Gender Preference</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="Any">Any</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

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

            <label>Smoking Preference</label>
            <select name="smoking" value={formData.smoking} onChange={handleChange}>
              <option value="true">Any</option>
              <option value="false">Not Allowed</option>
            </select>

            <label>Alcohol Preference</label>
            <select name="alcohol" value={formData.alcohol} onChange={handleChange}>
              <option value="true">Any</option>
              <option value="false">Not Allowed</option>
            </select>

            <label>Pets Allowed</label>
            <select name="pets" value={formData.pets} onChange={handleChange}>
              <option value="true">Any</option>
              <option value="false">Not Allowed</option>
            </select>

            <label>Nationality</label>
            <Select
              options={Object.values(countries).map((c) => ({
                value: c.name,
                label: c.name,
              }))}
              value={
                formData.nationality
                  ? { value: formData.nationality, label: formData.nationality }
                  : null
              }
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  nationality: selected ? selected.value : "",
                }))
              }
              isClearable
            />

            <label>Religion</label>
            <select
              name="religion"
              value={formData.religion}
              onChange={handleChange}
            >
              <option value="Any">Any</option>
              <option value="Hinduism">Hinduism</option>
              <option value="Islam">Islam</option>
              <option value="Christianity">Christianity</option>
              <option value="Judaism">Judaism</option>
              <option value="Sikhism">Sikhism</option>
              <option value="Jainism">Jainism</option>
              <option value="Buddhism">Buddhism</option>
              <option value="Taoism">Taoism</option>
              <option value="Zoroastrianism">Zoroastrianism</option>
              <option value="Atheist">Atheist</option>
              <option value="Other">Other</option>
            </select>

            <label>Most Preferred Language</label>
            <Select
              options={ISO6391.getAllNames().map((lang) => ({
                value: lang,
                label: lang,
              }))}
              value={
                formData.language
                  ? { value: formData.language, label: formData.language }
                  : null
              }
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  language: selected ? selected.value : "",
                }))
              }
              isClearable
            />

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

            <button type="submit" className="property-submit-btn" disabled={loading}>
              {loading ? "Saving..." : "Save Preferences"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
