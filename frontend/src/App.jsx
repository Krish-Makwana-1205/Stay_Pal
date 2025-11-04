import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserCard from "./pages/UserCard";
import ForgetPassword from "./pages/ForgetPassword";
import TenantForm from "./pages/TenantForm";
import PropertyForm from "./pages/PropertyForm";
import TenantForm2 from "./pages/TenantForm2";
import RoommateForm1 from "./pages/RoommateForm1";
function App() {
  return (    
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgetpass" element={<ForgetPassword />} />
        <Route path="/usercard" element={<UserCard />} />
        <Route path="/propertyForm" element={<PropertyForm />} />
        <Route path="/tenantForm" element={<TenantForm/>}/>
        <Route path="/tenantForm2" element={<TenantForm2/>}/>
        <Route path="/RoommateForm1" element={<RoommateForm1/>}/>
      </Routes>
    
  );
}

export default App;
