import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { otpFetch } from "../api/authApi";
import "./Signup.css";


export default function Otp() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        
        e.preventDefault();
        try {
            console.log("bun");
            const temp = otpFetch({ email });
            console.log("here");
            console.log("Run");
            navigate("/Signup");
        } catch (err) {
            alert(err.response?.data?.message || "OTP generation failed");
        }
    };
    return (
        <div className="signup-container">
          <form className="signup-form" onSubmit={handleSubmit}>
            <h1 className="form-title">Get OTP</h1>
      <p className="form-subtitle">Join StayPal to find your perfect home.</p>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">GetOTP</button>
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      );

}