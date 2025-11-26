import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8002/roommate",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// create / update / apply helpers
export const uploadRoommate = (payload) => API.post("/add", payload);
export const updateRoommate = (payload) => API.post("/update", payload);
export const applyForRoommate = (payload) => API.post("/apply", payload);
export const getMyListing = () => API.get("/listings");

// Robust search helper — try several likely endpoints and methods until one succeeds.
// Returns axios response object of the first 2xx response, otherwise throws last error.
export const searchRoommatesParams = async (filters) => {
  const attempts = [
    { fn: () => API.get("/search", { params: filters }), desc: "GET /search" },
    { fn: () => API.get("/roommateSearch", { params: filters }), desc: "GET /roommateSearch" },
    { fn: () => API.get("/searchRoommates", { params: filters }), desc: "GET /searchRoommates" },
    { fn: () => API.post("/search", filters), desc: "POST /search (body)" },
    { fn: () => API.post("/search", {}, { params: filters }), desc: "POST /search (params)" },
  ];

  let lastErr;
  for (const attempt of attempts) {
    try {
      const res = await attempt.fn();
      // debug: show which attempt responded and the response payload
      // eslint-disable-next-line no-console
      console.log(`[searchRoommatesParams] attempt ${attempt.desc} -> status:`, res?.status, "data:", res?.data);
      if (res && res.status >= 200 && res.status < 300) {
        // attach metadata so caller can inspect which route returned
        res._attempt = attempt.desc;
        return res;
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`[searchRoommatesParams] failed ${attempt.desc}:`, err?.message || err);
      lastErr = err;
    }
  }
  throw lastErr || new Error("No search endpoint responded");
};

export const searchRoommates = (payload) => API.post("/search", payload);

// Update this function - remove /tenant/ from the path
export const fetchSingleTenant = (email) => API.get(`/profile/${email}`);

export default API;