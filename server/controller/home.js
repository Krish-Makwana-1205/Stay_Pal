const property = require("../model/property");

async function home(req, res) {
  try {
    const properties = await property.find();
    return res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error loading dashboard data",
      error: error.message,
    });
  }
}

async function filterProperties(req, res) {
  try {
    const {
      BHK,
      rentLowerBound,
      rentUpperBound,
      city,
      furnishingType,
      areaSize,
      parkingArea,
      page = 1,
      limit = 10,
    } = req.body;

    const body = {};

    if (!city) {
      return res.status(400).json({ success: false, message: "city not found" });
    }

    body.city =  "Ahmedabad";
;

    if (BHK) body.BHK = Number(BHK);

    if (furnishingType) body.furnishingType = furnishingType.trimEnd().toLowerCase();

    if (areaSize) body.areaSize = Number(areaSize);

    if (parkingArea) body.parkingArea = Number(parkingArea);


    if (rentLowerBound) body.rentLowerBound = Number(rentLowerBound);
    if (rentUpperBound) body.rentLowerBound = Number(rentUpperBound);



    const skip = (page - 1) * Number.parseInt(limit);
    const result = await property.find({city:body.city});
    console.log(result);

    res.status(200).json({ success: true, total, count: properties.length, page: Number.parseInt(page), sortOrderUsed: sortOrder, data: properties });
  }
  catch (error) {
    res.status(500).json({ success: false, message: "Error filtering properties", error: error.message });
  }
}

module.exports = { home, filterProperties };
