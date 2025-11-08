import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Filters from "../Components/Filters";
import "../StyleSheets/Dashboard.css";
import { fetchproperty, fetchHome } from "../api/filters"; 
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const [houses, setHouses] = useState([]);
  const [dbProperties, setDbProperties] = useState([]);
  const [view, setView] = useState("home"); 
  const [loadingResults, setLoadingResults] = useState(false);
  const [loadingHome, setLoadingHome] = useState(false);
  const [propertyCount, setPropertyCount] = useState(4);
  const [tenantCount, setTenantCount] = useState(4);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!loading && user && user.istenant === false) {
      navigate("/usercard");
    }
  }, [loading, user, navigate]);

  // useEffect(() => {
  //   function updateCounts() {
  //     const w = window.innerWidth;
  //     if (w < 600) {
  //       setPropertyCount(1);
  //       setTenantCount(1);
  //     } else if (w < 900) {
  //       setPropertyCount(2);
  //       setTenantCount(2);
  //     } else {
  //       setPropertyCount(4);
  //       setTenantCount(4);
  //     }
  //   }
  //   updateCounts();
  //   window.addEventListener("resize", updateCounts);
  //   return () => window.removeEventListener("resize", updateCounts);
  // }, []);

  // reflect view from URL query param ?view=properties|roommates|shared
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qview = params.get("view");
    if (qview) setView(qview);
  }, [location.search]);

  // fetch a few properties for dashboard preview
  useEffect(() => {
    let mounted = true;
    async function loadHome() {
      setLoadingHome(true);
      try {
        const { data } = await fetchHome();
        if (mounted && data && data.data) {
          setDbProperties(data.data || []);
        }
      } catch (err) {
        console.error("Failed to load dashboard properties:", err);
      } finally {
        if (mounted) setLoadingHome(false);
      }
    }
    // only fetch if user is logged in (middleware expects authenticated request)
    if (!loading && user) loadHome();
    return () => { mounted = false; };
  }, [loading, user]);

  // real properties are loaded from backend into `dbProperties` (no dummy/sample properties)

  const sampleTenants = [
    { id: "t1", name: "Asha, 24", desc: "Student • Non-smoker" },
    { id: "t2", name: "Ravi, 28", desc: "Working • Night shift" },
    { id: "t3", name: "Maya, 22", desc: "Intern • Vegetarian" },
  ];

  const handleFilters = async (filters) => {
    setLoadingResults(true);
    try {
      const { data } = await fetchproperty(filters);
      setHouses(data.data || []);
    } catch (err) {
      console.error("Filter error:", err);
      setHouses([]);
    } finally {
      setLoadingResults(false);
      setView("properties");
    }
  };
console.log(user);
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const goToProfile = () => navigate("/usercard");

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      {view === "properties" && (
        <div className="dashboard-filters">
          <h2 className="filters-title">Filters</h2>
          <Filters onApply={handleFilters} />
        </div>
      )}
      <div className={`dashboard-main ${view === "properties" ? "with-filters" : ""}`}>
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome, {user?.username || "User"}</p>
          </div>
          <div className="dashboard-actions">
            <button className="btn" onClick={() => setView("home")}>Home</button>
            <button className="btn" onClick={() => setView("properties")}>Search</button>
            <button className="btn" onClick={goToProfile}>Profile</button>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <hr className="dashboard-hr" />

        {view === "home" && (
          <>
            <h2>Featured Properties</h2>
            <div className="featured-properties">
                {loadingHome ? (
                  <div>Loading properties…</div>
                ) : dbProperties.length === 0 ? (
                  <div>No properties available</div>
                ) : (
                  dbProperties.slice(0, propertyCount).map((p, idx) => {
                    const imgSrc = p.img || (p.imgLink && p.imgLink.length > 0 ? p.imgLink[0] : null);
                    return (
                      <div key={p._id || p.id || idx} className="property-card">
                        {imgSrc ? <img src={imgSrc} alt={p.city} className="property-img" /> : <div className="property-img-placeholder" />}
                        <div className="card-body">
                          <h3>{p.city} — {p.BHK} BHK</h3>
                          <p>Rent: ₹{p.rentLowerBound} - ₹{p.rentUpperBound}</p>
                          <p className="furnishing">{p.furnishingType}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              {dbProperties.length > propertyCount && (
                <div className="see-more-wrap">
                  <button className="see-more-btn" onClick={() => { navigate('/dashboard?view=properties'); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                    See more
                  </button>
                </div>
              )}
            </div>

            <h2 className="tenants-title">Sample Tenants</h2>
            <div className="sample-tenants">
              {sampleTenants.slice(0, tenantCount).map((t) => (
                <div key={t.id} className="tenant-card">
                  <h4>{t.name}</h4>
                  <p>{t.desc}</p>
                </div>
              ))}
              {sampleTenants.length > tenantCount && (
                <div className="see-more-wrap">
                  <button className="see-more-btn" onClick={() => { navigate('/dashboard?view=roommates'); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                    See more
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {view === "properties" && (
          <>
            <h2>Results {loadingResults ? " (loading...)" : ""}</h2>
            {houses.length === 0 ? (
              <p>No results found</p>
            ) : (
              houses.map((item, i) => (
                <div key={i} className="result-item">
                  <h3>{item.city} — {item.BHK} BHK</h3>
                  <p>Rent: ₹{item.rentLowerBound} - ₹{item.rentUpperBound}</p>
                  <p>Furnishing: {item.furnishingType}</p>
                  <p>Transport: {item.transportAvailability ? "Available" : "No"}</p>
                  {item.imgLink?.length > 0 && <img src={item.imgLink[0]} alt="Property" width="250" />}
                </div>
              ))
            )}
          </>
        )}

        {view === "roommates" && (
          <div>
            <h2>Roommates</h2>
            <p>Component for roommates will be added here. (Placeholder)</p>
          </div>
        )}

        {view === "shared" && (
          <div>
            <h2>Shared Properties</h2>
            <p>Component for shared properties will be added here. (Placeholder)</p>
          </div>
        )}
      </div>

      <div className="dashboard-right">
        <h3>Quick Views</h3>
        <div className="quick-buttons">
          <button className={`quick-btn ${view === "properties" ? "active" : ""}`} onClick={() => navigate('/dashboard?view=properties')}>
            View Properties
          </button>
          <button className={`quick-btn ${view === "roommates" ? "active" : ""}`} onClick={() => navigate('/dashboard?view=roommates')}>
            View Roommates
          </button>
          <button className={`quick-btn ${view === "shared" ? "active" : ""}`} onClick={() => navigate('/dashboard?view=shared')}>
            View Shared Property
          </button>
        </div>

  <hr className="dashboard-hr" />
        <div>
          <button className="sidebar-btn" onClick={() => navigate('/dashboard?view=home')}>Home</button>
          <Link to="/propertyForm" className="link-block">
            <button className="sidebar-btn">Add Property</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;