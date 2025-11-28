import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const form1 = (formData) => API.post("/tenant/form1", formData);
export const form2 = (formData) => API.post("/tenant/form2", formData);
export const getProfile = () => API.get("/tenant/profile");
export const updateProfile = (formData) =>
  API.post("/tenant/updateprofile", formData);

export const uploadPhoto = (formData) =>
  API.post("/user/uploadPhoto", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export default API;
