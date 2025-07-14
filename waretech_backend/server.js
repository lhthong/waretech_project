const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categorieRoutes = require("./routes/categorieRoutes");
const featuredRoutes = require("./routes/featuredRoutes");
const authRoutes = require("./routes/authRoutes");
const warehouseRoutes = require("./routes/warehouseRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productImageRoutes = require("./routes/productImageRoutes");
const reviewsRoutes = require("./routes/reviewsRoutes");
const overviewRoutes = require("./routes/overviewRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const statsRoutes = require("./routes/statsRoutes");
const faqRoutes = require("./routes/faqRoutes");

const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("ngrok-skip-browser-warning", "true");
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/faqs", faqRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/features", featuredRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/categories", categorieRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/product-review", reviewsRoutes);
app.use("/api/product-images", productImageRoutes);
app.use("/api/warehouse-overview", overviewRoutes);

app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
