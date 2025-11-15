import React, { useEffect, useState } from "react";
import { fetchMyProperties } from "../api/property";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>My Properties</h2>

      {/* No properties */}
      {properties?.length === 0 && <p>No properties found.</p>}

      {properties?.map((prop) => {
        if (!prop) return null; // Safety
        
        const tp = prop?.tenantPreferences || {};

        return (
          <div
            key={prop?._id || Math.random()}
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "25px",
              background: "#fafafa",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>{prop?.name}</h3>

            {/* Image */}
            {prop?.imgLink?.length > 0 && (
              <img
                src={prop?.imgLink[0]}
                alt={prop?.name}
                style={{
                  width: "300px",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginBottom: "15px",
                }}
              />
            )}

            {/* Edit property */}
            {user?.email === prop?.email && (
              <button
                onClick={() =>
                  navigate(`/editproperty/${prop?.email}/${prop?.name}`)
                }
              >
                Edit
              </button>
            )}

            {/* Main Details */}
            <p><strong>BHK:</strong> {prop?.BHK}</p>
            <p><strong>Rent:</strong> ₹{prop?.rent}</p>
            <p><strong>City:</strong> {prop?.city}</p>
            <p><strong>Locality:</strong> {prop?.locality}</p>
            <p><strong>Address:</strong> {prop?.address}</p>

            <p>
              <strong>Google Maps:</strong>{" "}
              <a href={prop?.addressLink} target="_blank" rel="noreferrer">
                Open Map
              </a>
            </p>

            <p><strong>Area Size:</strong> {prop?.areaSize} sq ft</p>
            <p><strong>House Type:</strong> {prop?.houseType}</p>
            <p><strong>Furnishing:</strong> {prop?.furnishingType}</p>
            <p><strong>Parking:</strong> {prop?.parkingArea}</p>
            <p><strong>Roommate Allowed:</strong> {prop?.isRoommate ? "Yes" : "No"}</p>
            <p><strong>Transport Available:</strong> {prop?.transportAvailability ? "Yes" : "No"}</p>

            <p><strong>Nation:</strong> {prop?.nation}</p>
            <p><strong>Description:</strong> {prop?.description}</p>

            <p>
              <strong>Nearby Places:</strong>{" "}
              {prop?.nearbyPlaces?.length > 0
                ? prop?.nearbyPlaces.join(", ")
                : "None"}
            </p>

          
                 <button onClick={() => openApplicants(prop.name)}>
      View Applicants
    </button>
            <hr style={{ margin: "20px 0" }} />

            {/* Tenant Preferences */}
            <h4>Tenant Preferences</h4>
            <div style={{ paddingLeft: "10px" }}>
              <p><strong>Gender:</strong> {tp?.gender || "Any"}</p>

              {tp?.ageRange && (
                <p><strong>Age Range:</strong> {tp?.ageRange}</p>
              )}

              <p><strong>Occupation:</strong> {tp?.occupation || "Any"}</p>
              <p><strong>Marital Status:</strong> {tp?.maritalStatus || "Any"}</p>
              <p><strong>Family:</strong> {tp?.family || "Any"}</p>
              <p><strong>Food Preference:</strong> {tp?.foodPreference || "Any"}</p>

              <p><strong>Smoking Allowed:</strong> {tp?.smoking ? "Yes" : "No"}</p>
              <p><strong>Alcohol Allowed:</strong> {tp?.alcohol ? "Yes" : "No"}</p>
              <p><strong>Pets Allowed:</strong> {tp?.pets ? "Yes" : "No"}</p>

              <p><strong>Nationality:</strong> {tp?.nationality || "Any"}</p>
              <p><strong>Working Shift:</strong> {tp?.workingShift || "Any"}</p>
              <p><strong>Professional Status:</strong> {tp?.professionalStatus || "Any"}</p>
              <p><strong>Religion:</strong> {tp?.religion || "Any"}</p>
              <p><strong>Language:</strong> {tp?.language || "Any"}</p>

              <p><strong>Min Stay Duration:</strong> {tp?.minStayDuration || 0} months</p>
              <p><strong>Max People Allowed:</strong> {tp?.maxPeopleAllowed || 0}</p>

              {tp?.notes && <p><strong>Notes:</strong> {tp?.notes}</p>}
            </div>

            <button
              onClick={() =>
                navigate(`/editpreferences/${prop?.email}/${prop?.name}`)
              }
            >
              Edit Preferences
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default MyProperties;
