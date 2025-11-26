import React, { useEffect, useState } from "react";
import { getSavedProperties } from "../api/tenantform";

export default function SavedProperties() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getSavedProperties();
        setList(res.data.data || []);
      } catch (err) {
        console.error("Fetch saved error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;
  if (list.length === 0) return <p style={{ padding: "20px" }}>No saved properties found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Saved Properties</h2>

      {list.map((item, idx) => (
        <div
          key={idx}
          style={{
            padding: "15px",
            marginBottom: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px"
          }}
        >
          <h3>{item.name}</h3>
          <p><strong>Owner:</strong> {item.email}</p>
          <p><strong>City:</strong> {item.city}</p>
          <p><strong>Rent:</strong> ₹{item.rent}</p>
        </div>
      ))}
    </div>
  );
}
