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
      page = 1,
      limit = 10,
    } = req.body;

    const body = {};

    if (city) body.city = new RegExp(`^${city}$`, "i");

    if (BHK) body.BHK = Number(BHK);
    if (furnishingType)
      body.furnishingType = new RegExp(`^${furnishingType}$`, "i");

    if (areaSize) body.areaSize = { $gte: Number(areaSize) };

    if (rentLowerBound || rentUpperBound) {
      body.rentLowerBound = {};
      if (rentLowerBound) body.rentLowerBound.$gte = Number(rentLowerBound);
      if (rentUpperBound) body.rentLowerBound.$lte = Number(rentUpperBound);
    }

    const skip = (page - 1) * Number.parseInt(limit);

    const sortOrder = {
      priority: -1,         
      BHK: 1,               
      rentLowerBound: 1,    
      furnishingType: 1,    
      areaSize: 1          
    };

    const [properties, total] = await Promise.all([
      property.find(body).sort(sortOrder).skip(skip).limit(Number.parseInt(limit)),
      property.countDocuments(body),
    ]);

    res.status(200).json({ success: true,total,count: properties.length, page: Number.parseInt(page), sortOrderUsed: sortOrder, data: properties});
  } 
  catch(error){
    res.status(500).json({ success: false, message: "Error filtering properties", error: error.message});
  }
}

module.exports = { home, filterProperties };
