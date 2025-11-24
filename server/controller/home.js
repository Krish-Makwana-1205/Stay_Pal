const property = require("../model/property");
const Tenant = require("../model/tenant");
const Application = require("../model/application");
const User = require("../model/user");
const { sendEmail } = require("../utils/mailer");
const { getSimilarity } = require("../utils/nlp");
const { getCoordinates, distance_Scoring } = require("../utils/geocode.js");
const { getAge } = require("../utils/agecalc.js");
const { getSimilaritySimple } = require("../utils/simplenlp.js");

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
      return res.status(404).json({ success: false, message: "No property found " });
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

    await Application.create({ tenantEmail, propertyName, propertyOwnerEmail, }),

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

    return res.status(200).json({ success: true, message: "Application sent successfully" });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this property.",
      });
    }

    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
}


async function getApplicationsForOwner(req, res) {
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

    const tenants = await Tenant.find({
      email: { $in: tenantEmails }
    });
    const preferences = propertyData.tenantPreferences;
    const calculatePoints = async (tenant) => {
      let match = 0, dif = 0;
      if (preferences.gender != 'Any' && tenant.gender != 'Other') {
        if (tenant.gender == propertyData.gender) {
          ++match;
        }
        else {
          ++dif;
        }
      }
      const age = getAge(tenant.dob);
      if (preferences.upperagelimit && preferences.loweragelimit) {


        if (age <= preferences.upperagelimit && age >= preferences.loweragelimit) {
          ++match;
        }
        else {
          ++dif
        }
      }
      else if (preferences.upperagelimit) {
        if (age <= preferences.upperagelimit) {
          ++match;
        }
        else {
          ++dif
        }
      }
      else if (preferences.loweragelimit) {
        if (age >= preferences.loweragelimit) {
          ++match;
        }
        else {
          ++dif;
        }
      }
      if (preferences.maritalStatus != 'Any') {
        if (tenant.maritalStatus == preferences.maritalStatus) {
          ++match;
        }
        else {
          ++dif;
        }
      }
      if (preferences.family != 'Any') {
        if (tenant.family && preferences.family == 'Not Allowed') {
          ++dif;
        }
        else if (!tenant.family) {
          ++match;
        }
        else if (tenant.family && preferences.family == 'Allowed') {
          ++match;
        }
      }
      if (preferences.foodPreference != 'Any' && tenant.foodPreference != 'Any') {
        if (preferences.foodPreference == 'Vegetarian') {
          if (tenant.foodPreference == 'Non-Veg') {
            ++dif;
          }
          else {
            ++match;
          }
        }
        else {
          if (tenant.foodPreference == 'Non-Veg') {
            ++match;
          }
          else {
            ++dif;
          }
        }
      }
      if (!preferences.smoking) {
        if (!tenant.smoker) {
          ++match;
        }
        else {
          ++dif
        }
      }
      else {
        ++match
      }
      if (!preferences.alcohol) {
        if (!tenant.alcohol) {
          ++match;
        }
        else {
          ++dif;
        }
      }
      else {
        ++match
      }
      if (!preferences.pets) {
        if (!tenant.Pet_lover) {
          ++match;
        }
        else {
          ++dif;
        }
      }
      else {
        ++match
      }
      if (preferences.nationality && tenant.nationality) {
        if (preferences.nationality == tenant.nationality) {
          ++match;
        }
        else {
          ++dif;
        }
      }
      if (preferences.workingShift != 'Any' && tenant.workingshifts != 'Any') {
        if (preferences.workingShift == 'Day Shift' && tenant.workingShift == 'morning') {
          ++match
        }
        else if (preferences.workingShift == 'Night Shift' && tenant.workingShift == 'night') {
          ++match;
        }
        else {
          ++dif;
        }
      }
      if (preferences.professionalStatus != "Any" && tenant.professionalStatus != "Any") {
        if (preferences.professionalStatus == "Student" && tenant.professionalStatus == "student") {
          ++match;
        }
        else if (preferences.professionalStatus != "Student" && tenant.professionalStatus == "working") {
          ++match;
        }
        else {
          ++dif;
        }
      }
      if (preferences.religion != "Any" && tenant.religion != "Any") {
        if (preferences.religion == tenant.religion) {
          ++match
        }
        else {
          ++dif;
        }
      }
      if (preferences.language != "Any" && tenant.language != "Any") {
        if (preferences.language == tenant.language) {
          ++match;
        }
        else {
          ++dif;
        }
      }
      if (preferences.minStayDuration != -1 && tenant.minStayDuration != -1) {
        if (preferences.minStayDuration <= tenant.minStayDuration) {
          ++match;
        }
        else {
          ++dif;
        }
      }
      let descmatch = -1;
      if (preferences.notes && tenant.description) {
        descmatch = await getSimilaritySimple(preferences.notes, tenant.description);
      }
      console.log(tenant.username);
      console.log(match);
      console.log(dif);

      return {
        match,
        dif,
        score: match - dif,
        descmatch
      };

    }

    const result = await Promise.all(
      tenants.map(async (tenant) => {
        const app = apps.find(a => a.tenantEmail === tenant.email);
        const points = await calculatePoints(tenant);

        return {
          tenant,
          appliedAt: app.appliedAt,
          ...points   // includes match, dif, score
        };
      })
    );

    // Sort by score descending
    result.sort((a, b) => b.score - a.score);


    return res.status(200).json({ success: true, count: result.length, data: result, });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}
async function getMyApplications(req, res) {
  try {
    const tenantEmail = req.user.email;

    if (!tenantEmail) {
      return res.status(400).json({
        success: false,
        message: "User not logged in",
      });
    }

    const apps = await Application.find({ tenantEmail });

    if (apps.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        message: "You have not applied to any properties",
        data: [],
      });
    }

    const propertyDetails = await Promise.all(
      apps.map(({ propertyName, propertyOwnerEmail }) =>
        property.findOne({ name: propertyName, email: propertyOwnerEmail })
      )
    );

    const result = apps.map((app, i) => ({
      property: propertyDetails[i],
      appliedAt: app.appliedAt,
    }));

    return res.status(200).json({
      success: true,
      count: result?.length || 0,
      data: result || [],
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
      limit = 100,
      description,
      transportAvailability,
      googleLink
    } = req.query;
    if (!req.user.email) {
      return res.status(400).json({ success: false, message: "User not defined" });
    }
    if (!rentLowerBound) {
      rentLowerBound = 0;
    }
    if (!city) {
      return res.status(400).json({ success: false, message: "City not provided" });
    }
    city = city.trimEnd().toLowerCase();

    let linkpres = false;
    let coords;
    let lat2, long2;
    if (googleLink) {
      try {
        coords = await getCoordinates(googleLink);
        linkpres = true;
      } catch (error) {
        linkpres = false;
      }
      lat2 = coords.latitude;
      long2 = coords.longitude;
      if (lat2 < -90 || lat2 > 90 || long2 < -180 || long2 > 180) {
        linkpres = false;
      }
    }
    else {

    }

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

    const skip = (page - 1) * Number(limit);

    let [tenantPreferences, properties] = await Promise.all([
      Tenant.findOne({ email: req.user.email }),
      property.find(filterCriteria).skip(skip).limit(limit),
    ]);
     function calculateBasicPoints(prop) {
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
          if (
            prop.furnishingType.toLowerCase() == "semi furnished" ||
            furnishingType.toLowerCase() == "semi furnished"
          ) {
            points += 5;
          }
        }
      }

      if (transportAvailability && prop.transportAvailability && transportAvailability != "Any") {
        if (transportAvailability == "true" && prop.transportAvailability) {
          points += 3;
        } else {
          points -= 3;
        }
      }

      if (areaSize && prop.areaSize) {
        const diff = prop.areaSize - areaSize;
        points += Math.max(0, 10 + diff / 100); // the more the better
      }

      if (nearbyPlaces && prop.nearbyPlaces) {
        let userPlaces = Array.isArray(nearbyPlaces)
          ? nearbyPlaces
          : nearbyPlaces.split(",").map((p) => p.trim().toLowerCase());

        let propertyPlaces = prop.nearbyPlaces.map((p) => p.toLowerCase());

        let matches = userPlaces.filter((p) => propertyPlaces.includes(p)).length;

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

        if (!prefs.smoking) {
          if (tenantPreferences.smoking) {
            points -= 3;
          }
        }

        if (!prefs.alcohol) {
          if (tenantPreferences.alcohol) {
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

      return points;
    }

    async function refinePoints(prop, basePoints) {
      let points = basePoints;

      // 1) NLP on description (2-stage: cheap -> complex)
      if (description && prop.description) {
        const easyScore = await getSimilaritySimple(description, prop.description); // cheap
        let finalNlpScore = easyScore;
        console.log(prop.name);
        console.log(easyScore);
        if (easyScore >= 0.85) {
          // Only now call complex NLP
          const complexScore = await getSimilarity(description, prop.description);
          finalNlpScore = complexScore;
        }

        points += finalNlpScore * 18;
      }

      // 2) Distance scoring (heavy, so only for top N)
      let lat1 = prop.latitude;
      let long1 = prop.longitude;
      if (lat1 && long1 && linkpres) {
        points += await distance_Scoring(lat1, long1, lat2, long2);
      }

      return points;
    }

    // Calculate points for all properties in parallel
     let baseScored = properties.map((prop) => ({
      prop,
      basePoints: calculateBasicPoints(prop),
    }));

     baseScored.sort((a, b) => b.basePoints - a.basePoints);
    

     const TOP_N = 10;
    const topForRefine = baseScored.slice(0, TOP_N);

    // Refine only top N with NLP + distance
    const refinedTop = await Promise.all(
      topForRefine.map(async (item) => {
        const finalPoints = await refinePoints(item.prop, item.basePoints);
        return {
          id: String(item.prop._id),
          points: finalPoints,
        };
      })
    );

    const refinedMap = new Map(refinedTop.map((r) => [r.id, r.points]));

    // ---------- MERGE: top N (refined) + rest (basic) ----------
    let scoredProperties = baseScored.map((item) => {
      const id = String(item.prop._id);
      const finalPoints = refinedMap.has(id) ? refinedMap.get(id) : item.basePoints;

      return {
        ...item.prop.toObject(),
        points: finalPoints,
      };
    });

    // Final sort by points (descending)
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


module.exports = { home, filterProperties, propertysend, applyForProperty, getApplicationsForOwner, getMyApplications };