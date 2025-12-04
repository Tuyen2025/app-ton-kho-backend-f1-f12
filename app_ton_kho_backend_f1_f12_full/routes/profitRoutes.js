const express = require("express");
const {
  getProfitSummary,
  getProfitByDay,
  getProfitByProduct,
} = require("../controllers/profitController");

const router = express.Router();

router.get("/summary", getProfitSummary);
router.get("/by-day", getProfitByDay);
router.get("/by-product", getProfitByProduct);

module.exports = router;
