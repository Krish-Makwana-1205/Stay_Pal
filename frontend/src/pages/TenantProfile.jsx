import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "../Components/Alert";
import { getProfile, updateProfile, uploadPhoto } from "../api/tenantform";
import { fetchUser } from "../api/authApi";

import "../StyleSheets/TenantProfile.css"; 

export default function TenantProfile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    gender: "",
    dob: "",
    foodPreference: "Any",
    religion: "Any",
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
    professional_status: "Any",
    workingshifts: "Any",
    Pet_lover: false,
    workPlace: "Any",
    description: "",
    maritalStatus: "Any",
    language: "Any",
    minStayDuration: 0,
    hometown: "",
    nationality: "",
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [newHobby, setNewHobby] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    let cancelled = false;

    const loadBoth = async () => {
      try {
        const profilePromise = getProfile();
        const userPromise = fetchUser();

        const [profileRes, userRes] = await Promise.all([profilePromise, userPromise]);

        if (cancelled) return;

        const t = profileRes.data.tenant  || {};
        const u = userRes.data.user || {};
        
        setFormData((prev) => ({
          ...prev,
          ...t,
          email: u.email ?? prev.email ?? t.email,
          username: u.username ?? prev.username ?? t.username,
          dob: t.dob ? String(t.dob).split("T")[0] : prev.dob,
          professional_status: t.professionalStatus ?? t.professional_status ?? prev.professional_status ?? "Any",
          description: t.description ?? t.descriptions ?? prev.description ?? "",
          Pet_lover: t.Pet_lover ?? prev.Pet_lover ?? false,
          hometown: t.hometown ?? prev.hometown ?? "",
          nationality: t.nationality ?? prev.nationality ?? "",
        }));

        if(u.profilePhoto) setPhotoPreview(u.profilePhoto);
      } catch (err) {
        console.error("Error loading profile/user:", err);
      }
    };

    loadBoth();

    return () => {
      cancelled = true;
    };
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const togglePref = (key) => {
    setFormData((p) => ({ ...p, [key]: !p[key] }));
  };

  const handleAddHobby = () => {
    if (!newHobby.trim()) return;
    setFormData((p) => ({ ...p, hobbies: [...p.hobbies, newHobby.trim()] }));
    setNewHobby("");
  };

  const handleRemoveHobby = (i) => {
    setFormData((p) => ({ ...p, hobbies: p.hobbies.filter((_, idx) => idx !== i) }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      const uploadPromise = selectedPhotoFile
        ? (() => {
            const fd = new FormData();
            fd.append("photo", selectedPhotoFile);
            return uploadPhoto(fd);
          })()
        : Promise.resolve();

      const payload = { ...formData };
      delete payload.email;
      delete payload.username;

      const updatePromise = updateProfile(payload);

      const [photoRes, updateRes] = await Promise.all([uploadPromise, updatePromise]);

      if (updateRes && (updateRes.status === 200 || updateRes.status === 201)) {
        setMessage({ text: "Profile updated successfully!", type: "success" });
        setIsEditing(false);
        setSelectedPhotoFile(null);
        if (photoRes && (photoRes.data?.profilePhoto || photoRes.data?.url)) {
          setPhotoPreview(photoRes.data.profilePhoto || photoRes.data.url);
        }
      } else {
        setMessage({ text: "Unexpected server response.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Error saving profile", type: "error" });
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="bp-page-container">
      {/* Main Card Wrapper */}
      <div className="bp-card">
        
        {/* Top Actions */}
        <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "flex-start" }}>
          <button className="bp-secondary-btn" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
        </div>

        <div className="bp-header">
          <h2>Tenant Profile</h2>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="bp-secondary-btn">
              Edit Profile
            </button>
          ) : (
            <button onClick={() => setIsEditing(false)} className="bp-secondary-btn">
              Cancel
            </button>
          )}
        </div>

        <Alert message={message.text} type={message.type} onClose={() => setMessage({ text: "", type: "" })} />

        <form onSubmit={handleSubmit} className="bp-form-layout">
          
          {/* Photo Section */}
          <div className="bp-photo-section">
            <div className="bp-photo-frame">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="bp-photo-img" />
              ) : (
                <div className="bp-photo-placeholder">NO PHOTO</div>
              )}

              {isEditing && (
                <>
                  <div className="bp-photo-overlay">
                     <span>Change</span>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                    accept="image/*"
                    className="bp-photo-input"
                  />
                </>
              )}
            </div>
          </div>

          {/* Main Form Grid */}
          <div className="bp-form-grid">
            <div className="bp-form-group">
              <label className="bp-label">Email</label>
              <input className="bp-input-field" type="email" name="email" value={formData.email} disabled />
            </div>

            <div className="bp-form-group">
              <label className="bp-label">Username</label>
              <input className="bp-input-field" type="text" name="username" value={formData.username} disabled />
            </div>

            <div className="bp-form-group">
              <label className="bp-label">Gender</label>
              <select className="bp-input-field" name="gender" value={formData.gender} onChange={handleChange} disabled={!isEditing}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="bp-form-group">
              <label className="bp-label">Date of Birth</label>
              <input className="bp-input-field" type="date" name="dob" value={formData.dob} onChange={handleChange} disabled={!isEditing} />
            </div>

            <div className="bp-form-group">
              <label className="bp-label">Food Preference</label>
              <select className="bp-input-field" name="foodPreference" value={formData.foodPreference} onChange={handleChange} disabled={!isEditing}>
                <option value="Any">Any</option>
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
                <option value="Jain">Jain</option>
                <option value="Vegan">Vegan</option>
              </select>
            </div>

            <div className="bp-form-group">
              <label className="bp-label">Religion</label>
              <select className="bp-input-field" name="religion" value={formData.religion} onChange={handleChange} disabled={!isEditing}>
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
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="bp-form-group">
              <label className="bp-label">Hometown</label>
              <input className="bp-input-field" type="text" name="hometown" value={formData.hometown || ""} onChange={handleChange} disabled={!isEditing} />
            </div>

            <div className="bp-form-group">
              <label className="bp-label">Nationality</label>
              <input className="bp-input-field" type="text" name="nationality" value={formData.nationality || ""} onChange={handleChange} disabled={!isEditing} />
            </div>

            <div className="bp-form-group">
              <label className="bp-label">Professional Status</label>
              <select className="bp-input-field" name="professional_status" value={formData.professional_status} onChange={handleChange} disabled={!isEditing}>
                <option value="Any">Any</option>
                <option value="student">Student</option>
                <option value="working">Working</option>
              </select>
            </div>

            <div className="bp-form-group">
              <label className="bp-label">Working Shifts</label>
              <select className="bp-input-field" name="workingshifts" value={formData.workingshifts} onChange={handleChange} disabled={!isEditing}>
                <option value="Any">Any</option>
                <option value="morning">Morning</option>
                <option value="night">Night</option>
              </select>
            </div>

            <div className="bp-form-group">
              <label className="bp-label">Work Place</label>
              <input className="bp-input-field" type="text" name="workPlace" value={formData.workPlace} onChange={handleChange} disabled={!isEditing} />
            </div>

            <div className="bp-form-group">
              <label className="bp-label">Marital Status</label>
              <select className="bp-input-field" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} disabled={!isEditing}>
                <option value="Any">Any</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
            </div>

            <div className="bp-form-group">
              <label className="bp-label">Language</label>
              <input className="bp-input-field" type="text" name="language" value={formData.language} onChange={handleChange} disabled={!isEditing} />
            </div>

            <div className="bp-form-group">
              <label className="bp-label">Min Stay (Months)</label>
              <input className="bp-input-field" type="number" name="minStayDuration" value={formData.minStayDuration} onChange={handleChange} disabled={!isEditing} min="0" />
            </div>
          </div>

          <hr style={{ borderColor: 'var(--bp-grid-line)', margin: '20px 0' }} />

          {/* Binary Preferences (Alcohol/Smoking) */}
          <div className="bp-form-group">
            <label className="bp-label">Habits</label>
            <div className="bp-pref-row">
              <button type="button" className={`bp-pref-card ${formData.alcohol ? "active" : ""}`} onClick={() => isEditing && togglePref("alcohol")}>
                <img src="/no_alcohol.png" alt="No Alcohol" />
                <span style={{ fontSize: '0.7rem' }}>{formData.alcohol ? "Allows Alcohol" : "No Alcohol"}</span>
              </button>
          
              <button type="button" className={`bp-pref-card ${formData.smoker ? "active" : ""}`} onClick={() => isEditing && togglePref("smoker")}>
                <img src="/no_smoking.png" alt="No Smoking" />
                <span style={{ fontSize: '0.7rem' }}>{formData.smoker ? "Smoker" : "No Smoking"}</span>
              </button>
            </div>
          </div>

          {/* Lifestyle Preferences */}
          <div className="bp-form-group">
            <label className="bp-label">Quick Preferences</label>
            <div className="bp-pref-row">
              {imagePrefs.map((pref) => (
                <button key={pref.key} type="button" className={`bp-pref-card ${formData[pref.key] ? "active" : ""}`} onClick={() => isEditing && togglePref(pref.key)}>
                  <img src={pref.img} alt={pref.label} />
                  <span style={{ fontSize: '0.7rem' }}>{pref.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hobbies */}
          <div className="bp-form-group">
            <label className="bp-label">Hobbies</label>
            {isEditing && (
              <div className="bp-hobby-row">
                <input 
                  className="bp-input-field" 
                  style={{ width: 'auto', flex: 1 }}
                  value={newHobby} 
                  onChange={(e) => setNewHobby(e.target.value)} 
                  placeholder="Add hobby..." 
                />
                <button type="button" onClick={handleAddHobby} className="bp-secondary-btn">Add</button>
              </div>
            )}
            <div className="bp-hobby-list">
              {formData.hobbies.map((h, i) => (
                <div key={i} className="bp-hobby-tag">
                  {h}
                  {isEditing && (
                    <span 
                      style={{ cursor: 'pointer', color: 'red', fontWeight: 'bold', marginLeft: '5px' }} 
                      onClick={() => handleRemoveHobby(i)}
                    >
                      ×
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bp-form-group">
            <label className="bp-label">About Yourself</label>
            <textarea 
              className="bp-input-field"
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              disabled={!isEditing} 
              rows="4"
              style={{ border: '1px solid #ddd', padding: '10px' }} 
            />
          </div>

          {isEditing && (
            <button type="submit" className="bp-submit-btn" disabled={loadingSubmit}>
              {loadingSubmit ? "Saving..." : "Save Changes"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}