import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/roommate`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const uploadRoommate = (payload) => API.post("/add", payload);
export const updateRoommate = (payload) => API.post("/update", payload);
export const applyForRoommate = (payload) => API.post("/apply", payload);
export const getMyListing = () => API.get("/listings");

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
      if (res && res.status >= 200 && res.status < 300) {
        res._attempt = attempt.desc;
        return res;
      }
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error("No search endpoint responded");
};

export const searchRoommates = (payload) => API.post("/search", payload);

export const fetchSingleTenant = (email) => API.get(`/profile/${email}`);

export default API;
