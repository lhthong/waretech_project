const Supplier = require("../models/supplierModel");

const supplierController = {
  createSupplier: async (req, res) => {
    try {
      const newSupplier = await Supplier.create(req.body);
      return res.status(201).json({
        message: "Tạo nhà cung cấp thành công",
        supplier: newSupplier,
      });
    } catch (err) {
      console.error("Lỗi tạo nhà cung cấp:", err);
      return res.status(500).json({ message: "Lỗi khi tạo nhà cung cấp" });
    }
  },

  getAllSupplier: async (req, res) => {
    try {
      const suppliers = await Supplier.findAll();
      res.status(200).json(suppliers);
    } catch (err) {
      console.error("Lỗi lấy danh sách nhà cung cấp:", err);
      return res
        .status(500)
        .json({ message: "Lỗi khi lấy danh sách nhà cung cấp" });
    }
  },

  getSupplierById: async (req, res) => {
    try {
      const id = req.params.id;
      const supplier = await Supplier.findById(id);
      if (!supplier) {
        return res.status(404).json({ message: "Không tìm thấy nhà cung cấp" });
      }
      return res.status(200).json(supplier);
    } catch (err) {
      console.error("Lỗi lấy nhà cung cấp:", err);
      return res.status(500).json({ message: "Lỗi khi lấy nhà cung cấp" });
    }
  },

  updateSupplier: async (req, res) => {
    try {
      const result = await Supplier.update(req.params.id, req.body);
      return res.status(200).json({
        message: "Cập nhật nhà cung cấp thành công",
        supplier: result,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Lỗi khi cập nhật nhà cung cấp", error: err.message });
    }
  },

  deleteSupplier: async (req, res) => {
    try {
      const supplier = await Supplier.findById(req.params.id);
      if (!supplier) {
        return res.status(404).json({ message: "nhà cung cấp không tồn tại" });
      }

      await Supplier.delete(req.params.id);
      return res.status(200).json({ message: "Xóa nhà cung cấp thành công" });
    } catch (err) {
      console.error("Lỗi xóa nhà cung cấp:", err);
      return res.status(500).json({ message: "Lỗi khi xóa nhà cung cấp" });
    }
  },
};

module.exports = supplierController;
