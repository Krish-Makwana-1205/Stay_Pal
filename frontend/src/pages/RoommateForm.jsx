import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NumberInput from "../Components/NumberInput";
import Alert from "../Components/Alert";
import API from "../api/roommate";
import { useAuth } from "../context/AuthContext";
import "../StyleSheets/RoommateForm.css"; // Import the new CSS

export default function RoommateForm() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [rentLower, setRentLower] = useState("");
  const [rentUpper, setRentUpper] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [submitting, setSubmitting] = useState(false);

  const [serverListing, setServerListing] = useState(null);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // fetch server listing for current user
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    const fetchListing = async () => {
      setLoadingExisting(true);
      try {
        const res = await API.get("/listings", { withCredentials: true });
        const data = res?.data?.data ?? [];
        if (Array.isArray(data) && data.length > 0) {
          const r = data[0];
          setServerListing(r);
          setCity(r.city ?? "");
          setRentLower(String(r.rentlower ?? ""));
          setRentUpper(String(r.rentupper ?? ""));
          setIsEditing(false);
        } else {
          setServerListing(null);
          setCity("");
          setRentLower("");
          setRentUpper("");
          setIsEditing(false);
        }
      } catch (err) {
        console.error("Failed to fetch roommate listing:", err);
        setServerListing(null);
        setCity("");
        setRentLower("");
        setRentUpper("");
      } finally {
        setLoadingExisting(false);
      }
    };

    fetchListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  const isFormEditable = isEditing || !serverListing;

  const safeSetCity = (v) => { if (isFormEditable) setCity(v); };
  const safeSetRentLower = (v) => { if (isFormEditable) setRentLower(v); };
  const safeSetRentUpper = (v) => { if (isFormEditable) setRentUpper(v); };

  // CREATE
  const handleCreate = async () => {
    setMessage({ text: "", type: "" });
    const lower = Number(rentLower), upper = Number(rentUpper);

    if (!city || city.trim() === "") return setMessage({ text: "City required", type: "error" });
    if (Number.isNaN(lower) || Number.isNaN(upper)) return setMessage({ text: "Enter valid rents", type: "error" });

    setSubmitting(true);
    try {
      const payload = { city: city.trim().toLowerCase(), rentlower: lower, rentupper: upper };
      const res = await API.post("/add", payload, { withCredentials: true });

      if (res.status === 200 || res.status === 201) {
        const saved = { ...payload, email: user?.email ?? null };
        setServerListing(saved);
        setIsEditing(false);
        setMessage({ text: res.data?.message || "Listed successfully", type: "success" });
      } else {
        setMessage({ text: res.data?.message || "Unexpected response", type: "error" });
      }
    } catch (err) {
      console.error("Create failed:", err);
      setMessage({ text: err?.response?.data?.message || "Could not create listing", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  // UPDATE
  const handleUpdate = async () => {
    setMessage({ text: "", type: "" });
    const lower = Number(rentLower), upper = Number(rentUpper);

    if (!city || city.trim() === "") return setMessage({ text: "City required", type: "error" });
    if (Number.isNaN(lower) || Number.isNaN(upper)) return setMessage({ text: "Enter valid rents", type: "error" });

    setSubmitting(true);
    try {
      const newCity = city.trim().toLowerCase();
      const oldCity = (serverListing?.city || "").trim().toLowerCase();

      let res;
      if (oldCity && oldCity !== newCity) {
        await API.post("/delete", { city: oldCity }, { withCredentials: true });
        res = await API.post("/add", { city: newCity, rentlower: lower, rentupper: upper }, { withCredentials: true });
      } else {
        res = await API.post("/update", { city: newCity, rentlower: lower, rentupper: upper }, { withCredentials: true });
      }

      if (res.status === 200 || res.status === 201) {
        const saved = { city: newCity, rentlower: lower, rentupper: upper, email: user?.email ?? null };
        setServerListing(saved);
        setIsEditing(false);
        setMessage({ text: res.data?.message || "Updated successfully", type: "success" });
      } else {
        setMessage({ text: res.data?.message || "Unexpected response", type: "error" });
      }
    } catch (err) {
      console.error("Update failed:", err);
      setMessage({ text: err?.response?.data?.message || "Could not update", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  // DELETE
  const handleDelete = async () => {
    if (!window.confirm("Delete your roommate listing? This cannot be undone.")) return;
    setSubmitting(true);
    try {
      const payload = { city: (serverListing?.city || city || "").trim().toLowerCase() };
      const res = await API.post("/delete", payload, { withCredentials: true });

      if (res.status === 200) {
        setServerListing(null);
        setCity("");
        setRentLower("");
        setRentUpper("");
        setIsEditing(false);
        setMessage({ text: res.data?.message || "Deleted", type: "success" });
      } else {
        setMessage({ text: res.data?.message || "Delete failed", type: "error" });
      }
    } catch (err) {
      console.error("Delete failed:", err);
      setMessage({ text: err?.response?.data?.message || "Could not delete", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingExisting) return (
    <div className="rm-page-container">
      <div className="rm-card">
        <p style={{ textAlign: 'center', color: 'var(--rm-primary)' }}>Loading Data...</p>
      </div>
    </div>
  );

  return (
    <div className="rm-page-container">
      <div className="rm-header">
        <h2>List as Roommate</h2>
      </div>

      <div className="rm-card">
        
        <div style={{ marginBottom: "1rem" }}>
           <button className="rm-btn-secondary" onClick={() => navigate("/dashboard")}>← Dashboard</button>
        </div>

        {/* CTA when not listed */}
        {!serverListing && (
          <div className="rm-info-box dashed">
            <p className="rm-info-text">You have not listed yourself as a roommate yet.</p>
            <div style={{ marginTop: 15 }}>
              <button className="rm-btn-primary" onClick={() => setIsEditing(true)}>List Yourself</button>
            </div>
          </div>
        )}

        {/* View mode */}
        {serverListing && !isEditing && (
          <div className="rm-info-box solid">
            <label className="rm-label">Current Status</label>
            <p className="rm-info-text"><strong>City:</strong> <span style={{ textTransform: 'capitalize'}}>{serverListing.city || "—"}</span></p>
            <p className="rm-info-text"><strong>Rent Range:</strong> ₹{serverListing.rentlower ?? "—"} - ₹{serverListing.rentupper ?? "—"}</p>
            
            <div className="rm-btn-group" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
              <button className="rm-btn-secondary" onClick={() => setIsEditing(true)}>Edit Details</button>
              <button className="rm-btn-danger" onClick={handleDelete} disabled={submitting}>Delete Listing</button>
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isFormEditable) return;
            if (serverListing) handleUpdate();
            else handleCreate();
          }}
        >
          {/* Inputs Section */}
          <div className="rm-form-group">
            <label className="rm-label">City</label>
            <input
              className="rm-input"
              value={city}
              onChange={(e) => safeSetCity(e.target.value)}
              placeholder="Enter city"
              disabled={!isFormEditable}
            />
          </div>

          <div className="rm-row">
            <div className="rm-col">
              <label className="rm-label">Rent lower (₹)</label>
              <NumberInput
                className="rm-input" /* Ensure NumberInput accepts className or wraps input */
                value={rentLower}
                onChange={(e) => {
                  if (!isFormEditable) return;
                  const val = e?.target ? e.target.value : e;
                  setRentLower(val);
                }}
                disabled={!isFormEditable}
                readOnly={!isFormEditable}
                min={0}
              />
            </div>

            <div className="rm-col">
              <label className="rm-label">Rent upper (₹)</label>
              <NumberInput
                className="rm-input"
                value={rentUpper}
                onChange={(e) => {
                  if (!isFormEditable) return;
                  const val = e?.target ? e.target.value : e;
                  setRentUpper(val);
                }}
                disabled={!isFormEditable}
                readOnly={!isFormEditable}
                min={0}
              />
            </div>
          </div>

          {message.text && (
            <div style={{ marginBottom: 20 }}>
              <Alert message={message.text} type={message.type} onClose={() => setMessage({ text: "", type: "" })} autoClose={5000} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="rm-btn-group">
            {!serverListing && isEditing && (
              <>
                <button type="submit" className="rm-btn-primary" disabled={submitting}>
                  {submitting ? "Saving..." : "Create Listing"}
                </button>
                <button 
                  type="button" 
                  className="rm-btn-secondary" 
                  onClick={() => { setIsEditing(false); setCity(""); setRentLower(""); setRentUpper(""); }}
                >
                  Cancel
                </button>
              </>
            )}

            {serverListing && isEditing && (
              <>
                <button type="submit" className="rm-btn-primary" disabled={submitting}>
                  {submitting ? "Updating..." : "Update Listing"}
                </button>
                <button 
                  type="button" 
                  className="rm-btn-secondary" 
                  onClick={() => { 
                    setIsEditing(false); 
                    setCity(serverListing.city || ""); 
                    setRentLower(String(serverListing.rentlower ?? "")); 
                    setRentUpper(String(serverListing.rentupper ?? "")); 
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}