import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { City } from "country-state-city";
import NumberInput from "../Components/NumberInput";
import LocalitySelector from "../Components/LocalitySelector";
import { fetchSingleProperty } from "../api/filters";
import { uploadProperty } from "../api/propertyform";
import Alert from "../Components/Alert";
import "../StyleSheets/PropertyForm.css";

export default function EditProperty() {
    const fileInputRef = useRef(null);

const triggerFileInput = () => {
  if (fileInputRef.current) fileInputRef.current.click();
};

  const { email, name } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [images, setImages] = useState([]); // BOTH existing + new files
  const [existingImages, setExistingImages] = useState([]); // only existing URLs
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [linkError, setLinkError] = useState("");

  // ------------------ LOAD PROPERTY ------------------
  useEffect(() => {
    async function load() {
      try {
        const { data } = await fetchSingleProperty(email, name);
        const p = data.data;

        setFormData({
          name: p.name,
          email: p.email,
          description: p.description,
          BHK: p.BHK,
          rent: p.rent,
          nation: p.nation,
          pincode: p.pincode,
          city: p.city,
          locality: p.locality,
          houseType: p.houseType,
          furnishingType: p.furnishingType,
          areaSize: p.areaSize,
          houseNumber: p.address.split("$*")[0] || "",
          street: p.address.split("$*")[1] || "",
          areaOrLandmark: p.address.split("$*")[2] || "",
          address: p.address,
          addressLink: p.addressLink,
          nearbyPlaces: p.nearbyPlaces || [],
          parkingArea: p.parkingArea,
          transportAvailability: p.transportAvailability,
          isRoommate: p.isRoommate,
        });

        setExistingImages(p.imgLink || []);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [email, name]);

  if (!formData) return <p>Loading...</p>;

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

  const cityOptions = City.getCitiesOfCountry("IN").map((c) => ({
    value: c.name,
    label: c.name,
  }));

  // -------------- HANDLERS --------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleNearbyPlacesChange = (selected) => {
    setFormData({
      ...formData,
      nearbyPlaces: selected ? selected.map((s) => s.value) : [],
    });
  };

  // Upload new images
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setImages(selected); // store new files only
  };

  // --- FIX: rebuild address string like PropertyForm ---

const handleSave = async (e) => {
  e.preventDefault();

  // VALIDATION
  if (
    !formData.name ||
    !formData.description ||
    !formData.BHK ||
    !formData.rent ||
    !formData.pincode ||
    !formData.city ||
    !formData.locality ||
    !formData.houseType
  ) {
    setMessage("Please fill all required fields.");
    return;
  }

  if (linkError) {
    setMessage("Enter a valid Google Maps link.");
    return;
  }

  setLoading(true);

  // ✅ FIX 1 — rebuild address INSIDE handleSave
  const fullAddress = `${formData.houseNumber || ""}$*${formData.street || ""}$*${formData.areaOrLandmark || ""}`;

  const fd = new FormData();

  // ✅ FIX 2 — append ALL fields EXCEPT old "address"
  Object.entries(formData).forEach(([key, val]) => {
    if (key === "address") return; // don't send old address

    if (Array.isArray(val)) {
      val.forEach((v) => fd.append(key, v));
    } else {
      fd.append(key, val);
    }
  });

  // NEW correct address
  fd.append("address", fullAddress);

  // ✅ FIX 3 — send BACKEND the existing image URLs
  existingImages.forEach((url) => fd.append("existingImages", url));

  // NEW uploaded images
  if (images.length > 0) {
    images.forEach((img) => fd.append("images", img));
  }

  try {
    const res = await uploadProperty(fd);
    // IMPORTANT: force LocalitySelector to fetch localities for this city on edit page
localStorage.removeItem(`localities_${p.city}`); 

    setMessage("Updated successfully!");
    navigate("/myproperties");
  } catch (err) {
    console.error(err);
    setMessage("Update failed.");
  } finally {
    setLoading(false);
  }
};


  // ------------------- JSX -------------------
  return (
    <div className="property-form-container">
      <h2 className="form-title">Edit Property</h2>

      <form onSubmit={handleSave} className="property-form" encType="multipart/form-data">

        {/* NAME */}
        <label>Property Name *</label>
        <input name="name" value={formData.name} onChange={handleChange} required />

        {/* DESCRIPTION */}
        <label>Description *</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />

        {/* BHK */}
        <label>BHK *</label>
        <NumberInput
          name="BHK"
          value={formData.BHK}
          onChange={(e) => setFormData({ ...formData, BHK: e.target.value })}
          required
        />

        {/* Rent */}
        <label>Rent *</label>
        <NumberInput
          name="rent"
          value={formData.rent}
          onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
          required
        />

        {/* CITY */}
        <label>City *</label>
        <Select
          options={cityOptions}
          value={{ value: formData.city, label: formData.city }}
          onChange={(selected) => setFormData({ ...formData, city: selected.value })}
        />

        {/* Nearby places */}
        <label>Nearby Places</label>
<CreatableSelect
  isMulti
  options={nearbyOptions}
  value={formData.nearbyPlaces.map((p) => ({ value: p, label: p }))}
  onChange={(selected) =>
    setFormData({
      ...formData,
      nearbyPlaces: selected ? selected.map((s) => s.value) : [],
    })
  }
/>


        {/* Locality */}
        <label>Locality *</label>
        <LocalitySelector
  key={formData.city} // <— FORCE reload when city changes
  city={formData.city}
  value={formData.locality}
  onChange={(loc) => {
    const list = JSON.parse(localStorage.getItem(`localities_${formData.city}`));

    const match = list?.find((l) => l.locality === loc);

    setFormData((prev) => ({
      ...prev,
      locality: loc,
      pincode: match ? match.postalCode : prev.pincode, // autofill pincode
    }));
  }}
/>


        {/* PINCODE */}
        <label>Pincode *</label>
        <input name="pincode" value={formData.pincode} onChange={handleChange} required />

        {/* HOUSE TYPE */}
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

        {/* Furnishing */}
        <label>Furnishing Type</label>
        <select
          name="furnishingType"
          value={formData.furnishingType}
          onChange={handleChange}
        >
          <option value="Fully Furnished">Fully Furnished</option>
          <option value="Semi Furnished">Semi Furnished</option>
          <option value="Unfurnished">Unfurnished</option>
          <option value="Any">Any</option>
        </select>

        {/* Area size */}
        <label>Area Size</label>
        <NumberInput
          name="areaSize"
          value={formData.areaSize}
          onChange={(e) => setFormData({ ...formData, areaSize: e.target.value })}
        />

        {/* Address */}
        <label>Address</label>
        <div className="address-fields">
          <input
            name="houseNumber"
            placeholder="House No"
            value={formData.houseNumber}
            onChange={handleChange}
          />
          <input
            name="street"
            placeholder="Street"
            value={formData.street}
            onChange={handleChange}
          />
          <input
            name="areaOrLandmark"
            placeholder="Area/Landmark"
            value={formData.areaOrLandmark}
            onChange={handleChange}
          />
        </div>

        {/* Address Link */}
        <label>Address Link</label>
        <input
          name="addressLink"
          value={formData.addressLink}
          onChange={(e) => {
            const v = e.target.value.trim();
            setFormData({ ...formData, addressLink: v });

            const pattern = /^(https?:\/\/)?(www\.)?(google\.com\/maps|goo\.gl\/maps|maps\.app\.goo\.gl)/;
            setLinkError(pattern.test(v) ? "" : "Invalid map link");
          }}
        />
        {linkError && <p style={{ color: "red" }}>{linkError}</p>}

        {/* Parking */}
        <label>Parking</label>
        <Select
          options={parkingOptions}
          value={{ value: formData.parkingArea, label: formData.parkingArea }}
          onChange={(sel) => setFormData({ ...formData, parkingArea: sel.value })}
        />

       {/* Existing Images */}
<label>Existing Images</label>
<div className="image-preview-container">
  {existingImages.map((img, i) => (
    <img key={i} src={img} className="preview-thumb" />
  ))}
</div>

{/* NEW IMAGES PREVIEW */}
{images.length > 0 && (
  <div className="image-preview-container">
    {images.map((img, idx) => (
      <div key={idx} className="image-preview">
        <img
          src={URL.createObjectURL(img)}
          className="preview-thumb"
        />
      </div>
    ))}
  </div>
)}

{/* Upload Button */}
<button
  type="button"
  className="clear-images-btn"
  onClick={triggerFileInput}
  style={{ marginTop: "10px" }}
>
  Upload New Images
</button>

<input
  ref={fileInputRef}
  type="file"
  name="images"
  multiple
  accept="image/*"
  style={{ display: "none" }}
  onChange={(e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages((prev) => [...prev, ...selectedFiles]);
  }}
/>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <Alert
        message={message}
        type={message.includes("success") ? "success" : "error"}
        onClose={() => setMessage("")}
      />
    </div>
  );
}
