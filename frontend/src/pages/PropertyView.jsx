import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSingleProperty, fetchproperty, applyForProperty } from "../api/filters";
import "../StyleSheets/PropertyView.css";

export default function PropertyView() {
  const { email, name } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyLoading, setApplyLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchSingleProperty(email, name);
        setProperty(res.data.data);
      } catch (err) {
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
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
    if (property) loadSimilar(property);
  }, [property]);

  if (loading) return <h2 style={{ padding: "20px" }}>Loading property...</h2>;
  if (!property) return <h2 style={{ padding: "20px" }}>Property not found.</h2>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>{property.name}</h1>

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

      <h2>Property Details</h2>

      <div
        style={{
          marginTop: "15px",
          background: "#f8f8f8",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <div className="pv-details">
          <p><strong>Rent:</strong> ₹{property.rent}</p>
          <p><strong>BHK:</strong> {property.BHK}</p>
          <p><strong>City:</strong> {property.city}</p>
          <p><strong>Locality:</strong> {property.locality}</p>

          {property.areaSize && (
            <p><strong>Area Size:</strong> {property.areaSize} sq ft</p>
          )}

          <p><strong>House Type:</strong> {property.houseType}</p>
          <p><strong>Furnishing:</strong> {property.furnishingType}</p>
          <p><strong>Parking:</strong> {property.parkingArea}</p>

          <p>
            <strong>Transport Availability:</strong>{" "}
            {property.transportAvailability ? "Yes" : "No"}
          </p>

          <p><strong>Description:</strong> {property.description}</p>

          <p>
            <strong>Nearby Places:</strong>{" "}
            {property.nearbyPlaces?.length
              ? property.nearbyPlaces.join(", ")
              : "None"}
          </p>

          <p><strong>Owner Email:</strong> {property.email}</p>

          <p>
            <strong>Address:</strong>{" "}
            {property.address.split("$*").join(", ")}
          </p>

          <p>
            <strong>Google Maps:</strong>{" "}
            <a href={property.addressLink} target="_blank" rel="noreferrer">
              Open in Maps
            </a>
          </p>
        </div>

        <button
          className="apply-btn"
          disabled={applyLoading}
          onClick={async () => {
            try {
              setApplyLoading(true);

              const payload = {
                propertyName: property.name,
                propertyOwnerEmail: property.email,
              };

              await applyForProperty(payload);
              alert("Application sent to the owner!");
            } catch (err) {
              console.error(err);
              alert("Failed to apply.");
            } finally {
              setApplyLoading(false);
            }
          }}
          style={{
            marginTop: "20px",
            padding: "12px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            opacity: applyLoading ? 0.6 : 1,
          }}
        >
          {applyLoading ? "Applying..." : "Apply"}
        </button>
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
}
