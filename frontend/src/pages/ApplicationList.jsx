import { useParams } from "react-router-dom";
import { getApplications } from "../api/filters";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatPage from "./ChatPage";
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

  if (loading) return <h2>Loading...</h2>;
  if (apps.length === 0) return <h3>No applications yet.</h3>;

  return (
    <div style={{padding:"20px"}}>
      <button onClick={() => navigate("/my-chats")}>
      Chats
    </button>
      <h2>Applications for {propertyName}</h2>

      {apps.map((a, i) => (
        <div key={i} className="tenant-card" style={{
  border: "1px solid #ddd",
  padding: "15px",
  marginBottom: "20px",
  borderRadius: "8px",
  background: "#fafafa"
}}>
  <h3>Tenant Profile</h3>

  <p><strong>Name:</strong> {a.tenant?.name}</p>
  <p><strong>Email:</strong> {a.tenant?.email}</p>
  <p><strong>Gender:</strong> {a.tenant?.gender}</p>
  <p><strong>Date of Birth:</strong> {new Date(a.tenant?.dob).toLocaleDateString()}</p>
  <p><strong>Hometown:</strong> {a.tenant?.hometown}</p>
  <p><strong>Nationality:</strong> {a.tenant?.nationality}</p>
  <p><strong>Religion:</strong> {a.tenant?.religion}</p>
  <p><strong>Food Preference:</strong> {a.tenant?.foodPreference}</p>
  <p><strong>Language Preference:</strong> {a.tenant?.language}</p>
  <p><strong>Professional Status:</strong> {a.tenant?.professionalStatus}</p>
  <p><strong>Marital Status:</strong> {a.tenant?.maritalStatus}</p>
  <p><strong>Smoker:</strong> {a.tenant?.smoker ? "Yes" : "No"}</p>
  <p><strong>Drinks Alcohol:</strong> {a.tenant?.alcohol ? "Yes" : "No"}</p>
  <p><strong>Pet Lover:</strong> {a.tenant?.Pet_lover ? "Yes" : "No"}</p>
  <p><strong>Night Owl:</strong> {a.tenant?.nightOwl ? "Yes" : "No"}</p>
  <p><strong>Early Bird:</strong> {a.tenant?.earlybird ? "Yes" : "No"}</p>
  <p><strong>Music Lover:</strong> {a.tenant?.music_lover ? "Yes" : "No"}</p>
  <p><strong>Fitness Freak:</strong> {a.tenant?.fitness_freak ? "Yes" : "No"}</p>
  <p><strong>Party Lover:</strong> {a.tenant?.party_lover ? "Yes" : "No"}</p>

  <p><strong>Hobbies:</strong> {a.tenant?.hobbies?.length ? a.tenant.hobbies.join(", ") : "None"}</p>
  <p><strong>Allergies:</strong> {a.tenant?.allergies?.length ? a.tenant.allergies.join(", ") : "None"}</p>
  
  <p><strong>Description:</strong> {a.tenant?.description || "No description given"}</p>

  <p><strong>Applied At:</strong> {new Date(a.appliedAt).toLocaleString()}</p>
</div>

      ))}
    </div>
  );
}
