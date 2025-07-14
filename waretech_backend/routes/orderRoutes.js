const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { isAuth, authorizeRoles } = require("../middleware/authMiddleware");

// Áp dụng cả xác thực + phân quyền
const onlyAdminOrStaff = [isAuth, authorizeRoles("admin", "staff")];
const onlyAll = [isAuth, authorizeRoles("admin", "staff", "client")];

router.post("/", onlyAll, orderController.createOrder);
router.get("/", onlyAll, orderController.getAllOrder);
router.get("/filter/by-status", onlyAll, orderController.getOrdersByStatus);
router.get("/:id", onlyAll, orderController.getOrderById);
router.get("/user/:userId", onlyAll, orderController.getOrdersByUserId);
router.patch("/:id/status", onlyAll, orderController.updateOrderStatus);
router.get(
  "/export/excel",
  onlyAdminOrStaff,
  orderController.exportOrdersToExcel
);

module.exports = router;
