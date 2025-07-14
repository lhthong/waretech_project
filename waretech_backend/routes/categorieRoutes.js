const express = require("express");
const router = express.Router();
const categorieController = require("../controllers/categorieController");
const { isAuth, authorizeRoles } = require("../middleware/authMiddleware");

// Áp dụng cả xác thực + phân quyền
const onlyAdminOrStaff = [isAuth, authorizeRoles("admin", "staff")];

router.post("/", onlyAdminOrStaff, categorieController.createCategorie);
router.get("/", categorieController.getAllCategorie);
router.put("/:id", onlyAdminOrStaff, categorieController.updateCategorie);
router.delete("/:id", onlyAdminOrStaff, categorieController.deleteCategorie);

module.exports = router;
