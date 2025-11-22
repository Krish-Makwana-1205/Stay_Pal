const property = require("../model/property");

async function findNearestProperty(req, res) {
  try {
    let { addressLink , radius} = req.query;
    radius = (radius*1000);
    if(!radius){
      radius = 10000
    }
    if (!addressLink) {
      return res.status(400).json({ message: "Address link is required" });
    }


    const coordMatch = addressLink.match(/(-?\d{1,3}\.\d+)[ ,]+(-?\d{1,3}\.\d+)/);
    if (!coordMatch) {
      return res.status(400).json({ message: "Could not extract coordinates from address link" });
    }

    const latitude = parseFloat(coordMatch[1]);
    const longitude = parseFloat(coordMatch[2]);
    
    const nearest = await property.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: radius, 
        },
      },
    });

    if (nearest.length === 0) {
      return res.status(200).json({ message: "No nearby properties found" });
    }

    res.status(200).json({ message: "Nearby properties found", properties: nearest });
  } catch (error) {
    console.error("Error finding nearby properties:", error);
    res.status(500).json({ message: "Error finding nearby properties", error: error.message });
  }
}

module.exports = {
    findNearestProperty
}
