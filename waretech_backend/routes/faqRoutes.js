const express = require("express");
const router = express.Router();
const faqController = require("../controllers/faqController");
const { isAuth, authorizeRoles } = require("../middleware/authMiddleware");

// Áp dụng cả xác thực + phân quyền
const onlyAdmin = [isAuth, authorizeRoles("admin")];
const onlyAdminOrStaff = [isAuth, authorizeRoles("admin", "staff")];

router.post("/", onlyAdmin, faqController.createFaq);
router.get("/", faqController.getAllFaqs);
router.get("/:id", onlyAdminOrStaff, faqController.getFaqById);
router.put("/:id", onlyAdmin, faqController.updateFaq);
router.delete("/:id", onlyAdmin, faqController.deleteFaq);
router.patch("/:id/status", onlyAdmin, faqController.updateFaqStatus);
router.post("/chatbot", faqController.handleChatbotQuestion);

module.exports = router;
