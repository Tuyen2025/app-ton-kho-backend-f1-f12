const mongoose = require("mongoose");

const stockOutSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    lot: { type: mongoose.Schema.Types.ObjectId, ref: "Lot" },
    type: { type: String, enum: ["RAW", "FINISHED"], required: true },
    quantityKg: { type: Number, required: true },
    quantityBags: { type: Number, default: 0 },
    quantityCay: { type: Number, default: 0 },
    wireColor: { type: mongoose.Schema.Types.ObjectId, ref: "WireColor" },
    baleBrand: { type: mongoose.Schema.Types.ObjectId, ref: "BaleBrand" },
    // Thông tin bán hàng
    customerName: { type: String },
    salePricePerKg: { type: Number }, // giá bán
    extraCost: { type: Number, default: 0 }, // chi phí phát sinh lúc bán
    purpose: { type: String, enum: ["SALE", "SANG_CHIET", "KHAC"], default: "SALE" },
    createdBy: { type: String, default: "system" },
    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockOut", stockOutSchema);
