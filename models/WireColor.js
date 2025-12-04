const mongoose = require("mongoose");

const wireColorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // Vàng, Xanh, Đỏ...
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WireColor", wireColorSchema);
