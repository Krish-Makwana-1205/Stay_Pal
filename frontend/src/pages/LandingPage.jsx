import { Link } from "react-router-dom";
import BlurText from "../Components/BlurText";
import SplitText from "../Components/SplitText";
import { useAuth } from "../context/AuthContext";

import "./LandingPage.css";
export default function LandingPage() {
  const {user}=useAuth();
  return (
    <div>
      <BlurText
        text="Looking for peace?"
        delay={270}
        animateBy="words"
        direction="top"
        className="landingtext"
      />
      <SplitText
        text="Here Comes StayPal!"
        delay={100}
        duration={0.6}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 40 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        className="aftertext"
      />
      {user?<p>u are here </p>:<Link to="/login" className="get-started-btn">Get Started</Link>}  
    </div>
  );
}
