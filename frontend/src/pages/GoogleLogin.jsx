import React, { useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { googleAuth } from '../api/authApi';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function GoogleLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const res = await axios.get("http://localhost:8002/user/me", {
        withCredentials: true
      });
      if (res.data.success) {
        navigate("/usercard");   
      }
    } catch (err) {
    }
  };

  
  const responseGoogle = async (authResult) => {
    try {
      if (authResult.code) {
        const result = await googleAuth(authResult.code);
        console.log("Google User:", result.data.user);

        navigate("/usercard"); 
         window.location.reload();
      }
    } catch (err) {
      console.log("Google Login Error:", err);
    }
  };

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: responseGoogle,
    onError: responseGoogle,
  });

  useEffect(() => {
    googleLogin();   
  }, []);

  return (
    <div>
      <button onClick={() => googleLogin()}>
        Continue with Google
      </button>
      <p>If popup did not open, click the button above.</p>
    </div>
  );
}

export default GoogleLogin;
