const FeaturedProduct = require("../models/featuredModel");

const featuredController = {
  createFeaturedProduct: async (req, res) => {
    try {
      const { product_id, type } = req.body;

      // Kiểm tra sản phẩm đã tồn tại trong danh sách chưa
      const existing = await FeaturedProduct.checkExist(product_id, type);
      if (existing) {
        return res.status(400).json({
          message: "Sản phẩm đã tồn tại trong danh sách này",
        });
      }

      const newFeatured = await FeaturedProduct.create(req.body);
      return res.status(201).json({
        message: "Thêm sản phẩm đặc trưng thành công",
        featuredProduct: newFeatured,
      });
    } catch (err) {
      console.error("Lỗi thêm sản phẩm đặc trưng:", err);
      return res.status(500).json({
        message: "Lỗi khi thêm sản phẩm đặc trưng",
        error: err.message,
      });
    }
  },

  getAllFeaturedProducts: async (req, res) => {
    try {
      const { type } = req.query; // Lọc theo type nếu có
      const featuredProducts = await FeaturedProduct.findAll(type);
      res.status(200).json(featuredProducts);
    } catch (err) {
      console.error("Lỗi lấy danh sách sản phẩm đặc trưng:", err);
      return res.status(500).json({
        message: "Lỗi khi lấy danh sách sản phẩm đặc trưng",
        error: err.message,
      });
    }
  },

  getFeaturedProductById: async (req, res) => {
    try {
      const featuredProduct = await FeaturedProduct.findById(req.params.id);
      if (!featuredProduct) {
        return res.status(404).json({
          message: "Không tìm thấy sản phẩm đặc trưng",
        });
      }
      res.status(200).json(featuredProduct);
    } catch (err) {
      console.error("Lỗi lấy thông tin sản phẩm đặc trưng:", err);
      return res.status(500).json({
        message: "Lỗi khi lấy thông tin sản phẩm đặc trưng",
        error: err.message,
      });
    }
  },

  updateFeaturedProduct: async (req, res) => {
    try {
      const featuredProduct = await FeaturedProduct.findById(req.params.id);
      if (!featuredProduct) {
        return res.status(404).json({
          message: "Không tìm thấy sản phẩm đặc trưng",
        });
      }

      const result = await FeaturedProduct.update(req.params.id, req.body);
      return res.status(200).json({
        message: "Cập nhật sản phẩm đặc trưng thành công",
        featuredProduct: result,
      });
    } catch (err) {
      console.error("Lỗi cập nhật sản phẩm đặc trưng:", err);
      return res.status(500).json({
        message: "Lỗi khi cập nhật sản phẩm đặc trưng",
        error: err.message,
      });
    }
  },

  deleteFeaturedProduct: async (req, res) => {
    try {
      const featuredProduct = await FeaturedProduct.findById(req.params.id);
      if (!featuredProduct) {
        return res.status(404).json({
          message: "Không tìm thấy sản phẩm đặc trưng",
        });
      }

      await FeaturedProduct.delete(req.params.id);
      return res.status(200).json({
        message: "Xóa sản phẩm đặc trưng thành công",
      });
    } catch (err) {
      console.error("Lỗi xóa sản phẩm đặc trưng:", err);
      return res.status(500).json({
        message: "Lỗi khi xóa sản phẩm đặc trưng",
        error: err.message,
      });
    }
  },
};

module.exports = featuredController;
