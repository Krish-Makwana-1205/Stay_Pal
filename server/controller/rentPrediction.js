const property = require("../model/property");

const predictRent = async (req, res) => {
  try {
    const { city, BHK, areaSize, furnishingType } = req.query;

    // ALWAYS store/compare city in lowercase (same as uploadProperty)
    const normalizedCity = (city || "").trim().toLowerCase();

    // 1) Log raw incoming query params
    console.log("PREDICT RENT called with params:", {
      city: normalizedCity,
      BHK,
      areaSize,
      furnishingType,
    });
    // Basic validation
    if (!normalizedCity || !BHK || !areaSize) {
      console.log("PREDICT RENT -> missing required fields");
      return res.status(400).json({
        success: false,
        message: "Missing required fields (city, BHK or areaSize)",
      });
    }

    // ±30% area range
    const areaLower = Number(areaSize) * 0.7;
    const areaUpper = Number(areaSize) * 1.3;

    // ±1 BHK allowed
    const bhkMin = Number(BHK) - 1;
    const bhkMax = Number(BHK) + 1;

    // --------- MAIN QUERY: city + BHK range + area range ----------
    const baseQuery = {
  city: normalizedCity,
  BHK: { $gte: bhkMin, $lte: bhkMax },
  areaSize: { $gte: areaLower, $lte: areaUpper },
};

    // Furnishing logic: selected type OR "Any"
    if (furnishingType && furnishingType !== "Any") {
      const regex = new RegExp("^" + furnishingType + "$", "i");
      baseQuery.$or = [{ furnishingType: regex }, { furnishingType: "Any" }];
    }

    console.log(
      "PREDICT RENT -> main Mongo query:",
      JSON.stringify(baseQuery, null, 2)
    );

    let similarProps = await property
      .find(baseQuery)
      .select("city BHK areaSize furnishingType rent");

    console.log(
      "PREDICT RENT -> matched docs (with area filter):",
      similarProps.length
    );

    // --------- FALLBACK: if no docs, ignore areaSize completely ----------
    if (similarProps.length === 0) {
  const fallbackQuery = {
    city: normalizedCity,
    BHK: { $gte: bhkMin, $lte: bhkMax },
  };

      if (furnishingType && furnishingType !== "Any") {
        const regex = new RegExp("^" + furnishingType + "$", "i");
        fallbackQuery.$or = [
          { furnishingType: regex },
          { furnishingType: "Any" },
        ];
      }

      console.log(
        "PREDICT RENT -> fallback Mongo query (no area filter):",
        JSON.stringify(fallbackQuery, null, 2)
      );

      similarProps = await property
        .find(fallbackQuery)
        .select("city BHK areaSize furnishingType rent");

      console.log(
        "PREDICT RENT -> matched docs (fallback without area):",
        similarProps.length
      );
    }

    // Still nothing -> truly insufficient data
    if (similarProps.length === 0) {
      return res.status(200).json({
        success: true,
        status: "insufficient data",
        sampleSize: 0,
      });
    }

    // At least one doc -> compute range
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
      sampleSize: similarProps.length,
    });
  } catch (err) {
    console.error("PREDICT RENT -> ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { predictRent };