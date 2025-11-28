import React, { useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { googleAuth, fetchUser } from '../api/authApi';   
import { useNavigate } from "react-router-dom";
import "../StyleSheets/GoogleLogin.css";

function GoogleLogin() {
  const navigate = useNavigate();


  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const res = await fetchUser();  
      if (res.data?.success) {
        navigate("/usercard");
      }
    } catch (err) {
    }
  };

  const responseGoogle = async (authResult) => {
    try {
      if (authResult.code) {
        const result = await googleAuth(authResult.code);  
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
    <div className="google-login-wrapper">
      <div className="google-login-card">

        <h2 className="google-login-title">Login to Continue</h2>

        <button className="google-btn" onClick={() => googleLogin()}>
          <img src="/google-icon.png" alt="Google" />
          Continue with Google
        </button>

        <p className="google-hint">
          If popup did not open, click the button above.
        </p>

      </div>
    </div>
  );
}

export default GoogleLogin;
