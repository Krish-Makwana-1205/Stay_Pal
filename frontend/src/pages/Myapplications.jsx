import React, { useEffect, useState } from "react";
import { fetchMyApplications } from "../api/filters";
import { useNavigate } from "react-router-dom";
export default function MyApplications() {
  const [apps, setApps] = useState(null); // <-- START AS null
  const [loading, setLoading] = useState(true);
    const navigate=useNavigate();
  useEffect(() => {
    async function load() {
      try {
        const res = await fetchMyApplications();
        console.log("API RESPONSE:", res.data);

        
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


  if (loading) return <p>Loading...</p>;

  if (apps && apps.length === 0)
    return <p>You have not applied to any properties yet.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Applications</h2>

      {apps.map((item, index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h3>{item?.property?.name || "Unknown Property"}</h3>
          <p><strong>Owner:</strong> {item?.property?.email}</p>
<button onClick={() => navigate(`/chat/${item?.property.email}`)}>Chat</button>
          <p><strong>City:</strong> {item?.property?.city}</p>
          <p><strong>Applied At:</strong> {new Date(item.appliedAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
