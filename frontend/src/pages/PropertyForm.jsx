import React, { useState, useRef } from "react";
import { uploadProperty } from "../api/propertyform";
import "../StyleSheets/PropertyForm.css";
import Alert from "../Components/Alert";

export default function PropertyForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    BHK: "",
    rentLowerBound: "",
    rentUpperBound: "",
    nation: "",
    pincode: "",
    city: "",
  });
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [imageLimitMessage, setImageLimitMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle image input (multiple)
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalFiles = images.length + selectedFiles.length;

    if (totalFiles > 10) {
      setImageLimitMessage("You can upload a maximum of 10 images only.");
      const allowedFiles = selectedFiles.slice(0, 10 - images.length);
      setImages((prev) => [...prev, ...allowedFiles]);
      return;
    }

    setImages((prev) => [...prev, ...selectedFiles]);
    setImageLimitMessage("");
  };

  // remove all selected images (clears state and file input)
  const handleClearImages = (e) => {
    e.preventDefault();
    setImages([]);
    setImageLimitMessage("");
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    images.forEach((img) => data.append("images", img));

    try {
      const res = await uploadProperty(data);
      if (res.status === 200) {
        setMessage({ text: res.data.message || "Property uploaded successfully!", type: "success" });
        setFormData({
          name: "",
          email: "",
          description: "",
          BHK: "",
          rentLowerBound: "",
          rentUpperBound: "",
          nation: "",
          pincode: "",
          city: "",
        });
        setImages([]);
        if (fileInputRef.current) fileInputRef.current.value = null;
      }
    } catch (error) {
      console.error("Error uploading property:", error);
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
    <div className="property-form-container">
      <h2 className="form-title">Upload Property</h2>
      <form
        onSubmit={handleSubmit}
        className="property-form"
        encType="multipart/form-data"
      >
        <label>Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label>BHK *</label>
        <input
          type="number"
          name="BHK"
          value={formData.BHK}
          onChange={handleChange}
          required
        />

        <label>Rent Lower Bound *</label>
        <input
          type="number"
          name="rentLowerBound"
          value={formData.rentLowerBound}
          onChange={handleChange}
          required
        />

        <label>Rent Upper Bound *</label>
        <input
          type="number"
          name="rentUpperBound"
          value={formData.rentUpperBound}
          onChange={handleChange}
          required
        />

        <label>Nation *</label>
        <input
          type="text"
          name="nation"
          value={formData.nation}
          onChange={handleChange}
          required
        />

        <label>City *</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />

        <label>Pincode *</label>
        <input
          type="text"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          required
        />

        <label>Property Images *</label>
        <input
          ref={fileInputRef}
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          required
        />

        {imageLimitMessage && (
          <p style={{ color: "red", fontSize: "0.9rem", marginTop: "4px" }}>
            {imageLimitMessage}
          </p>
        )}

        <div style={{ marginTop: 8, marginBottom: 12 }}>
          <button
            type="button"
            onClick={handleClearImages}
            disabled={images.length === 0}
            className="clear-images-btn"
          >
            Clear Selected Images
          </button>
          <span style={{ marginLeft: 12 }}>
            {images.length > 0
              ? `${images.length} image(s) selected`
              : "No images selected"}
          </span>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Uploading..." : "Upload Property"}
        </button>
      </form>

      <Alert message={message.text} type={message.type} onClose={() => setMessage({ text: "", type: "" })} />
    </div>
  );
}
