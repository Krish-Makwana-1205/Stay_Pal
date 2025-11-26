const express = require('express');
const router = express.Router();
const {restrictToLoggedinUserOnly} = require('../middleware/logincheck');
const {roommateUpload, roommateSearch, getlistings, updatelisting, deletelisting, applyForRoommate} = require('../controller/roommate');
const Tenant = require('../model/tenant');

router.post('/add', restrictToLoggedinUserOnly, roommateUpload);
router.post('/search', restrictToLoggedinUserOnly, roommateSearch);
router.get('/listings', restrictToLoggedinUserOnly, getlistings);
router.post('/update', restrictToLoggedinUserOnly, updatelisting);
router.post('/delete', restrictToLoggedinUserOnly, deletelisting);
router.post('/apply', restrictToLoggedinUserOnly, applyForRoommate);

// Add this route to fetch single tenant profile
router.get('/profile/:email', restrictToLoggedinUserOnly, async (req, res) => {
  try {
    const { email } = req.params;
    const tenant = await Tenant.findOne({ email });
    
    if (!tenant) {
      return res.status(404).json({ success: false, message: "Tenant profile not found" });
    }
    
    return res.status(200).json({ success: true, tenant });
  } catch (error) {
    console.error('Error fetching tenant profile:', error);
    return res.status(500).json({ success: false, message: "Error fetching tenant profile", error: error.message });
  }
});

module.exports = router;
