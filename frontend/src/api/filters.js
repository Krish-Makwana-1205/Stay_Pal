import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8002/home", 
  withCredentials:true
});
export const fetchSingleProperty = (email, name) =>API.get(`/property?email=${email}&name=${name}`);

export const fetchproperty = (filters) => API.get(`/filter`, { params: filters });
export const applyForProperty  = (payload) => API.post("/apply", payload);
export const getApplications =async(propertyName)=>API.get(`/owner/applications?propertyName=${propertyName}`);
export const fetchMyApplications = async () => {
  return API.get("/tenant/my-applications");
};

export const fetchHome = () => API.get(`/`);

