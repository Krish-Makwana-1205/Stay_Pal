const property = require("../model/property");
const tenant = require("../model/tenant");
const user = require("../model/user");


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