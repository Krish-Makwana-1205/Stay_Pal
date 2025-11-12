import React, { useEffect, useState } from "react";
import { fetchMyProperties } from "../api/property";

const MyProperties = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchMyProperties()
      .then((res) => {
        setProperties(res.data.properties || []);
      })
      .catch((err) => console.log(err));
  }, []);

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

          <p><strong>Created At:</strong> {new Date(prop.createdAt).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(prop.updatedAt).toLocaleString()}</p>

          <hr style={{ margin: "20px 0" }} />

          {/* Tenant Preferences */}
          <h4>Tenant Preferences</h4>
          <div style={{ paddingLeft: "10px" }}>
            <p><strong>Gender:</strong> {prop.tenantPreferences.gender}</p>
            <p><strong>Food Preference:</strong> {prop.tenantPreferences.foodPreference}</p>
            <p><strong>Family Type:</strong> {prop.tenantPreferences.family}</p>
            <p><strong>Language:</strong> {prop.tenantPreferences.language}</p>
            <p><strong>Alcohol Allowed:</strong> {prop.tenantPreferences.alcohol ? "Yes" : "No"}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyProperties;
