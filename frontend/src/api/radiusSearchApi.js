import axios from "axios";

const RADIUS_API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/radiussearch`,
  withCredentials: true,
});

// GET nearest properties
export const fetchNearestProperties = (addressLink, radiusKm) =>
  RADIUS_API.get("/", {
    params: {
      addressLink,
      radius: radiusKm,
    },
  });

export default RADIUS_API;
