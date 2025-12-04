const express = require("express");
const { getLots, createLot } = require("../controllers/lotController");

const router = express.Router();

router.get("/", getLots);
router.post("/", createLot);

module.exports = router;
