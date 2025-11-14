import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { uploadProperty } from "../api/propertyform";
import "../StyleSheets/PropertyForm.css";
import Alert from "../Components/Alert";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Country, City } from "country-state-city";
import NumberInput from "../Components/NumberInput";
import LocalitySelector from "../Components/LocalitySelector";

export default function PropertyForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    BHK: "",
    rent: "",
    nation: "India",
    pincode: "",
    city: "",
    locality: "",
    houseType: "",
    furnishingType: "Any",
    areaSize: "",
    houseNumber: "",
    street: "",
    areaOrLandmark: "",
    address: "",
    addressLink: "",
    nearbyPlaces: [],
    parkingArea: "None",
    transportAvailability: false,
    isRoommate: false,
  });

  const [images, setImages] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [imageLimitMessage, setImageLimitMessage] = useState("");
  const fileInputRef = useRef(null);
  const [linkError, setLinkError] = useState("");

   const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
 // Load saved form data (if any)
useEffect(() => {
  const savedForm = localStorage.getItem("propertyFormData");
  if (savedForm) {
    setFormData(JSON.parse(savedForm));
  }
}, []);
// Save form data automatically on every change
useEffect(() => {
  localStorage.setItem("propertyFormData", JSON.stringify(formData));
}, [formData]);


  useEffect(() => {
    if (!authLoading) {
      if (!user) navigate("/login");
    }
  }, [authLoading, user, navigate]);
  if (authLoading) return <p>Loading...</p>;
  if (!user) return null;
  // ---------- HANDLERS ----------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCityChange = (selected) => {
    setFormData({ ...formData, city: selected ? selected.value : "" });
  };

  const handleNearbyPlacesChange = (selectedOptions) => {
    setFormData({
      ...formData,
      nearbyPlaces: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
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

    if (!formData.rent || Number(formData.rent) <= 0) {
      setMessage({ text: "Please enter a valid rent amount.", type: "error" });
      return;
    }
    if(linkError){
      setMessage({ text: "Enter Valid Link", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });
formData.address = `${formData.houseNumber || ""}$*${formData.street || ""}$*${formData.areaOrLandmark || ""}`;
console.log("Address:", formData.address);
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
    // 🧹 Clear saved draft data
    localStorage.removeItem("propertyFormData");

    // ✅ Success message
    setMessage({
      text: res.data.message || "Property uploaded successfully!",
      type: "success",
    });

    // ⭐ Save property name for PF2 auto-fill

    setFormData({
      name: "",
      email: "",
      description: "",
      BHK: "",
      rent: "",
      nation: "India",
      pincode: "",
      city: "",
      locality: "",
      houseType: "",
      furnishingType: "Any",
      areaSize: "",
      address: "",
      addressLink: "",
      nearbyPlaces: [],
      parkingArea: "None",
      transportAvailability: false,
      isRoommate: false,
      houseNumber: "",
      street: "",
      areaOrLandmark: "",
    });

    // 🖼️ Reset images
    setImages([]);
    if (fileInputRef.current) fileInputRef.current.value = null;

    // 🔄 Navigate to next step
    // IMPORTANT: force LocalitySelector to fetch localities for this city on edit page
localStorage.removeItem(`localities_${formData.city}`);
localStorage.setItem("propertyForm_lastName", formData.name);

    navigate("/PropertyForm2");
  }
} catch (error) {
  console.error("Error uploading property:", error);

  if (error.response) {
    const backendMessage =
      error.response.data?.message ||
      error.response.data?.msg ||
      JSON.stringify(error.response.data);

    console.log(" Backend full error:", backendMessage);

    // 🚨 Handle MongoDB duplicate key error (E11000)
    if (/E11000.*duplicate key error/i.test(backendMessage)) {
      setMessage({
        text: "A property with this name already exists. Please choose a unique name.",
        type: "error",
      });
    } else if (backendMessage.includes("ValidationError")) {
      setMessage({
        text: "Please fill all required fields correctly.",
        type: "error",
      });
    } else {
      setMessage({
        text: backendMessage || "Server error.",
        type: "error",
      });
    }
  } else {
    // 🌐 Network issue or request not reaching backend
    setMessage({ text: "Network error. Please check your connection.", type: "error" });
  }
} finally {
  // ⏳ Stop loader in all cases
  setLoading(false);
}
  };

  // ---------- OPTIONS ----------
  const nearbyOptions = [
    { value: "Market", label: "Market" },
    { value: "Bus Stop", label: "Bus Stop" },
    { value: "School", label: "School" },
    { value: "Hospital", label: "Hospital" },
    { value: "Metro Station", label: "Metro Station" },
    { value: "Grocery Store", label: "Grocery Store" },
    { value: "Super Market (e.g. Dmart)", label: "Super Market (e.g. Dmart)" },
    { value: "Park", label: "Park" },
    { value: "Mall", label: "Mall" },
    { value: "Restaurant", label: "Restaurant" },
    { value: "Pharmacy", label: "Pharmacy" },
    { value: "ATM", label: "ATM" },
    { value: "Gym", label: "Gym" },
  ];

  const parkingOptions = [
    { value: "None", label: "None" },
    { value: "2 Wheeler", label: "2 Wheeler" },
    { value: "4 Wheeler", label: "4 Wheeler" },
    { value: "More", label: "More" },
  ];

  // Fetch all Indian cities from country-state-city
  const cityOptions = City.getCitiesOfCountry("IN").map((city) => ({
    value: city.name,
    label: city.name,
  }));

  // ---------- JSX ----------
  return (
    <div className="property-form-container">
      <h2 className="form-title">Upload Property</h2>

      <form onSubmit={handleSubmit} className="property-form" encType="multipart/form-data">
        {/* BASIC FIELDS */}
        <label>Property Name *</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Description *</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />

 <label>BHK *</label>
<NumberInput
  name="BHK"
  max="100"
  value={formData.BHK}
  onChange={(e) => setFormData({ ...formData, BHK: e.target.value })}
  required
/>


<label>Rent (₹) *</label>
<NumberInput
  name="rent"
  max="100000000"
  value={formData.rent}
  onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
  required
/>



        {/* CITY DROPDOWN */}
        <label>City *</label>
        <Select
          options={cityOptions}
          value={cityOptions.find((c) => c.value === formData.city) || null}
          onChange={handleCityChange}
          placeholder="Select your city"
          isClearable
        />

        {/* NEARBY PLACES */}
        <label style={{ marginTop: "10px" }}>Nearby Places</label>
        <CreatableSelect
          isMulti
          options={nearbyOptions}
          value={formData.nearbyPlaces.map((p) => ({ value: p, label: p }))}
          onChange={handleNearbyPlacesChange}
          placeholder="Select or add nearby places"
        />

       

<label>Locality *</label>
<LocalitySelector
  city={formData.city}
  value={formData.locality}
  onChange={(loc) => {
    const newLocality = loc;

    const list = JSON.parse(
      localStorage.getItem(`localities_${formData.city}`)
    );

    const match = list?.find((item) => item.locality === newLocality);
{console.log(list);}
    setFormData((prev) => ({
      ...prev,
      locality: newLocality,
      pincode: match ? match.postalCode : "",
    }));
  }}
/>
<label>Pincode *</label>
<input
  type="text"
  name="pincode"
  value={formData.pincode}
  onChange={handleChange}
  required
/>



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
<NumberInput
  name="areaSize"
  max="1000000"
  value={formData.areaSize}
  onChange={(e) => setFormData({ ...formData, areaSize: e.target.value })}
/>


       {/* ADDRESS SECTION */}
<label>Address Details</label>

<div className="address-fields">
  <input
    type="text"
    name="houseNumber"
    placeholder="House / Flat No."
    value={formData.houseNumber}
    onChange={handleChange}
  />

  <input
    type="text"
    name="street"
    placeholder="Street / Road Name"
    value={formData.street}
    onChange={handleChange}
  />

  <input
    type="text"
    name="areaOrLandmark"
    placeholder="Area / Landmark"
    value={formData.areaOrLandmark}
    onChange={handleChange}
  />
</div>


       <label>Address Link</label>
<input
  type="text"
  name="addressLink"
  value={formData.addressLink}
  placeholder="Paste Google Maps link"
  onChange={(e) => {
    const val = e.target.value.trim();
    setFormData({ ...formData, addressLink: val });

    const googleMapsPattern = /^(https?:\/\/)?(www\.)?(google\.com\/maps\/(place|@)|goo\.gl\/maps|maps\.app\.goo\.gl)\/.+/;

    if (val && !googleMapsPattern.test(val)) {
      setLinkError("Please enter a valid Google Maps link.");
    } else {
      setLinkError("");
    }
  }}
/>

{linkError && <p style={{ color: "red", fontSize: "0.9rem" }}>{linkError}</p>}


        <label>Parking Area *</label>
        <Select
          options={parkingOptions}
          value={parkingOptions.find((p) => p.value === formData.parkingArea) || null}
          onChange={(selected) =>
            setFormData({ ...formData, parkingArea: selected ? selected.value : "None" })
          }
          placeholder="Select Parking Option"
        />

       

       {/* IMAGE UPLOAD */}
<label>Property Images (max 10) *</label>


{/* Show error if image limit exceeded */}
{imageLimitMessage && (
  <p style={{ color: "red", fontSize: "0.9rem" }}>{imageLimitMessage}</p>
)}

{/* Show thumbnails of uploaded images */}
{images.length > 0 && (
  <div className="image-preview-container">
    {images.map((img, index) => (
      <div key={index} className="image-preview">
        <img
          src={URL.createObjectURL(img)}
          alt={`Preview ${index}`}
          className="preview-thumb"
        />
      </div>
    ))}
  </div>
)}
<input
  ref={fileInputRef}
  type="file"
  name="images"
  multiple
  accept="image/*"
  onChange={(e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalFiles = images.length + selectedFiles.length;

    if (totalFiles > 10) {
      setImageLimitMessage("You can upload a maximum of 10 images only.");
      const allowedFiles = selectedFiles.slice(0, 7 - images.length);
      setImages((prev) => [...prev, ...allowedFiles]);
      return;
    }

    setImages((prev) => [...prev, ...selectedFiles]);
    setImageLimitMessage("");
  }}
  required
/>
<div style={{ marginTop: 8, marginBottom: 12 }}>
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      setImages([]);
      setImageLimitMessage("");
      if (fileInputRef.current) fileInputRef.current.value = null;
    }}
    disabled={images.length === 0}
    className="clear-images-btn"
  >
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

      <Alert
        message={message.text}
        type={message.type}
        onClose={() => setMessage({ text: "", type: "" })}
      />
    </div>
  );
}
