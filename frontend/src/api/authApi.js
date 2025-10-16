import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8002/user/", 
  withCredentials:true
});

export const signupUser = (formData) => API.post("/registration", formData);

export const loginUser = (formData) => API.post("/login", formData);

export const otpFetch = (formData) => API.post("registration/otp", formData);

export const forgetPass = (formData) => API.post("forgotpassword/otp", formData);

export const resetPass = (formData) => API.post("/forgotpassword",formData);