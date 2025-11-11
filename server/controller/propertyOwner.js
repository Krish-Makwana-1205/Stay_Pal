const property = require("../model/property");
// const { getCoordinates } = require("../utils/geocode.js");

// require("dotenv").config();


async function uploadProperty(req, res) {
  try {
    const imgUrls = req.files.map(file => file.path);
    let body = req.body;
    // Trim trailing spaces AND convert to lowercase for relevant fields
    if (body.description) body.description = body.description.trimEnd().toLowerCase();
    if (body.rent) body.rent = body.rent;
    if (body.nation) body.nation = body.nation.trimEnd().toLowerCase();
    if (body.pincode) body.pincode = body.pincode;
    if (body.city) body.city = body.city.trimEnd().toLowerCase();
    if (body.address) body.address = body.address.trimEnd().toLowerCase();
    if (body.addressLink) body.addressLink = body.addressLink.trimEnd();

    // Required fields check
    if (
      !body.name || !body.description || !body.BHK ||
      !body.rent || !body.nation || !body.pincode || !body.city || !body.locality || !body.houseType
    ) {
      return res.status(400).json({ message: "Required fields missing" });
    }
                                
    // let latitude, longitude;

    // try {
    //   const coords = await getCoordinates(body.address, body.addressLink);
    //   latitude = coords.latitude;
    //   longitude = coords.longitude;
    // } catch (error) {
    //   console.error("Coordinate error:", error.message);
    //   return res.status(500).json({ message: "Unable to fetch location coordinates" });
    // }
    if(!req.user.email){
        return res.status(400).json({ message: "User is not logged in" });
    }
    const Property = await property.findOneAndUpdate(
      { email: req.user.email, name: body.name },
      {
        email: req.user.email,
        name: body.name,
        imgLink: imgUrls,
        description: body.description,
        BHK: body.BHK,
        rent:body.rent,
        locality: body.locality,
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
        houseType: body.houseType,
        isRoommate: body.isRoommate,
      },
      { new: true, timestamps: true, upsert: true }
    );
    return res.status(200).json({ message: "Property created successfully" });
  } catch (error) {
    console.error("Error uploading property:", error.message);
    return res.status(500).json({ message: "Error uploading property", error: error.message });
  }
}
async function addTenantPreferences(req, res) {
  try {
    if (!req.user.email || !req.body.name) {
      return res.status(400).json({ message: "User not defined" });
    }

    const updated = await property.findOneAndUpdate(
      { email:req.user.email, name:req.body.name },
      {
        tenantPreferences: {
          gender: req.body.gender || "Any",
          upperagelimit: req.body.upperagelimit,
          loweragelimit: req.body.loweragelimit,
          occupation: req.body.occupation || null,
          maritalStatus: req.body.maritalStatus || "Any",
          family: req.body.family || "Any",
          foodPreference: req.body.foodPreference || "Any",
          smoking: req.body.smoking || false,
          alcohol: req.body.alcohol || false,
          pets: req.body.pets,
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
// async function findNearestProperty(req, res) {
//   try {
//     const { addressLink } = req.body; 

//     if (!addressLink) {
//       return res.status(400).json({ message: "Address link is required" });
//     }

    
//     const coordMatch = addressLink.match(/(-?\d{1,3}\.\d+)[ ,]+(-?\d{1,3}\.\d+)/);
//     if (!coordMatch) {
//       return res.status(400).json({ message: "Could not extract coordinates from address link" });
//     }

//     const latitude = parseFloat(coordMatch[1]);
//     const longitude = parseFloat(coordMatch[2]);

//     const nearest = await property.find({
//       location: {
//         $near: {
//           $geometry: {
//             type: "Point",
//             coordinates: [longitude, latitude],
//           },
//           $maxDistance: 10000, // 10 km radius
//         },
//       },
//     });

//     if (nearest.length === 0) {
//       return res.status(404).json({ message: "No nearby properties found" });
//     }

//     res.status(200).json({ message: "Nearby properties found", properties: nearest });
//   } catch (error) {
//     console.error("Error finding nearby properties:", error);
//     res.status(500).json({ message: "Error finding nearby properties", error: error.message });
//   }
// }



module.exports = {
  uploadProperty,
  addTenantPreferences,
  // findNearestProperty
};