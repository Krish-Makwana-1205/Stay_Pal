const property = require("../model/property");
const { getCoordinates } = require("../utils/geocode.js");

require("dotenv").config();


async function uploadProperty(req, res) {
  try {
    const imgUrls = req.files.map(file => file.path);
    let body = req.body;

    // Trim trailing spaces AND convert to lowercase for relevant fields
    if (body.name) body.name = body.name.trimEnd().toLowerCase();
    if (body.email) body.email = body.email.trimEnd().toLowerCase();
    if (body.description) body.description = body.description.trimEnd().toLowerCase();
    if (body.BHK) body.BHK = body.BHK;
    if (body.rentLowerBound) body.rentLowerBound = body.rentLowerBound;
    if (body.rentUpperBound) body.rentUpperBound = body.rentUpperBound;
    if (body.nation) body.nation = body.nation.trimEnd().toLowerCase();
    if (body.pincode) body.pincode = body.pincode;
    if (body.city) body.city = body.city.trimEnd().toLowerCase();
    if (body.address) body.address = body.address.trimEnd().toLowerCase();
    if (body.addressLink) body.addressLink = body.addressLink.trimEnd();
    if (body.furnishingType) body.furnishingType = body.furnishingType.trimEnd().toLowerCase();

    // Required fields check
    if (
      !body.name || !body.email || !body.description || !body.BHK ||
      !body.rentLowerBound || !body.rentUpperBound ||
      !body.nation || !body.pincode || !body.city
    ) {
      return res.status(400).json({ message: "Required fields missing" });
    }


    let latitude, longitude;

    try {
      const coords = await getCoordinates(body.address, body.addressLink);
      latitude = coords.latitude;
      longitude = coords.longitude;
    } catch (error) {
      console.error("Coordinate error:", error.message);
      return res.status(500).json({ message: "Unable to fetch location coordinates" });
    }
    req.user.email = req.user.email.trimEnd().toLowerCase();
    const Property = await property.findOneAndUpdate(
      { email: body.email, name: body.name },
      {
        email: req.user.email,
        name: body.name,
        imgLink: imgUrls,
        description: body.description,
        BHK: body.BHK,
        rentLowerBound: body.rentLowerBound,
        rentUpperBound: body.rentUpperBound,
        address: body.address,
        addressLink: body.addressLink,
        nation: body.nation,
        pincode: body.pincode,
        city: body.city,
        furnishingType: body.furnishingType || "unfurnished", // lowercase default too
        areaSize: body.areaSize ? Number(body.areaSize) : null,
        nearbyPlaces: Array.isArray(body.nearbyPlaces) ? body.nearbyPlaces.map(place => place.trimEnd().toLowerCase()) : [],
        transportAvailability: body.transportAvailability === "true" || body.transportAvailability === true,
        parkingArea: body.parkingArea,
        specialFeatures: Array.isArray(body.specialFeatures) ? body.specialFeatures.map(feature => feature.trimEnd().toLowerCase()) : []
      },
      { new: true, timestamps: true, upsert: true }
    );

    console.log(Property);
    return res.status(200).json({ message: "Property created successfully" });
  } catch (error) {
    console.error("Error uploading property:", error.message);
    return res.status(500).json({ message: "Error uploading property", error: error.message });
  }
}
async function addTenantPreferences(req, res) {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: "Email and property name are required" });
    }

    const updated = await property.findOneAndUpdate(
      { email, name },
      {
        tenantPreferences: {
          gender: req.body.gender || "Any",
          ageRange: req.body.ageRange || null,
          occupation: req.body.occupation || null,
          maritalStatus: req.body.maritalStatus || "Any",
          family: req.body.family || "Any",
          foodPreference: req.body.foodPreference || "Any",
          smoking: req.body.smoking || "Any",
          alcohol: req.body.alcohol || "Any",
          pets: req.body.pets === "true" || req.body.pets === true,
          nationality: req.body.nationality || "Any",
          workingShift: req.body.workingShift || "Any",
          professionalStatus: req.body.professionalStatus || "Any",
          religion: req.body.religion || "Any",
          language: req.body.language || "Any",
          minStayDuration: Number(req.body.minStayDuration) || 0,
          maxPeopleAllowed: Number(req.body.maxPeopleAllowed) || 0,
          notes: req.body.notes || null
        }
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Property not found" });
    }

    return res.status(200).json({ success: true, message: "Tenant preferences saved", data: updated });
  } catch (error) {
    console.error("Error saving tenant preferences:", error.message);
    return res.status(500).json({ message: "Error saving tenant preferences", error: error.message });
  }
}
async function findNearestProperty(req, res) {
  try {
    const { addressLink } = req.body; 

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
          $maxDistance: 10000, // 10 km radius
        },
      },
    });

    if (nearest.length === 0) {
      return res.status(404).json({ message: "No nearby properties found" });
    }

    res.status(200).json({ message: "Nearby properties found", properties: nearest });
  } catch (error) {
    console.error("Error finding nearby properties:", error);
    res.status(500).json({ message: "Error finding nearby properties", error: error.message });
  }
}



module.exports = {
  uploadProperty,
  addTenantPreferences,
  findNearestProperty
};