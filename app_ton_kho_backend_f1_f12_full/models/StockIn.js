const mongoose = require("mongoose");

const stockInSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    lot: { type: mongoose.Schema.Types.ObjectId, ref: "Lot", required: true },
    quantityBags: { type: Number, required: true },
    quantityKg: { type: Number, required: true },
    unitPricePerKg: { type: Number, required: true }, // giá mua chính
    transportCost: { type: Number, default: 0 }, // chi phí vận chuyển
    laborCost: { type: Number, default: 0 }, // bốc vác
    otherCost: { type: Number, default: 0 },
    createdBy: { type: String, default: "system" },
    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockIn", stockInSchema);
