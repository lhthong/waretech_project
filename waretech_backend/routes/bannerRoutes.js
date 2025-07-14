const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadBanner");
const bannerController = require("../controllers/bannerController");
const { isAuth, authorizeRoles } = require("../middleware/authMiddleware");

// Áp dụng cả xác thực + phân quyền
const onlyAdminOrStaff = [isAuth, authorizeRoles("admin", "staff")];

router.post(
  "/",
  onlyAdminOrStaff,
  upload.single("image"),
  bannerController.createBanner
);
router.get("/", onlyAdminOrStaff, bannerController.getAllBanners);
router.get("/active", bannerController.getActiveBanners);
router.get("/:id", onlyAdminOrStaff, bannerController.getBannerById);
router.patch(
  "/:id/toggle",
  onlyAdminOrStaff,
  bannerController.toggleBannerActive
);
router.delete("/:id", onlyAdminOrStaff, bannerController.deleteBanner);

module.exports = router;
