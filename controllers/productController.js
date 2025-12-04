const Product = require("../models/Product");
const logActivity = require("../utils/logActivity");

async function getProducts(req, res, next) {
  try {
    const docs = await Product.find().sort({ createdAt: -1 });
    res.json({ ok: true, data: docs });
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const doc = await Product.create(req.body);
    logActivity({
      user: req.user || "system",
      action: "CREATE_PRODUCT",
      entityType: "Product",
      entityId: doc._id.toString(),
      payload: req.body,
    });
    res.status(201).json({ ok: true, data: doc });
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const doc = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!doc) {
      res.status(404);
      throw new Error("Không tìm thấy sản phẩm");
    }
    logActivity({
      user: req.user || "system",
      action: "UPDATE_PRODUCT",
      entityType: "Product",
      entityId: doc._id.toString(),
      payload: req.body,
    });
    res.json({ ok: true, data: doc });
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const doc = await Product.findByIdAndDelete(id);
    if (!doc) {
      res.status(404);
      throw new Error("Không tìm thấy sản phẩm");
    }
    logActivity({
      user: req.user || "system",
      action: "DELETE_PRODUCT",
      entityType: "Product",
      entityId: doc._id.toString(),
    });
    res.json({ ok: true, message: "Đã xóa sản phẩm" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
