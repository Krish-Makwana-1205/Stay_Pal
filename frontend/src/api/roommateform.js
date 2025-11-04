import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8002/roommate/", 
  withCredentials:true
});

export const form1 = (formData) => API.post("/form1", formData);

export const form2 = (formData) => API.post("/form2",formData);
