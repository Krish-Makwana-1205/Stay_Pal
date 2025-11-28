import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/user`,
  withCredentials: true
});

export const signupUser = (formData) => API.post("/registration", formData);
export const loginUser = (formData) => API.post("/login", formData);
export const otpFetch = (formData) => API.post("/registration/otp", formData);
export const forgetPass = (formData) => API.post("/forgotpassword/otp", formData);
export const resetPass = (formData) => API.post("/forgotpassword", formData);
export const googleAuth = (code) => API.get(`/google?code=${code}`);
export const fetchUser = () => API.get("/me");
