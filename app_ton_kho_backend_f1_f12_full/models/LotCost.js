const mongoose = require("mongoose");

const lotCostSchema = new mongoose.Schema(
  {
    lot: { type: mongoose.Schema.Types.ObjectId, ref: "Lot", required: true, unique: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    totalKg: { type: Number, required: true },
    baseMaterialCost: { type: Number, required: true }, // tiền mua đường
    transportCost: { type: Number, default: 0 },
    laborCost: { type: Number, default: 0 },
    otherCost: { type: Number, default: 0 },
    totalCost: { type: Number, required: true },
    costPerKg: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LotCost", lotCostSchema);
