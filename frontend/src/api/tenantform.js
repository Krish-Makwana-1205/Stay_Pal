import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8002", 
  withCredentials: true,
});

export const form1 = (formData) => API.post("/tenant/form1", formData);
export const form2 = (formData) => API.post("/tenant/form2", formData);

// New helpers
export const getProfile = () => API.get("/tenant/profile");
export const updateProfile = (formData) => API.post("/tenant/updateprofile", formData);

export default API;
