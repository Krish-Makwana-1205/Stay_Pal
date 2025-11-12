import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSingleProperty } from "../api/filters";

const PropertyView = () => {
  const { email, name } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    fetchSingleProperty(email, name)
      .then((res) => setProperty(res.data.data))
      .catch((err) => console.error("Error fetching property:", err));
  }, [email, name]);

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

 
    </div>
  );
};

export default PropertyView;
