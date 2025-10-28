import axios from "axios";
import { useNavigate,Link } from "react-router-dom";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8002/user/logout",
        {},
        { withCredentials: true } 
      );

     navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
}
