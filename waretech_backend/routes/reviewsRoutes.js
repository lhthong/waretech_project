const express = require("express");
const router = express.Router();
const ReviewsController = require("../controllers/ReviewsController");
const { isAuth, authorizeRoles } = require("../middleware/authMiddleware");

// Áp dụng cả xác thực + phân quyền
const onlyAdminOrStaff = [isAuth, authorizeRoles("admin", "staff")];
const onlyCustomer = [isAuth, authorizeRoles("client")];

router.post("/", onlyCustomer, ReviewsController.createReviews);
router.get("/", ReviewsController.getAllReviews);
router.get("/:id", ReviewsController.getReviewsById);
router.put("/:id", onlyCustomer, ReviewsController.updateReviews);
router.delete("/:id", onlyAdminOrStaff, ReviewsController.deleteReviews);

module.exports = router;
