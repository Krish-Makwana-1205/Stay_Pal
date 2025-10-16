import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8002/tenant/", 
  withCredentials:true
});

export const form1 = (formData) => API.post("/form1", formData);


