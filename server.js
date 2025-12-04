require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const productRoutes = require("./routes/productRoutes");
const masterDataRoutes = require("./routes/masterDataRoutes");
const lotRoutes = require("./routes/lotRoutes");
const stockRoutes = require("./routes/stockRoutes");
const costRoutes = require("./routes/costRoutes");
const profitRoutes = require("./routes/profitRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Kết nối DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Fake user middleware (sau này có auth thì thay)
app.use((req, res, next) => {
  req.user = "admin-demo";
  next();
});

// Health check
app.get("/", (req, res) => {
  res.json({ ok: true, message: "APP TỒN KHO Bích Tuyền - Backend F1-F12 OK!" });
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/master", masterDataRoutes);
app.use("/api/lots", lotRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/cost", costRoutes);
app.use("/api/profit", profitRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 & Error
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 APP TỒN KHO Backend F1-F12 running on port ${PORT}`);
});
