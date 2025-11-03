const property = require("../model/property");
const Tenant = require("../model/tenant");
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
  console.log('run');
  try {
    const {
      BHK,
      rentLowerBound,
      rentUpperBound,
      city,
      furnishingType,
      areaSize,
      transportAvailability,
      page = 1,
      limit = 10,
    } = req.query;
    if(!req.user.email){
      return res.status(501).json({success:false, message:"User not defined"});
    }
    const {
      tenantPreferences = {}
    } = await Tenant.findOne({email:req.user.email});
    if (!city) {
      return res.status(400).json({ success: false, message: "City not provided" });
    }

    const filterCriteria = { city };

    if (rentLowerBound && rentUpperBound) {
      filterCriteria.$and = [
        { rentLowerBound: { $gte: Number(rentLowerBound) } },
        { rentUpperBound: { $lte: Number(rentUpperBound) } },
      ];
    } else if (rentLowerBound) {
      filterCriteria.rentLowerBound = { $gte: Number(rentLowerBound) };
    } else if (rentUpperBound) {
      filterCriteria.rentUpperBound = { $lte: Number(rentUpperBound) };
    }

    const skip = (page - 1) * Number(limit);

    let properties = await property.find(filterCriteria).skip(skip).limit(limit);

    const calculatePoints = (prop) => {
      let points = 0;

      if (BHK && prop.BHK) {
        const diff = Math.abs(prop.BHK - BHK);
        points += Math.max(0, 10 - diff); 
      }

      if (furnishingType && prop.furnishingType) {
        if (prop.furnishingType.toLowerCase() === furnishingType.toLowerCase()) {
          points += 10;
        } else {
          if(prop.furnishingType.toLowerCase() == 'semi furnished' || furnishingType.toLowerCase() == 'semi furnished'){
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
          if (tenantPreferences.smoking === prefs.smoking) points += 3;
        }

        if (tenantPreferences.alcohol && prefs.alcohol !== "Any") {
          if (tenantPreferences.alcohol === prefs.alcohol) points += 4;
        }

        if (tenantPreferences.professionalStatus && prefs.professionalStatus !== "Any") {
          if (tenantPreferences.professionalStatus === prefs.professionalStatus) points += 1;
        }

        if (tenantPreferences.workingShift && prefs.workingShift !== "Any") {
          if (tenantPreferences.workingShift === prefs.workingShift) points += 2;
        }

        if (tenantPreferences.language && prefs.language !== "Any") {
          if (tenantPreferences.language === prefs.language) points += 2;
        }
      }

      return points;
    };

    properties = properties.map((prop) => ({
      ...prop.toObject(),
      points: calculatePoints(prop),
    }));
    console.log(properties);
    properties.sort((a, b) => b.points - a.points);
    console.log(properties);
    res.status(200).json({
      success: true,
      count: properties.length,
      page: Number(page),
      data: properties,
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
