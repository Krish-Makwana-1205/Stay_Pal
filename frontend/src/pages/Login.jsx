import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import Alert from "../Components/Alert";
import "../StyleSheets/Login.css";

export default function Login() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    if (user.istenant) navigate("/dashboard");
    else navigate("/usercard");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      login(res.data.user);
    } catch (err) {
      setAlert({
        text: err.response?.data?.message || "Login failed",
        type: "error",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Left Section with Heading + Image */}
        <div className="login-left">
          <div className="brand-overlay">
            <h1 className="brand-title">Welcome to StayPal</h1>
            <img
              src="https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg"
              alt="Blue themed house"
              className="login-image"
            />
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="login-right">
          <Alert
            message={alert.text}
            type={alert.type}
            onClose={() => setAlert({ text: "", type: "" })}
          />
          <form className="login-form" onSubmit={handleSubmit}>
            <h1 className="form-title">Welcome Back!</h1>
            <p className="form-subtitle">Log in to continue to StayPal.</p>

            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Login
            </button>

            {/* OR separator */}
            <div className="or-separator">
              <span>OR</span>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              className="google-btn"
              onClick={() => (window.location.href = "http://localhost:8002/auth/google")}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
                alt="Google icon"
                className="google-icon"
              />
              Login with Google
            </button>

            <p className="login-link">
              Don't have an account? <Link to="/signup">Signup</Link>
            </p>
            <p className="login-link">
              <Link to="/forgetpass">Forgot password?</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
