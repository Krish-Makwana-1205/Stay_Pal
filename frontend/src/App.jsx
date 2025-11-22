import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserCard from "./pages/UserCard";
import ForgetPassword from "./pages/ForgetPassword";
import TenantForm from "./pages/TenantForm";
import PropertyForm from "./pages/PropertyForm";
import TenantForm2 from "./pages/TenantForm2";
import Dashboard from "./pages/Dashboard";
import PropertyForm2 from "./pages/PropertForm2";
import TenantProfile from "./pages/TenantProfile";
import ViewProperties from "./pages/ViewProperties";
import MyProperties from "./pages/MyProperties";
import PropertyView from "./pages/PropertyView";
import EditProperty from "./pages/EditProperty";
import EditPreferences from "./pages/EditPreferences";
import ApplicationList from "./pages/ApplicationList";
import RoommateForm from "./pages/RoommateForm"
// import ViewRoommates from "./pages/ViewRoommates";
// import ViewShared from "./pages/ViewShared";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from "./pages/GoogleLogin";
import ChatPage from "./pages/ChatPage";
import ChatListPage from "./pages/ChatListPage";
import MyApplications from "./pages/Myapplications";
function App() {
  return (
    <GoogleOAuthProvider clientId="111906127844-bkf5itk1g4jr340f13arirg2bcu83t8i.apps.googleusercontent.com">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgetpass" element={<ForgetPassword />} />
        <Route path="/usercard" element={<UserCard />} />
        <Route path="/propertyForm" element={<PropertyForm />} />
        <Route path="/tenantForm" element={<TenantForm />} />
        <Route path="/tenantForm2" element={<TenantForm2 />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/propertyForm2" element={<PropertyForm2 />} />
        <Route path="/profile" element={<TenantProfile />} />
        <Route path="dashboard/properties" element={<ViewProperties />} />
        <Route path="/myproperties" element={<MyProperties />} />
        <Route path="/property/:email/:name" element={<PropertyView />} />
        <Route path="/editproperty/:email/:name" element={<EditProperty />} />
        <Route path="/googlelogin" element={<GoogleLogin />} />
        <Route path="/tenant/my-applications" element={<MyApplications />} />
        <Route path="/roommateform" element={<RoommateForm />} />
        
        <Route
          path="/editpreferences/:email/:name"
          element={<EditPreferences />}
        />
        <Route
          path="/applications/:propertyName"
          element={<ApplicationList />}
        />
        <Route path="*" element={<h1>Page Not Found</h1>} />
        <Route path="/chat/:receiverEmail" element={<ChatPage/>} />
        <Route path="/my-chats" element={<ChatListPage />} />

        {/* <Route path="roommates" element={<ViewRoommates />} /> */}
        {/* <Route path="shared" element={<ViewShared />} /> */}
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
