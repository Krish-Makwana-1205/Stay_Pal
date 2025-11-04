import React, { useEffect, useState } from "react";
import "../StyleSheets/TenantForm.css"; 
import { form2 } from "../api/tenantform"; 
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
  const navigate=useNavigate();
  const {user} = useAuth();
  useEffect(() => {
  if (!user) {   
      navigate("/login");    
  }
}, [user, navigate]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [newHobby,setNewHobby]=useState({});
  // Handle checkbox and text/selection updates
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Add hobby to array
  const handleAddHobby = () => {
    if (newHobby.trim() !== "") {
      setFormData({
        ...formData,
        hobbies: [...formData.hobbies, newHobby.trim()],
      });
      setNewHobby("");
    }
  };

  // Remove hobby
  const handleRemoveHobby = (index) => {
    setFormData({
      ...formData,
      hobbies: formData.hobbies.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    navigate("/dashboard");
    try {
      const res = await form2(formData);
      if (res.status === 200) {
        setMessage({ text: "Preferences saved successfully!", type: "success" });
      }
    } catch (error) {
      console.error("Error submitting preferences:", error);
      if (error.response) {
        setMessage({ text: error.response.data.message || "Server error.", type: "error" });
      } else {
        setMessage({ text: "Network error.", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tenant-form-container">
      <h2 className="form-title">Tenant Preferences</h2>
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

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Preferences"}
        </button>
      </form>

      {message && <Alert message={message.text} type={message.type} onClose={() => setMessage({ text: "", type: "" })} />}
    </div>
  );
}
