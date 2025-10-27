// controller/dashboard.js
const property = require("../model/property");

async function home(req, res) {
  try {
    const { email } = req.query;
    let query = {};
    if (email) query.email = email;

    const properties = await property.find(query);
    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error loading dashboard data",
      error: error.message,
    });
  }
}

module.exports = { home }; 
