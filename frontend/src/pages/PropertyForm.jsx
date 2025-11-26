import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { uploadProperty } from "../api/propertyform";
import "../StyleSheets/PropertyForm.css";
import Alert from "../Components/Alert";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { City } from "country-state-city";
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

  // Load saved draft
  useEffect(() => {
    const savedForm = localStorage.getItem("propertyFormData");
    if (savedForm) setFormData(JSON.parse(savedForm));
  }, []);

  // Autosave draft
  useEffect(() => {
    localStorage.setItem("propertyFormData", JSON.stringify(formData));
  }, [formData]);

  // Auth check
  useEffect(() => {
    if (!authLoading) {
      if (!user) navigate("/login");
    }
  }, [authLoading, user, navigate]);

  if (authLoading) return <p>Loading...</p>;
  if (!user) return null;

  // Handlers -----------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleCityChange = (selected) => {
    setFormData({ ...formData, city: selected ? selected.value : "" });
  };

  const handleNearbyPlacesChange = (selectedOptions) => {
    setFormData({
      ...formData,
      nearbyPlaces: selectedOptions
        ? selectedOptions.map((opt) => opt.value)
        : [],
    });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalFiles = images.length + selectedFiles.length;

    if (totalFiles > 10) {
      setImageLimitMessage("You can upload a maximum of 10 images only.");
      const allowed = selectedFiles.slice(0, 10 - images.length);
      setImages((prev) => [...prev, ...allowed]);
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
      setMessage({
        text: "Please enter a valid rent amount.",
        type: "error",
      });
      return;
    }
    if (linkError) {
      setMessage({ text: "Enter Valid Link", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    formData.address = `${formData.houseNumber || ""}$*${formData.street || ""}$*${formData.areaOrLandmark || ""}`;

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
        localStorage.removeItem("propertyFormData");

        setMessage({
          text: res.data.message || "Property uploaded successfully!",
          type: "success",
        });

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

        setImages([]);
        if (fileInputRef.current) fileInputRef.current.value = null;

        localStorage.removeItem(`localities_${formData.city}`);
        localStorage.setItem("propertyForm_lastName", formData.name);

        navigate("/PropertyForm2");
      }
    } catch (error) {
      console.error("Error uploading:", error);

      if (error.response) {
        const backendMessage =
          error.response.data?.message ||
          error.response.data?.msg ||
          JSON.stringify(error.response.data);

        if (/E11000.*duplicate key/.test(backendMessage)) {
          setMessage({
            text: "A property with this name already exists.",
            type: "error",
          });
        } else {
          setMessage({
            text: backendMessage || "Server error.",
            type: "error",
          });
        }
      } else {
        setMessage({
          text: "Network error. Check connection.",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Options -----------------------------------
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

  // --------------------------------------------
  return (
    <div className="pf-container">

  <div className="pf-wrapper">

    {/* TITLE */}
    <h2 className="pf-title">Upload Property</h2>

    {/* MAIN CARD */}
    <div className="pf-card">

      <form
        onSubmit={handleSubmit}
        className="pf-form"
        encType="multipart/form-data"
      >
        {/* BASIC FIELDS */}
        <label className="pf-label">Property Name *</label>
        <input
          className="pf-input"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label className="pf-label">Description *</label>
        <textarea
          className="pf-textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label className="pf-label">BHK *</label>
        <NumberInput
          className="pf-input"
          name="BHK"
          max="100"
          value={formData.BHK}
          onChange={(e) =>
            setFormData({ ...formData, BHK: e.target.value })
          }
          required
        />

        <label className="pf-label">Rent (₹) *</label>
        <NumberInput
          className="pf-input"
          name="rent"
          max="100000000"
          value={formData.rent}
          onChange={(e) =>
            setFormData({ ...formData, rent: e.target.value })
          }
          required
        />

        {/* CITY */}
        <label className="pf-label">City *</label>
        <Select
          className="pf-select"
          options={cityOptions}
          value={cityOptions.find((c) => c.value === formData.city) || null}
          onChange={handleCityChange}
          placeholder="Select your city"
          isClearable
        />

        {/* NEARBY */}
        <label className="pf-label" style={{ marginTop: "10px" }}>
          Nearby Places
        </label>
        <CreatableSelect
          className="pf-select"
          isMulti
          options={nearbyOptions}
          value={formData.nearbyPlaces.map((p) => ({
            value: p,
            label: p,
          }))}
          onChange={handleNearbyPlacesChange}
          placeholder="Select or add nearby places"
        />

        {/* LOCALITY */}
        <label className="pf-label">Locality *</label>
        <LocalitySelector
          className="pf-select"
          city={formData.city}
          value={formData.locality}
          onChange={(loc) => {
            const list = JSON.parse(
              localStorage.getItem(`localities_${formData.city}`)
            );
            const match = list?.find((item) => item.locality === loc);

            setFormData((prev) => ({
              ...prev,
              locality: loc,
              pincode: match ? match.postalCode : "",
            }));
          }}
        />

        <label className="pf-label">Pincode *</label>
        <input
          className="pf-input"
          type="text"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          required
        />

        <label className="pf-label">House Type *</label>
        <select
          className="pf-input"
          name="houseType"
          value={formData.houseType}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="Apartment">Apartment</option>
          <option value="Tenament">Tenament</option>
          <option value="Bungalow">Bungalow</option>
          <option value="Studio">Studio</option>
          <option value="Condo">Condo</option>
          <option value="Other">Other</option>
        </select>

        <label className="pf-label">Furnishing Type</label>
        <select
          className="pf-input"
          name="furnishingType"
          value={formData.furnishingType}
          onChange={handleChange}
        >
          <option value="Fully Furnished">Fully Furnished</option>
          <option value="Semi Furnished">Semi Furnished</option>
          <option value="Unfurnished">Unfurnished</option>
          <option value="Any">Any</option>
        </select>

        <label className="pf-label">Area Size (sq ft)</label>
        <NumberInput
          className="pf-input"
          name="areaSize"
          max="1000000"
          value={formData.areaSize}
          onChange={(e) =>
            setFormData({ ...formData, areaSize: e.target.value })
          }
        />

        {/* ADDRESS */}
        <label className="pf-label">Address Details</label>
        <div className="pf-address-fields">
          <input
            className="pf-input"
            type="text"
            name="houseNumber"
            placeholder="House / Flat No."
            value={formData.houseNumber}
            onChange={handleChange}
          />

          <input
            className="pf-input"
            type="text"
            name="street"
            placeholder="Street / Road Name"
            value={formData.street}
            onChange={handleChange}
          />

          <input
            className="pf-input"
            type="text"
            name="areaOrLandmark"
            placeholder="Area / Landmark"
            value={formData.areaOrLandmark}
            onChange={handleChange}
          />
        </div>

        <label className="pf-label">Address Link</label>
        <input
          className="pf-input"
          type="text"
          name="addressLink"
          value={formData.addressLink}
          placeholder="Paste Google Maps link"
          onChange={(e) => {
            const val = e.target.value.trim();
            setFormData({ ...formData, addressLink: val });

            const valid = /^(https?:\/\/)?(www\.)?(google\.com\/maps\/(place|@)|goo\.gl\/maps|maps\.app\.goo\.gl)\/.+/;
            setLinkError(val && !valid.test(val) ? "Please enter a valid Google Maps link." : "");
          }}
        />

        {linkError && (
          <p className="pf-error">{linkError}</p>
        )}

        <label className="pf-label">Parking Area *</label>
        <Select
          className="pf-select"
          options={parkingOptions}
          value={parkingOptions.find((p) => p.value === formData.parkingArea) || null}
          onChange={(selected) =>
            setFormData({
              ...formData,
              parkingArea: selected ? selected.value : "None",
            })
          }
          placeholder="Select Parking Option"
        />

        {/* IMAGE UPLOAD */}
        <label className="pf-label">Property Images (max 10) *</label>

        {imageLimitMessage && (
          <p className="pf-error">{imageLimitMessage}</p>
        )}

        {images.length > 0 && (
          <div className="pf-image-preview-container">
            {images.map((img, i) => (
              <img
                key={i}
                src={URL.createObjectURL(img)}
                className="pf-preview-thumb"
                alt=""
              />
            ))}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          name="images"
          multiple
          accept="image/*"
          className="pf-input"
          onChange={handleFileChange}
          required
        />

        <div className="pf-image-actions">
          <button
            type="button"
            onClick={handleClearImages}
            disabled={images.length === 0}
            className="pf-clear-images-btn"
          >
            Clear Selected Images
          </button>

          <span className="pf-image-count">
            {images.length > 0
              ? `${images.length} image(s) selected`
              : "No images selected"}
          </span>
        </div>

        <button
          type="submit"
          className="pf-submit-btn"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Property"}
        </button>
      </form>
    </div>
  </div>

  <Alert
    message={message.text}
    type={message.type}
    onClose={() => setMessage({ text: "", type: "" })}
  />
</div>
  );
}
