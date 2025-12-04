const WireColor = require("../models/WireColor");
const BaleBrand = require("../models/BaleBrand");
const logActivity = require("../utils/logActivity");

// WireColor
async function getWireColors(req, res, next) {
  try {
    const docs = await WireColor.find().sort({ createdAt: -1 });
    res.json({ ok: true, data: docs });
  } catch (err) {
    next(err);
  }
}

async function createWireColor(req, res, next) {
  try {
    const doc = await WireColor.create(req.body);
    logActivity({
      user: req.user || "system",
      action: "CREATE_WIRE_COLOR",
      entityType: "WireColor",
      entityId: doc._id.toString(),
      payload: req.body,
    });
    res.status(201).json({ ok: true, data: doc });
  } catch (err) {
    next(err);
  }
}

// BaleBrand
async function getBaleBrands(req, res, next) {
  try {
    const docs = await BaleBrand.find().sort({ createdAt: -1 });
    res.json({ ok: true, data: docs });
  } catch (err) {
    next(err);
  }
}

async function createBaleBrand(req, res, next) {
  try {
    const doc = await BaleBrand.create(req.body);
    logActivity({
      user: req.user || "system",
      action: "CREATE_BALE_BRAND",
      entityType: "BaleBrand",
      entityId: doc._id.toString(),
      payload: req.body,
    });
    res.status(201).json({ ok: true, data: doc });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getWireColors,
  createWireColor,
  getBaleBrands,
  createBaleBrand,
};
