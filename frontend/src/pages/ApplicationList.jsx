import { useParams } from "react-router-dom";
import { getApplications } from "../api/filters";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../StyleSheets/ApplicationList.css"; 

export default function ApplicationList() {
  const { propertyName } = useParams();
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await getApplications(propertyName);
        setApps(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [propertyName]);

  // Helper component to display data fields uniformly
  const DataField = ({ label, value }) => (
    <div className="app-data-row">
      <span className="app-data-label">{label}</span>
      <span className="app-data-value">{value || "N/A"}</span>
    </div>
  );

  // Helper to render boolean tags
  const BooleanTag = ({ label, isTrue }) => (
    <div className={`app-tag ${isTrue ? "is-positive" : "is-negative"}`}>
      {label}
    </div>
  );

  if (loading) return <div className="app-list-wrapper"><h2 className="app-loading">Loading...</h2></div>;
  
  return (
    <div className="app-list-wrapper">
      <div className="app-content-container">
        
        {/* Header Row */}
        <div className="app-header-row">
          <h2 className="app-main-heading">
            Applications: {propertyName}
          </h2>
          <button className="app-nav-btn" onClick={() => navigate("/my-chats")}>
            View Chats
          </button>
        </div>

        {apps.length === 0 ? (
          <h3 className="app-empty">No applications yet.</h3>
        ) : (
          <div className="app-cards-grid">
            {apps.map((a, i) => {
              const t = a.tenant || {}; // Shorten reference
              
              return (
                <div key={i} className="app-tenant-card">
                  {/* Decorative Bar */}
                  <div className="app-card-deco"></div>
                  
                  <div className="app-card-body">
                    <h3 className="app-card-title">{t.name || "Unknown Tenant"}</h3>

                    {/* Basic Info Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <DataField label="Email" value={t.email} />
                      <DataField label="Phone" value={t.phone || "--"} />
                      <DataField label="Gender" value={t.gender} />
                      <DataField label="Nationality" value={t.nationality} />
                      <DataField label="Status" value={t.professionalStatus} />
                      <DataField label="Marital" value={t.maritalStatus} />
                    </div>

                    <DataField 
                        label="Hometown" 
                        value={t.hometown} 
                    />

                    {/* Lifestyle / Boolean Tags Section */}
                    <div className="app-tags-container">
                        <BooleanTag label="Smoker" isTrue={t.smoker} />
                        <BooleanTag label="Drinker" isTrue={t.alcohol} />
                        <BooleanTag label="Pet Lover" isTrue={t.Pet_lover} />
                        <BooleanTag label="Night Owl" isTrue={t.nightOwl} />
                        <BooleanTag label="Early Bird" isTrue={t.earlybird} />
                        <BooleanTag label="Music" isTrue={t.music_lover} />
                        <BooleanTag label="Fitness" isTrue={t.fitness_freak} />
                        <BooleanTag label="Party" isTrue={t.party_lover} />
                    </div>

                    {/* Array Data */}
                    <div className="app-data-row">
                        <span className="app-data-label">Hobbies</span>
                        <span className="app-data-value">
                            {t.hobbies?.length ? t.hobbies.join(", ") : "None listed"}
                        </span>
                    </div>

                    {/* Description */}
                    <div className="app-desc-box">
                      "{t.description || "No description provided."}"
                    </div>

                    <span className="app-timestamp">
                      Applied: {new Date(a.appliedAt).toLocaleString()}
                    </span>
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