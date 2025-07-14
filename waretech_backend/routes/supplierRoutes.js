const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");
const { isAuth, authorizeRoles } = require("../middleware/authMiddleware");

// Áp dụng cả xác thực + phân quyền
const onlyAdminOrStaff = [isAuth, authorizeRoles("admin", "staff")];

router.post("/", onlyAdminOrStaff, supplierController.createSupplier);
router.get("/", onlyAdminOrStaff, supplierController.getAllSupplier);
router.get("/:id", onlyAdminOrStaff, supplierController.getSupplierById);
router.put("/:id", onlyAdminOrStaff, supplierController.updateSupplier);
router.delete("/:id", onlyAdminOrStaff, supplierController.deleteSupplier);

module.exports = router;
