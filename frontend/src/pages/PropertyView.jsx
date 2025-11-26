import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchSingleProperty,
  fetchproperty,
  applyForProperty,
} from "../api/filters";
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

  if (loading) return <h2 className="pv-loading">Loading property...</h2>;
  if (!property) return <h2 className="pv-loading">Property not found.</h2>;

  return (
    <div className="pv-wrapper pv-profile-container">

      {/* HEADER */}
      <div className="pv-header-box">
        <h2 className="pv-page-title pv-profile-title">{property.name}</h2>
      </div>

      {/* CARD */}
      <div className="pv-property-card pv-profile-card">

        {/* HEADER ROW */}
        <div className="pv-card-header pv-profile-card-header">
          <h3 className="pv-profile-card-title">{property.name}</h3>

          <button
            className="pv-action-btn pv-edit-btn pv-small pv-profile-btn pv-profile-btn-accent"
            onClick={() => navigate(`/chat/${property.email}`)}
          >
            Chat With Owner
          </button>
        </div>

        {/* BODY */}
        <div className="pv-card-body pv-profile-body">
          
          {/* MAIN IMAGE */}
          <div className="pv-image-wrapper pv-profile-image-box">
            {property.imgLink?.length > 0 && (
              <img
                src={property.imgLink[0]}
                alt={property.name}
                className="pv-profile-img"
              />
            )}
          </div>

          {/* DETAILS GRID */}
          <div className="pv-details-grid pv-profile-grid">
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
              <strong>Transport:</strong>{" "}
              {property.transportAvailability ? "Yes" : "No"}
            </p>

            <p className="pv-full-width">
              <strong>Address:</strong> {property.address.split("$*").join(", ")}
            </p>

            <p className="pv-full-width">
              <strong>Google Maps: </strong>
              <a
                href={property.addressLink}
                target="_blank"
                rel="noreferrer"
                className="pv-map-link pv-profile-link"
              >
                Open in Maps
              </a>
            </p>

            <p className="pv-full-width">
              <strong>Nearby Places:</strong>{" "}
              {property.nearbyPlaces?.length
                ? property.nearbyPlaces.join(", ")
                : "None"}
            </p>

            <p><strong>Owner Email:</strong> {property.email}</p>
          </div>

          {/* DESCRIPTION */}
          <div className="pv-description-box pv-profile-desc-box">
            <strong>Description:</strong> {property.description}
          </div>

          {/* APPLY BUTTON */}
          <button
            className="pv-primary-btn pv-profile-btn pv-profile-btn-primary"
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
          >
            {applyLoading ? "Applying..." : "Apply"}
          </button>
        </div>
      </div>

      {/* SIMILAR PROPERTIES SECTION */}
      {similar.length > 0 && (
        <div className="pv-preferences-section pv-profile-pref-box">
          <div className="pv-pref-header pv-profile-pref-header">
            <h4 className="pv-profile-subtitle">Similar Properties</h4>
          </div>

          <div className="pv-similar-list">
            {similar.map((item, idx) => {
              const img = item.imgLink?.[0];

              return (
                <div
                  key={idx}
                  className="pv-similar-card"
                  onClick={() => navigate(`/property/${item.email}/${item.name}`)}
                >
                  <img src={img} alt="" className="pv-similar-img" />
                  <div className="pv-similar-text">
                    <h4>{item.BHK} BHK in {item.city}</h4>
                    <p>₹{item.rent}</p>
                    <p className="pv-similar-locality">{item.locality}</p>
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
