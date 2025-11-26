// ViewRoommates.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { searchRoommatesParams, applyForRoommate } from "../api/roommate";
import "../StyleSheets/PropertyView.css"; // final CSS — place the CSS file at this path

export default function ViewRoommates() {
  const { city: routeCity } = useParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    city: "",
    gender: "Any",
    minAge: "",
    maxAge: "",
    foodPreference: "Any",
    hobbies: "", // comma-separated
    description: "",
    religion: "",
    alcohol: false,
    smoking: false,
    nationality: "",
    nightOwl: false,
    earlybird: false,
    Pet_lover: false,
    professionalStatus: "Any",
    maritalStatus: "Any",
    family: false,
    language: "",
    fitness_freak: false,
    studious: false,
    party_lover: false,
    allergies: "",
    minStayDuration: "",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [applyLoading, setApplyLoading] = useState({});

  useEffect(() => {
    if (routeCity) {
      setFilters((s) => ({ ...s, city: routeCity }));
      setTimeout(() => submit({ preventDefault: () => {} }), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeCity]);

  const handleChange = (k) => (e) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setFilters((s) => ({ ...s, [k]: value }));
  };

  // robust extractor — tries several common shapes and falls back to first array found in response
  function extractArrayFromResponse(res) {
    if (!res) return [];
    // direct array
    if (Array.isArray(res)) return res;
    // axios response object
    const payload = res.data ?? res;
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.data)) return payload.data;
    // common wrappers
    if (payload && Array.isArray(payload.roommates)) return payload.roommates;
    if (payload && Array.isArray(payload.tenants)) return payload.tenants;
    if (payload && Array.isArray(payload.results)) return payload.results;
    // find first array value anywhere in payload object
    if (payload && typeof payload === "object") {
      for (const k of Object.keys(payload)) {
        if (Array.isArray(payload[k])) return payload[k];
      }
    }
    return [];
  }

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
      hobbies: Array.isArray(filtersForm.hobbies)
        ? filtersForm.hobbies
        : filtersForm.hobbies
        ? filtersForm.hobbies.split(",").map((s) => s.trim()).filter(Boolean)
        : undefined,
      nationality: filtersForm.nationality || undefined,
      nightOwl: typeof filtersForm.nightOwl === "boolean" ? filtersForm.nightOwl : undefined,
      earlybird: typeof filtersForm.earlybird === "boolean" ? filtersForm.earlybird : undefined,
      Pet_lover: typeof filtersForm.Pet_lover === "boolean" ? filtersForm.Pet_lover : undefined,
      professionalStatus: filtersForm.professionalStatus && filtersForm.professionalStatus !== "Any" ? filtersForm.professionalStatus : undefined,
      maritalStatus: filtersForm.maritalStatus && filtersForm.maritalStatus !== "Any" ? filtersForm.maritalStatus : undefined,
      family: typeof filtersForm.family === "boolean" ? filtersForm.family : undefined,
      language: filtersForm.language || undefined,
      fitness_freak: typeof filtersForm.fitness_freak === "boolean" ? filtersForm.fitness_freak : undefined,
      studious: typeof filtersForm.studious === "boolean" ? filtersForm.studious : undefined,
      party_lover: typeof filtersForm.party_lover === "boolean" ? filtersForm.party_lover : undefined,
      allergies: Array.isArray(filtersForm.allergies)
        ? filtersForm.allergies
        : filtersForm.allergies
        ? filtersForm.allergies.split(",").map((s) => s.trim()).filter(Boolean)
        : undefined,
      minStayDuration: filtersForm.minStayDuration ? Number(filtersForm.minStayDuration) : undefined,
      description: filtersForm.description || undefined,
    };

    Object.keys(params).forEach((k) => params[k] === undefined && delete params[k]);

    const res = await searchRoommatesParams(params);

    // DEBUG: full response shape (logged so you can paste it here)
    // eslint-disable-next-line no-console
    console.log("roommate search raw response (full):", res);

    // common payload targets
    const payload = res?.data ?? res;

    // normalize into an array when possible
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
      const { arr: data, raw } = await submitRoommateSearch(filters);

      // DEBUG: show both the extracted array and the raw payload in console
      // eslint-disable-next-line no-console
      console.log("roommate search extracted array:", data);
      // eslint-disable-next-line no-console
      console.log("roommate search raw payload (raw.data):", raw?.data ?? raw);

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

      // If normalization failed but backend returned items, use raw array
      if (normalized.length === 0 && Array.isArray(data) && data.length > 0) {
        setResults(data);
      } else {
        setResults(normalized);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Roommate search error:", err);
      setError(err?.response?.data?.message || err?.message || "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (recipientEmail) => {
    if (!recipientEmail) return;
    setApplyLoading((s) => ({ ...s, [recipientEmail]: true }));
    try {
      await applyForRoommate({ recipientEmail });
      alert("Roommate request sent.");
    } catch (err) {
      console.error("Apply failed:", err);
      alert(err?.response?.data?.message || "Failed to send request.");
    } finally {
      setApplyLoading((s) => ({ ...s, [recipientEmail]: false }));
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
      nightOwl: false,
      earlybird: false,
      Pet_lover: false,
      professionalStatus: "Any",
      maritalStatus: "Any",
      family: false,
      language: "",
      fitness_freak: false,
      studious: false,
      party_lover: false,
      allergies: "",
      minStayDuration: "",
    });
    setResults([]);
    setError("");
  };

  return (
    <div className="similar-wrapper" style={{display:'flex',gap:20,alignItems:'flex-start'}}>
      <aside style={{width:340}}>
        <h2 style={{marginTop:0}}>Filters</h2>

        <div style={{marginBottom:10}}>
          <label>City *<br />
            <input value={filters.city} onChange={handleChange('city')} placeholder="e.g. mumbai" />
          </label>
        </div>

        <div style={{marginBottom:8}}>
          <label>Gender<br />
            <select value={filters.gender} onChange={handleChange('gender')}>
              <option>Any</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </label>
        </div>

        <div style={{display:'flex',gap:8,marginBottom:8}}>
          <label>Min age<br /><input value={filters.minAge} onChange={handleChange('minAge')} /></label>
          <label>Max age<br /><input value={filters.maxAge} onChange={handleChange('maxAge')} /></label>
        </div>

        <div style={{marginBottom:8}}>
          <label>Food Preference<br />
            <select value={filters.foodPreference} onChange={handleChange('foodPreference')}>
              <option>Any</option>
              <option>Veg</option>
              <option>Non-Veg</option>
              <option>Vegan</option>
              <option>Jain</option>
            </select>
          </label>
        </div>

        <div style={{marginBottom:8}}>
          <label>Hobbies (comma separated)<br />
            <input value={filters.hobbies} onChange={handleChange('hobbies')} />
          </label>
        </div>

        <div style={{marginBottom:8}}>
          <label>Allergies (comma separated)<br />
            <input value={filters.allergies} onChange={handleChange('allergies')} />
          </label>
        </div>

        <div style={{marginBottom:8}}>
          <label>Nationality<br />
            <input value={filters.nationality} onChange={handleChange('nationality')} />
          </label>
        </div>

        <div style={{marginBottom:8}}>
          <label>Language<br />
            <input value={filters.language} onChange={handleChange('language')} />
          </label>
        </div>

        <div style={{marginBottom:8}}>
          <label>Religion<br />
            <input value={filters.religion} onChange={handleChange('religion')} />
          </label>
        </div>

        <div style={{marginBottom:8}}>
          <label>Professional Status<br />
            <select value={filters.professionalStatus} onChange={handleChange('professionalStatus')}>
              <option>Any</option>
              <option>Student</option>
              <option>Working</option>
              <option>Self-Employed</option>
              <option>Unemployed</option>
            </select>
          </label>
        </div>

        <div style={{marginBottom:8}}>
          <label>Marital Status<br />
            <select value={filters.maritalStatus} onChange={handleChange('maritalStatus')}>
              <option>Any</option>
              <option>Single</option>
              <option>Married</option>
              <option>Divorced</option>
            </select>
          </label>
        </div>

        <div style={{marginBottom:8}}>
          <label><input type="checkbox" checked={filters.alcohol} onChange={handleChange('alcohol')} /> Alcohol OK</label><br />
          <label><input type="checkbox" checked={filters.smoking} onChange={handleChange('smoking')} /> Smokes</label><br />
          <label><input type="checkbox" checked={filters.nightOwl} onChange={handleChange('nightOwl')} /> Night Owl</label><br />
          <label><input type="checkbox" checked={filters.earlybird} onChange={handleChange('earlybird')} /> Early Bird</label><br />
          <label><input type="checkbox" checked={filters.Pet_lover} onChange={handleChange('Pet_lover')} /> Pet Lover</label><br />
          <label><input type="checkbox" checked={filters.family} onChange={handleChange('family')} /> Family OK</label><br />
          <label><input type="checkbox" checked={filters.fitness_freak} onChange={handleChange('fitness_freak')} /> Fitness Freak</label><br />
          <label><input type="checkbox" checked={filters.studious} onChange={handleChange('studious')} /> Studious</label><br />
          <label><input type="checkbox" checked={filters.party_lover} onChange={handleChange('party_lover')} /> Party Lover</label>
        </div>

        <div style={{marginBottom:8}}>
          <label>Min stay duration (months)<br />
            <input value={filters.minStayDuration} onChange={handleChange('minStayDuration')} />
          </label>
        </div>

        <div style={{marginBottom:8}}>
          <label>Description (optional)<br />
            <textarea value={filters.description} onChange={handleChange('description')} rows={3} />
          </label>
        </div>

        <div style={{display:'flex',gap:8}}>
          <button onClick={submit} disabled={loading}>{loading ? 'Searching...' : 'Search'}</button>
          <button onClick={resetFilters}>Reset</button>
        </div>

        {error && <div style={{color:'red',marginTop:8}}>{error}</div>}
      </aside>

      <main style={{flex:1}}>
        <h2 style={{marginTop:0}}>Results {filters.city ? `for ${filters.city}` : ''}</h2>

        <div className="similar-wrapper">
          <div className="similar-list">
            {/* if you want horizontal cards you can map thumbnail-like items here; alternatively show vertical list below */}
          </div>
        </div>

        <div style={{marginTop:16}}>
          {loading && <div>Loading...</div>}
          {!loading && results.length === 0 && <div>No results found</div>}

          {results.map((t) => (
            <div
              className="similar-card"
              key={t.email || Math.random()}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/roommate/${t.email}`)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/roommate/${t.email}`); }}
              style={{ marginBottom: 12, cursor: "pointer" }}
            >
              {/* optional image */}
              {t.imgLink?.[0] && <img src={t.imgLink[0]} alt="" className="similar-img" />}

              <div className="similar-text">
                <h4 style={{ margin: "0 0 6px 0" }}>{t.username || t.name || "Unnamed"}</h4>
                <p style={{ margin: 0 }}><strong>Email:</strong> {t.email}</p>
                <p style={{ margin: 0 }}><strong>Age:</strong> {t.age || "—"} &nbsp; <strong>Gender:</strong> {t.gender || "—"}</p>
                <p className="similar-locality">{t.city || ""} {t.locality ? `• ${t.locality}` : ""}</p>

                <p style={{ marginTop: 8 }}><strong>Food:</strong> {t.foodPreference || "—"} | <strong>Nationality:</strong> {t.nationality || "—"}</p>

                <p style={{ marginTop: 8 }}><strong>Hobbies:</strong> {t.hobbies?.length ? t.hobbies.join(", ") : "—"}</p>
                <p style={{ marginTop: 8 }}><strong>Allergies:</strong> {t.allergies?.length ? t.allergies.join(", ") : "—"}</p>

                <p style={{ color: "#556", marginTop: 8 }}>{t.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

    </div>
  );
}
