import React, { useEffect, useState, useRef } from "react";
import "../StyleSheets/TenantForm2.css";
import { form2, getProfile, uploadPhoto } from "../api/tenantform";
import Alert from "../Components/Alert";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function TenantForm2() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const fileInputRef = useRef(null);

  // Icons / image preferences
  const imagePrefs = [
    { key: "nightOwl", label: "Night Owl", img: "/nightOwl.png" },
    { key: "earlybird", label: "Early Bird", img: "/earlybird.png" },
    { key: "studious", label: "Studious", img: "/studious.png" },
    { key: "fitness_freak", label: "Fitness Freak", img: "/fitness_freak.png" },
    { key: "sporty", label: "Sporty", img: "/sporty.png" },
    { key: "traveller", label: "Traveller", img: "/traveller.png" },
    { key: "party_lover", label: "Party Lover", img: "/party_lover.png" },
    { key: "music_lover", label: "Music Lover", img: "/music_lover.png" },
    { key: "Pet_lover", label: "Pet Lover", img: "/pet_lover.png" },
  ];

  // Initial form state
  const [formData, setFormData] = useState({
    foodPreference: "",
    religion: "",
    alcohol: false,
    smoker: false,
    nightOwl: false,
    earlybird: false,
    studious: false,
    fitness_freak: false,
    sporty: false,
    traveller: false,
    party_lover: false,
    music_lover: false,
    hobbies: [],
    allergies: [],
    professional_status: "",
    workingshifts: "",
    havePet: false,
    workPlace: "",
    descriptions: "",
    // Added fields
    maritalStatus: "Any",
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
          traveller: typeof t.traveller === "boolean" ? t.traveller : (t.traveller ?? f.traveller), // Handle legacy key
          party_lover: typeof t.party_lover === "boolean" ? t.party_lover : f.party_lover,
          music_lover: typeof t.music_lover === "boolean" ? t.music_lover : f.music_lover,
          hobbies: Array.isArray(t.hobbies) ? t.hobbies : f.hobbies,
          allergies: Array.isArray(t.allergies) ? t.allergies : f.allergies,
          professional_status: t.professionalStatus ?? t.professional_status ?? f.professional_status,
          workingshifts: t.workingshifts ?? f.workingshifts,
          havePet: typeof t.Pet_lover === "boolean" ? t.Pet_lover : f.havePet,
          workPlace: t.workPlace ?? f.workPlace,
          descriptions: t.description ?? t.descriptions ?? f.descriptions,
          // Prefill added fields:
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

  // Generic change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Toggle booleans (for icon buttons)
  const togglePref = (key) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Hobby Handlers
  const handleAddHobby = () => {
    if (!newHobby.trim()) return;
    setFormData((prev) => ({ ...prev, hobbies: [...prev.hobbies, newHobby.trim()] }));
    setNewHobby("");
  };

  const handleRemoveHobby = (index) => {
    setFormData((prev) => ({ ...prev, hobbies: prev.hobbies.filter((_, i) => i !== index) }));
  };

  // Photo Handler
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading1(true);
    setMessage({ text: "", type: "" });

    try {
      // Whitelist allowed keys
      const allowedKeys = [
        "foodPreference", "religion", "alcohol", "smoker", "nightOwl", "earlybird",
        "studious", "fitness_freak", "sporty", "traveller", "party_lover", "music_lover",
        "hobbies", "allergies", "professionalStatus", "workingshifts", "Pet_lover",
        "workPlace", "description", "maritalStatus", "family", "language", "minStayDuration",
      ];

      // Normalize formData
      const raw = { ...formData };
      
      // Map deprecated/local keys to backend keys
      if (raw.professional_status && !raw.professionalStatus) raw.professionalStatus = raw.professional_status;
      if (typeof raw.havePet !== "undefined" && typeof raw.Pet_lover === "undefined") raw.Pet_lover = raw.havePet;
      if (raw.descriptions && typeof raw.description === "undefined") raw.description = raw.descriptions;
      
      // Ensure Defaults
      raw.hobbies = Array.isArray(raw.hobbies) ? raw.hobbies : [];
      raw.allergies = Array.isArray(raw.allergies) ? raw.allergies : [];
      imagePrefs.forEach(p => { if (typeof raw[p.key] === "undefined") raw[p.key] = false; });
      
      if (typeof raw.maritalStatus === "undefined") raw.maritalStatus = "Any";
      if (typeof raw.family === "undefined") raw.family = false;
      if (typeof raw.language === "undefined") raw.language = "Any";
      if (typeof raw.minStayDuration === "undefined") raw.minStayDuration = -1;

      // Build Payload
      const payload = {};
      allowedKeys.forEach((k) => {
        if (Object.prototype.hasOwnProperty.call(raw, k)) payload[k] = raw[k];
      });

      // Send Text Data
      const res = await form2(payload);

      // Upload Photo (if exists)
      if (profilePhoto && user) {
        const fd = new FormData();
        fd.append("photo", profilePhoto);
        try { 
          await uploadPhoto(fd); 
        } catch (err) {
          // Photo failure is non-blocking but worth notifying
          setMessage({ 
            text: err.response?.data?.message || "Preferences saved, but photo upload failed.", 
            type: "error" 
          });
          setloading1(false);
          return; 
        }
      }

      if (res.status === 200 || res.status === 201) {
        setMessage({ text: "Preferences saved successfully!", type: "success" });
        // navigate("/dashboard"); // Optional: redirect or stay
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
    <div className="profile-page-wrapper">
      <h2 className="profile-heading">TENANT PROFILE</h2>
      <Alert message={message.text} type={message.type} onClose={() => setMessage({ text: "", type: "" })} />

      <form onSubmit={handleSubmit} className="profile-card">
        <div className="profile-layout-wrapper">
          
          {/* --- LEFT COLUMN --- */}
          <div className="profile-col-left">
            <label className="profile-label">Food Preference</label>
            <select className="profile-input" name="foodPreference" value={formData.foodPreference} onChange={handleChange}>
              <option value="">Select preference</option>
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
              <option value="Jain">Jain</option>
              <option value="Vegan">Vegan</option>
            </select>

            <label className="profile-label">Religion</label>
            <select className="profile-input" name="religion" value={formData.religion} onChange={handleChange}>
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

            {/* Alcohol & Smoking Toggles */}
            <div className="profile-inline-row">
              <div>
                <label className="profile-label">Alcohol</label>
                <button type="button" className={`profile-icon-toggle ${formData.alcohol ? "active" : ""}`} onClick={() => togglePref("alcohol")}>
                  <img src="/no_alcohol.png" alt="No Alcohol" />
                  <span>{formData.alcohol ? "Yes" : "No"}</span>
                </button>
              </div>
              <div>
                <label className="profile-label">Smoking</label>
                <button type="button" className={`profile-icon-toggle ${formData.smoker ? "active" : ""}`} onClick={() => togglePref("smoker")}>
                  <img src="/no_smoking.png" alt="No Smoking" />
                  <span>{formData.smoker ? "Yes" : "No"}</span>
                </button>
              </div>
            </div>

            <label className="profile-label">Professional Status</label>
            <select className="profile-input" name="professional_status" value={formData.professional_status} onChange={handleChange}>
              <option value="">Select status</option>
              <option value="student">Student</option>
              <option value="working">Working</option>
              <option value="Any">Any</option>
            </select>

            <label className="profile-label">Working Shifts</label>
            <select className="profile-input" name="workingshifts" value={formData.workingshifts} onChange={handleChange}>
              <option value="">Select shift</option>
              <option value="morning">Morning</option>
              <option value="night">Night</option>
              <option value="Any">Any</option>
            </select>

            <label className="profile-label">Marital Status</label>
            <select className="profile-input" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
              <option value="Any">Any</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
            </select>

            <label className="profile-label">Language</label>
            <input className="profile-input" type="text" name="language" value={formData.language} onChange={handleChange} placeholder="Any" />

            <label className="profile-label">Min Stay (Months)</label>
            <input className="profile-input" type="number" name="minStayDuration" value={formData.minStayDuration} onChange={handleChange} min={-1} step={1} placeholder="-1 for no minimum" />

            <label className="profile-label">Allergies (optional)</label>
            <input 
              className="profile-input" 
              type="text" 
              name="allergies" 
              value={Array.isArray(formData.allergies) ? formData.allergies.join(", ") : formData.allergies} 
              onChange={(e) => setFormData((p) => ({ ...p, allergies: e.target.value ? e.target.value.split(",").map(s => s.trim()).filter(Boolean) : [] }))} 
              placeholder="comma separated" 
            />
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="profile-col-right">
            <div className="profile-photo-section">
              <label className="profile-label">Profile Photo</label>
              <div className="profile-photo-frame">
                {photoPreview ? <img src={photoPreview} alt="Preview" className="profile-img-display" /> : <div className="profile-photo-placeholder">No Photo</div>}
              </div>
              <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="profile-file-input" />
            </div>

            <div className="profile-grid-section">
              <label className="profile-label" style={{textAlign: 'center', width: '100%'}}>Personality</label>
              <div className="profile-grid">
                {imagePrefs.map(pref => (
                  <button key={pref.key} type="button" className={`profile-grid-item ${formData[pref.key] ? "active" : ""}`} onClick={() => togglePref(pref.key)} title={pref.label}>
                    <img src={pref.img} alt={pref.label} />
                    <span>{pref.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <label className="profile-label">Work Place</label>
            <input className="profile-input" type="text" name="workPlace" value={formData.workPlace} onChange={handleChange} />

            <label className="profile-label">Hobbies</label>
            <div className="profile-hobby-area">
              <input className="profile-input" type="text" value={newHobby} onChange={(e) => setNewHobby(e.target.value)} placeholder="Enter a hobby" />
              <button type="button" className="profile-add-btn" onClick={handleAddHobby}>Add</button>
            </div>
            <ul className="profile-hobby-tags">
              {formData.hobbies.map((hobby, index) => (
                <li key={index}>
                  {hobby} <button type="button" onClick={() => handleRemoveHobby(index)} className="profile-remove-tag">x</button>
                </li>
              ))}
            </ul>
            
            <label className="profile-label">About Yourself</label>
            <textarea className="profile-input" name="descriptions" value={formData.descriptions} onChange={handleChange} placeholder="Tell us something about yourself..." />
            
            <div className="profile-checkbox-wrapper">
              <input type="checkbox" name="family" checked={formData.family} onChange={handleChange} id="famCheck" />
              <label htmlFor="famCheck" className="profile-checkbox-label">Family-friendly</label>
            </div>
          </div>
        </div>

        <button type="submit" className="profile-save-btn" disabled={loading1}>
          {loading1 ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}