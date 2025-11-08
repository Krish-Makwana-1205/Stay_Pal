import React, { useEffect, useState, useRef } from "react";
import "../StyleSheets/TenantForm.css";
import { form2, getProfile, uploadPhoto } from "../api/tenantform";
import Alert from "../Components/Alert";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) navigate("/login");
    // prefill preferences + photo if exists
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
          hobbies: Array.isArray(t.hobbies) ? t.hobbies : f.hobbies,
          professional_status: t.professional_status ?? f.professional_status,
          workingshifts: t.workingshifts ?? f.workingshifts,
          havePet: typeof t.havePet === "boolean" ? t.havePet : f.havePet,
          workPlace: t.workPlace ?? f.workPlace,
          descriptions: t.descriptions ?? f.descriptions,
        }));
        if (t.profilePhoto) setPhotoPreview(t.profilePhoto);
      } catch (err) {
        // ignore
      }
    };
    if (user) load();
    return () => { mounted = false; };
  }, [user, loading, navigate]);

  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading1, setloading1] = useState(false);
  const [newHobby, setNewHobby] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddHobby = () => {
    if (!newHobby.trim()) return;
    setFormData({ ...formData, hobbies: [...formData.hobbies, newHobby.trim()] });
    setNewHobby("");
  };

  const handleRemoveHobby = (index) => {
    setFormData({ ...formData, hobbies: formData.hobbies.filter((_, i) => i !== index) });
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
      const res = await form2(formData);

      // upload photo if selected
      if (profilePhoto && user) {
        const fd = new FormData();
        fd.append("photo", profilePhoto);
        fd.append("email", user.email);
        fd.append("username", user.username || user.name || "");
        try {
          await uploadPhoto(fd);
        } catch (err) {
          // show upload error but allow preferences to be saved
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
        <select
          name="foodPreference"
          value={formData.foodPreference}
          onChange={handleChange}
        >
          <option value="">Select preference</option>
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
          <option value="Jain">Jain</option>
          <option value="Vegan">Vegan</option>
        </select>

        {/* Religion */}
        <label>Religion</label>
        <input
          type="text"
          name="religion"
          value={formData.religion}
          onChange={handleChange}
        />

        {/* Alcohol */}
        <label>
          <input
            type="checkbox"
            name="alcohol"
            checked={formData.alcohol}
            onChange={handleChange}
          />
          Consumes Alcohol
        </label>

        {/* Smoker */}
        <label>
          <input
            type="checkbox"
            name="smoker"
            checked={formData.smoker}
            onChange={handleChange}
          />
          Smoker
        </label>

        {/* Night Owl */}
        <label>
          <input
            type="checkbox"
            name="nightOwl"
            checked={formData.nightOwl}
            onChange={handleChange}
          />
          Night Owl
        </label>

        {/* Professional Status */}
        <label>Professional Status</label>
        <select
          name="professional_status"
          value={formData.professional_status}
          onChange={handleChange}
        >
          <option value="">Select status</option>
          <option value="student">Student</option>
          <option value="working">Working</option>
        </select>

        {/* Working Shifts */}
        <label>Working Shifts</label>
        <select
          name="workingshifts"
          value={formData.workingshifts}
          onChange={handleChange}
        >
          <option value="">Select shift</option>
          <option value="morning">Morning</option>
          <option value="night">Night</option>
        </select>

        {/* Have Pet */}
        <label>
          <input
            type="checkbox"
            name="havePet"
            checked={formData.havePet}
            onChange={handleChange}
          />
          Have a Pet
        </label>

        {/* Work Place */}
        <label>Work Place</label>
        <input
          type="text"
          name="workPlace"
          value={formData.workPlace}
          onChange={handleChange}
        />

        {/* Hobbies */}
        <label>Hobbies</label>
        <div className="hobby-section">
          <input
            type="text"
            value={newHobby}
            onChange={(e) => setNewHobby(e.target.value)}
            placeholder="Enter a hobby"
          />
          <button type="button" onClick={handleAddHobby}>
            Add Hobby
          </button>
        </div>
        <ul className="hobby-list">
          {formData.hobbies.map((hobby, index) => (
            <li key={index}>
              {hobby}{" "}
              <button
                type="button"
                onClick={() => handleRemoveHobby(index)}
                className="remove-btn"
              >
                x
              </button>
            </li>
          ))}
        </ul>

        {/* Description */}
        <label>About Yourself</label>
        <textarea
          name="descriptions"
          value={formData.descriptions}
          onChange={handleChange}
          placeholder="Tell us something about yourself..."
        />

        {/* Add this before the submit button */}
        <div className="photo-upload-section">
          <label>Profile Photo</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            accept="image/*"
            className="photo-input"
          />
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
