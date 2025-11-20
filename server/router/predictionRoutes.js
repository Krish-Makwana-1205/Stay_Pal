const express = require("express");
const router = express.Router();

const { predictRent } = require("../controller/rentPrediction");

router.get("/predict-rent", predictRent);

module.exports = router;
