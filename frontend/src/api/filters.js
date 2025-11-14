import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8002/home", 
  withCredentials:true
});
export const fetchSingleProperty = (email, name) =>API.get(`/property?email=${email}&name=${name}`);

export const fetchproperty = (filters) => API.get(`/filter`, { params: filters });
export const fetchHome = () => API.get(`/`);

