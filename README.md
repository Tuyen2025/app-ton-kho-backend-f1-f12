# APP TỒN KHO Bích Tuyền - Backend F1 → F12

Backend Node.js/Express + MongoDB cho hệ thống tồn kho đường (RAW/FINISHED) với đầy đủ:

- F1: Danh mục sản phẩm
- F2: Danh mục màu dây
- F3: Danh mục nhãn hiệu bao
- F4: Nhập kho RAW
- F5: Xuất kho / Sang chiết
- F6: Quản lý lô (Lot)
- F7: Tồn kho realtime
- F8: Quy đổi kg ↔ bao ↔ cây (dựa trên kgPerBao, kgPerCay của Product)
- F9: Lịch sử nhập / xuất
- F10: Activity Log
- F11: Giá vốn theo lô (LotCost)
- F12: Lợi nhuận (ProfitRecord)

## 1. Cài đặt

```bash
npm install
```

Tạo file `.env` từ `.env.sample`:

```bash
cp .env.sample .env
```

Chỉnh `MONGO_URI` nếu cần.

## 2. Chạy dev

```bash
npm run dev
```

Server mặc định chạy ở `http://localhost:10000`.

## 3. Một số API chính

- `GET /api/products` — Danh sách sản phẩm
- `POST /api/products` — Tạo sản phẩm

- `GET /api/master/wire-colors`
- `POST /api/master/wire-colors`

- `GET /api/master/bale-brands`
- `POST /api/master/bale-brands`

- `GET /api/lots`
- `POST /api/lots`

- `POST /api/stock/in/raw` — Nhập kho RAW + tạo/cộng dồn giá vốn lô (F4 + F11)
- `POST /api/stock/out` — Xuất kho / Sang chiết + tính lợi nhuận (F5 + F12)
- `GET /api/stock/inventory` — Tồn kho realtime (F7)
- `GET /api/stock/history` — Lịch sử nhập/xuất (F9)

- `GET /api/cost/lot/:lotId` — Xem giá vốn 1 lô (F11)
- `POST /api/cost/lot/:lotId/recalc` — Tính lại giá vốn từ toàn bộ phiếu nhập của lô

- `GET /api/profit/summary` — Tổng doanh thu / giá vốn / lợi nhuận
- `GET /api/profit/by-day` — Lợi nhuận theo ngày
- `GET /api/profit/by-product` — Lợi nhuận theo sản phẩm

- `GET /api/dashboard/summary` — Dashboard tổng quan (tồn kho + nhập/xuất hôm nay + lợi nhuận hôm nay)

Mọi chỗ có `req.user` hiện đang set cứng `"admin-demo"` trong `server.js` để log Activity.
