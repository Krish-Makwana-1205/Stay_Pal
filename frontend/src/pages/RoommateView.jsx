import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSingleTenant, applyForRoommate } from "../api/roommate";
import "../StyleSheets/PropertyView.css";

export default function RoommateView() {
  const { email } = useParams();
  const navigate = useNavigate();

  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyLoading, setApplyLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchSingleTenant(email);
        setTenant(res.data.tenant || res.data.data || res.data);
      } catch (err) {
        console.error("Error fetching tenant:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [email]);

  if (loading) return <h2 className="pv-loading">Loading profile...</h2>;
  if (!tenant) return <h2 className="pv-loading">Profile not found.</h2>;

  const imagePrefs = [
    { key: "nightOwl", label: "Night Owl", img: "/nightOwl.png" },
    { key: "earlybird", label: "Early Bird", img: "/earlybird.png" },
    { key: "studious", label: "Studious", img: "/studious.png" },
    { key: "fitness_freak", label: "Fitness Freak", img: "/fitness_freak.png" },
    { key: "sporty", label: "Sporty", img: "/sporty.png" },
    { key: "traveller", label: "Traveller", img: "/traveller.png" },
    { key: "party_lover", label: "Party Lover", img: "/party_lover.png" },
    { key: "music_lover", label: "Music Lover", img: "/music_lover.png" },
    { key: "Pet_lover", label: "Pet Lover", img: "/pet_lover.png" },
  ];

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="pv-wrapper pv-profile-container">
      {/* HEADER */}
      <div className="pv-header-box">
        <h2 className="pv-page-title pv-profile-title">{tenant.username || "Roommate Profile"}</h2>
      </div>

      {/* CARD */}
      <div className="pv-property-card pv-profile-card">
        {/* HEADER ROW */}
        <div className="pv-card-header pv-profile-card-header">
          <h3 className="pv-profile-card-title">{tenant.username || tenant.name}</h3>

          <button
            className="pv-action-btn pv-edit-btn pv-small pv-profile-btn pv-profile-btn-accent"
            onClick={() => navigate(`/chat/${tenant.email}`)}
          >
            Chat With Them
          </button>
        </div>

        {/* BODY */}
        <div className="pv-card-body pv-profile-body">
          {/* PROFILE PHOTO */}
          <div className="pv-image-wrapper pv-profile-image-box">
            {tenant.profilePhoto ? (
              <img
                src={tenant.profilePhoto}
                alt={tenant.username}
                className="pv-profile-img"
              />
            ) : (
              <div className="pv-photo-placeholder" style={{ 
                width: "100%", 
                height: "300px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                background: "#f0f0f0",
                color: "#999"
              }}>
                NO PHOTO
              </div>
            )}
          </div>

          {/* DETAILS GRID */}
          <div className="pv-details-grid pv-profile-grid">
            <p><strong>Gender:</strong> {tenant.gender || "Not specified"}</p>
            <p><strong>Age:</strong> {calculateAge(tenant.dob)}</p>

            <p><strong>Hometown:</strong> {tenant.hometown || "Not specified"}</p>
            <p><strong>Nationality:</strong> {tenant.nationality || "Not specified"}</p>

            <p><strong>Food Preference:</strong> {tenant.foodPreference || "Any"}</p>
            <p><strong>Religion:</strong> {tenant.religion || "Any"}</p>

            <p><strong>Professional Status:</strong> {tenant.professionalStatus || tenant.professional_status || "Any"}</p>
            <p><strong>Working Shifts:</strong> {tenant.workingshifts || "Any"}</p>

            <p><strong>Marital Status:</strong> {tenant.maritalStatus || "Any"}</p>
            <p><strong>Language:</strong> {tenant.language || "Any"}</p>

            <p><strong>Work Place:</strong> {tenant.workPlace || "Any"}</p>
            <p><strong>Min Stay Duration:</strong> {tenant.minStayDuration >= 0 ? `${tenant.minStayDuration} months` : "Not specified"}</p>

            <p><strong>Email:</strong> {tenant.email}</p>
          </div>

          {/* HABITS */}
          <div className="pv-description-box pv-profile-desc-box">
            <strong>Habits:</strong>
            <div style={{ display: "flex", gap: "15px", marginTop: "10px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <img src="/no_alcohol.png" alt="Alcohol" style={{ width: "24px", height: "24px" }} />
                <span>{tenant.alcohol ? "Allows Alcohol" : "No Alcohol"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <img src="/no_smoking.png" alt="Smoking" style={{ width: "24px", height: "24px" }} />
                <span>{tenant.smoker ? "Smoker" : "No Smoking"}</span>
              </div>
            </div>
          </div>

          {/* PERSONALITY PREFERENCES */}
          <div className="pv-description-box pv-profile-desc-box">
            <strong>Personality:</strong>
            <div style={{ display: "flex", gap: "15px", marginTop: "10px", flexWrap: "wrap" }}>
              {imagePrefs.map((pref) => (
                <div 
                  key={pref.key} 
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "5px",
                    opacity: tenant[pref.key] ? 1 : 0.3,
                    padding: "4px 8px",
                    border: tenant[pref.key] ? "2px solid #4CAF50" : "1px solid #ddd",
                    borderRadius: "8px",
                    background: tenant[pref.key] ? "#e8f5e9" : "#f9f9f9"
                  }}
                >
                  <img src={pref.img} alt={pref.label} style={{ width: "24px", height: "24px" }} />
                  <span style={{ fontSize: "0.9rem" }}>{pref.label}</span>
                  {tenant[pref.key] && <span style={{ color: "#4CAF50", marginLeft: "4px" }}>✓</span>}
                </div>
              ))}
            </div>
          </div>

          {/* HOBBIES */}
          {tenant.hobbies?.length > 0 && (
            <div className="pv-description-box pv-profile-desc-box">
              <strong>Hobbies:</strong>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                {tenant.hobbies.map((hobby, idx) => (
                  <span key={idx} style={{ 
                    padding: "4px 10px", 
                    background: "#e8f4f8", 
                    borderRadius: "4px",
                    fontSize: "0.9rem"
                  }}>
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ALLERGIES */}
          {tenant.allergies?.length > 0 && (
            <div className="pv-description-box pv-profile-desc-box">
              <strong>Allergies:</strong>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                {tenant.allergies.map((allergy, idx) => (
                  <span key={idx} style={{ 
                    padding: "4px 10px", 
                    background: "#ffe8e8", 
                    borderRadius: "4px",
                    fontSize: "0.9rem"
                  }}>
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* DESCRIPTION */}
          <div className="pv-description-box pv-profile-desc-box">
            <strong>About:</strong> {tenant.description || tenant.descriptions || "No description provided."}
          </div>

          {/* SEND REQUEST BUTTON */}
          <button
            className="pv-primary-btn pv-profile-btn pv-profile-btn-primary"
            disabled={applyLoading}
            onClick={async () => {
              try {
                setApplyLoading(true);

                const payload = {
                  recipientEmail: tenant.email,
                };

                await applyForRoommate(payload);
                alert("Roommate request sent!");
              } catch (err) {
                console.error(err);
                alert(err?.response?.data?.message || "Failed to send request.");
              } finally {
                setApplyLoading(false);
              }
            }}
          >
            {applyLoading ? "Sending..." : "Send Roommate Request"}
          </button>
        </div>
      </div>
    </div>
  );
}