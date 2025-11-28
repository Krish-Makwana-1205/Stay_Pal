import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/propertyOwner`,
  withCredentials: true,
});

export const fetchMyProperties = () => API.get(`/properties`);
export default API;
