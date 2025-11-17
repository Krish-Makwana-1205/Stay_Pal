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
    { key: "wanderer", label: "Wanderer", img: "/wanderer.png" },
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
    wanderer: false,
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
        console.log(userRes);
        console.log(profileRes);
        if (cancelled) return;

        const t = profileRes.data.tenant  || {};
        const u = userRes.data.user || {};
        console.log(u);
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
    <div className="profile-container">
      <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "flex-start" }}>
        <button className="back-btn" onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>
      </div>

      <div className="profile-header">
        <h2>Tenant Profile</h2>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Profile</button>
        ) : (
          <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
        )}
      </div>

      <Alert message={message.text} type={message.type} onClose={() => setMessage({ text: "", type: "" })} />

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="profile-photo-section full-width">
          <div className="photo-container">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="profile-photo" />
            ) : (
              <div className="photo-placeholder" />
            )}

            {isEditing && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/*"
                  className="photo-input"
                />
              </>
            )}
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} disabled />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" value={formData.username} disabled />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} disabled={!isEditing}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} disabled={!isEditing} />
          </div>

          <div className="form-group">
            <label>Food Preference</label>
            <select name="foodPreference" value={formData.foodPreference} onChange={handleChange} disabled={!isEditing}>
              <option value="Any">Any</option>
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
              <option value="Jain">Jain</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>

          <div className="form-group">
            <label>Religion</label>
            <select name="religion" value={formData.religion} onChange={handleChange} disabled={!isEditing}>
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

          <div className="form-group">
            <label>Hometown</label>
            <input type="text" name="hometown" value={formData.hometown || ""} onChange={handleChange} disabled={!isEditing} />
          </div>

          <div className="form-group">
            <label>Nationality</label>
            <input type="text" name="nationality" value={formData.nationality || ""} onChange={handleChange} disabled={!isEditing} />
          </div>

          <div className="form-group">
            <label>Professional Status</label>
            <select name="professional_status" value={formData.professional_status} onChange={handleChange} disabled={!isEditing}>
              <option value="Any">Any</option>
              <option value="student">Student</option>
              <option value="working">Working</option>
            </select>
          </div>

          <div className="form-group">
            <label>Working Shifts</label>
            <select name="workingshifts" value={formData.workingshifts} onChange={handleChange} disabled={!isEditing}>
              <option value="Any">Any</option>
              <option value="morning">Morning</option>
              <option value="night">Night</option>
            </select>
          </div>

          <div className="form-group">
            <label>Work Place</label>
            <input type="text" name="workPlace" value={formData.workPlace} onChange={handleChange} disabled={!isEditing} />
          </div>

          <div className="form-group">
            <label>Marital Status</label>
            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} disabled={!isEditing}>
              <option value="Any">Any</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
            </select>
          </div>

          <div className="form-group">
            <label>Language</label>
            <input type="text" name="language" value={formData.language} onChange={handleChange} disabled={!isEditing} />
          </div>

          <div className="form-group">
            <label>Minimum Stay Duration (months)</label>
            <input type="number" name="minStayDuration" value={formData.minStayDuration} onChange={handleChange} disabled={!isEditing} min="0" />
          </div>
        </div>

        <label>Alcohol Preference</label>
        <div className="small-pref-row">
          <button type="button" className={`pref-icon small ${formData.alcohol ? "active" : ""}`} onClick={() => isEditing && togglePref("alcohol")}>
            <img src="/no_alcohol.png" alt="No Alcohol" />
            <span>{formData.alcohol ? "Allows Alcohol" : "No Alcohol"}</span>
          </button>
        </div>

        <label>Smoking Preference</label>
        <div className="small-pref-row">
          <button type="button" className={`pref-icon small ${formData.smoker ? "active" : ""}`} onClick={() => isEditing && togglePref("smoker")}>
            <img src="/no_smoking.png" alt="No Smoking" />
            <span>{formData.smoker ? "Smoker" : "No Smoking"}</span>
          </button>
        </div>

        <label>Quick Preferences</label>
        <div className="pref-icons">
          {imagePrefs.map((pref) => (
            <button key={pref.key} type="button" className={`pref-icon ${formData[pref.key] ? "active" : ""}`} onClick={() => isEditing && togglePref(pref.key)}>
              <img src={pref.img} alt={pref.label} />
              <span>{pref.label}</span>
            </button>
          ))}
        </div>

        <div className="form-group full-width">
          <label>Hobbies</label>
          {isEditing && (
            <div className="hobby-input-row">
              <input value={newHobby} onChange={(e) => setNewHobby(e.target.value)} placeholder="Add hobby" />
              <button type="button" onClick={handleAddHobby} className="hobby-add-btn">Add</button>
            </div>
          )}
          <div className="hobby-list">
            {formData.hobbies.map((h, i) => (
              <div key={i} className="hobby-item">
                {h}
                {isEditing && <button type="button" className="hobby-remove-btn" onClick={() => handleRemoveHobby(i)}>×</button>}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group full-width">
          <label>About Yourself</label>
          <textarea name="description" value={formData.description} onChange={handleChange} disabled={!isEditing} rows="4" />
        </div>

        {isEditing && (
          <button type="submit" className="submit-btn" disabled={loadingSubmit}>
            {loadingSubmit ? "Saving..." : "Save Changes"}
          </button>
        )}
      </form>
    </div>
  );
}
