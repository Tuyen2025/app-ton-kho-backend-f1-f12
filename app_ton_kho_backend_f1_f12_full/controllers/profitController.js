const ProfitRecord = require("../models/ProfitRecord");

// F12 - Báo cáo lợi nhuận
async function getProfitSummary(req, res, next) {
  try {
    const { from, to } = req.query;
    const match = {};
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    const agg = await ProfitRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$revenue" },
          totalCogs: { $sum: "$cogs" },
          totalExtraCost: { $sum: "$extraCost" },
          totalProfit: { $sum: "$profit" },
        },
      },
    ]);

    const summary = agg[0] || {
      totalRevenue: 0,
      totalCogs: 0,
      totalExtraCost: 0,
      totalProfit: 0,
    };

    res.json({ ok: true, data: summary });
  } catch (err) {
    next(err);
  }
}

async function getProfitByDay(req, res, next) {
  try {
    const { from, to } = req.query;
    const match = {};
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    const agg = await ProfitRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            y: { $year: "$createdAt" },
            m: { $month: "$createdAt" },
            d: { $dayOfMonth: "$createdAt" },
          },
          revenue: { $sum: "$revenue" },
          cogs: { $sum: "$cogs" },
          extraCost: { $sum: "$extraCost" },
          profit: { $sum: "$profit" },
        },
      },
      { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } },
    ]);

    res.json({ ok: true, data: agg });
  } catch (err) {
    next(err);
  }
}

async function getProfitByProduct(req, res, next) {
  try {
    const { from, to } = req.query;
    const match = {};
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    const agg = await ProfitRecord.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product._id",
          productName: { $first: "$product.name" },
          revenue: { $sum: "$revenue" },
          cogs: { $sum: "$cogs" },
          extraCost: { $sum: "$extraCost" },
          profit: { $sum: "$profit" },
        },
      },
      { $sort: { profit: -1 } },
    ]);

    res.json({ ok: true, data: agg });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfitSummary,
  getProfitByDay,
  getProfitByProduct,
};
