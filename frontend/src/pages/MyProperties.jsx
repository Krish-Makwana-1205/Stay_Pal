import React, { useEffect, useState } from "react";
import { fetchMyProperties } from "../api/property";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    fetchMyProperties()
      .then((res) => {
        setProperties(res.data.properties || []);
      })
      .catch((err) => console.log(err));
  }, []);
  // const [isowner, setIsOwner] = useState(false);
  // console.log(user);
  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>My Properties</h2>

      {properties.map((prop) => (
        <div
          key={prop._id}
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "25px",
            background: "#fafafa",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>{prop.name}</h3>

          {/* Image */}
          {prop.imgLink?.length > 0 && (
            <img
              src={prop.imgLink[0]}
              alt={prop.name}
              style={{
                width: "300px",
                height: "180px",
                objectFit: "cover",
                borderRadius: "10px",
                marginBottom: "15px",
              }}
            />
          )}
          {user.email===prop.email&&(
            <button onClick={() => navigate(`/editproperty/${user.email}/${prop.name}`)}>
              Edit
            </button>
          )}

          {/* Main Details */}
          <p><strong>BHK:</strong> {prop.BHK}</p>
          <p><strong>Rent:</strong> ₹{prop.rent}</p>
          <p><strong>City:</strong> {prop.city}</p>
          <p><strong>Locality:</strong> {prop.locality}</p>
          <p><strong>Address:</strong> {prop.address}</p>

          <p>
            <strong>Google Maps:</strong>{" "}
            <a href={prop.addressLink} target="_blank" rel="noreferrer">
              Open Map
            </a>
          </p>

          <p><strong>Area Size:</strong> {prop.areaSize} sq ft</p>
          <p><strong>House Type:</strong> {prop.houseType}</p>
          <p><strong>Furnishing:</strong> {prop.furnishingType}</p>
          <p><strong>Parking:</strong> {prop.parkingArea}</p>
          <p><strong>Roommate Allowed:</strong> {prop.isRoommate ? "Yes" : "No"}</p>
          <p><strong>Transport Available:</strong> {prop.transportAvailability ? "Yes" : "No"}</p>

          <p><strong>Nation:</strong> {prop.nation}</p>
          <p><strong>Description:</strong> {prop.description}</p>
            <p><strong>Nearby Places:</strong> 
  {prop.nearbyPlaces?.length > 0 
    ? prop.nearbyPlaces.join(", ") 
    : "None"}
</p>

          <p><strong>Created At:</strong> {new Date(prop.createdAt).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(prop.updatedAt).toLocaleString()}</p>

          <hr style={{ margin: "20px 0" }} />

          {/* Tenant Preferences */}
         <h4>Tenant Preferences</h4>
<div style={{ paddingLeft: "10px" }}>
  <p><strong>Gender:</strong> {prop.tenantPreferences.gender}</p>

  {prop.tenantPreferences.ageRange && (
    <p><strong>Age Range:</strong> {prop.tenantPreferences.ageRange}</p>
  )}

  <p><strong>Occupation:</strong> {prop.tenantPreferences.occupation || "Any"}</p>

  <p><strong>Marital Status:</strong> {prop.tenantPreferences.maritalStatus}</p>

  <p><strong>Family:</strong> {prop.tenantPreferences.family}</p>

  <p><strong>Food Preference:</strong> {prop.tenantPreferences.foodPreference}</p>

  <p><strong>Smoking Allowed:</strong> 
    {prop.tenantPreferences.smoking ? "Yes" : "No"}
  </p>

  <p><strong>Alcohol Allowed:</strong> 
    {prop.tenantPreferences.alcohol ? "Yes" : "No"}
  </p>

  <p><strong>Pets Allowed:</strong> 
    {prop.tenantPreferences.pets ? "Yes" : "No"}
  </p>

  <p><strong>Nationality:</strong> 
    {prop.tenantPreferences.nationality || "Any"}
  </p>

  <p><strong>Working Shift:</strong> 
    {prop.tenantPreferences.workingShift}
  </p>

  <p><strong>Professional Status:</strong> 
    {prop.tenantPreferences.professionalStatus}
  </p>

  <p><strong>Religion:</strong> 
    {prop.tenantPreferences.religion}
  </p>

  <p><strong>Language:</strong> 
    {prop.tenantPreferences.language}
  </p>

  <p><strong>Min Stay Duration:</strong> 
    {prop.tenantPreferences.minStayDuration || 0} months
  </p>

  <p><strong>Max People Allowed:</strong> 
    {prop.tenantPreferences.maxPeopleAllowed || 0}
  </p>

  {prop.tenantPreferences.notes && (
    <p><strong>Notes:</strong> {prop.tenantPreferences.notes}</p>
  )}
</div>

          <button onClick={() =>
  navigate(`/editpreferences/${prop.email}/${prop.name}`)
}>
  Edit Preferences
</button>

        </div>
      ))}
    </div>
  );
};

export default MyProperties;
