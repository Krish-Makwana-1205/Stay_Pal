import React, { useState, useRef, useEffect } from "react";
import { uploadProperty } from "../api/propertyform";
import "../StyleSheets/PropertyForm.css";
import Alert from "../Components/Alert";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
    locality: "",
    houseType: "",
    furnishingType: "Any",
    areaSize: "",
    address: "",
    addressLink: "",
    nearbyPlaces: [],
    transportAvailability: false,
    parkingArea: false,
    isRoommate: false,
  });
  const [rentError, setRentError] = useState("");
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [imageLimitMessage, setImageLimitMessage] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNearbyPlaceChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updated = checked
        ? [...prev.nearbyPlaces, value]
        : prev.nearbyPlaces.filter((p) => p !== value);
      return { ...prev, nearbyPlaces: updated };
    });
  };

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

  const handleClearImages = (e) => {
    e.preventDefault();
    setImages([]);
    setImageLimitMessage("");
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //checking if rent lower bound is less than rent upper bound
    if (Number(formData.rentLowerBound) >= Number(formData.rentUpperBound)) {
      setMessage({ text: "Rent lower bound must be less than rent upper bound", type: "error" });
      return;
    } else {
      setRentError("");
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((v) => data.append(key, v));
      } else {
        data.append(key, formData[key]);
      }
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
          locality: "",
          houseType: "",
          furnishingType: "Any",
          areaSize: "",
          address: "",
          addressLink: "",
          nearbyPlaces: [],
          transportAvailability: false,
          parkingArea: false,
          isRoommate: false,
        });
        setImages([]);
        if (fileInputRef.current) fileInputRef.current.value = null;
        navigate("/PropertyForm2");
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

  return (<div className="property-form-container"> <h2 className="form-title">Upload Property</h2> <form onSubmit={handleSubmit} className="property-form" encType="multipart/form-data">


    {/* Basic Fields */}
    <label>Property name *</label>
    <input type="text" name="name" value={formData.name} onChange={handleChange} required />

    <label>Description *</label>
    <textarea name="description" value={formData.description} onChange={handleChange} required />

    <label>BHK *</label>
    <input type="number" name="BHK" value={formData.BHK} onChange={handleChange} required />

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

    {rentError && <p className="error-text">{rentError}</p>}

    <label>Nation *</label>
    <input type="text" name="nation" value={formData.nation} onChange={handleChange} required />

    <label>City *</label>
    <input type="text" name="city" value={formData.city} onChange={handleChange} required />

    <label>Pincode *</label>
    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required />

    {/* New Fields */}
    <label>Locality *</label>
    <input type="text" name="locality" value={formData.locality} onChange={handleChange} required />

    <label>House Type *</label>
    <select name="houseType" value={formData.houseType} onChange={handleChange} required>
      <option value="">Select</option>
      <option value="Apartment">Apartment</option>
      <option value="Tenament">Tenament</option>
      <option value="Bungalow">Bungalow</option>
      <option value="Studio">Studio</option>
      <option value="Condo">Condo</option>
      <option value="Other">Other</option>
    </select>

    <label>Furnishing Type</label>
    <select name="furnishingType" value={formData.furnishingType} onChange={handleChange}>
      <option value="Fully Furnished">Fully Furnished</option>
      <option value="Semi Furnished">Semi Furnished</option>
      <option value="Unfurnished">Unfurnished</option>
      <option value="Any">Any</option>
    </select>

    <label>Area Size (sq ft)</label>
    <input type="number" name="areaSize" value={formData.areaSize} onChange={handleChange} />

    <label>Address</label>
    <input type="text" name="address" value={formData.address} onChange={handleChange} />

    <label>Address Link</label>
    <input type="text" name="addressLink" value={formData.addressLink} onChange={handleChange} />

    <fieldset className="nearby-fieldset">
      <legend>Nearby Places</legend>
      {["Market", "Bus Stop", "School", "Hospital", "Metro"].map((place) => (
        <label key={place} className="checkbox-inline">
          <input
            type="checkbox"
            value={place}
            checked={formData.nearbyPlaces.includes(place)}
            onChange={handleNearbyPlaceChange}
          />
          {place}
        </label>
      ))}
    </fieldset>

    <label className="checkbox-inline">
      <input type="checkbox" name="transportAvailability" checked={formData.transportAvailability} onChange={handleChange} />
      Transport Availability
    </label>

    <label className="checkbox-inline">
      <input type="checkbox" name="parkingArea" checked={formData.parkingArea} onChange={handleChange} />
      Parking Area
    </label>

    <label className="checkbox-inline">
      <input type="checkbox" name="isRoommate" checked={formData.isRoommate} onChange={handleChange} />
      Is Roommate Property
    </label>

    {/* Image Upload */}
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

    {imageLimitMessage && <p style={{ color: "red", fontSize: "0.9rem" }}>{imageLimitMessage}</p>}

    <div style={{ marginTop: 8, marginBottom: 12 }}>
      <button type="button" onClick={handleClearImages} disabled={images.length === 0} className="clear-images-btn">
        Clear Selected Images
      </button>
      <span style={{ marginLeft: 12 }}>
        {images.length > 0 ? `${images.length} image(s) selected` : "No images selected"}
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
