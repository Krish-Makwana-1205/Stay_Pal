import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "linear-gradient(135deg, #020b2b, #011640)",
        color: "white",
        fontFamily: "Inter, sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <motion.h1
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{ fontSize: "120px", fontWeight: "800", margin: 0 }}
      >
        404
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{ fontSize: "22px", marginTop: "10px", marginBottom: "30px" }}
      >
        Oops! The page you're looking for doesn't exist. 
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.7 }}
        style={{ display: "flex", gap: "20px" }}
      >
        <Link
          to="/"
          style={{
            padding: "12px 28px",
            backgroundColor: "#0a3ad1",
            color: "white",
            borderRadius: "10px",
            fontSize: "18px",
            textDecoration: "none",
            boxShadow: "0 0 12px rgba(0, 140, 255, 0.6)",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.08)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >

          Go Home
        </Link>

        <Link
          to="/login"
          style={{
            padding: "12px 28px",
            border: "2px solid #0a3ad1",
            color: "white",
            borderRadius: "10px",
            fontSize: "18px",
            textDecoration: "none",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#0a3ad1")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
        >
          Login
        </Link>
        
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1, duration: 1 }}
        style={{
          fontSize: "14px",
          position: "absolute",
          bottom: "20px",
          letterSpacing: "2px",
        }}
      >
        StayPal. © {new Date().getFullYear()}
      </motion.div>
    </div>
  );
}
