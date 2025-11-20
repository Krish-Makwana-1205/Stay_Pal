import React from "react";
import PropertyCard from "./PropertyCard";
import "./FeaturedProperties.css";


const FeaturedProperties = ({ loading, error, properties = [], onPropertyClick }) => {
  if (loading) return <p>Loading properties…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!properties || properties.length === 0) return <p>Select a city to view available properties.</p>;

  return (
    <div className="featured-properties">
      {properties.slice(0, 4).map((p, idx) => (
        <PropertyCard
          key={p._id || idx}
          property={p}
          onClick={() => onPropertyClick(p)}
        />
      ))}
    </div>
  );
};

export default FeaturedProperties;
