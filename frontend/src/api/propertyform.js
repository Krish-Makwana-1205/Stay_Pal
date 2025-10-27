// src/api/propertyform.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8002/propertyOwner", // backend router mounts at /propertyOwner
  withCredentials: true,
});

export const uploadProperty = (formData) =>
  API.post("/addproperty", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
