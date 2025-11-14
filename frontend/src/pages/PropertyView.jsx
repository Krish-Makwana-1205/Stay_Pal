import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSingleProperty } from "../api/filters";
import { fetchproperty } from "../api/filters";
import { useNavigate } from "react-router-dom";
import "../StyleSheets/PropertyView.css";
const PropertyView = () => {
  const { email, name } = useParams();
  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchSingleProperty(email, name)
      .then((res) => setProperty(res.data.data))
      .catch((err) => console.error("Error fetching property:", err));
  }, [email, name]);
  const loadSimilar = async (p) => {
    try {
      const low = Math.floor(p.rent * 0.8);
      const high = Math.ceil(p.rent * 1.2);

      const filters = {
        city: p.city,
        BHK: p.BHK,
        houseType: p.houseType,
        furnishingType: p.furnishingType,
        parkingArea: p.parkingArea,
        transportAvailability: p.transportAvailability,
        isRoommate: p.isRoommate,

        locality: p.locality,
        nearbyPlaces: p.nearbyPlaces,

        rentLowerBound: low,
        rentUpperBound: high,

        areaLowerBound: p.areaSize ? Math.floor(p.areaSize * 0.7) : undefined,
        areaUpperBound: p.areaSize ? Math.ceil(p.areaSize * 1.3) : undefined,
      };

      const { data } = await fetchproperty(filters);

      const list = data.data?.filter(
        (item) => !(item.email === p.email && item.name === p.name)
      );

      setSimilar(list || []);
    } catch (err) {
      console.error("Similar error:", err);
    }
  };

  useEffect(() => {
    if (property) {
      loadSimilar(property);
    }
  }, [property]);
  if (!property) return <h2 style={{ padding: "20px" }}>Loading...</h2>;

  const {
    _id,
    tenantPreferences,
    createdAt,
    updatedAt,
    imgLink,
    __v,
    ...filtered
  } = property;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* Title */}
      <h1 style={{ marginBottom: "10px" }}>{property.name}</h1>

      {/* Image */}
      {property.imgLink?.length > 0 && (
        <img
          src={property.imgLink[0]}
          alt={property.name}
          style={{
            width: "100%",
            maxHeight: "350px",
            objectFit: "cover",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        />
      )}

      {/* Auto Render Property Details */}
      <h2>Property Details</h2>
      <div
        style={{
          marginTop: "15px",
          background: "#f8f8f8",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        {Object.entries(filtered).map(([key, value]) => (
          <p key={key} style={{ marginBottom: "8px" }}>
            <strong>{key}:</strong>{" "}
            {key === "addressLink" ? (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "blue", textDecoration: "underline" }}
              >
                Open in Google Maps
              </a>
            ) : (
              String(value)
            )}
          </p>
        ))}
      </div>
      {similar.length > 0 && (
  <div className="similar-wrapper">
    <h3>Similar Properties</h3>

    <div className="similar-list">
      {similar.map((item, idx) => {
        const img = item.imgLink?.[0];

        return (
          <div
            key={idx}
            className="similar-card"
            onClick={() =>
              navigate(`/property/${item.email}/${item.name}`)
            }
          >
            <img src={img} alt="" className="similar-img" />

            <div className="similar-text">
              <h4>{item.BHK} BHK in {item.city}</h4>
              <p>₹{item.rent}</p>
              <p className="similar-locality">{item.locality}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}

    </div>
  );
};

export default PropertyView;
