import axios from "axios";

const CHAT_API = axios.create({
  baseURL: "http://localhost:8002/chat",
  withCredentials: true,
});

export const fetchChatList = () => CHAT_API.get("/list");

export const fetchChat = (receiverEmail) =>
  CHAT_API.get(`/?email=${receiverEmail}`);

export const sendChatMessage = (receiverEmail, message) =>
  CHAT_API.post("/post", {
    email: receiverEmail,
    message,
  });

export default CHAT_API;
