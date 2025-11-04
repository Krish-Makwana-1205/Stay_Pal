import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8002/rooommate/", 
  withCredentials:true
});

export const form1 = (formData) => API.post("/roommate/form1", formData);

export const form2 = (formData) => API.post("/roommate/form2",formData);
