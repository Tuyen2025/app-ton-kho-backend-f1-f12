const Inventory = require("../models/Inventory");
const ProfitRecord = require("../models/ProfitRecord");
const StockIn = require("../models/StockIn");
const StockOut = require("../models/StockOut");

async function getDashboardSummary(req, res, next) {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Tổng tồn kho
    const invAgg = await Inventory.aggregate([
      {
        $group: {
          _id: "$type",
          totalKg: { $sum: "$totalKg" },
        },
      },
    ]);

    const totalRaw = invAgg.find((i) => i._id === "RAW")?.totalKg || 0;
    const totalFinished = invAgg.find((i) => i._id === "FINISHED")?.totalKg || 0;

    // Nhập/Xuất hôm nay
    const [inTodayAgg, outTodayAgg, profitTodayAgg] = await Promise.all([
      StockIn.aggregate([
        { $match: { createdAt: { $gte: todayStart, $lte: todayEnd } } },
        { $group: { _id: null, totalKg: { $sum: "$quantityKg" } } },
      ]),
      StockOut.aggregate([
        { $match: { createdAt: { $gte: todayStart, $lte: todayEnd } } },
        { $group: { _id: null, totalKg: { $sum: "$quantityKg" } } },
      ]),
      ProfitRecord.aggregate([
        { $match: { createdAt: { $gte: todayStart, $lte: todayEnd } } },
        { $group: { _id: null, profit: { $sum: "$profit" } } },
      ]),
    ]);

    const inToday = inTodayAgg[0]?.totalKg || 0;
    const outToday = outTodayAgg[0]?.totalKg || 0;
    const profitToday = profitTodayAgg[0]?.profit || 0;

    res.json({
      ok: true,
      data: {
        totalRawKg: totalRaw,
        totalFinishedKg: totalFinished,
        inTodayKg: inToday,
        outTodayKg: outToday,
        profitToday,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboardSummary };
