const express = require("express");
const router = express.Router();
const categorieController = require("../controllers/FeaturedController");
const { isAuth, authorizeRoles } = require("../middleware/authMiddleware");

// Áp dụng cả xác thực + phân quyền
const onlyAdminOrStaff = [isAuth, authorizeRoles("admin", "staff")];

router.post("/", onlyAdminOrStaff, categorieController.createFeaturedProduct);
router.get("/", categorieController.getAllFeaturedProducts);
router.get("/:id", categorieController.getFeaturedProductById);
router.put("/:id", onlyAdminOrStaff, categorieController.updateFeaturedProduct);
router.delete(
  "/:id",
  onlyAdminOrStaff,
  categorieController.deleteFeaturedProduct
);

module.exports = router;
