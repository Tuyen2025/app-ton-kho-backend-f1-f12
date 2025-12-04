const Inventory = require("../models/Inventory");
const Lot = require("../models/Lot");
const StockIn = require("../models/StockIn");
const StockOut = require("../models/StockOut");
const LotCost = require("../models/LotCost");
const ProfitRecord = require("../models/ProfitRecord");
const logActivity = require("../utils/logActivity");

// Helper: upsert inventory record
async function adjustInventory({
  product,
  lot,
  type,
  wireColor,
  baleBrand,
  deltaKg,
  deltaBags = 0,
  deltaCay = 0,
}) {
  const filter = { product, type };
  if (lot) filter.lot = lot;
  if (wireColor) filter.wireColor = wireColor;
  if (baleBrand) filter.baleBrand = baleBrand;

  const inv = await Inventory.findOne(filter);
  if (!inv) {
    return await Inventory.create({
      ...filter,
      totalKg: deltaKg,
      totalBags: deltaBags,
      totalCay: deltaCay,
    });
  } else {
    inv.totalKg += deltaKg;
    inv.totalBags += deltaBags;
    inv.totalCay += deltaCay;
    if (inv.totalKg < 0) inv.totalKg = 0;
    if (inv.totalBags < 0) inv.totalBags = 0;
    if (inv.totalCay < 0) inv.totalCay = 0;
    await inv.save();
    return inv;
  }
}

// F4 - Nhập kho RAW
async function stockInRaw(req, res, next) {
  try {
    const {
      product,
      lot, // optional: nếu đã tạo lot trước
      lotCode,
      manufactureDate,
      invoiceType,
      invoiceNumber,
      quantityBags,
      quantityKg,
      unitPricePerKg,
      transportCost = 0,
      laborCost = 0,
      otherCost = 0,
      note,
    } = req.body;

    let lotDoc = null;

    if (lot) {
      lotDoc = await Lot.findById(lot);
    } else {
      // Tự tạo Lot nếu chưa có
      lotDoc = await Lot.create({
        product,
        lotCode,
        manufactureDate,
        invoiceType,
        invoiceNumber,
        totalBags: quantityBags,
        totalKg: quantityKg,
        note,
      });
    }

    const stockIn = await StockIn.create({
      product,
      lot: lotDoc._id,
      quantityBags,
      quantityKg,
      unitPricePerKg,
      transportCost,
      laborCost,
      otherCost,
      note,
      createdBy: req.user || "system",
    });

    // Tăng tồn kho RAW
    await adjustInventory({
      product,
      lot: lotDoc._id,
      type: "RAW",
      deltaKg: quantityKg,
      deltaBags: quantityBags,
    });

    // F11 - Tính giá vốn theo lô
    const baseMaterialCost = unitPricePerKg * quantityKg;
    const totalCost = baseMaterialCost + transportCost + laborCost + otherCost;
    const costPerKg = totalCost / quantityKg;

    let lotCost = await LotCost.findOne({ lot: lotDoc._id });
    if (!lotCost) {
      lotCost = await LotCost.create({
        lot: lotDoc._id,
        product,
        totalKg: quantityKg,
        baseMaterialCost,
        transportCost,
        laborCost,
        otherCost,
        totalCost,
        costPerKg,
      });
    } else {
      // Nếu nhập bổ sung cùng lô: cộng dồn
      const newTotalKg = lotCost.totalKg + quantityKg;
      const newTotalCost = lotCost.totalCost + totalCost;
      lotCost.totalKg = newTotalKg;
      lotCost.baseMaterialCost += baseMaterialCost;
      lotCost.transportCost += transportCost;
      lotCost.laborCost += laborCost;
      lotCost.otherCost += otherCost;
      lotCost.totalCost = newTotalCost;
      lotCost.costPerKg = newTotalCost / newTotalKg;
      await lotCost.save();
    }

    logActivity({
      user: req.user || "system",
      action: "STOCK_IN_RAW",
      entityType: "StockIn",
      entityId: stockIn._id.toString(),
      payload: req.body,
    });

    res.status(201).json({ ok: true, data: { stockIn, lot: lotDoc } });
  } catch (err) {
    next(err);
  }
}

// F5 - Xuất kho / Sang chiết
async function stockOut(req, res, next) {
  try {
    const {
      product,
      lot,
      type, // RAW / FINISHED
      quantityKg,
      quantityBags = 0,
      quantityCay = 0,
      wireColor,
      baleBrand,
      customerName,
      salePricePerKg,
      extraCost = 0,
      purpose = "SALE",
      note,
    } = req.body;

    // Trừ tồn kho
    await adjustInventory({
      product,
      lot,
      type,
      wireColor,
      baleBrand,
      deltaKg: -Math.abs(quantityKg),
      deltaBags: -Math.abs(quantityBags),
      deltaCay: -Math.abs(quantityCay),
    });

    const stockOut = await StockOut.create({
      product,
      lot,
      type,
      quantityKg,
      quantityBags,
      quantityCay,
      wireColor,
      baleBrand,
      customerName,
      salePricePerKg,
      extraCost,
      purpose,
      note,
      createdBy: req.user || "system",
    });

    // F12 - Tính lợi nhuận nếu có giá bán
    let profitRecord = null;
    if (salePricePerKg && salePricePerKg > 0) {
      let costPerKg = 0;

      if (lot) {
        const lotCost = await LotCost.findOne({ lot });
        if (lotCost && lotCost.costPerKg) {
          costPerKg = lotCost.costPerKg;
        }
      }

      // Nếu chưa có LotCost (VD: hàng tồn cũ chưa nhập đủ thông tin) → tạm cho 0, sau có thể cập nhật lại
      const revenue = salePricePerKg * quantityKg;
      const cogs = costPerKg * quantityKg;
      const profit = revenue - cogs - extraCost;

      profitRecord = await ProfitRecord.create({
        stockOut: stockOut._id,
        product,
        lot: lot || null,
        quantityKg,
        salePricePerKg,
        revenue,
        costPerKg,
        cogs,
        extraCost,
        profit,
      });
    }

    logActivity({
      user: req.user || "system",
      action: "STOCK_OUT",
      entityType: "StockOut",
      entityId: stockOut._id.toString(),
      payload: req.body,
    });

    res.status(201).json({ ok: true, data: { stockOut, profitRecord } });
  } catch (err) {
    next(err);
  }
}

// F7 - Tồn kho realtime
async function getInventorySummary(req, res, next) {
  try {
    const agg = await Inventory.aggregate([
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
          _id: { product: "$product._id", type: "$type" },
          productName: { $first: "$product.name" },
          group: { $first: "$product.group" },
          type: { $first: "$type" },
          totalKg: { $sum: "$totalKg" },
          totalBags: { $sum: "$totalBags" },
          totalCay: { $sum: "$totalCay" },
        },
      },
      { $sort: { productName: 1, type: 1 } },
    ]);

    res.json({ ok: true, data: agg });
  } catch (err) {
    next(err);
  }
}

// F9 - Lịch sử nhập / xuất
async function getStockHistory(req, res, next) {
  try {
    const { from, to } = req.query;
    const dateFilter = {};
    if (from || to) {
      dateFilter.createdAt = {};
      if (from) dateFilter.createdAt.$gte = new Date(from);
      if (to) dateFilter.createdAt.$lte = new Date(to);
    }

    const ins = await StockIn.find(dateFilter)
      .populate("product lot")
      .sort({ createdAt: -1 })
      .limit(500);
    const outs = await StockOut.find(dateFilter)
      .populate("product lot")
      .sort({ createdAt: -1 })
      .limit(500);

    res.json({ ok: true, data: { ins, outs } });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  stockInRaw,
  stockOut,
  getInventorySummary,
  getStockHistory,
};
