import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/propertyOwner`,
  withCredentials: true,
});

export const uploadProperty = (formData) =>
  API.post("/addproperty", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteProperty = async (propertyName) => {
  try {
    const { data } = await API.post(
      "/delete-property",
      { propertyName },
      { withCredentials: true }
    );

    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const savePreferences = (payload) =>
  API.post("/preferences", payload);

export default API;
