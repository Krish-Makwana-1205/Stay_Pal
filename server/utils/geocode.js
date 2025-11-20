const axios = require("axios");


async function getCoordinates(addressLink) {
  try {
    const apiKey = process.env.OPENCAGE_API_KEY;
    if (!apiKey) throw new Error("Missing OpenCage API key");

    if (addressLink) {
      const coordMatch = addressLink.match(
        /(-?\d{1,3}\.\d+)[ ,]+(-?\d{1,3}\.\d+)/
      );
      if (coordMatch) {
        const lat = parseFloat(coordMatch[1]);
        const lng = parseFloat(coordMatch[2]);
        return { latitude: lat, longitude: lng };
      }
    }
    const url = 'https://api.opencagedata.com/geocode/v1/json?q=${encoded}&key=${apiKey}';

    const response = await axios.get(url);
    if (response.data.results && response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry;
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error("No results found for given address");
    }
  } catch (error) {
    console.error("Geocoding error:", error.message);
    throw new Error("Geocoding failed");
  }
}


async function distance_Scoring(latitude1, longitude1, latitude2, longitude2) {
  // Validate all inputs
  if (
    typeof latitude1 !== "number" || typeof longitude1 !== "number" ||
    typeof latitude2 !== "number" || typeof longitude2 !== "number"
  ) {
    return { distanceKm: null, points: 0 };
  }

  // Additional geo range validation
  if (
    latitude1 < -90 || latitude1 > 90 ||
    latitude2 < -90 || latitude2 > 90 ||
    longitude1 < -180 || longitude1 > 180 ||
    longitude2 < -180 || longitude2 > 180
  ) {
    return { distanceKm: null, points: 0 };
  }

  // Convert degrees → radians
  const toRad = (deg) => (deg * Math.PI) / 180;

  const R = 6371.0088; // Earth radius in km (WGS-84)
  const dLat = toRad(latitude2 - latitude1);
  const dLon = toRad(longitude2 - longitude1);

  const lat1Rad = toRad(latitude1);
  const lat2Rad = toRad(latitude2);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceKm = R * c;

  // ----- Scoring logic -----
  let points = 0;
  if (distanceKm <= 2) points = 20;
  else if (distanceKm <= 5) points = 15;
  else if (distanceKm <= 15) points = 10;
  else if (distanceKm <= 30) points = 5;
  else points = 0;

  return points;
}


module.exports = { getCoordinates, distance_Scoring };