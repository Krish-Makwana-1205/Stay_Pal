import React, { useEffect, useState } from "react";
import "../StyleSheets/TenantProfle.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Alert from "../Components/Alert";
import { getProfile, updateProfile } from "../api/tenantform";

export default function TenantProfile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    gender: "",
    dob: "",
    foodPreference: "Any",
    religion: "Any",
    alcohol: false,
    smoker: false,
    hometown: "",
    nationality: "",
    nightOwl: false,
    hobbies: [],
    professional_status: "Any",
    workingshifts: "Any",
    havePet: false,
    workPlace: "Any",
    descriptions: "",
    maritalStatus: "Any",
    family: false,
    language: "Any",
    minStayDuration: 0
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [newHobby, setNewHobby] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    let mounted = true;
    const loadProfile = async () => {
      try {
        const res = await getProfile();
        const tenant = res.data?.tenant || res.data?.data || res.data;
        if (!tenant) return;
        if (!mounted) return;

        setFormData({
          email: tenant.email || user.email || "",
          username: tenant.username || user.username || "",
          gender: tenant.gender || "",
          dob: tenant.dob ? tenant.dob.split("T")[0] : "",
          foodPreference: tenant.foodPreference || "Any",
          religion: tenant.religion || "Any",
          alcohol: Boolean(tenant.alcohol),
          smoker: Boolean(tenant.smoker),
          hometown: tenant.hometown || "",
          nationality: tenant.nationality || "",
          nightOwl: Boolean(tenant.nightOwl),
          hobbies: Array.isArray(tenant.hobbies) ? tenant.hobbies : [],
          professional_status: tenant.professional_status || "Any",
          workingshifts: tenant.workingshifts || "Any",
          havePet: Boolean(tenant.havePet),
          workPlace: tenant.workPlace || "Any",
          descriptions: tenant.descriptions || "",
          maritalStatus: tenant.maritalStatus || "Any",
          family: Boolean(tenant.family),
          language: tenant.language || "Any",
          minStayDuration: tenant.minStayDuration ?? 0,
        });
      } catch (err) {
        console.debug("loadProfile error:", err?.message || err);
      }
    };

    loadProfile();
    return () => { mounted = false; };
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let v = type === "checkbox" ? checked : value;
    if (name === "minStayDuration") v = value === "" ? "" : Number(value);
    setFormData(prev => ({ ...prev, [name]: v }));
  };

  const handleAddHobby = () => {
    if (!newHobby.trim()) return;
    setFormData(prev => ({ ...prev, hobbies: [...prev.hobbies, newHobby.trim()] }));
    setNewHobby("");
  };

  const handleRemoveHobby = (idx) => {
    setFormData(prev => ({ ...prev, hobbies: prev.hobbies.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setMessage({ text: "", type: "" });

    try {
      const payload = { ...formData };
      if (!payload.dob) delete payload.dob;
      const res = await updateProfile(payload);
      if (res.status === 200 || res.status === 201) {
        setMessage({ text: "Profile saved successfully.", type: "success" });
        setIsEditing(false);
      } else {
        setMessage({ text: res.data?.message || "Unexpected server response.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Save failed.", type: "error" });
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button onClick={() => navigate("/dashboard")} className="back-btn">← Dashboard</button>
        <h2>Tenant Profile</h2>
        <div className="header-actions">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Profile</button>
          ) : (
            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          )}
        </div>
      </div>

      <Alert message={message.text} type={message.type} onClose={() => setMessage({ text: "", type: "" })} />

      <form onSubmit={handleSubmit} className="profile-form">
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
              <option value="Buddhism">Buddhism</option>
              <option value="Jainism">Jainism</option>
              <option value="Taoism">Taoism</option>
              <option value="Zoroastrianism">Zoroastrianism</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Hometown</label>
            <input type="text" name="hometown" value={formData.hometown} onChange={handleChange} disabled={!isEditing} />
          </div>

          <div className="form-group">
            <label>Nationality</label>
            <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} disabled={!isEditing} />
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

        <div className="checkbox-section">
          <label><input type="checkbox" name="alcohol" checked={formData.alcohol} onChange={handleChange} disabled={!isEditing} /> Consumes Alcohol</label>
          <label><input type="checkbox" name="smoker" checked={formData.smoker} onChange={handleChange} disabled={!isEditing} /> Smoker</label>
          <label><input type="checkbox" name="nightOwl" checked={formData.nightOwl} onChange={handleChange} disabled={!isEditing} /> Night Owl</label>
          <label><input type="checkbox" name="havePet" checked={formData.havePet} onChange={handleChange} disabled={!isEditing} /> Have Pet</label>
          <label><input type="checkbox" name="family" checked={formData.family} onChange={handleChange} disabled={!isEditing} /> Family</label>
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
                {isEditing && (
                  <button type="button" className="hobby-remove-btn" onClick={() => handleRemoveHobby(i)}>×</button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group full-width">
          <label>Description</label>
          <textarea name="descriptions" value={formData.descriptions} onChange={handleChange} disabled={!isEditing} rows="4" />
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
