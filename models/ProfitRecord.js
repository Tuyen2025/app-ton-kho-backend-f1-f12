const mongoose = require("mongoose");

const profitRecordSchema = new mongoose.Schema(
  {
    stockOut: { type: mongoose.Schema.Types.ObjectId, ref: "StockOut", required: true, unique: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    lot: { type: mongoose.Schema.Types.ObjectId, ref: "Lot" },
    quantityKg: { type: Number, required: true },
    salePricePerKg: { type: Number, required: true },
    revenue: { type: Number, required: true },
    // Giá vốn
    costPerKg: { type: Number, required: true },
    cogs: { type: Number, required: true },
    extraCost: { type: Number, default: 0 },
    profit: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProfitRecord", profitRecordSchema);
