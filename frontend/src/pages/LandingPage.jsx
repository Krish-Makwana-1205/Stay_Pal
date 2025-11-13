import React from "react";
import { useAuth } from "../context/AuthContext";
import "../StyleSheets/LandingPage.css";
import { Link } from "react-router-dom";
import StayPalLogo from "../assets/logo_blue.png"; 

export default function LandingPage() {
  const { user, loading } = useAuth();

  const getStartedLink = user ? "/usercard" : "/signup";

  return (
    <main className="card">
      {/* Hero Section */}
      <div className="content-wrapper">
        <header className="hero-header">
          <img src={StayPalLogo} alt="StayPal Logo" className="header-logo" />
          <h1 className="logo">StayPal</h1>
        </header>

        <div className="text-content">
          <p className="tagline">
            The one-stop solution for all your renting problems
          </p>
          <p className="description">
            StayPal makes finding your next home or the perfect flatmate a
            breeze. Our intuitive platform connects you with verified listings
            and compatible individuals, ensuring a smooth and stress-free renting
            experience. Discover your <strong>ideal living situation</strong> with
            StayPal.
          </p>

          {!loading && (
            <Link to={getStartedLink} className="cta-button">
              Get Started
              <span className="cta-arrow">→</span>
            </Link>
          )}
        </div>

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

      {/* Features Section - MODIFIED */}
      <section className="features-section">
        <h2 className="section-title">How StayPal Works For You</h2>

        {/* Main Features - MODIFIED STRUCTURE */}
        <div className="main-features">
          <div className="feature-card large-feature-card"> {/* Added a class for styling */}
            <div className="feature-content-wrapper">
                <div className="feature-text">
                    <h3>Find Your Perfect Flat</h3>
                    <p>
                        Browse through verified property listings and discover flats that
                        match your preferences, budget, and location needs.
                    </p>
                </div>
                <div className="feature-image-container">
                    <img src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Modern apartment" className="feature-image"/>
                </div>
            </div>
          </div>

          <div className="feature-card large-feature-card"> {/* Added a class for styling */}
            <div className="feature-content-wrapper reverse-layout"> {/* Added reverse-layout for alternating */}
                <div className="feature-text">
                    <h3>Match With Roommates</h3>
                    <p>
                        Connect with compatible roommates based on lifestyle preferences,
                        habits, and interests for a harmonious living experience.
                    </p>
                </div>
                <div className="feature-image-container">
                    <img src="https://images.pexels.com/photos/7075778/pexels-photo-7075778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="People interacting" className="feature-image"/>
                </div>
            </div>
          </div>

          <div className="feature-card large-feature-card"> {/* Added a class for styling */}
            <div className="feature-content-wrapper">
                <div className="feature-text">
                    <h3>Move Into Shared Spaces</h3>
                    <p>
                        Find flats with existing flatmates looking for another tenant—your
                        room and new friends are waiting for you!
                    </p>
                </div>
                <div className="feature-image-container">
                    <img src="https://images.pexels.com/photos/101808/pexels-photo-101808.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Moving boxes" className="feature-image"/>
                </div>
            </div>
          </div>
        </div>

        {/* Minor Features - NO CHANGE IN STRUCTURE, ONLY CSS */}
        <div className="minor-features">
          <div className="minor-feature small-minor-feature"> {/* Added a class for styling */}
            <div className="minor-feature-icon">📤</div>
            <h4>List Your Property</h4>
            <p>
              Property owners can easily upload and showcase their rentals to
              reach thousands of potential tenants.
            </p>
          </div>

          <div className="minor-feature small-minor-feature"> {/* Added a class for styling */}
            <div className="minor-feature-icon">✨</div>
            <h4>Smart Compatibility Matching</h4>
            <p>
              Select qualities you desire in a roommate and let our algorithm
              match you with the most compatible people.
            </p>
          </div>
        </div>
      </section>

      {/* ... (rest of your component remains the same) ... */}
      <section className="properties-section">
        <h2 className="section-title">Featured Properties</h2>
        <div className="properties-scroll">
          <div className="property-card">
            <img
              src="https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg"
              alt="Modern apartment"
              className="property-image"
            />
            <div className="property-details">
              <h4>Modern 2BHK Apartment</h4>
              <p className="property-location">📍 Downtown, Mumbai</p>
              <p className="property-price">₹25,000/month</p>
              <div className="property-features">
                <span>🛏️ 2 Beds</span>
                <span>🚿 2 Baths</span>
                <span>📏 1200 sq ft</span>
              </div>
            </div>
          </div>

          <div className="property-card">
            <img
              src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg"
              alt="Cozy studio"
              className="property-image"
            />
            <div className="property-details">
              <h4>Cozy Studio Apartment</h4>
              <p className="property-location">📍 Koramangala, Bangalore</p>
              <p className="property-price">₹18,000/month</p>
              <div className="property-features">
                <span>🛏️ 1 Bed</span>
                <span>🚿 1 Bath</span>
                <span>📏 650 sq ft</span>
              </div>
            </div>
          </div>

          <div className="property-card">
            <img
              src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
              alt="Spacious villa"
              className="property-image"
            />
            <div className="property-details">
              <h4>Spacious 3BHK Villa</h4>
              <p className="property-location">📍 Gurgaon, Delhi NCR</p>
              <p className="property-price">₹45,000/month</p>
              <div className="property-features">
                <span>🛏️ 3 Beds</span>
                <span>🚿 3 Baths</span>
                <span>📏 2000 sq ft</span>
              </div>
            </div>
          </div>

          <div className="property-card">
            <img
              src="https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg"
              alt="Luxury penthouse"
              className="property-image"
            />
            <div className="property-details">
              <h4>Luxury Penthouse</h4>
              <p className="property-location">📍 Bandra West, Mumbai</p>
              <p className="property-price">₹85,000/month</p>
              <div className="property-features">
                <span>🛏️ 4 Beds</span>
                <span>🚿 4 Baths</span>
                <span>📏 3500 sq ft</span>
              </div>
            </div>
          </div>

          <div className="property-card">
            <img
              src="https://images.pexels.com/photos/2079234/pexels-photo-2079234.jpeg"
              alt="Budget friendly flat"
              className="property-image"
            />
            <div className="property-details">
              <h4>Budget-Friendly 1BHK</h4>
              <p className="property-location">📍 Whitefield, Bangalore</p>
              <p className="property-price">₹12,000/month</p>
              <div className="property-features">
                <span>🛏️ 1 Bed</span>
                <span>🚿 1 Bath</span>
                <span>📏 550 sq ft</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
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
          <p>&copy; 2024 StayPal. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}