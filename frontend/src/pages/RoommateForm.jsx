import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NumberInput from "../Components/NumberInput";
import Alert from "../Components/Alert";
import API from "../api/roommate";
import { useAuth } from "../context/AuthContext";// keep your existing auth context

export default function RoommateForm() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [rentLower, setRentLower] = useState("");
  const [rentUpper, setRentUpper] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [submitting, setSubmitting] = useState(false);

  const [serverListing, setServerListing] = useState(null); // single source of truth from server
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
        // treat as no listing but keep the user on the page
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

  // defensive setters to make sure we don't mutate values in view mode
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
      const backendMsg = err?.response?.data?.message || err?.message || "Could not create listing";
      setMessage({ text: backendMsg, type: "error" });
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
        // backend's update filters by city, so perform delete(oldCity) then add(newCity)
        await API.post("/delete", { city: oldCity }, { withCredentials: true });
        res = await API.post("/add", { city: newCity, rentlower: lower, rentupper: upper }, { withCredentials: true });
      } else {
        // city unchanged — call update endpoint
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
      const backendMsg = err?.response?.data?.message || err?.message || "Could not update";
      setMessage({ text: backendMsg, type: "error" });
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
      const backendMsg = err?.response?.data?.message || err?.message || "Could not delete";
      setMessage({ text: backendMsg, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingExisting) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 720, margin: "30px auto", padding: 20 }}>
      <h2>List as Roommate</h2>

      {/* CTA when not listed */}
      {!serverListing && (
        <div style={{ marginBottom: 16, padding: 12, border: "1px dashed #e6e9ef", borderRadius: 8 }}>
          <p style={{ margin: 0 }}>You have not listed yourself as a roommate yet.</p>
          <div style={{ marginTop: 10 }}>
            <button onClick={() => setIsEditing(true)}>List Yourself</button>
          </div>
        </div>
      )}

      {/* View mode */}
      {serverListing && !isEditing && (
        <div style={{ border: "1px solid #e6e9ef", padding: 12, borderRadius: 8, marginBottom: 12 }}>
          <strong>Your current listing</strong>
          <p style={{ margin: "6px 0" }}><strong>City:</strong> {serverListing.city || "—"}</p>
          <p style={{ margin: "6px 0" }}><strong>Rent:</strong> ₹{serverListing.rentlower ?? "—"} - ₹{serverListing.rentupper ?? "—"}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleDelete} disabled={submitting}>Delete</button>
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
        style={{ marginTop: 8 }}
      >
        <label style={{ display: "block", fontWeight: 700 }}>City</label>
        <input
          value={city}
          onChange={(e) => safeSetCity(e.target.value)}
          placeholder="Enter city"
          disabled={!isFormEditable}
          style={{ width: "60%", padding: 8, marginBottom: 12 }}
        />

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontWeight: 700 }}>Rent lower (₹)</label>
            <NumberInput
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

          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontWeight: 700 }}>Rent upper (₹)</label>
            <NumberInput
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
          <div style={{ marginBottom: 12 }}>
            <Alert message={message.text} type={message.type} onClose={() => setMessage({ text: "", type: "" })} autoClose={5000} />
          </div>
        )}

        <div style={{ marginTop: 8 }}>
          {!serverListing && (
            <>
              {!isEditing ? (
                <button type="button" onClick={() => setIsEditing(true)}>Start Creating</button>
              ) : (
                <>
                  <button type="button" onClick={handleCreate} disabled={submitting}>{submitting ? "Saving..." : "Create Listing"}</button>
                  <button type="button" onClick={() => { setIsEditing(false); setCity(""); setRentLower(""); setRentUpper(""); }} style={{ marginLeft: 8 }}>Cancel</button>
                </>
              )}
            </>
          )}

          {serverListing && (
            <>
              {!isEditing ? (
                <button type="button" onClick={() => setIsEditing(true)}>Edit</button>
              ) : (
                <>
                  <button type="button" onClick={handleUpdate} disabled={submitting}>{submitting ? "Updating..." : "Update Listing"}</button>
                  <button type="button" onClick={() => { setIsEditing(false); setCity(serverListing.city || ""); setRentLower(String(serverListing.rentlower ?? "")); setRentUpper(String(serverListing.rentupper ?? "")); }} style={{ marginLeft: 8 }}>Cancel</button>
                </>
              )}
              <button type="button" onClick={handleDelete} style={{ marginLeft: 8 }} disabled={submitting}>Delete</button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
