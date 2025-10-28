import React, { useState } from "react";
import "../StyleSheets/TenantForm.css";
import { form1 } from "../api/tenantform";
import { useNavigate } from "react-router-dom";


export default function TenantForm() {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    nationality: "",
    hometown: "",
    gender: "",
    dob: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
    const res=await form1(formData);

      if (res.status === 200) {
        setMessage("Profile created successfully!");
        navigate("/tenantForm2");     
       }
    } catch (error) {
      console.error("Error submitting tenant form:", error);
      if (error.response) {
        setMessage(error.response.data.message || "Server error.");
      } else {
        setMessage("Network error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tenant-form-container">
      <h2 className="form-title">Tenant Profile</h2>
      <form onSubmit={handleSubmit} className="tenant-form">
        <label>
          Nationality <span className="required">*</span>
        </label>
        <input
          type="text"
          name="nationality"
          value={formData.nationality}
          onChange={handleChange}
          required
        />

        <label>
          Hometown <span className="required">*</span>
        </label>
        <input
          type="text"
          name="hometown"
          value={formData.hometown}
          onChange={handleChange}
          required
        />

        <label>
          Gender <span className="required">*</span>
        </label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label>
          Date of Birth <span className="required">*</span>
        </label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Save Profile"}
        </button>
      </form>

      {message && <p className="response-message">{message}</p>}
    </div>
  );
}
