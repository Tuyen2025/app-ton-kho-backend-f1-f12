const express = require("express");
const {
  getWireColors,
  createWireColor,
  getBaleBrands,
  createBaleBrand,
} = require("../controllers/masterDataController");

const router = express.Router();

// Wire colors
router.get("/wire-colors", getWireColors);
router.post("/wire-colors", createWireColor);

// Bale brands
router.get("/bale-brands", getBaleBrands);
router.post("/bale-brands", createBaleBrand);

module.exports = router;
