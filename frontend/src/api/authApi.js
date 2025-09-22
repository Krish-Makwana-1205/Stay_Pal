import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8002/user/", 
  withCredentials:true
});

export const signupUser = (formData) => API.post("/registeration", formData);

export const loginUser = (formData) => API.post("/login", formData);
