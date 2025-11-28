import React from "react";
import { useAuth } from "../context/AuthContext";
import "../StyleSheets/LandingPage.css";
import { Link, useNavigate } from "react-router-dom";
import StayPalLogo from "../assets/logo_blue.png";

export default function LandingPage() {
  const { user, loading } = useAuth();

  const getStartedLink = user ? "/usercard" : "/login";
  const navigate = useNavigate();

  const goToUserOrLogin = () => {
    if (user) navigate("/usercard");
    else navigate("/login");
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("defaultCity");
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith("filters_")) {
          localStorage.removeItem(key);
        }
      });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed from landing page:", err);
    }
  };

  return (
    <main className="card">
      <div className="content-wrapper">
        <header className="hero-header">
          <div className="hero-brand">
            <img src={StayPalLogo} alt="StayPal Logo" className="header-logo" />
            <h1 className="logo">StayPal</h1>
          </div>

          <nav className="nav-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Sign up</Link>
          </nav>
        </header>

        <div className="text-content">
          <p className="tagline">The one-stop solution for all your renting problems</p>
          <p className="description">
            StayPal makes finding your next home or the perfect flatmate a breeze.
          </p>

          {!loading && (
            <Link to={getStartedLink} className="cta-button">
              Get Started <span className="cta-arrow">→</span>
            </Link>
          )}
        </div>

        <div className="image-gallery">
          <img
            src="https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg"
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

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">How StayPal Works For You</h2>

        <div className="main-features">
          <div
            className="feature-card large-feature-card"
            onClick={goToUserOrLogin}
            role="button"
            tabIndex={0}
            style={{ cursor: "pointer" }}
          >
            <div className="feature-content-wrapper">
              <div className="feature-text">
                <h3>Find Your Perfect Flat</h3>
                <p>Browse verified listings based on your needs.</p>
              </div>
              <div className="feature-image-container">
                <img
                  src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"
                  alt="Modern apartment"
                  className="feature-image"
                />
              </div>
            </div>
          </div>

          <div
            className="feature-card large-feature-card"
            onClick={goToUserOrLogin}
            role="button"
            tabIndex={0}
            style={{ cursor: "pointer" }}
          >
            <div className="feature-content-wrapper reverse-layout">
              <div className="feature-text">
                <h3>Match With Roommates</h3>
                <p>Connect with compatible roommates easily.</p>
              </div>
              <div className="feature-image-container">
                <img
                  src="https://i.pinimg.com/736x/aa/5f/5b/aa5f5bc605ded26696868cbd6b28aea7.jpg"
                  alt="People interacting"
                  className="feature-image"
                />
              </div>
            </div>
          </div>

          <div
            className="feature-card large-feature-card"
            onClick={goToUserOrLogin}
            role="button"
            tabIndex={0}
            style={{ cursor: "pointer" }}
          >
            <div className="feature-content-wrapper">
              <div className="feature-text">
                <h3>Move Into Shared Spaces</h3>
                <p>Find shared flats with existing flatmates.</p>
              </div>
              <div className="feature-image-container">
                <img
                  src="https://i.pinimg.com/1200x/84/20/fd/8420fd62d778c883078397db505fb288.jpg"
                  alt="Moving boxes"
                  className="feature-image"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Minor Features */}
        <div className="minor-features">
          <div className="minor-feature small-minor-feature">
            <div className="minor-feature-icon">📤</div>
            <h4>List Your Property</h4>
            <p>Owners can easily upload and share their rentals.</p>
          </div>

          <div className="minor-feature small-minor-feature">
            <div className="minor-feature-icon">✨</div>
            <h4>Smart Compatibility</h4>
            <p>Match with the right roommates.</p>
          </div>
        </div>
      </section>

      {/* ⭐ UPDATED Featured Properties Section */}
      <section className="ftproperties-section">
        <h2 className="section-title">Featured Properties</h2>

        <div className="ftproperties-scroll">

          {/* CARD 1 */}
          <div
            className="ftproperty-card"
            onClick={goToUserOrLogin}
            role="button"
            tabIndex={0}
            style={{ cursor: "pointer" }}
          >
            <img
              src="https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg"
              alt="Modern apartment"
              className="ftproperty-image"
            />
            <div className="ftproperty-details">
              <h4>2BHK Flat</h4>
              <p className="ftproperty-location">📍 City: Mumbai | Locality: Andheri West</p>
              <p className="ftproperty-price">Rent: ₹25,000/month</p>
              <p className="ftproperty-furniture">Furtinue: Semi-Furnished</p>
            </div>
          </div>

          {/* CARD 2 */}
          <div
            className="ftproperty-card"
            onClick={goToUserOrLogin}
            role="button"
            tabIndex={0}
            style={{ cursor: "pointer" }}
          >
            <img
              src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg"
              alt="Cozy studio"
              className="ftproperty-image"
            />
            <div className="ftproperty-details">
              <h4>Studio Apartment</h4>
              <p className="ftproperty-location">📍 City: Bangalore | Locality: Koramangala</p>
              <p className="ftproperty-price">Rent: ₹18,000/month</p>
              <p className="ftproperty-furniture">Furtinue: Fully-Furnished</p>
            </div>
          </div>

          {/* CARD 3 */}
          <div
            className="ftproperty-card"
            onClick={goToUserOrLogin}
            role="button"
            tabIndex={0}
            style={{ cursor: "pointer" }}
          >
            <img
              src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
              alt="Villa"
              className="ftproperty-image"
            />
            <div className="ftproperty-details">
              <h4>3BHK Villa</h4>
              <p className="ftproperty-location">📍 City: Delhi NCR | Locality: Gurgaon</p>
              <p className="ftproperty-price">Rent: ₹45,000/month</p>
              <p className="ftproperty-furniture">Furtinue: Unfurnished</p>
            </div>
          </div>

          {/* CARD 4 */}
          <div
            className="ftproperty-card"
            onClick={goToUserOrLogin}
            role="button"
            tabIndex={0}
            style={{ cursor: "pointer" }}
          >
            <img
              src="https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg"
              alt="Penthouse"
              className="ftproperty-image"
            />
            <div className="ftproperty-details">
              <h4>Penthouse</h4>
              <p className="ftproperty-location">📍 City: Mumbai | Locality: Bandra West</p>
              <p className="ftproperty-price">Rent: ₹85,000/month</p>
              <p className="ftproperty-furniture">Furtinue: Fully-Furnished</p>
            </div>
          </div>

          {/* CARD 5 */}
          <div
            className="ftproperty-card"
            onClick={goToUserOrLogin}
            role="button"
            tabIndex={0}
            style={{ cursor: "pointer" }}
          >
            <img
              src="https://images.pexels.com/photos/2079234/pexels-photo-2079234.jpeg"
              alt="Budget flat"
              className="ftproperty-image"
            />
            <div className="ftproperty-details">
              <h4>1BHK Budget Flat</h4>
              <p className="ftproperty-location">📍 City: Bangalore | Locality: Whitefield</p>
              <p className="ftproperty-price">Rent: ₹12,000/month</p>
              <p className="ftproperty-furniture">Furtinue: Semi-Furnished</p>
            </div>
          </div>
        </div>
      </section>

     <section className="reviews-section">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="reviews-scroll">
          <div className="review-card">
            <div className="review-header">
              <div className="reviewer-avatar">A</div>
              <div className="reviewer-info">
                <h5>Ananya Sharma</h5>
                <div className="review-rating">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <p className="review-text">
              "StayPal made my relocation to Bangalore so easy! Found the perfect
              flat with amazing roommates within a week. The compatibility
              matching really works!"
            </p>
          </div>

          <div className="review-card">
            <div className="review-header">
              <div className="reviewer-avatar">R</div>
              <div className="reviewer-info">
                <h5>Rahul Mehta</h5>
                <div className="review-rating">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <p className="review-text">
              "As a property owner, listing on StayPal was seamless. Got genuine
              inquiries and found reliable tenants in no time. Highly recommend!"
            </p>
          </div>

          <div className="review-card">
            <div className="review-header">
              <div className="reviewer-avatar">P</div>
              <div className="reviewer-info">
                <h5>Priya Desai</h5>
                <div className="review-rating">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <p className="review-text">
              "I was skeptical about finding roommates online, but StayPal's
              verification process gave me confidence. Met wonderful people who
              became good friends!"
            </p>
          </div>

          <div className="review-card">
            <div className="review-header">
              <div className="reviewer-avatar">V</div>
              <div className="reviewer-info">
                <h5>Vikram Singh</h5>
                <div className="review-rating">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <p className="review-text">
              "The interface is super intuitive and the property listings are
              genuine. Found my dream apartment in Mumbai at a great price.
              Thanks StayPal!"
            </p>
          </div>

          <div className="review-card">
            <div className="review-header">
              <div className="reviewer-avatar">S</div>
              <div className="reviewer-info">
                <h5>Sneha Patel</h5>
                <div className="review-rating">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <p className="review-text">
              "Best platform for students! Found affordable accommodation near my
              college with roommates who share similar schedules. Couldn't ask
              for more!"
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
        <div className="footer-logo">
          <img src={StayPalLogo} alt="StayPal Logo" className="footer-header-logo" />
          
          <span>StayPal</span>
          </div>
          <div className="footer-contact">
            <h4>Get In Touch</h4>
            <p>
              Customer Support:{" "}
              <a href="mailto:support@staypal.com">support@staypal.com</a>
            </p>
            <p>
              Business Inquiries:{" "}
              <a href="mailto:business@staypal.com">business@staypal.com</a>
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 StayPal. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
