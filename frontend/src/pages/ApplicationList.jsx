import { useParams } from "react-router-dom";
import { getApplications } from "../api/filters";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../StyleSheets/ApplicationList.css";

import Header from '../Components/Header';

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

  const DataField = ({ label, value }) => (
    <div className="app-data-row">
      <span className="app-data-label">{label}</span>
      <span className="app-data-value">{value || "N/A"}</span>
    </div>
  );

  const BooleanTag = ({ label, isTrue }) => (
    <div className={`app-tag ${isTrue ? "is-positive" : "is-negative"}`}>
      {label}
    </div>
  );

  if (loading) return <div className="app-list-wrapper"><h2 className="app-loading">Loading...</h2></div>;
  
  return (
    <div className="app-list-wrapper">
      <div className="app-content-container">
        
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
              const t = a.tenant || {};
              
              const photoUrl = t.profilePhoto || "https://via.placeholder.com/150x150.png?text=No+Photo";

              // Compute match percentage: prefer match/dif if available, otherwise map score to 0-100
              const match = typeof a.match === 'number' ? a.match : 0;
              const dif = typeof a.dif === 'number' ? a.dif : 0;
              let percent = 50;
              if (match + dif > 0) {
                percent = Math.round((match / (match + dif)) * 100);
              } else if (typeof a.score === 'number') {
                // map score (which can be negative) to a sigmoid 0-100
                const mapped = 100 / (1 + Math.exp(-a.score / 3));
                percent = Math.round(mapped);
              }

              return (
                <div key={i} className="app-tenant-card">
                  <div className="app-card-deco"></div>
                  
                  <div className="app-card-body">
                    
                    <div className="app-card-header-flex">
                        <div className="app-photo-frame">
                            <img 
                                src={photoUrl} 
                                alt={t.username} 
                                className="app-photo-img"
                                // Fallback if the provided image URL is broken
                                onError={(e) => {e.target.onerror = null; e.target.src="https://via.placeholder.com/150x150.png?text=Error";}}
                            />
                        </div>
                        <div>
                             <h3 className="app-card-title">{t.username || "Unknown Tenant"}</h3>
                             <p className="app-card-subtitle">{t.professionalStatus || "Applicant"}</p>
                        </div>
                    </div>

                    {/* Match Score Meter */}
                    <div style={{ marginTop: 12, marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div className="app-score-label">Match Score</div>
                          <div className="app-score-meter" aria-hidden>
                            <div
                              className="app-score-fill"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                        <div className="app-score-percent">{percent}%</div>
                      </div>
                    </div>


                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <DataField label="Email" value={t.email} />
                      <DataField label="Phone" value={t.phone || "--"} />
                      <DataField label="Gender" value={t.gender} />
                      <DataField label="Nationality" value={t.nationality} />
                      <DataField label="Marital" value={t.maritalStatus} />
                    </div>

                    <DataField 
                        label="Hometown" 
                        value={t.hometown} 
                    />

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

                    <div className="app-data-row">
                        <span className="app-data-label">Hobbies</span>
                        <span className="app-data-value">
                            {t.hobbies?.length ? t.hobbies.join(", ") : "None listed"}
                        </span>
                    </div>

                    <div className="app-desc-box">
                      "{t.description || "No description provided."}"
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