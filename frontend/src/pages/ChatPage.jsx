import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchChat, sendChatMessage } from "../api/chat";
import Header from "../Components/Header";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const { receiverEmail } = useParams();
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState("");

  // AUTH
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // LOGOUT HANDLER
  const handleLogout = async () => {
    await logout();
    navigate("/"); // redirect to homepage or login page
  };

  // FETCH CHAT
  const loadChat = async () => {
    try {
      const res = await fetchChat(receiverEmail);
      setChat(res.data.data || null);
    } catch (err) {
      console.error("Error fetching chat:", err);
    }
  };

  // SEND MESSAGE
  const sendMessage = async () => {
    if (!message.trim()) return;

    await sendChatMessage(receiverEmail, message);
    setMessage("");
    await loadChat();
  };

  useEffect(() => {
    loadChat();
  }, [receiverEmail]);

  return (
    <>
      <Header 
        user={user}          // actual logged-in user object
        onLogout={handleLogout} 
        onNavigate={navigate}
      />

      <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
        <h2>Chat with: {receiverEmail}</h2>

        <div
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            height: "400px",
            overflowY: "scroll",
            marginBottom: "15px",
            borderRadius: "10px",
          }}
        >
          {chat?.messages?.length ? (
            chat.messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  textAlign:
                    msg.senderEmail === receiverEmail ? "left" : "right",
                  margin: "10px 0",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "10px",
                    borderRadius: "10px",
                    background:
                      msg.senderEmail === receiverEmail ? "#f0f0f0" : "#a4d7ff",
                  }}
                >
                  {msg.body}
                </span>
              </div>
            ))
          ) : (
            <p>No messages yet.</p>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              padding: "10px 20px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
