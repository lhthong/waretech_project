const express = require("express");
const router = express.Router();
const productImageController = require("../controllers/productImageController");
const {
  singleUpload,
  multipleUpload,
  handleUploadErrors,
} = require("../middleware/imageMiddleware");
const { isAuth, authorizeRoles } = require("../middleware/authMiddleware");

// Áp dụng cả xác thực + phân quyền
const onlyAdminOrStaff = [isAuth, authorizeRoles("admin", "staff")];

router.post(
  "/",
  onlyAdminOrStaff,
  singleUpload,
  handleUploadErrors,
  productImageController.createProductImage
);
router.post(
  "/many",
  onlyAdminOrStaff,
  multipleUpload,
  handleUploadErrors,
  productImageController.createManyProductImages
);
router.get("/", productImageController.getAllProductImage);
router.put(
  "/:id",
  onlyAdminOrStaff,
  productImageController.setAsMainProductImage
);
router.delete(
  "/:id",
  onlyAdminOrStaff,
  productImageController.deleteProductImage
);
router.post(
  "/delete-many",
  onlyAdminOrStaff,
  productImageController.deleteManyProductImages
);

module.exports = router;
