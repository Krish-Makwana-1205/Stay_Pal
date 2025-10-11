import { Link } from "react-router-dom";
import BlurText from "../Components/BlurText";
import SplitText from "../Components/SplitText";
import { useAuth } from "../context/AuthContext";
import React from "react";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <main className="card">
      <div className="content-wrapper">
        {/* Left Text Content */}
        <div className="text-content">
          <h1 className="logo">StayPal</h1>
          <p className="tagline">
            The one-stop solution for all your renting problems
          </p>
          <p className="description">
            StayPal makes finding your next home or the perfect flatmate a
            breeze. Our intuitive platform connects with verified listings and
            compatible individuals, ensuring a smooth a stress renting
            experience. Discover your{" "}
            <strong>ideal living situation</strong> with StayPal.
          </p>
          <a href="/Otp" className="cta-button">
            Get Started
          </a>
        </div>

        {/* Right Image Gallery */}
        <div className="image-gallery">
          <img
            src="https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Living room"
            className="img-1"
          />
          <img src="/roommate.png" alt="Roommates" className="img-2" />

          <img
            src="https://i.pinimg.com/originals/56/a9/04/56a904ff1c6c62d02af5c6582722a01b.jpg"
            alt="Cozy bedroom"
            className="img-3"
          />
        </div>
      </div>
    </main>
  );
}
