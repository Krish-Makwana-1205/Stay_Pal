// ...existing code...
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8002/propertyOwner", // backend router mounts at /propertyOwner
  withCredentials: true,
});

// upload property (multipart/form-data) — used by PropertyForm.jsx
export const uploadProperty = (formData) =>
  API.post("/addproperty", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// save tenant preferences for a property — used by PropertyForm2.jsx
export const savePreferences = (payload) => API.post("/preferences", payload);

export default API;
// ...existing code...