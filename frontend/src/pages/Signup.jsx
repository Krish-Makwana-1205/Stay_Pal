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
      setAlert({ text: err.response?.data?.message || "OTP generation failed", type: "error" });
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
      setAlert({ text: err.response?.data?.message || "Signup failed", type: "error" });
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
      setAlert({ text: err.response?.data?.message || "Login failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <Alert message={alert.text} type={alert.type} onClose={() => setAlert({ text: "", type: "" })} />
      <form
        className="signup-form"
        onSubmit={step === "email" ? handleGetOtp : handleSignup}
      >
        <h1 className="form-title">Create an Account</h1>
        <p className="form-subtitle">Join StayPal to find your perfect home.</p>

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={step === "otp"}
        />
        <input
          type="password"
          placeholder="Set Password"
          value={password}
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={step === "otp"}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          name="confirmPassword"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={step === "otp"}
        />
        <input
          type="text"
          placeholder="Username"
          value={name}
          name="name"
          onChange={(e) => setName(e.target.value)}
          required
          disabled={step === "otp"}
        />

        {step === "otp" && (
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            name="otp"
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        )}

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : step === "email"
            ? "Get OTP"
            : "Signup"}
        </button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>

        {step === "otp" && (
          <p>
            Didn't receive OTP?{" "}
            <button
              type="button"
              className="resend-otp-btn"
              onClick={handleGetOtp}
              disabled={loading}
            >
              Resend OTP
            </button>
          </p>
        )}
      </form>
    </div>
  );
}
