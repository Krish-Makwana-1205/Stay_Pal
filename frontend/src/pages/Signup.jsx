import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser, otpFetch, loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import Alert from "../Components/Alert";
import "../StyleSheets/Signup.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ text: "", type: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGetOtp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setAlert({ text: "Passwords do not match!", type: "error" });
      return;
    }

    try {
      setLoading(true);
      await otpFetch({ email });
      setAlert({ text: "OTP sent to your email!", type: "success" });
      setStep("otp");
    } catch (err) {
      setAlert({
        text: err.response?.data?.message || "OTP generation failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signupUser({ email, password, name, otp });
      setAlert({ text: "Signup successful!", type: "success" });
    } catch (err) {
      setAlert({
        text: err.response?.data?.message || "Signup failed",
        type: "error",
      });
      return;
    } finally {
      setLoading(false);
    }

    try {
      setLoading(true);
      const res = await loginUser({ email, password });
      login(res.data.user);
      navigate("/usercard");
    } catch (err) {
      setAlert({
        text: err.response?.data?.message || "Login failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  return (
    <div className="signup-container">
      <Alert
        message={alert.text}
        type={alert.type}
        onClose={() => setAlert({ text: "", type: "" })}
      />

      <div className="signup-wrapper">
        {/* Left Side */}
        <div className="login-left">
          <div className="brand-overlay">
            <h1 className="brand-title">Welcome to StayPal</h1>
            <p className="brand-subtext">
              Discover a community where comfort meets connection — <br />find your ideal stay, connect with verified owners, and <br />experience a smoother way to feel at home. 
              
            </p>
            <img
              src="https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg"
              alt="Blue themed house"
              className="login-image"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="signup-right">
          <form
            className="signup-form"
            onSubmit={step === "email" ? handleGetOtp : handleSignup}
          >
            <h2 className="form-title">Create an Account</h2>
            <p className="form-subtitle">
              Join StayPal to find your perfect home
            </p>

            {/* Email */}
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={step === "otp"}
                className="form-input"
              />
            </div>

            {/* Password */}
            <div className="input-group">
              <input
                type="password"
                placeholder="Set Password"
                value={password}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={step === "otp"}
                className="form-input"
              />
            </div>

            {/* Confirm Password */}
            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                name="confirmPassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={step === "otp"}
                className="form-input"
              />
            </div>

            {/* Username */}
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                value={name}
                name="name"
                onChange={(e) => setName(e.target.value)}
                required
                disabled={step === "otp"}
                className="form-input"
              />
            </div>

            {/* OTP Field */}
            {step === "otp" && (
              <div className="input-group otp-input-group">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  name="otp"
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading
                ? "Please wait..."
                : step === "email"
                ? "Get OTP"
                : "Create Account"}
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="google-btn"
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google logo"
                className="google-logo"
              />
              Sign up with Google
            </button>

            <p className="login-link">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
