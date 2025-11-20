const property = require("../model/property");

const predictRent = async (req, res) => {
  try {
    const { city, BHK, areaSize, furnishingType } = req.query;

    if (!city || !BHK || !areaSize || !furnishingType) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }
    // ±30% area range
    const areaLower = Number(areaSize) * 0.7;
    const areaUpper = Number(areaSize) * 1.3;

    // ±1 BHK allowed
    const bhkMin = Number(BHK) - 1;
    const bhkMax = Number(BHK) + 1;

    const similarProps = await property.find({
      city,
      BHK: { $gte: bhkMin, $lte: bhkMax },
      furnishingType: { $regex: new RegExp("^" + furnishingType + "$", "i") },
      areaSize: { $gte: areaLower, $lte: areaUpper }
    }).select("rent");

    if (similarProps.length < 2) {
      return res.status(200).json({
        success: true,
        status: "insufficient data",
        sampleSize: similarProps.length
      });
    }

    const total = similarProps.reduce(
      (sum, p) => sum + (p.rent || 0),
      0
    );

    const avgRent = total / similarProps.length;

    return res.status(200).json({
      success: true,
      status: "ok",
      min: Math.round(avgRent * 0.9),
      max: Math.round(avgRent * 1.1),
      sampleSize: similarProps.length
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
module.exports = { predictRent };
