import React, { useEffect, useState } from "react";
import { fetchMyProperties } from "../api/property";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../StyleSheets/MyProperties.css"; 

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const openApplicants = (propertyName) => {
    navigate(`/applications/${propertyName}`);
  };

  useEffect(() => {
    fetchMyProperties()
      .then((res) => {
        setProperties(res.data?.properties || []);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="my-properties-container">

      <h2 className="page-title">My Properties</h2>

      {/* NO PROPERTIES */}
      {properties?.length === 0 && (
        <div className="no-properties">No properties found.</div>
      )}

      {properties?.map((prop) => {
        if (!prop) return null;

        const tp = prop?.tenantPreferences || {};

        return (
          <div key={prop?._id || Math.random()} className="property-card">

            {/* Header Row */}
            <div className="card-header">
              <h3>{prop?.name}</h3>

              {user?.email === prop?.email && (
                <button
                  className="action-btn edit-btn small"
                  onClick={() =>
                    navigate(`/editproperty/${prop?.email}/${prop?.name}`)
                  }
                >
                  Edit Property
                </button>
              )}
            </div>

            {/* LEFT COLUMN */}
            <div className="card-body">

              {/* Image */}
              <div className="image-wrapper">
                {prop?.imgLink?.length > 0 && (
                  <img src={prop.imgLink[0]} alt={prop.name} />
                )}
              </div>

              {/* Main Details */}
              <div className="details-grid">

                <p><strong>BHK:</strong> {prop?.BHK}</p>
                <p><strong>Rent:</strong> ₹{prop?.rent}</p>

                <p><strong>City:</strong> {prop?.city}</p>
                <p><strong>Locality:</strong> {prop?.locality}</p>

                <p className="full-width">
                  <strong>Address:</strong> {prop?.address}
                </p>

                <p className="full-width">
                  <strong>Google Maps:</strong>{" "}
                  <a href={prop?.addressLink} target="_blank" rel="noreferrer" className="map-link">
                    Open Map
                  </a>
                </p>

                <p><strong>Area Size:</strong> {prop?.areaSize} sq ft</p>
                <p><strong>House Type:</strong> {prop?.houseType}</p>

                <p><strong>Furnishing:</strong> {prop?.furnishingType}</p>
                <p><strong>Parking:</strong> {prop?.parkingArea}</p>

                <p><strong>Roommate Allowed:</strong> {prop?.isRoommate ? "Yes" : "No"}</p>
                <p><strong>Transport Available:</strong> {prop?.transportAvailability ? "Yes" : "No"}</p>

              </div>

              <div className="description-box">
                <strong>Description:</strong> {prop?.description}
              </div>

              <div className="description-box">
                <strong>Nearby Places:</strong>{" "}
                {prop?.nearbyPlaces?.length > 0
                  ? prop?.nearbyPlaces.join(", ")
                  : "None"}
              </div>

              <button
                className="primary-btn"
                onClick={() => openApplicants(prop.name)}
              >
                View Applicants
              </button>

            </div>

            {/* RIGHT SIDEBAR = TENANT PREFERENCES */}
            <div className="preferences-section">

              <div className="pref-header">
                <h4>Tenant Preferences</h4>
                <button
                  className="action-btn edit-btn small"
                  onClick={() =>
                    navigate(`/editpreferences/${prop?.email}/${prop?.name}`)
                  }
                >
                  Edit
                </button>
              </div>

              <div className="details-grid">

                <p><strong>Gender:</strong> {tp?.gender || "Any"}</p>

                {tp?.ageRange && (
                  <p><strong>Age Range:</strong> {tp.ageRange}</p>
                )}

                <p><strong>Occupation:</strong> {tp?.occupation || "Any"}</p>
                <p><strong>Marital Status:</strong> {tp?.maritalStatus || "Any"}</p>

                <p><strong>Family:</strong> {tp?.family || "Any"}</p>
                <p><strong>Food Pref:</strong> {tp?.foodPreference || "Any"}</p>

                <p><strong>Smoking:</strong> {tp?.smoking ? "Allowed" : "No"}</p>
                <p><strong>Alcohol:</strong> {tp?.alcohol ? "Allowed" : "No"}</p>

                <p><strong>Pets:</strong> {tp?.pets ? "Allowed" : "No"}</p>
                <p><strong>Nationality:</strong> {tp?.nationality || "Any"}</p>

                <p><strong>Shift:</strong> {tp?.workingShift || "Any"}</p>
                <p><strong>Profession:</strong> {tp?.professionalStatus || "Any"}</p>

                <p><strong>Religion:</strong> {tp?.religion || "Any"}</p>
                <p><strong>Language:</strong> {tp?.language || "Any"}</p>

                <p><strong>Min Stay:</strong> {tp?.minStayDuration || 0} months</p>
                <p><strong>Max People:</strong> {tp?.maxPeopleAllowed || 0}</p>

              </div>

              {tp?.notes && (
                <div className="notes-box">
                  <strong>Notes:</strong> {tp.notes}
                </div>
              )}

            </div>

          </div>
        );
      })}

    </div>
  );
};

export default MyProperties;
