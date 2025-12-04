const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    lot: { type: mongoose.Schema.Types.ObjectId, ref: "Lot" },
    type: { type: String, enum: ["RAW", "FINISHED"], required: true },
    wireColor: { type: mongoose.Schema.Types.ObjectId, ref: "WireColor" },
    baleBrand: { type: mongoose.Schema.Types.ObjectId, ref: "BaleBrand" },
    totalKg: { type: Number, required: true, default: 0 },
    totalBags: { type: Number, default: 0 },
    totalCay: { type: Number, default: 0 },
  },
  { timestamps: true }
);

inventorySchema.index({ product: 1, lot: 1, type: 1, wireColor: 1, baleBrand: 1 }, { unique: true });

module.exports = mongoose.model("Inventory", inventorySchema);
