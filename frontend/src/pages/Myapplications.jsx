import React, { useEffect, useState } from "react";
import { fetchMyApplications } from "../api/filters";
import { useNavigate } from "react-router-dom";
import "../StyleSheets/Myapplications.css"; 

export default function MyApplications() {
  const [apps, setApps] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchMyApplications();
        setApps(res.data?.data ?? []);
      } catch (err) {
        console.error(err);
        setApps([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Helper for consistent data rows using new classes
  const DataField = ({ label, value }) => (
    <div className="my-apps-data-row">
      <span className="my-apps-data-label">{label}</span>
      <span className="my-apps-data-value">{value || "N/A"}</span>
    </div>
  );

  if (loading) return (
    <div className="my-apps-wrapper">
      <h2 className="my-apps-loading">Loading...</h2>
    </div>
  );

  return (
    <div className="my-apps-wrapper">
      <div className="my-apps-container">
        
        {/* Header */}
        <div className="my-apps-header">
          <h2 className="my-apps-title">My Applications</h2>
          <button className="my-apps-btn" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>

        {/* Empty State */}
        {apps && apps.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
             <h3 className="my-apps-empty">No applications found.</h3>
          </div>
        ) : (
          /* Grid Layout */
          <div className="my-apps-grid">
            {apps.map((item, index) => {
              const prop = item.property || {};
              
              return (
                <div key={index} className="my-apps-card">
                  {/* Decorative Bar */}
                  <div className="my-apps-card-deco"></div>

                  <div className="my-apps-card-body">
                    
                    {/* Header Section: Photo + Name */}
                    <div
                      className="my-apps-card-header"
                      style={{ cursor: prop?.email && prop?.name ? "pointer" : "default" }}
                      onClick={() => {
                        if (prop?.email && prop?.name) {
                          navigate(`/property/${prop.email}/${prop.name}`);
                        }
                      }}
                    >
                        <div className="my-apps-photo-frame">
                          <img 
                            src={prop?.imgLink && prop.imgLink.length > 0 ? prop.imgLink[0] : "https://cdn-icons-png.flaticon.com/512/609/609803.png"}
                            alt={prop.name || "Property Image"} 
                            className="my-apps-photo"
                            style={{ padding: '15px' }} 
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://cdn-icons-png.flaticon.com/512/609/609803.png" }}
                          />
                        </div>
                        <div>
                             <h3 className="my-apps-card-title">{prop.name || "Unknown Property"}</h3>
                             <p className="my-apps-card-subtitle">{prop.city || "Unknown City"}</p>
                        </div>
                    </div>

                    {/* Data Fields */}
                    <DataField label="Owner Email" value={prop.email} />
                    <DataField 
                        label="Applied At" 
                        value={new Date(item.appliedAt).toLocaleString()} 
                    />

                    {/* Chat Action Button */}
                    <div style={{ marginTop: "25px" }}>
                        <button 
                            className="my-apps-btn" 
                            style={{ width: "100%", textAlign: "center" }}
                            onClick={() => navigate(`/chat/${prop.email}`)}
                        >
                            Chat with Owner
                        </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}