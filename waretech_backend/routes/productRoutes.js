const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { isAuth, authorizeRoles } = require("../middleware/authMiddleware");

// Áp dụng cả xác thực + phân quyền
const onlyAdminOrStaff = [isAuth, authorizeRoles("admin", "staff")];
const onlyAdmin = [isAuth, authorizeRoles("admin")];

// Public routes
router.get("/", productController.getAllProduct);
router.get("/product-store", productController.getProductStore);
router.get("/search/name", productController.searchProducts);
router.get(
  "/stock-status",
  onlyAdminOrStaff,
  productController.getProductsByStockStatus
);
router.get("/:id", productController.getProductById);

// Admin/Staff routes
router.post("/", onlyAdminOrStaff, productController.createProduct);
router.put("/:id", onlyAdminOrStaff, productController.updateProduct);
router.delete("/:id", onlyAdminOrStaff, productController.deleteProduct);
router.put(
  "/:id/threshold",
  onlyAdminOrStaff,
  productController.updateThreshold
);

// Soft Delete management routes
router.post("/:id/restore", onlyAdminOrStaff, productController.restoreProduct);
router.get(
  "/deleted/list",
  onlyAdminOrStaff,
  productController.getDeletedProducts
);

module.exports = router;
