const ActivityLog = require("../models/ActivityLog");

async function logActivity({ user = "system", action, entityType, entityId, payload }) {
  try {
    await ActivityLog.create({
      user,
      action,
      entityType,
      entityId,
      payload,
    });
  } catch (err) {
    console.error("Ghi ActivityLog lỗi:", err.message);
  }
}

module.exports = logActivity;
