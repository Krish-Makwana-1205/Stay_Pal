import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8002/home", 
  withCredentials:true
});

export const fetchproperty = (filters) => API.get(`/filter`, { params: filters });

