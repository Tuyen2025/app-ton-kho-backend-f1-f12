const mongoose = require("mongoose");

const lotSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    lotCode: { type: String, required: true, trim: true }, // mã lô
    manufactureDate: { type: Date, required: true },
    invoiceType: { type: String, enum: ["CO_HOA_DON", "KHONG_HOA_DON"], default: "KHONG_HOA_DON" },
    invoiceNumber: { type: String },
    totalBags: { type: Number, required: true }, // tổng bao nhập
    totalKg: { type: Number, required: true }, // tổng kg nhập
    note: { type: String },
    isClosed: { type: Boolean, default: false }, // nếu đã dùng hết
  },
  { timestamps: true }
);

lotSchema.index({ product: 1, lotCode: 1 }, { unique: true });

module.exports = mongoose.model("Lot", lotSchema);
