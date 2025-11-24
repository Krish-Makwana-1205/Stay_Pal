// src/pages/EditTenantPreferences.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import ISO6391 from "iso-639-1";
import { countries } from "countries-list";
import NumberInput from "../Components/NumberInput";
import Alert from "../Components/Alert";
import { fetchSingleProperty } from "../api/filters";
import { savePreferences } from "../api/propertyform";
import { useAuth } from "../context/AuthContext";
import "../StyleSheets/EditPrefernces.css";

export default function EditTenantPreferences() {
  const { email, name } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // occupation options reused from your form
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

  // Fetch property and prefill tenantPreferences
  useEffect(() => {
    if (!email || !name) return;
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const res = await fetchSingleProperty(email, name);
        const p = res.data?.data;
        if (!p) {
          setMessage({ text: "Property not found.", type: "error" });
          return;
        }

        // Prefill base fields
        const tp = p.tenantPreferences || {};

        // ageRange in backend earlier was saved as "min-max" or "min+"
        let minAge = "";
        let maxAge = "";
        if (tp.ageRange) {
          if (tp.ageRange.includes("-")) {
            const parts = tp.ageRange.split("-");
            minAge = parts[0] || "";
            maxAge = parts[1] || "";
          } else if (tp.ageRange.endsWith("+")) {
            minAge = tp.ageRange.replace("+", "") || "";
            maxAge = "";
          }
        }

        if (!mounted) return;
        setFormData({
          email: p.email || email || "",
          name: p.name || name || "",
          gender: tp.gender || "Any",
          minAge: minAge,
          maxAge: maxAge,
          occupation: tp.occupation || "",
          maritalStatus: tp.maritalStatus || "Any",
          family: tp.family || "Any",
          foodPreference: tp.foodPreference || "Any",
          smoking: typeof tp.smoking === "boolean" ? tp.smoking : true,
          alcohol: typeof tp.alcohol === "boolean" ? tp.alcohol : true,
          pets: typeof tp.pets === "boolean" ? tp.pets : true,
          nationality: tp.nationality || "",
          workingShift: tp.workingShift || "Any",
          professionalStatus: tp.professionalStatus || "Any",
          religion: tp.religion || "",
          language: tp.language || "",
          minStayDuration: tp.minStayDuration ?? "",
          maxPeopleAllowed: tp.maxPeopleAllowed ?? "",
          notes: tp.notes || "",
        });
      } catch (err) {
        console.error("Error loading preferences:", err);
        setMessage({ text: "Failed to load preferences.", type: "error" });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [email, name]);

  // handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    // convert select-like strings for boolean selects in your schema (smoking/alcohol/pets)
    if (name === "smoking" || name === "alcohol" || name === "pets") {
      setFormData((prev) => ({ ...prev, [name]: value === "true" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOccupationChange = (selected) => {
    setFormData((prev) => ({ ...prev, occupation: selected ? selected.value : "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    // basic validation
    if (!formData.name) {
      setMessage({ text: "Property name required.", type: "error" });
      return;
    }
    if (formData.minAge && formData.maxAge && Number(formData.minAge) > Number(formData.maxAge)) {
      setMessage({ text: "Minimum age cannot be greater than maximum age.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      // Create expected payload shape like before
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
        minStayDuration: formData.minStayDuration ? Number(formData.minStayDuration) : 0,
        maxPeopleAllowed: formData.maxPeopleAllowed ? Number(formData.maxPeopleAllowed) : 0,
        notes: formData.notes || "",
      };

      const res = await savePreferences(payload);
      if (res.status === 200) {
        setMessage({ text: res.data.message || "Preferences saved.", type: "success" });
        // optional: redirect back to MyProperties after save
        setTimeout(() => navigate("/myproperties"), 900);
      } else {
        setMessage({ text: res.data?.message || "Unexpected response.", type: "error" });
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

  // render
  return (
    <div className="epre-property-form-container">
      <h2 className="epre-form-title">Edit Tenant Preferences</h2>

      <Alert message={message.text} type={message.type} onClose={() => setMessage({ text: "", type: "" })} />

      <form onSubmit={handleSubmit} className="epre-property-form">
        <label>Email (auto-filled)</label>
        <input type="email" value={formData.email} readOnly disabled style={{ backgroundColor: "#f3f3f3", color: "#666" }} />

        <label>Property Name *</label>
        <input type="text" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} required />

        <label>Gender Preference</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="Any">Any</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label>Age Range</label>
        <div style={{ display: "flex", gap: "10px" }}>
          <NumberInput name="minAge" placeholder="Min Age" value={formData.minAge} onChange={(e) => setFormData((p) => ({ ...p, minAge: e.target.value }))} min="0" />
          <NumberInput name="maxAge" placeholder="Max Age" value={formData.maxAge} onChange={(e) => setFormData((p) => ({ ...p, maxAge: e.target.value }))} min="0" />
        </div>

        <label>Occupation</label>
        <CreatableSelect options={occupationOptions} value={formData.occupation ? { value: formData.occupation, label: formData.occupation } : null} onChange={handleOccupationChange} isClearable />

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

        <label>Smoking Preference</label>
        <select name="smoking" value={String(formData.smoking)} onChange={handleChange}>
          <option value="true">Any</option>
          <option value="false">Not Allowed</option>
        </select>

        <label>Alcohol Preference</label>
        <select name="alcohol" value={String(formData.alcohol)} onChange={handleChange}>
          <option value="true">Any</option>
          <option value="false">Not Allowed</option>
        </select>

        <label>Pets Allowed</label>
        <select name="pets" value={String(formData.pets)} onChange={handleChange}>
          <option value="true">Any</option>
          <option value="false">Not Allowed</option>
        </select>

        <label>Nationality</label>
        <Select options={Object.values(countries).map(c => ({ value: c.name, label: c.name }))} value={formData.nationality ? { value: formData.nationality, label: formData.nationality } : null} onChange={(s) => setFormData((p)=>({ ...p, nationality: s ? s.value : "" }))} isClearable />

        <label>Religion</label>
        <select name="religion" value={formData.religion} onChange={handleChange}>
          <option value="Any">Any</option>
          <option value="Hinduism">Hinduism</option>
          <option value="Islam">Islam</option>
          <option value="Christianity">Christianity</option>
          <option value="Judaism">Judaism</option>
          <option value="Sikhism">Sikhism</option>
          <option value="Jainism">Jainism</option>
          <option value="Buddhism">Buddhism</option>
          <option value="Other">Other</option>
        </select>

        <label>Most preferred Language</label>
        <Select options={ISO6391.getAllNames().map(lang => ({ value: lang, label: lang }))} value={formData.language ? { value: formData.language, label: formData.language } : null} onChange={(s) => setFormData((p)=>({ ...p, language: s ? s.value : "" }))} isClearable />

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
        <NumberInput name="minStayDuration" min="0" value={formData.minStayDuration} onChange={(e) => setFormData(p => ({ ...p, minStayDuration: e.target.value }))} />

        <label>Max People Allowed</label>
        <NumberInput name="maxPeopleAllowed" min="0" value={formData.maxPeopleAllowed} onChange={(e) => setFormData(p => ({ ...p, maxPeopleAllowed: e.target.value }))} />

        <label>Notes</label>
        <textarea name="notes" value={formData.notes} onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))} />

        <button type="submit" className="epre-submit-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Preferences"}
        </button>
      </form>
    </div>
  );
}