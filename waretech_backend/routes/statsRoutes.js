const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");
const { isAuth, authorizeRoles } = require("../middleware/authMiddleware");

// Áp dụng cả xác thực + phân quyền
const onlyAdminOrStaff = [isAuth, authorizeRoles("admin", "staff")];

// Endpoint cho thẻ thống kê
router.get("/daily-profit", onlyAdminOrStaff, statsController.getDailyProfit);
router.get("/daily-revenue", onlyAdminOrStaff, statsController.getDailyRevenue);
router.get("/daily-orders", onlyAdminOrStaff, statsController.getDailyOrders);
router.get(
  "/daily-sold-products",
  onlyAdminOrStaff,
  statsController.getDailySoldProducts
);
router.get(
  "/total-inventory",
  onlyAdminOrStaff,
  statsController.getTotalInventory
);

// Endpoint cho biểu đồ doanh thu
router.get(
  "/revenue-by-day",
  onlyAdminOrStaff,
  statsController.getRevenueByDay
);
router.get(
  "/revenue-by-month",
  onlyAdminOrStaff,
  statsController.getRevenueByMonth
);
router.get(
  "/revenue-by-year",
  onlyAdminOrStaff,
  statsController.getRevenueByYear
);

// Endpoint cho sản phẩm bán chạy và tồn kho
router.get(
  "/best-selling-products",
  onlyAdminOrStaff,
  statsController.getBestSellingProducts
);
router.get(
  "/top-inventory-products",
  onlyAdminOrStaff,
  statsController.getTopInventoryProducts
);
// Endpoint xuất PDF
router.get("/export-pdf", onlyAdminOrStaff, statsController.exportStatsToPDF);

module.exports = router;
