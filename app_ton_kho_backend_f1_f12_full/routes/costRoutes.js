const express = require("express");
const { getLotCost, recalcLotCost } = require("../controllers/costController");

const router = express.Router();

router.get("/lot/:lotId", getLotCost);
router.post("/lot/:lotId/recalc", recalcLotCost);

module.exports = router;
