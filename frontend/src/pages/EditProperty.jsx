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
import "../StyleSheets/EditProperty.css";

export default function EditProperty() {
  const { email, name } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(null);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [linkError, setLinkError] = useState("");

  // ******** LOAD PROPERTY ********
  useEffect(() => {
    async function load() {
      try {
        const res = await fetchSingleProperty(email, name);
        const p = res.data.data;

        setFormData({
          name: p.name,
          email: p.email,
          description: p.description,
          BHK: p.BHK,
          rent: p.rent,
          nation: p.nation,
          pincode: p.pincode,
          city: p.city,
          locality: p.locality || "",
          houseType: p.houseType,
          furnishingType: p.furnishingType,
          areaSize: p.areaSize,
          houseNumber: p.address.split("$*")[0] || "",
          street: p.address.split("$*")[1] || "",
          areaOrLandmark: p.address.split("$*")[2] || "",
          addressLink: p.addressLink,
          nearbyPlaces: p.nearbyPlaces || [],
          parkingArea: p.parkingArea,
          transportAvailability: p.transportAvailability,
          isRoommate: p.isRoommate
        });

        setExistingImages(p.imgLink || []);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }
    load();
  }, [email, name]);

  if (!formData) return <p>Loading...</p>;

  // ******** OPTIONS ********
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
    { value: "Gym", label: "Gym" }
  ];

  const parkingOptions = [
    { value: "None", label: "None" },
    { value: "2 Wheeler", label: "2 Wheeler" },
    { value: "4 Wheeler", label: "4 Wheeler" },
    { value: "More", label: "More" }
  ];

  const cityOptions = City.getCitiesOfCountry("IN").map((c) => ({
    value: c.name,
    label: c.name
  }));

  // ******** HANDLERS ********
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    setImages((prev) => [...prev, ...selected]);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // ******** SAVE ********
  const handleSave = async (e) => {
    e.preventDefault();

    if (linkError) {
      setMessage("Invalid Google Maps link");
      return;
    }

    const fd = new FormData();

    // Address rebuild
    const fullAddress = `${formData.houseNumber}$*${formData.street}$*${formData.areaOrLandmark}`;

    Object.entries(formData).forEach(([key, val]) => {
      if (key === "address") return;
      if (Array.isArray(val)) val.forEach((v) => fd.append(key, v));
      else fd.append(key, val);
    });

    fd.append("address", fullAddress);

    // existing images
    existingImages.forEach((url) => fd.append("existingImages", url));

    // new images
    images.forEach((img) => fd.append("images", img));

    try {
      setLoading(true);
      const res = await uploadProperty(fd);

      localStorage.removeItem(`localities_${formData.city}`);
      navigate("/myproperties");
    } catch (err) {
      console.error(err);
      setMessage("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ep-property-form-container">
      <h2 className="ep-form-title">Edit Property</h2>

      <form onSubmit={handleSave} className="ep-property-form">

        <label>Property Name *</label>
        <input value={formData.name} name="name" onChange={handleChange} />

        <label>Description *</label>
        <textarea value={formData.description} name="description" onChange={handleChange} />

        <label>BHK *</label>
        <NumberInput value={formData.BHK} name="BHK"
          onChange={(e) => setFormData({ ...formData, BHK: e.target.value })} />

        <label>Rent *</label>
        <NumberInput value={formData.rent} name="rent"
          onChange={(e) => setFormData({ ...formData, rent: e.target.value })} />

        <label>City *</label>
        <Select
          options={cityOptions}
          value={{ value: formData.city, label: formData.city }}
          onChange={(c) => setFormData({ ...formData, city: c.value })}
        />

        <label>Nearby Places</label>
        <CreatableSelect
          isMulti
          options={nearbyOptions}
          value={formData.nearbyPlaces.map((p) => ({ value: p, label: p }))}
          onChange={(opts) =>
            setFormData({ ...formData, nearbyPlaces: opts.map((o) => o.value) })
          }
        />

        <label>Locality *</label>
        {formData.city && (
          <LocalitySelector
            city={formData.city}
            value={formData.locality}
            onChange={(v) => {
              const list = JSON.parse(localStorage.getItem(`localities_${formData.city}`));
              const pin = list?.find((l) => l.locality === v)?.postalCode;
              setFormData({ ...formData, locality: v, pincode: pin || formData.pincode });
            }}
          />
        )}

        <label>Pincode *</label>
        <input name="pincode" value={formData.pincode} onChange={handleChange} />

        <label>House Type *</label>
        <select name="houseType" value={formData.houseType} onChange={handleChange}>
          <option value="">Select</option>
          <option value="Apartment">Apartment</option>
          <option value="Tenament">Tenament</option>
          <option value="Bungalow">Bungalow</option>
          <option value="Studio">Studio</option>
          <option value="Condo">Condo</option>
        </select>

        <label>Existing Images</label>
        <div className="ep-image-preview-container">
          {existingImages.map((img, i) => (
            <img key={i} src={img} className="ep-preview-thumb" />
          ))}
        </div>

        <label>New Images</label>
        <button type="button" className="ep-clear-images-btn" onClick={triggerFileInput}>
          Upload New Images
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />

        {images.length > 0 && (
          <div className="ep-image-preview-container">
            {images.map((img, i) => (
              <img key={i} src={URL.createObjectURL(img)} className="ep-preview-thumb" />
            ))}
          </div>
        )}

        <button className="ep-submit-btn" type="submit" disabled={loading}>
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
