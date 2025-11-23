const property = require("../model/property");
const { getCoordinates } = require("../utils/geocode.js");

async function findNearestProperty(req, res) {
  try {
    let { addressLink, radius } = req.query;

    if (!addressLink) {
      return res.status(400).json({ message: "Address link is required" });
    }

    // Radius from km → meters. Default to 50km if not provided.
    let radiusMeters = Number(radius) * 1000;
    if (!radiusMeters || Number.isNaN(radiusMeters)) {
      radiusMeters = 50000; // 50 km
    }

    // Use common geocoding helper (works with coords, full URLs, plain text)
    let coords;
    try {
      coords = await getCoordinates(addressLink);
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Could not extract coordinates from address link" });
    }

    const { latitude, longitude } = coords;

    // Extra safety check
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res
        .status(400)
        .json({ message: "Invalid coordinates extracted from address link" });
    }

    const nearest = await property.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: radiusMeters,
        },
      },
    });

    if (nearest.length === 0) {
      return res.status(200).json({ message: "No nearby properties found" });
    }

    return res
      .status(200)
      .json({ message: "Nearby properties found", properties: nearest });
  } catch (error) {
    console.error("Error finding nearby properties:", error);
    res.status(500).json({
      message: "Error finding nearby properties",
      error: error.message,
    });
  }
}

module.exports = {
  findNearestProperty,
};
