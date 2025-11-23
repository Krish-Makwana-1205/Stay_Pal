const axios = require("axios");

// Extract latitude/longitude from either:
// 1) A plain string containing numbers: "23.02,72.57" or "@23.02,72.57",
// 2) A Google Maps URL (including short maps.app.goo.gl links).
async function getCoordinates(addressLink) {
  try {
    if (!addressLink) {
      throw new Error("Address link is required");
    }

    const coordRegex = /(-?\d{1,3}\.\d+)[ ,@]+(-?\d{1,3}\.\d+)/;

    // 1) Directly from the string (works for raw coords and full Google Maps URLs)
    let match = addressLink.match(coordRegex);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      return { latitude: lat, longitude: lng };
    }

    // 2) If it's a URL (e.g. maps.app.goo.gl short link),
    //    follow redirects to the final Google Maps URL and
    //    try to read coordinates from there.
    if (/^https?:\/\//i.test(addressLink)) {
      const response = await axios.get(addressLink, {
        maxRedirects: 5,
        // Allow 3xx redirects as "ok" so axios follows them
        validateStatus: (status) => status >= 200 && status < 400,
      });

      const finalUrl =
        response.request?.res?.responseUrl ||
        response.request?._redirectable?._currentUrl ||
        response.request?._redirectable?._options?.href ||
        addressLink;

      match = finalUrl.match(coordRegex);
      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        return { latitude: lat, longitude: lng };
      }
    }

    // If still nothing, we don't attempt external geocoding here.
    throw new Error("No coordinates found in link");
  } catch (error) {
    console.error("Geocoding error:", error.message);
    throw new Error("Could not geocode address link");
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