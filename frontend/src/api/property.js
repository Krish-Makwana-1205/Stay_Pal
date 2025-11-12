import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8002/propertyOwner", 
  withCredentials:true
});

export const fetchMyProperties = () => API.get(`/properties`);
