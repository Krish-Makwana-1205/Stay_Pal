import React, { useEffect, useState, useRef } from "react";
import "../StyleSheets/TenantForm.css";
import { form2, getProfile, uploadPhoto } from "../api/tenantform";
import Alert from "../Components/Alert";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function TenantForm2() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const fileInputRef = useRef(null);

  // icons / image preferences (files must be in frontend/public/)
  const imagePrefs = [
    { key: "nightOwl", label: "Night Owl", img: "/nightOwl.png" },
    { key: "earlybird", label: "Early Bird", img: "/earlybird.png" },
    { key: "studious", label: "Studious", img: "/studious.png" },
    { key: "fitness_freak", label: "Fitness Freak", img: "/fitness_freak.png" },
    { key: "sporty", label: "Sporty", img: "/sporty.png" },
    { key: "wanderer", label: "Wanderer", img: "/wanderer.png" },
    { key: "party_lover", label: "Party Lover", img: "/party_lover.png" },
    { key: "music_lover", label: "Music Lover", img: "/music_lover.png" },
    { key: "Pet_lover", label: "Pet Lover", img: "/pet_lover.png" },
  ];

  // initial form state (include all boolean image preferences so toggling works)
  const [formData, setFormData] = useState({
    foodPreference: "",
    religion: "",
    alcohol: false, // image toggle (no_alcohol icon)
    smoker: false,  // image toggle (no_smoking icon)
    nightOwl: false,
    earlybird: false,
    studious: false,
    fitness_freak: false,
    sporty: false,
    wanderer: false,
    party_lover: false,
    music_lover: false,
    hobbies: [],
    allergies: [],
    professional_status: "",
    workingshifts: "",
    havePet: false,
    workPlace: "",
    descriptions: "",
    // added fields
    maritalStatus: "Any", // enum: Single, Married, Any
    family: false,
    language: "Any",
    minStayDuration: -1,
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading1, setloading1] = useState(false);
  const [newHobby, setNewHobby] = useState("");

  // Prefill existing tenant profile
  useEffect(() => {
    if (!loading && !user) navigate("/login");

    let mounted = true;
    const load = async () => {
      try {
        const res = await getProfile();
        const t = res.data?.tenant || res.data?.data || res.data;
        if (!mounted || !t) return;

        // map backend keys into local formData shape
        setFormData((f) => ({
          ...f,
          foodPreference: t.foodPreference ?? f.foodPreference,
          religion: t.religion ?? f.religion,
          alcohol: typeof t.alcohol === "boolean" ? t.alcohol : f.alcohol,
          smoker: typeof t.smoker === "boolean" ? t.smoker : f.smoker,
          nightOwl: typeof t.nightOwl === "boolean" ? t.nightOwl : f.nightOwl,
          earlybird: typeof t.earlybird === "boolean" ? t.earlybird : f.earlybird,
          studious: typeof t.studious === "boolean" ? t.studious : f.studious,
          fitness_freak: typeof t.fitness_freak === "boolean" ? t.fitness_freak : f.fitness_freak,
          sporty: typeof t.sporty === "boolean" ? t.sporty : f.sporty,
          wanderer: typeof t.wanderer === "boolean" ? t.wanderer : f.wanderer,
          party_lover: typeof t.party_lover === "boolean" ? t.party_lover : f.party_lover,
          music_lover: typeof t.music_lover === "boolean" ? t.music_lover : f.music_lover,
          hobbies: Array.isArray(t.hobbies) ? t.hobbies : f.hobbies,
          allergies: Array.isArray(t.allergies) ? t.allergies : f.allergies,
          professional_status: t.professionalStatus ?? t.professional_status ?? f.professional_status,
          workingshifts: t.workingshifts ?? f.workingshifts,
          havePet: typeof t.Pet_lover === "boolean" ? t.Pet_lover : f.havePet,
          workPlace: t.workPlace ?? f.workPlace,
          descriptions: t.description ?? t.descriptions ?? f.descriptions,
          // PREFILL added fields:
          maritalStatus: t.maritalStatus ?? f.maritalStatus,
          family: typeof t.family === "boolean" ? t.family : f.family,
          language: t.language ?? f.language,
          minStayDuration: typeof t.minStayDuration === "number" ? t.minStayDuration : f.minStayDuration,
        }));

        if (t.profilePhoto) setPhotoPreview(t.profilePhoto);
      } catch (err) {
        // ignore silently
      }
    };

    if (user) load();
    return () => { mounted = false; };
  }, [user, loading, navigate]);

  // generic change handler for inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // toggle booleans (for icon buttons)
  const togglePref = (key) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddHobby = () => {
    if (!newHobby.trim()) return;
    setFormData((prev) => ({ ...prev, hobbies: [...prev.hobbies, newHobby.trim()] }));
    setNewHobby("");
  };

  const handleRemoveHobby = (index) => {
    setFormData((prev) => ({ ...prev, hobbies: prev.hobbies.filter((_, i) => i !== index) }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading1(true);
    setMessage({ text: "", type: "" });

    try {
      // Frontend -> backend keys mapping and allowed whitelist
      const allowedKeys = [
        "foodPreference",
        "religion",
        "alcohol",
        "smoker",
        "nightOwl",
        "earlybird",
        "studious",
        "fitness_freak",
        "sporty",
        "wanderer",
        "party_lover",
        "music_lover",
        "hobbies",
        "allergies",
        "professionalStatus",
        "workingshifts",
        "Pet_lover",
        "workPlace",
        "description",
        // added fields
        "maritalStatus",
        "family",
        "language",
        "minStayDuration",
      ];

      // normalize / map local formData to the backend-expected keys
      const raw = { ...formData };

      // map professional_status -> professionalStatus
      if (raw.professional_status && !raw.professionalStatus) {
        raw.professionalStatus = raw.professional_status;
      }

      // map havePet -> Pet_lover
      if (typeof raw.havePet !== "undefined" && typeof raw.Pet_lover === "undefined") {
        raw.Pet_lover = raw.havePet;
      }

      // map descriptions -> description
      if (raw.descriptions && typeof raw.description === "undefined") {
        raw.description = raw.descriptions;
      }

      // ensure arrays
      raw.hobbies = Array.isArray(raw.hobbies) ? raw.hobbies : [];
      raw.allergies = Array.isArray(raw.allergies) ? raw.allergies : [];

      // ensure boolean keys for imagePrefs exist (so false will be sent if intentionally unchecked)
      imagePrefs.forEach(p => {
        if (typeof raw[p.key] === "undefined") raw[p.key] = false;
      });

      // ensure added keys exist so backend receives explicit defaults if user didn't touch them
      if (typeof raw.maritalStatus === "undefined") raw.maritalStatus = "Any";
      if (typeof raw.family === "undefined") raw.family = false;
      if (typeof raw.language === "undefined") raw.language = "Any";
      if (typeof raw.minStayDuration === "undefined") raw.minStayDuration = -1;

      // build final payload with only allowed keys
      const payload = {};
      allowedKeys.forEach((k) => {
        if (Object.prototype.hasOwnProperty.call(raw, k)) {
          payload[k] = raw[k];
        }
      });

      // Send preferences update
      const res = await form2(payload);

      // Photo upload separate (best-effort). Prefer server to use auth to identify user.
      if (profilePhoto && user) {
        const fd = new FormData();
        fd.append("photo", profilePhoto);
        try {
          await uploadPhoto(fd);
        } catch (err) {
          setMessage({
            text: err.response?.data?.message || "Photo upload failed. Backend may not accept uploads.",
            type: "error",
          });
        }
      }

      if (res.status === 200 || res.status === 201) {
        setMessage({ text: "Preferences saved successfully!", type: "success" });
        navigate("/dashboard");
      } else {
        setMessage({ text: res.data?.message || "Unexpected response", type: "error" });
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Error saving preferences", type: "error" });
    } finally {
      setloading1(false);
    }
  };

  return (
    <div className="tenant-form-container">
      <h2 className="form-title">Preferences & Photo</h2>

      <Alert message={message.text} type={message.type} onClose={() => setMessage({ text: "", type: "" })} />

      <form onSubmit={handleSubmit} className="tenant-form">
        {/* Food Preference */}
        <label>Food Preference</label>
        <select name="foodPreference" value={formData.foodPreference} onChange={handleChange}>
          <option value="">Select preference</option>
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
          <option value="Jain">Jain</option>
          <option value="Vegan">Vegan</option>
        </select>

        {/* Religion (dropdown matching backend enum) */}
        <label>Religion</label>
        <select name="religion" value={formData.religion} onChange={handleChange}>
          <option value="">Select Religion</option>
          <option value="Hinduism">Hinduism</option>
          <option value="Islam">Islam</option>
          <option value="Christianity">Christianity</option>
          <option value="Judaism">Judaism</option>
          <option value="Sikhism">Sikhism</option>
          <option value="Jainism">Jainism</option>
          <option value="Buddhism">Buddhism</option>
          <option value="Taoism">Taoism</option>
          <option value="Zoroastrianism">Zoroastrianism</option>
          <option value="Other">Other</option>
          <option value="Any">Any</option>
        </select>

        {/* NO ALCOHOL - replaced checkbox with image toggle */}
        <label>Alcohol</label>
        <div className="small-pref-row">
          <button
            type="button"
            className={`pref-icon small ${formData.alcohol ? "active" : ""}`}
            onClick={() => togglePref("alcohol")}
            aria-pressed={!!formData.alcohol}
            title={formData.alcohol ? "Allows alcohol (toggled)" : "No alcohol"}
          >
            <img src="/no_alcohol.png" alt="No Alcohol" />
            <span style={{ fontSize: "0.72rem" }}>{formData.alcohol ? "Allows Alcohol" : "No Alcohol"}</span>
          </button>
        </div>

        {/* NO SMOKING - replaced checkbox with image toggle */}
        <label>Smoking</label>
        <div className="small-pref-row">
          <button
            type="button"
            className={`pref-icon small ${formData.smoker ? "active" : ""}`}
            onClick={() => togglePref("smoker")}
            aria-pressed={!!formData.smoker}
            title={formData.smoker ? "Smoker" : "No Smoking"}
          >
            <img src="/no_smoking.png" alt="No Smoking" />
            <span style={{ fontSize: "0.72rem" }}>{formData.smoker ? "Smoker" : "No Smoking"}</span>
          </button>
        </div>

        {/* Professional Status */}
        <label>Professional Status</label>
        <select name="professional_status" value={formData.professional_status} onChange={handleChange}>
          <option value="">Select status</option>
          <option value="student">Student</option>
          <option value="working">Working</option>
          <option value="Any">Any</option>
        </select>

        {/* Working Shifts */}
        <label>Working Shifts</label>
        <select name="workingshifts" value={formData.workingshifts} onChange={handleChange}>
          <option value="">Select shift</option>
          <option value="morning">Morning</option>
          <option value="night">Night</option>
          <option value="Any">Any</option>
        </select>

        {/* Marital Status (added) */}
        <label>Marital Status</label>
        <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
          <option value="Any">Any</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
        </select>

        {/* Family (added) */}
        <label>
          <input type="checkbox" name="family" checked={formData.family} onChange={handleChange} />
          Family-friendly (lives with family or prefers family accommodation)
        </label>

        {/* Language (added) */}
        <label>Language</label>
        <input type="text" name="language" value={formData.language} onChange={handleChange} placeholder="Any" />

        {/* Minimum stay duration (added) */}
        <label>Minimum stay duration (months)</label>
        <input
          type="number"
          name="minStayDuration"
          value={formData.minStayDuration}
          onChange={handleChange}
          min={-1}
          step={1}
          placeholder="-1 for no minimum"
        />

        {/* Work Place */}
        <label>Work Place</label>
        <input type="text" name="workPlace" value={formData.workPlace} onChange={handleChange} />

        {/* Hobbies */}
        <label>Hobbies</label>
        <div className="hobby-section">
          <input type="text" value={newHobby} onChange={(e) => setNewHobby(e.target.value)} placeholder="Enter a hobby" />
          <button type="button" onClick={handleAddHobby}>Add Hobby</button>
        </div>
        <ul className="hobby-list">
          {formData.hobbies.map((hobby, index) => (
            <li key={index}>
              {hobby}{" "}
              <button type="button" onClick={() => handleRemoveHobby(index)} className="remove-btn">x</button>
            </li>
          ))}
        </ul>

        {/* Allergies (simple comma input) */}
        <label>Allergies (optional)</label>
        <input
          type="text"
          name="allergies"
          value={Array.isArray(formData.allergies) ? formData.allergies.join(", ") : formData.allergies}
          onChange={(e) => setFormData((p) => ({ ...p, allergies: e.target.value ? e.target.value.split(",").map(s => s.trim()).filter(Boolean) : [] }))}
          placeholder="comma separated, e.g. peanuts, pollen"
        />

        {/* Description */}
        <label>About Yourself</label>
        <textarea name="descriptions" value={formData.descriptions} onChange={handleChange} placeholder="Tell us something about yourself..." />

        {/* Boolean preference icons (image toggles) */}
        <label>Quick Preferences</label>
        <div className="pref-icons">
          {imagePrefs.map(pref => (
            <button
              key={pref.key}
              type="button"
              className={`pref-icon ${formData[pref.key] ? "active" : ""}`}
              onClick={() => togglePref(pref.key)}
              aria-pressed={!!formData[pref.key]}
              title={pref.label}
            >
              <img src={pref.img} alt={pref.label} />
              <span>{pref.label}</span>
            </button>
          ))}
        </div>

        {/* Photo upload */}
        <div className="photo-upload-section">
          <label>Profile Photo</label>
          <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="photo-input-local" />
          {photoPreview && (
            <div className="photo-preview">
              <img src={photoPreview} alt="Preview" style={{ width: 140, height: 140, borderRadius: "50%", objectFit: "cover" }} />
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn" disabled={loading1}>
          {loading1 ? "Saving..." : "Save Preferences"}
        </button>
      </form>
    </div>
  );
}
