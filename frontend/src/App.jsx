import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserCard from "./pages/UserCard";
import ForgetPassword from "./pages/ForgetPassword";
import { AuthProvider } from "./context/AuthContext";
import TenantForm from "./pages/TenantForm";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgetpass" element={<ForgetPassword />} />
        <Route path="/usercard" element={<UserCard />} />
        <Route path="/tenantForm" element={<TenantForm/>}/>
      </Routes>
    </AuthProvider>
  );
}

export default App;
