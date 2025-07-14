const Categorie = require("../models/categorieModel");

const categorieController = {
  createCategorie: async (req, res) => {
    try {
      const newCategorie = await Categorie.create(req.body);
      return res
        .status(201)
        .json({ message: "Tạo danh mục thành công", category: newCategorie });
    } catch (err) {
      console.error("Lỗi tạo danh mục:", err);
      return res.status(500).json({ message: "Lỗi khi tạo danh mục" });
    }
  },

  getAllCategorie: async (req, res) => {
    try {
      const categories = await Categorie.findAll();
      res.status(200).json(categories);
    } catch (err) {
      console.error("Lỗi lấy danh sách danh mục:", err);
      return res
        .status(500)
        .json({ message: "Lỗi khi lấy danh sách danh mục" });
    }
  },

  updateCategorie: async (req, res) => {
    try {
      const result = await Categorie.update(req.params.id, req.body);
      return res.status(200).json({
        message: "Cập nhật danh mục thành công",
        categorie: result,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Lỗi khi cập nhật nhà cung cấp", error: err.message });
    }
  },

  deleteCategorie: async (req, res) => {
    try {
      const category = await Categorie.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Danh mục không tồn tại" });
      }

      await Categorie.delete(req.params.id);
      return res.status(200).json({ message: "Xóa danh mục thành công" });
    } catch (err) {
      console.error("Lỗi xóa danh mục:", err);
      return res.status(500).json({ message: "Lỗi khi xóa danh mục" });
    }
  },
};

module.exports = categorieController;
