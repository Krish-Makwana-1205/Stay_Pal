import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/propertyOwner`,
  withCredentials: true,
});

export const uploadProperty = (formData) =>
  API.post("/addproperty", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const savePreferences = (payload) => API.post("/preferences", payload);

export default API;
