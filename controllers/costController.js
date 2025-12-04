const LotCost = require("../models/LotCost");
const Lot = require("../models/Lot");
const StockIn = require("../models/StockIn");

// F11 - Xem giá vốn theo lô
async function getLotCost(req, res, next) {
  try {
    const { lotId } = req.params;
    const doc = await LotCost.findOne({ lot: lotId }).populate("lot product");
    if (!doc) {
      res.status(404);
      throw new Error("Chưa có giá vốn cho lô này");
    }
    res.json({ ok: true, data: doc });
  } catch (err) {
    next(err);
  }
}

// Tính lại giá vốn theo toàn bộ StockIn của lô (trong trường hợp thay đổi)
async function recalcLotCost(req, res, next) {
  try {
    const { lotId } = req.params;
    const lot = await Lot.findById(lotId);
    if (!lot) {
      res.status(404);
      throw new Error("Không tìm thấy lô");
    }

    const stockIns = await StockIn.find({ lot: lotId });
    if (!stockIns.length) {
      res.status(400);
      throw new Error("Không có phiếu nhập nào cho lô này");
    }

    let totalKg = 0;
    let baseMaterialCost = 0;
    let transportCost = 0;
    let laborCost = 0;
    let otherCost = 0;

    for (const s of stockIns) {
      totalKg += s.quantityKg;
      baseMaterialCost += s.unitPricePerKg * s.quantityKg;
      transportCost += s.transportCost;
      laborCost += s.laborCost;
      otherCost += s.otherCost;
    }

    const totalCost = baseMaterialCost + transportCost + laborCost + otherCost;
    const costPerKg = totalCost / totalKg;

    const payload = {
      lot: lotId,
      product: lot.product,
      totalKg,
      baseMaterialCost,
      transportCost,
      laborCost,
      otherCost,
      totalCost,
      costPerKg,
    };

    let lotCost = await LotCost.findOne({ lot: lotId });
    if (!lotCost) {
      lotCost = await LotCost.create(payload);
    } else {
      Object.assign(lotCost, payload);
      await lotCost.save();
    }

    res.json({ ok: true, data: lotCost });
  } catch (err) {
    next(err);
  }
}

module.exports = { getLotCost, recalcLotCost };
