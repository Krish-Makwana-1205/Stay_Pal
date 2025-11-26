import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchChatList } from "../api/chat";
import "../StyleSheets/ChatListPage.css";

export default function ChatListPage() {
  const [chats, setChats] = useState([]);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
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
  }, [loading, user]);

  if (loading) return <div className="chat-page-wrapper"><p>Loading...</p></div>;
  if (!user) return <div className="chat-page-wrapper"><p>Please login first.</p></div>;

  return (
    <div className="chat-page-wrapper">
      <div className="chat-list-card">
        <h2 className="chat-list-heading">Your Chats</h2>

        <div className="chat-items-container">
          {chats.length === 0 ? (
            <p className="chat-empty-state">No chats found. Start a conversation!</p>
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
                  className="chat-item"
                  onClick={() => navigate(`/chat/${other}`)}
                >
                  <div className="chat-item-header">
                    <span className="chat-item-name">{other}</span>
                    <span className="chat-item-arrow">OPEN &rarr;</span>
                  </div>
                  <p className="chat-item-message">{lastMessage}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}