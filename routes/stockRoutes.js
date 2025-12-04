const express = require("express");
const {
  stockInRaw,
  stockOut,
  getInventorySummary,
  getStockHistory,
} = require("../controllers/stockController");

const router = express.Router();

// F4 - Nhập kho RAW
router.post("/in/raw", stockInRaw);

// F5 - Xuất kho / Sang chiết
router.post("/out", stockOut);

// F7 - Tồn kho realtime
router.get("/inventory", getInventorySummary);

// F9 - Lịch sử nhập / xuất
router.get("/history", getStockHistory);

module.exports = router;
