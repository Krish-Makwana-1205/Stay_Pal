const property = require("../model/property");
const Tenant = require("../model/tenant");
const {getSimilarity} = require("../utils/nlp");

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
    let {
      BHK,
      rentLowerBound,
      rentUpperBound,
      city,
      locality,
      furnishingType,
      areaSize,
      transportAvailability,
      houseType,
      nearbyPlaces,
      page = 1,
      limit = 20,
      description,
    } = req.query;
    if (!req.user.email) {
      return res.status(400).json({ success: false, message: "User not defined" });
    }
    if(!rentLowerBound){
      rentLowerBound = 0;
    }
    if (!city) {
      return res.status(400).json({ success: false, message: "City not provided" });
    }
    city = city.trimEnd().toLowerCase();

    const filterCriteria = { city };

    if (rentLowerBound && rentUpperBound) {
      filterCriteria.$and = [
        { rent: { $gte: Number(rentLowerBound) } },
        { rent: { $lte: Number(rentUpperBound) } },
      ];
    } else if (rentLowerBound) {
      filterCriteria.rent = { $gte: Number(rentLowerBound) };
    } else if (rentUpperBound) {
      filterCriteria.rent = { $lte: Number(rentUpperBound) };
    }
    console.log(filterCriteria);

    const skip = (page - 1) * Number(limit);

    let [tenantPreferences, properties] = await Promise.all([
      Tenant.findOne({ email: req.user.email }),
      property.find(filterCriteria).skip(skip).limit(limit),
    ]);
    const calculatePoints = async (prop) => {
      let points = 0;
      if (locality && prop.locality) {
        if (locality == prop.locality) {
          points += 15;
        }
      }
      if (houseType && prop.houseType) {
        if (houseType == prop.houseType) {
          points += 10;
        }
      }
      if (BHK && prop.BHK) {
        const diff = Math.abs(prop.BHK - BHK);
        points += Math.max(0, 10 - diff);
      }

      if (furnishingType && prop.furnishingType) {
        if (prop.furnishingType.toLowerCase() === furnishingType.toLowerCase()) {
          points += 10;
        } else {
          if (prop.furnishingType.toLowerCase() == 'semi furnished' || furnishingType.toLowerCase() == 'semi furnished') {
            points += 5;
          }
        }
      }

      if (areaSize && prop.areaSize) {
        const diff = prop.areaSize - areaSize;
        points += Math.max(0, 10 + diff / 100);
      }

      if (typeof transportAvailability === "boolean" && prop.transportAvailability === transportAvailability) {
        points += 7;
      }

      if (tenantPreferences) {
        const prefs = prop.tenantPreferences || {};

        if (tenantPreferences.gender && prefs.gender !== "Any") {
          if (tenantPreferences.gender === prefs.gender) points += 5;
        }

        if (tenantPreferences.maritalStatus && prefs.maritalStatus !== "Any") {
          if (tenantPreferences.maritalStatus === prefs.maritalStatus) points += 2;
        }

        if (tenantPreferences.family && prefs.family !== "Any") {
          if (tenantPreferences.family === prefs.family) points += 2;
        }

        if (tenantPreferences.foodPreference && prefs.foodPreference !== "Any") {
          if (tenantPreferences.foodPreference === prefs.foodPreference) points += 1;
        }

        if (tenantPreferences.smoking && prefs.smoking !== "Any") {
          if (tenantPreferences.smoking === prefs.smoking) points += 2;
        }

        if (tenantPreferences.alcohol && prefs.alcohol !== "Any") {
          if (tenantPreferences.alcohol === prefs.alcohol) points += 4;
        }

        if (tenantPreferences.professionalStatus && prefs.professionalStatus !== "Any") {
          if (tenantPreferences.professionalStatus === prefs.professionalStatus) points += 1;
        }

        if (tenantPreferences.workingshifts && prefs.workingShift !== "Any") {
          if (tenantPreferences.workingshifts === prefs.workingShift) points += 1;
        }

        if (tenantPreferences.language && prefs.language !== "Any") {
          if (tenantPreferences.language === prefs.language) points += 2;
        }
      }
      if(description && prop.description){
        let simi = await getSimilarity(description, prop.description);
        points += simi*18; 
      }
      return points;
    };

    // Calculate points for all properties in parallel
    let scoredProperties = await Promise.all(
      properties.map(async (prop) => ({
        ...prop.toObject(),
        points: await calculatePoints(prop),
      }))
    );

    // Sort by points descending
    scoredProperties.sort((a, b) => b.points - a.points);

    return res.status(200).json({
      success: true,
      count: scoredProperties.length,
      page: Number(page),
      data: scoredProperties,
    });
  } catch (error) {
    console.error("Error filtering properties:", error);
    res.status(500).json({
      success: false,
      message: "Error filtering properties",
      error: error.message,
    });
  }
}


module.exports = { home, filterProperties };
