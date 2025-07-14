const express = require("express");
const router = express.Router();
const WarehouseController = require("../controllers/warehouseController");
const { isAuth, authorizeRoles } = require("../middleware/authMiddleware");

// Áp dụng cả xác thực + phân quyền
const onlyAdminOrStaff = [isAuth, authorizeRoles("admin", "staff")];

router.post(
  "/phieu_nhap",
  onlyAdminOrStaff,
  WarehouseController.createPhieunhap
);
// router.get("/phieu_nhap", onlyAdminOrStaff, WarehouseController.getAllPhieunhap);
router.get(
  "/phieu_nhap/:id",
  onlyAdminOrStaff,
  WarehouseController.getPhieunhapById
);
router.put(
  "/phieu_nhap/:id",
  onlyAdminOrStaff,
  WarehouseController.updatePhieunhap
);

router.post(
  "/phieu_xuat",
  onlyAdminOrStaff,
  WarehouseController.createPhieuxuat
);
router.get(
  "/phieu_xuat",
  onlyAdminOrStaff,
  WarehouseController.getAllPhieuxuat
);
router.get(
  "/phieu_xuat/:id",
  onlyAdminOrStaff,
  WarehouseController.getPhieuxuatById
);
router.put(
  "/phieu_xuat/:id",
  onlyAdminOrStaff,
  WarehouseController.updatePhieuxuat
);

router.get(
  "/warehouse-info",
  onlyAdminOrStaff,
  WarehouseController.getAllWarehousesInfo
);
module.exports = router;
