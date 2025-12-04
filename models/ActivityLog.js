const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    user: { type: String, default: "system" },
    action: { type: String, required: true },
    entityType: { type: String },
    entityId: { type: String },
    payload: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
