import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8002/roommate",
  withCredentials: true, // ensure auth cookie is sent
  headers: {
    "Content-Type": "application/json",
  },
});

export const uploadRoommate = (payload) => API.post("/add", payload);
export const searchRoommates = (payload) => API.post("/search", payload);
// fetch current user's listings (backend exposes GET /listings)
export const getMyListing = () => API.get("/listings");
// update an existing listing (backend exposes POST /update)
export const updateRoommate = (payload) => API.post("/update", payload);

export default API;