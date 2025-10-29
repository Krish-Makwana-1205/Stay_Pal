import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgetPass, resetPass, loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import Alert from "../Components/Alert";

// import "./ForgetPassword.css";

export default function ForgetPassword() {
  const [step, setStep] = useState("email"); // "email" or "reset"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ text: "", type: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  // STEP 1 — Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      setAlert({ text: "Please enter your email!", type: "error" });
      return;
    }

    try {
      setLoading(true);
      await forgetPass({ email }); // calls /forgotpassword/otp
      setAlert({ text: "OTP sent to your email!", type: "success" });
      setStep("reset");
    } catch (err) {
      setAlert({ text: err.response?.data?.message || "Failed to send OTP", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 — Reset password using OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setAlert({ text: "Passwords do not match!", type: "error" });
      return;
    }

    try {
      setLoading(true);

      // call /forgotpassword to reset password
      await resetPass({ email, otp, password });

      setAlert({ text: "Password reset successful! Logging you in...", type: "success" });
      // auto-login
      const res = await loginUser({ email, password });
      login(res.data.user);
      navigate("/usercard");
    } catch (err) {
      setAlert({ text: err.response?.data?.message || "Password reset failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forget-container">
      <Alert message={alert.text} type={alert.type} onClose={() => setAlert({ text: "", type: "" })} />
      <form
        className="forget-form"
        onSubmit={step === "email" ? handleSendOtp : handleResetPassword}
      >
        <h1 className="form-title">Reset Your Password</h1>
        <p className="form-subtitle">
          {step === "email"
            ? "Enter your registered email to get an OTP."
            : "Enter OTP and your new password."}
        </p>

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={step === "reset"}
        />

        {step === "reset" && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : step === "email"
            ? "Send OTP"
            : "Reset Password"}
        </button>

        {step === "reset" && (
          <p>
            Didn’t receive OTP?{" "}
            <button
              type="button"
              className="resend-otp-btn"
              onClick={handleSendOtp}
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
