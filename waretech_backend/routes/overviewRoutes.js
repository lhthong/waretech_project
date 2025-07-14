const express = require("express");
const router = express.Router();
const OverviewController = require("../controllers/overviewController");
const { isAuth, authorizeRoles } = require("../middleware/authMiddleware");

// Áp dụng cả xác thực + phân quyền
const onlyAdminOrStaff = [isAuth, authorizeRoles("admin", "staff")];

router.get(
  "/stats/yearly",
  onlyAdminOrStaff,
  OverviewController.getInventoryStats
);
router.get(
  "/stats/monthly",
  onlyAdminOrStaff,
  OverviewController.getMonthlyStats
);
router.get(
  "/stock/:productId",
  onlyAdminOrStaff,
  OverviewController.getCurrentStock
);
router.get(
  "/receipt-details",
  onlyAdminOrStaff,
  OverviewController.getWarehouseOverview
);

router.get(
  "/stock-by-category",
  onlyAdminOrStaff,
  OverviewController.getStockPercentageByCategory
);
module.exports = router;
