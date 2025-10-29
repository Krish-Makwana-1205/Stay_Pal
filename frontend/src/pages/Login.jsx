import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import Alert from "../Components/Alert";
import "../StyleSheets/Login.css";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      console.log(res.data.user);
      login(res.data.user); 
      navigate("/usercard");
    } catch (err) {
      setAlert({ text: err.response?.data?.message || "Login failed", type: "error" });
    }
  };

  return (
    <div className="login-container">
      <Alert message={alert.text} type={alert.type} onClose={() => setAlert({ text: "", type: "" })} />
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="form-title">Welcome Back!</h1>
  <p className="form-subtitle">Log in to continue to StayPal.</p>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>

        <p>
          Dont have an account? <Link to="/signup">Signup</Link>
        </p>
        <p>
          <Link to ='/forgetpass'>forget password?</Link>
        </p>
      </form>
    </div>
  );
}
