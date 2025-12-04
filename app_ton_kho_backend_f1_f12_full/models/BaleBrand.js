const mongoose = require("mongoose");

const baleBrandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // Bao Thái, Bao Trắng...
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BaleBrand", baleBrandSchema);
