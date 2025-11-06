// const axios = require("axios");


// async function getCoordinates(address, addressLink) {
//   try {
//     const apiKey = process.env.OPENCAGE_API_KEY;
//     if (!apiKey) throw new Error("Missing OpenCage API key");

//     if (addressLink) {
//       const coordMatch = addressLink.match(
//         /(-?\d{1,3}\.\d+)[ ,]+(-?\d{1,3}\.\d+)/
//       );
//       if (coordMatch) {
//         const lat = parseFloat(coordMatch[1]);
//         const lng = parseFloat(coordMatch[2]);
//         return { latitude: lat, longitude: lng };
//       }
//     }
//     if (!address) throw new Error("No address provided");

//     const encoded = encodeURIComponent(address);
//     const url = 'https://api.opencagedata.com/geocode/v1/json?q=${encoded}&key=${apiKey}';

//     const response = await axios.get(url);

//     if (response.data.results && response.data.results.length > 0) {
//       const { lat, lng } = response.data.results[0].geometry;
//       return { latitude: lat, longitude: lng };
//     } else {
//       throw new Error("No results found for given address");
//     }
//   } catch (error) {
//     console.error("Geocoding error:", error.message);
//     throw new Error("Geocoding failed");
//   }
// }

// module.exports = { getCoordinates };