import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchChatList } from "../api/chat";

export default function ChatListPage() {
  const [chats, setChats] = useState([]);
  const { user, loading } = useAuth();  // <-- use loading from context
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until auth loading is finished AND user is available
    if (loading || !user) return;

    async function loadChats() {
      try {
        const chatRes = await fetchChatList();
        setChats(chatRes.data.data || []);
      } catch (err) {
        console.error("Chat list fetch error:", err);
      }
    }

    loadChats();
  }, [loading, user]);  // re-run only when loading stops & user comes

  if (loading) return <p>Loading user...</p>;
  if (!user) return <p>Please login first.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Chats</h2>

      {chats.length === 0 ? (
        <p>No chats yet.</p>
      ) : (
        chats.map((chat, idx) => {
          const [u1, u2] = chat.email;

          const other = u1 === user.email ? u2 : u1;

          const lastMessage =
            chat.messages.length > 0
              ? chat.messages[chat.messages.length - 1].body
              : "No messages yet";

          return (
            <div
              key={idx}
              onClick={() => navigate(`/chat/${other}`)}
              style={{
                padding: "15px",
                borderBottom: "1px solid #ddd",
                cursor: "pointer",
              }}
            >
              <h3>{other}</h3>
              <p style={{ color: "#777" }}>{lastMessage}</p>
            </div>
          );
        })
      )}
    </div>
  );
}
