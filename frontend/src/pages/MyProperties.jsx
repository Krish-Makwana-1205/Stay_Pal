import React, { useEffect, useState } from "react";
import { fetchMyProperties } from "../api/property";
import { deleteProperty } from "../api/propertyform";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../StyleSheets/MyProperties.css";

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // --------------------------
  // ADDRESS FORMATTER (new)
  // --------------------------
  const formatAddress = (raw) => {
    if (!raw) return "Not available";

    const parts = raw.split("$*");

    return {
      houseNo: parts[0] || "",
      street: parts[1] || "",
      area: parts[2] || "",
      landmark: parts[3] || "",
      extra: parts.slice(4).join(", ") || "",
    };
  };

  useEffect(() => {
    fetchMyProperties()
      .then((res) => {
        setProperties(res.data.properties);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = async (propertyName) => {
    if (!window.confirm(`Are you sure you want to delete "${propertyName}"?`)) {
      return;
    }

    setDeleteLoading(propertyName);
    
    try {
      await deleteProperty(propertyName);

      setProperties((prev) => prev.filter((p) => p.name !== propertyName));

      alert("Property deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message || "Failed to delete property");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="mp-my-properties-container">
      <div className="mp-header-box">
        <h2 className="mp-page-title">My Properties</h2>
      </div>

      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        properties.map((prop) => (
          <div key={prop._id} className="mp-property-card">
            
            {/* Header */}
            <div className="mp-card-header">
              <h3>{prop.name}</h3>
              <div style={{ display: "flex", gap: "8px" }}>
                {user?.email === prop.email && (
                  <>
                    <button
                      className="mp-action-btn small"
                      onClick={() =>
                        navigate(`/editproperty/${user.email}/${prop.name}`)
                      }
                    >
                      EDIT PROPERTY
                    </button>

                    <button
                      className="mp-action-btn small mp-delete-btn"
                      onClick={() => handleDelete(prop.name)}
                      disabled={deleteLoading === prop.name}
                      style={{
                        backgroundColor: "#dc3545",
                        borderColor: "#dc3545",
                      }}
                    >
                      {deleteLoading === prop.name ? "DELETING..." : "DELETE"}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Main Body */}
            <div className="mp-card-body">
              {prop.imgLink?.length > 0 && (
                <div className="mp-image-wrapper">
                  <img src={prop.imgLink[0]} alt={prop.name} />
                </div>
              )}

              <div className="mp-description-box">
                <strong>Description:</strong> {prop.description}
              </div>

              <div className="mp-details-grid">
                <p>
                  <strong>BHK:</strong> {prop.BHK}
                </p>
                <p>
                  <strong>Rent:</strong> ₹{prop.rent}
                </p>
                <p>
                  <strong>City:</strong> {prop.city}
                </p>
                <p>
                  <strong>Locality:</strong> {prop.locality}
                </p>
                <p>
                  <strong>Area:</strong> {prop.areaSize} sq ft
                </p>
                <p>
                  <strong>Type:</strong> {prop.houseType}
                </p>
                <p>
                  <strong>Furnished:</strong> {prop.furnishingType}
                </p>
                <p>
                  <strong>Parking:</strong> {prop.parkingArea}
                </p>
                <p>
                  <strong>Roommate:</strong> {prop.isRoommate ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Transport:</strong>{" "}
                  {prop.transportAvailability ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Nation:</strong> {prop.nation}
                </p>

                {/* -------------------------- */}
                {/* UPDATED ADDRESS BLOCK */}
                {/* -------------------------- */}
                <div className="mp-full-width">
                  <strong>Address:</strong>
                  <div style={{ marginTop: "5px" }}>
                    {(() => {
                      const a = formatAddress(prop.address);
                      return (
                        <>
                          <p>
                            <strong>House No:</strong> {a.houseNo}
                          </p>
                          <p>
                            <strong>Street / Road:</strong> {a.street}
                          </p>
                          <p>
                            <strong>Area:</strong> {a.area}
                          </p>
                          {a.landmark && (
                            <p>
                              <strong>Landmark:</strong> {a.landmark}
                            </p>
                          )}
                          {a.extra && (
                            <p>
                              <strong>Extra:</strong> {a.extra}
                            </p>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  <p style={{ marginTop: "8px" }}>
                    <strong>Google Maps:</strong>{" "}
                    <a
                      href={prop.addressLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mp-map-link"
                    >
                      Open Map
                    </a>
                  </p>
                </div>
              </div>

              <div className="mp-notes-box">
                <strong>Nearby:</strong>{" "}
                {prop.nearbyPlaces?.length > 0
                  ? prop.nearbyPlaces.join(", ")
                  : "None"}
              </div>

              <div style={{ marginTop: "12px" }}>
                {user?.email === prop.email && (
                  <button
                    className="mp-primary-btn"
                    style={{ width: "auto", padding: "8px 12px" }}
                    onClick={() => navigate(`/applications/${prop.name}`)}
                  >
                    VIEW APPLICATIONS
                  </button>
                )}
              </div>

              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#666",
                  marginTop: "10px",
                }}
              >
                Created: {new Date(prop.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="mp-preferences-section">
              <div className="mp-pref-header">
                <h4>Tenant Preferences</h4>
                <button
                  className="mp-action-btn small"
                  onClick={() =>
                    navigate(`/editpreferences/${prop.email}/${prop.name}`)
                  }
                >
                  EDIT
                </button>
              </div>

              <div className="mp-details-grid">
                <p>
                  <strong>Gender:</strong>{" "}
                  {prop.tenantPreferences?.gender}
                </p>

                {prop.tenantPreferences?.ageRange && (
                  <p>
                    <strong>Age:</strong>{" "}
                    {prop.tenantPreferences.ageRange}
                  </p>
                )}

                <p>
                  <strong>Occupation:</strong>{" "}
                  {prop.tenantPreferences?.occupation}
                </p>
                <p>
                  <strong>Marital Status:</strong>{" "}
                  {prop.tenantPreferences?.maritalStatus}
                </p>
                <p>
                  <strong>Family:</strong> {prop.tenantPreferences?.family}
                </p>
                <p>
                  <strong>Food:</strong>{" "}
                  {prop.tenantPreferences?.foodPreference}
                </p>
                <p>
                  <strong>Smoking:</strong>{" "}
                  {prop.tenantPreferences?.smoking
                    ? "Allowed"
                    : "No"}
                </p>
                <p>
                  <strong>Alcohol:</strong>{" "}
                  {prop.tenantPreferences?.alcohol
                    ? "Allowed"
                    : "No"}
                </p>
                <p>
                  <strong>Pets:</strong>{" "}
                  {prop.tenantPreferences?.pets ? "Allowed" : "No"}
                </p>
                <p>
                  <strong>Min Stay:</strong>{" "}
                  {prop.tenantPreferences?.minStayDuration} mths
                </p>

                {prop.tenantPreferences?.notes && (
                  <div
                    className="mp-full-width"
                    style={{ marginTop: "10px" }}
                  >
                    <strong>Notes:</strong>{" "}
                    {prop.tenantPreferences.notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyProperties;
