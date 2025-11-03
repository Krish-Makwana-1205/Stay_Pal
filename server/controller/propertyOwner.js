const property = require("../model/property");

async function uploadProperty(req, res) {
  try {
    const imgUrls = req.files.map(file => file.path);
    const body = req.body;
    if (!body.name || !body.email || !body.description || !body.BHK || !body.rentLowerBound || !body.rentUpperBound || !body.nation || !body.pincode || !body.city) {
      return res.status(400).json({ message: "Required fields missing" });
    }
    const addressLink = body.addressLink;
    const Property = await property.findOneAndUpdate(
      { email: body.email, name: body.name },
      {
        email: body.email,
        name: body.name,
        imgLink: imgUrls, 
        description: body.description,
        BHK: body.BHK,
        rentLowerBound: body.rentLowerBound,
        rentUpperBound: body.rentUpperBound,
        address: body.address,
        addressLink: addressLink,
        nation: body.nation,
        pincode: body.pincode,
        city: body.city,
        furnishingType: body.furnishingType || "Unfurnished",
        areaSize: body.areaSize ? Number(body.areaSize) : null,
        nearbyPlaces: Array.isArray(body.nearbyPlaces) ? body.nearbyPlaces : [],
        transportAvailability: body.transportAvailability === "true" || body.transportAvailability === true,
        parkingArea: body.parkingArea === "true" || body.parkingArea === true,
        specialFeatures: Array.isArray(body.specialFeatures) ? body.specialFeatures : []
      },
      { new: true, timestamps: true , upsert: true}
    );
    console.log(Property);
    return res.status(200).json({ message: "Property created" });
  } catch (error) {
    return res.status(500).json({ message: "Error uploading images", error: error });
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


module.exports = {
  uploadProperty,
  addTenantPreferences
};
