const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    group: { type: String, required: true, trim: true }, // Đường cát, Bi, ...
    kgPerBao: { type: Number, default: 50 }, // kg mỗi bao
    kgPerCay: { type: Number, default: 12 }, // kg mỗi cây (thành phẩm)
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
