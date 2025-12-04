const Lot = require("../models/Lot");
const logActivity = require("../utils/logActivity");

async function getLots(req, res, next) {
  try {
    const docs = await Lot.find().populate("product").sort({ createdAt: -1 });
    res.json({ ok: true, data: docs });
  } catch (err) {
    next(err);
  }
}

async function createLot(req, res, next) {
  try {
    const doc = await Lot.create(req.body);
    logActivity({
      user: req.user || "system",
      action: "CREATE_LOT",
      entityType: "Lot",
      entityId: doc._id.toString(),
      payload: req.body,
    });
    res.status(201).json({ ok: true, data: doc });
  } catch (err) {
    // Duplicate lotCode for same product
    if (err.code === 11000) {
      res.status(400);
      return next(new Error("Mã lô đã tồn tại cho sản phẩm này"));
    }
    next(err);
  }
}

module.exports = { getLots, createLot };
