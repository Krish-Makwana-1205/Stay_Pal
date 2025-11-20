import React from "react";


const PropertyCard = ({ property, onClick }) => {
  const p = property;
  const imgSrc = p.img || (p.imgLink?.length > 0 ? p.imgLink[0] : null);

  return (
    <div
      className="property-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onClick(); }}
    >
      {imgSrc ? (
        <img src={imgSrc} alt={p.city || p.name} className="property-img" />
      ) : (
        <div className="property-img-placeholder" />
      )}

      <div className="card-body">
        <h2>{p.name}</h2>
        <h3>{p.city} — {p.BHK} BHK</h3>
        <p>Rent: ₹{p.rent}</p>

        <div className="property-location-icon">
          <img
            src="/location-icon.png"
            alt="Open location"
            style={{ width: "20px", cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              if (p?.addressLink) {
                window.open(p.addressLink, "_blank", "noopener,noreferrer");
              }
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter") {
              e.stopPropagation();
              if (p?.addressLink) window.open(p.addressLink, "_blank", "noopener,noreferrer");
            }}}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
