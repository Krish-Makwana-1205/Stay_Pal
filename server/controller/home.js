const property = require("../model/property");
const Tenant = require("../model/tenant");
const Application = require("../model/application");
const User = require("../model/user");
const { sendEmail } = require("../utils/mailer");
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

async function propertysend(req, res) {
  try {
    const { email, name } = req.query;
    if (!email || !name) {
      return res.status(400).json({ success: false, message: "Email and Property Name are required" });
    }

    const foundProperty = await property.findOne({ email, name });

    if (!foundProperty) { 
      return res.status(404).json({ success: false, message: "No property found "});
    }

    return res.status(200).json({ 
      success: true, message: "Property fetched successfully", data: foundProperty,
    });
  } 
  catch (error) {
    console.log("Error fetching property:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function applyForProperty(req, res) {
  try {
    const tenantEmail = req.user.email;
    const { propertyName, propertyOwnerEmail } = req.body;

    if (!tenantEmail) {
      return res.status(400).json({ success: false, message: "User not logged in" });
    }

    if (!propertyName || !propertyOwnerEmail) {
      return res.status(400).json({
        success: false,
        message: "Property name & owner email required",
      });
    }

    if (tenantEmail === propertyOwnerEmail) {
      return res.status(400).json({
        success: false,
        message: "You cannot apply to your own property",
      });
    }

    const [tenant, foundProperty] = await Promise.all([
      Tenant.findOne({ email: tenantEmail }),
      property.findOne({ name: propertyName, email: propertyOwnerEmail }),
    ]);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant profile not found",
      });
    }

    if (!foundProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    await Promise.all([
      Application.create({
        tenantEmail,
        propertyName,
        propertyOwnerEmail,
      }),

      sendEmail(
        propertyOwnerEmail,
        "New Tenant Application",
        `
          <h2>New Tenant Application</h2>
          <p>Your property <strong>${propertyName}</strong> has a new application.</p>

          <h3>Tenant Details</h3>
          <p><strong>Name:</strong> ${tenant.name}</p>
          <p><strong>Email:</strong> ${tenant.email}</p>
          <p><strong>Gender:</strong> ${tenant.gender}</p>
          <p><strong>Marital Status:</strong> ${tenant.maritalStatus}</p>
          <p><strong>Profession:</strong> ${tenant.professionalStatus}</p>
          <p><strong>Food Preference:</strong> ${tenant.foodPreference}</p>
          <p><strong>Work Shift:</strong> ${tenant.workingshifts}</p>
          <p><strong>Languages:</strong> ${tenant.language}</p>

          <br><p>Contact the tenant to proceed.</p>
        `
      )
    ]);

    return res.status(200).json({success: true, message: "Application sent successfully"});

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this property.",
      });
    }

    return res.status(500).json({success: false, message: "Server error", error: error.message});
  }
}


async function getOwnerApplications(req, res) {
  try {
    const ownerEmail = req.user.email;
    const { propertyName } = req.query;

    if (!propertyName) {
      return res.status(400).json({
        success: false,
        message: "Property name is required",
      });
    }

    const [propertyData, apps] = await Promise.all([
      property.findOne({ name: propertyName, email: ownerEmail }),
      Application.find({ propertyName, propertyOwnerEmail: ownerEmail }),
    ]);

    if (!propertyData) {
      return res.status(403).json({
        success: false,
        message: "Access denied: You do not own this property",
      });
    }

    if (apps.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        message: "0 tenants have applied for this property",
        data: [],
      });
    }

    const tenantEmails = apps.map((app) => app.tenantEmail);

    const tenants = await Promise.all(
      tenantEmails.map((email) => Tenant.findOne({ email }))
    );

    const result = apps.map((app, i) => ({
      tenant: tenants[i],
      appliedAt: app.appliedAt,
    }));

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
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
      houseType,
      nearbyPlaces,
      page = 1,
      limit = 1000,
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

      if (nearbyPlaces && prop.nearbyPlaces) {
        let userPlaces = Array.isArray(nearbyPlaces)
          ? nearbyPlaces
          : nearbyPlaces.split(",").map(p => p.trim().toLowerCase());

        let propertyPlaces = prop.nearbyPlaces.map(p => p.toLowerCase());

        let matches = userPlaces.filter(p => propertyPlaces.includes(p)).length;

        points += matches * 3;
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

        if(!prefs.smoking){
          if(tenantPreferences.smoking){
            points -= 3;
          }
        }

        if(!prefs.alcohol){
          if(tenantPreferences.alcohol){
            points -= 3;
          }
        }

        if (tenantPreferences.professionalStatus && prefs.professionalStatus !== "Any") {
          if (tenantPreferences.professionalStatus === prefs.professionalStatus) points += 2;
        }

        if (tenantPreferences.workingshifts && prefs.workingShift !== "Any") {
          if (tenantPreferences.workingshifts === prefs.workingShift) points += 2;
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


module.exports = { home, filterProperties, propertysend, applyForProperty, getOwnerApplications};
