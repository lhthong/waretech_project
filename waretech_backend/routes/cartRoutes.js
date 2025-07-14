const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { isAuth, authorizeRoles } = require("../middleware/authMiddleware");

// Áp dụng cả xác thực + phân quyền
const onlyAdminOrStaffOrClient = [
  isAuth,
  authorizeRoles("admin", "staff", "client"),
];

router.post("/", onlyAdminOrStaffOrClient, cartController.createCart);
router.get("/user", onlyAdminOrStaffOrClient, cartController.getCartByToken);
router.put("/:id", onlyAdminOrStaffOrClient, cartController.updateCart);
router.delete("/:id", onlyAdminOrStaffOrClient, cartController.deleteCart);
router.post(
  "/delete-many",
  onlyAdminOrStaffOrClient,
  cartController.deleteCartMany
);

module.exports = router;
