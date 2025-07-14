const Warehouse = require("../models/warehouseModel");

const WarehouseController = {
  createPhieunhap: async (req, res) => {
    try {
      const newPhieunhap = await Warehouse.createPhieuNhap(req.body);
      return res.status(201).json({
        message: "Tạo phiếu nhập thành công",
        Phieunhap: newPhieunhap,
      });
    } catch (err) {
      console.error("Lỗi tạo phiếu nhập:", err);
      return res.status(500).json({ message: "Lỗi khi tạo phiếu nhập" });
    }
  },
  // getAllPhieunhap: async (req, res) => {
  //   try {
  //     const phieunhap = await Warehouse.findAllPhieuNhap();
  //     res.status(200).json(phieunhap);
  //   } catch (err) {
  //     console.error("Lỗi lấy danh sách:", err);
  //     return res.status(500).json({ message: "Lỗi khi lấy danh sách" });
  //   }
  // },

  getPhieunhapById: async (req, res) => {
    try {
      const id = req.params.id;
      const phieunhap = await Warehouse.findByIdPhieuNhap(id);
      if (!phieunhap) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      return res.status(200).json(phieunhap);
    } catch (err) {
      console.error("Lỗi lấy sản phẩm:", err);
      return res.status(500).json({ message: "Lỗi khi lấy sản phẩm" });
    }
  },

  updatePhieunhap: async (req, res) => {
    try {
      const result = await Warehouse.updatePhieuNhap(req.params.id, req.body);
      return res.status(200).json({
        message: "Cập nhật sản phẩm thành công",
        Phieunhap: result,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Lỗi khi cập nhật sản phẩm", error: err.message });
    }
  },
  createPhieuxuat: async (req, res) => {
    try {
      const newPhieuxuat = await Warehouse.createPhieuxuat(req.body);
      return res.status(201).json({
        message: "Tạo phiếu xuất thành công",
        Phieuxuat: newPhieuxuat,
      });
    } catch (err) {
      console.error("Lỗi tạo phiếu xuất:", err);
      return res.status(500).json({ message: "Lỗi khi tạo phiếu xuất" });
    }
  },
  getAllPhieuxuat: async (req, res) => {
    try {
      const phieuxuat = await Warehouse.findAllPhieuxuat();
      res.status(200).json(phieuxuat);
    } catch (err) {
      console.error("Lỗi lấy danh sách:", err);
      return res.status(500).json({ message: "Lỗi khi lấy danh sách" });
    }
  },

  getPhieuxuatById: async (req, res) => {
    try {
      const id = req.params.id;
      const phieuxuat = await Warehouse.findByIdPhieuxuat(id);
      if (!phieuxuat) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      return res.status(200).json(phieuxuat);
    } catch (err) {
      console.error("Lỗi lấy sản phẩm:", err);
      return res.status(500).json({ message: "Lỗi khi lấy sản phẩm" });
    }
  },

  updatePhieuxuat: async (req, res) => {
    try {
      const result = await Warehouse.updatePhieuxuat(req.params.id, req.body);
      return res.status(200).json({
        message: "Cập nhật sản phẩm thành công",
        Phieuxuat: result,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Lỗi khi cập nhật sản phẩm", error: err.message });
    }
  },
  getAllWarehousesInfo: async (req, res) => {
    try {
      const warehouse = await Warehouse.findAllWarehousesInfo();
      res.status(200).json(warehouse);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
      res.status(500).json({ message: "Lỗi khi lấy dữ liệu" });
    }
  },
};
module.exports = WarehouseController;
