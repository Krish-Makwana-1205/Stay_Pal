import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { searchRoommatesParams, applyForRoommate } from "../api/roommate";
import "../StyleSheets/SearchRoommates.css"; 

export default function ViewRoommates() {
  const { city: routeCity } = useParams();
  const navigate = useNavigate();

  
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

  const [filters, setFilters] = useState({
    city: "",
    gender: "Any",
    minAge: "",
    maxAge: "",
    foodPreference: "Any",
    hobbies: "", 
    description: "",
    religion: "",
    alcohol: false,
    smoking: false,
    nationality: "",
    professionalStatus: "Any",
    maritalStatus: "Any",
    family: false,
    language: "",
    allergies: "",
    minStayDuration: "",
    
    
    nightOwl: false,
    earlybird: false,
    Pet_lover: false,
    fitness_freak: false,
    studious: false,
    party_lover: false,
    sporty: false,       
    traveller: false,    
    music_lover: false,  
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [applyLoading, setApplyLoading] = useState({});

  useEffect(() => {
    if (routeCity) {
      setFilters((s) => ({ ...s, city: routeCity }));
      setTimeout(() => submit({ preventDefault: () => {} }), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeCity]);

  // General Change Handler
  const handleChange = (k) => (e) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setFilters((s) => ({ ...s, [k]: value }));
  };

  // Specific Toggle Handler for Icon Grid
  const togglePref = (key) => {
    setFilters((s) => ({ ...s, [key]: !s[key] }));
  };

  async function submitRoommateSearch(filtersForm) {
    const params = {
      city: (filtersForm.city || "").trim().toLowerCase(),
      gender: filtersForm.gender && filtersForm.gender !== "Any" ? filtersForm.gender : undefined,
      minAge: filtersForm.minAge ? Number(filtersForm.minAge) : undefined,
      maxAge: filtersForm.maxAge ? Number(filtersForm.maxAge) : undefined,
      foodPreference: filtersForm.foodPreference && filtersForm.foodPreference !== "Any" ? filtersForm.foodPreference : undefined,
      religion: filtersForm.religion && filtersForm.religion !== "Any" ? filtersForm.religion : undefined,
      alcohol: typeof filtersForm.alcohol === "boolean" ? filtersForm.alcohol : undefined,
      smoking: typeof filtersForm.smoking === "boolean" ? filtersForm.smoking : undefined,
      nationality: filtersForm.nationality || undefined,
      professionalStatus: filtersForm.professionalStatus && filtersForm.professionalStatus !== "Any" ? filtersForm.professionalStatus : undefined,
      maritalStatus: filtersForm.maritalStatus && filtersForm.maritalStatus !== "Any" ? filtersForm.maritalStatus : undefined,
      family: typeof filtersForm.family === "boolean" ? filtersForm.family : undefined,
      language: filtersForm.language || undefined,
      minStayDuration: filtersForm.minStayDuration ? Number(filtersForm.minStayDuration) : undefined,
      description: filtersForm.description || undefined,
      
      hobbies: Array.isArray(filtersForm.hobbies) ? filtersForm.hobbies : filtersForm.hobbies ? filtersForm.hobbies.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
      allergies: Array.isArray(filtersForm.allergies) ? filtersForm.allergies : filtersForm.allergies ? filtersForm.allergies.split(",").map((s) => s.trim()).filter(Boolean) : undefined,

      nightOwl: typeof filtersForm.nightOwl === "boolean" ? filtersForm.nightOwl : undefined,
      earlybird: typeof filtersForm.earlybird === "boolean" ? filtersForm.earlybird : undefined,
      Pet_lover: typeof filtersForm.Pet_lover === "boolean" ? filtersForm.Pet_lover : undefined,
      fitness_freak: typeof filtersForm.fitness_freak === "boolean" ? filtersForm.fitness_freak : undefined,
      studious: typeof filtersForm.studious === "boolean" ? filtersForm.studious : undefined,
      party_lover: typeof filtersForm.party_lover === "boolean" ? filtersForm.party_lover : undefined,
      sporty: typeof filtersForm.sporty === "boolean" ? filtersForm.sporty : undefined,
      traveller: typeof filtersForm.traveller === "boolean" ? filtersForm.traveller : undefined,
      music_lover: typeof filtersForm.music_lover === "boolean" ? filtersForm.music_lover : undefined,
    };

    Object.keys(params).forEach((k) => params[k] === undefined && delete params[k]);

    const res = await searchRoommatesParams(params);
    const payload = res?.data ?? res;

    // Normalization logic
    if (Array.isArray(payload)) return { arr: payload, raw: res };
    const candidates = payload?.data ?? payload?.roommates ?? payload?.tenants ?? payload?.results;
    if (Array.isArray(candidates)) return { arr: candidates, raw: res };

    if (payload && typeof payload === "object") {
      for (const k of Object.keys(payload)) {
        if (Array.isArray(payload[k])) return { arr: payload[k], raw: res };
      }
      const numericKeys = Object.keys(payload).filter((k) => /^\d+$/.test(k));
      if (numericKeys.length > 0) {
        const arr = numericKeys.sort((a,b)=>a-b).map((k) => payload[k]);
        return { arr, raw: res };
      }
      const maybeTenant = Object.keys(payload).length > 0 && (payload.email || payload._id || payload.username);
      if (maybeTenant) return { arr: [payload], raw: res };
    }
    return { arr: [], raw: res };
  }

  const submit = async (e) => {
    e?.preventDefault?.();
    if (!filters.city || filters.city.trim() === "") {
      setError("City is required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { arr: data } = await submitRoommateSearch(filters);
      
      const normalized = Array.isArray(data)
        ? data.map((r) => ({
            ...r,
            hobbies: Array.isArray(r.hobbies) ? r.hobbies : (r.hobbies ? (typeof r.hobbies === "string" ? r.hobbies.split(",").map(s => s.trim()).filter(Boolean) : []) : []),
            allergies: Array.isArray(r.allergies) ? r.allergies : (r.allergies ? (typeof r.allergies === "string" ? r.allergies.split(",").map(s => s.trim()).filter(Boolean) : []) : []),
            gender: r.gender ?? r.sex ?? r.Gender ?? "",
            email: r.email ?? r.emailId ?? r.contact ?? "",
            username: r.username ?? r.name ?? r.fullName ?? "",
            description: r.description ?? r.descriptions ?? ""
          }))
        : [];

      if (normalized.length === 0 && Array.isArray(data) && data.length > 0) {
        setResults(data);
      } else {
        setResults(normalized);
      }
    } catch (err) {
      console.error("Roommate search error:", err);
      setError(err?.response?.data?.message || err?.message || "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      city: "",
      gender: "Any",
      minAge: "",
      maxAge: "",
      foodPreference: "Any",
      hobbies: "",
      description: "",
      religion: "",
      alcohol: false,
      smoking: false,
      nationality: "",
      professionalStatus: "Any",
      maritalStatus: "Any",
      family: false,
      language: "",
      allergies: "",
      minStayDuration: "",
      nightOwl: false,
      earlybird: false,
      Pet_lover: false,
      fitness_freak: false,
      studious: false,
      party_lover: false,
      sporty: false,
      traveller: false,
      music_lover: false,
    });
    setResults([]);
    setError("");
  };

  return (
    <div className="vm-page">
      <div className="vm-content-wrapper">
        
        {/* LEFT FILTERS */}
        <aside className="vm-filters-panel">
          <h2 className="vm-filters-title">Filters</h2>

          <div className="vm-filter-group">
            <label className="vm-filter-label">City *</label>
            <input className="vm-filter-input" value={filters.city} onChange={handleChange('city')} placeholder="e.g. Mumbai" />
          </div>

          <div className="vm-filter-group">
            <label className="vm-filter-label">Gender</label>
            <select className="vm-filter-select" value={filters.gender} onChange={handleChange('gender')}>
              <option>Any</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="vm-filter-group">
            <div className="vm-row-inputs">
              <div style={{flex: 1}}>
                <label className="vm-filter-label">Min age</label>
                <input className="vm-filter-input" value={filters.minAge} onChange={handleChange('minAge')} />
              </div>
              <div style={{flex: 1}}>
                <label className="vm-filter-label">Max age</label>
                <input className="vm-filter-input" value={filters.maxAge} onChange={handleChange('maxAge')} />
              </div>
            </div>
          </div>

          <div className="vm-filter-group">
            <label className="vm-filter-label">Food Preference</label>
            <select className="vm-filter-select" value={filters.foodPreference} onChange={handleChange('foodPreference')}>
              <option>Any</option>
              <option>Veg</option>
              <option>Non-Veg</option>
              <option>Vegan</option>
              <option>Jain</option>
            </select>
          </div>

          <div className="vm-filter-group">
            <label className="vm-filter-label">Hobbies</label>
            <input className="vm-filter-input" value={filters.hobbies} onChange={handleChange('hobbies')} placeholder="e.g. Reading" />
          </div>

          <div className="vm-filter-group">
            <label className="vm-filter-label" style={{marginBottom:'10px'}}>Personality</label>
            <div className="vm-pref-grid">
              {imagePrefs.map((pref) => (
                <button
                  key={pref.key}
                  type="button"
                  className={`vm-pref-item ${filters[pref.key] ? "active" : ""}`}
                  onClick={() => togglePref(pref.key)}
                  title={pref.label}
                >
                  <img src={pref.img} alt={pref.label} />
                  <span>{pref.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Lifestyle Toggles (Alcohol, Smoking, Family) */}
          <div className="vm-filter-group">
            <label className="vm-filter-label">Lifestyle</label>
            <div className="vm-checkbox-group">
              <label className="vm-checkbox-label">
                <input type="checkbox" checked={filters.alcohol} onChange={handleChange('alcohol')} /> 
                Alcohol
              </label>
              <label className="vm-checkbox-label">
                <input type="checkbox" checked={filters.smoking} onChange={handleChange('smoking')} /> 
                Smoking
              </label>
              <label className="vm-checkbox-label">
                <input type="checkbox" checked={filters.family} onChange={handleChange('family')} /> 
                Family
              </label>
            </div>
          </div>

          <div className="vm-filter-group">
            <label className="vm-filter-label">Min stay (months)</label>
            <input className="vm-filter-input" value={filters.minStayDuration} onChange={handleChange('minStayDuration')} />
          </div>

          <div className="vm-btn-row">
            <button className="vm-btn-primary" onClick={submit} disabled={loading}>{loading ? 'Searching...' : 'Search'}</button>
            <button className="vm-btn-secondary" onClick={resetFilters}>Reset</button>
          </div>

          {error && <div style={{color:'red',marginTop:15, textAlign:'center'}}>{error}</div>}
        </aside>

        {/* RIGHT RESULTS */}
        <main className="vm-results-container">
          <div className="vm-results-card">
            <h2 className="vm-results-heading">Results {filters.city ? `for ${filters.city}` : ''}</h2>

            {loading && <div style={{textAlign:'center', padding:20, fontStyle:'italic'}}>Searching candidates...</div>}
            
            {!loading && results.length === 0 && (
              <div className="vm-no-results">
                No roommates found matching these criteria.
              </div>
            )}

            {results.map((t) => (
              <div
                className="vm-mate-card"
                key={t.email || Math.random()}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/roommate/${t.email}`)}
              >
                <img 
                  src={t.imgLink?.[0] || "https://via.placeholder.com/150?text=No+Img"} 
                  alt={t.username} 
                  className="vm-mate-img"
                  onError={(e) => {e.target.src = "https://via.placeholder.com/150?text=No+Img"}}
                />

                <div className="vm-mate-content">
                  <h4 className="vm-mate-name">{t.username || t.name || "Unnamed"}</h4>
                  <div className="vm-mate-details-grid">
                    <p><strong>Email:</strong> {t.email}</p>
                    <p><strong>Age:</strong> {t.age || "—"}</p>
                    <p><strong>Gender:</strong> {t.gender || "—"}</p>
                    <p><strong>Locality:</strong> {t.city || ""} {t.locality ? `• ${t.locality}` : ""}</p>
                    
                    {/* Display icons in result if they have the trait */}
                    <div style={{gridColumn: '1 / -1', display:'flex', gap:'5px', flexWrap:'wrap', marginTop:'5px'}}>
                        {imagePrefs.map(pref => t[pref.key] && (
                           <span key={pref.key} style={{fontSize:'0.75rem', background:'#eee', padding:'2px 6px', display:'flex', alignItems:'center', gap:'4px', border:'1px solid #ccc'}}>
                               <img src={pref.img} alt="" style={{width:'14px', height:'14px'}}/> {pref.label}
                           </span>
                        ))}
                    </div>
                  </div>

                  {t.description && (
                    <p className="vm-mate-desc">"{t.description}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}