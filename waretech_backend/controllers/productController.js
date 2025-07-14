const Product = require("../models/productModel");
const { getStockStatus } = require("../utils/productUtils");

const productController = {
  createProduct: async (req, res) => {
    try {
      const newProduct = await Product.create(req.body);
      return res
        .status(201)
        .json({ message: "Tạo sản phẩm thành công", product: newProduct });
    } catch (err) {
      console.error("Lỗi tạo sản phẩm:", err);
      return res.status(500).json({ message: "Lỗi khi tạo sản phẩm" });
    }
  },

  getProductStore: async (req, res) => {
    try {
      const {
        categoryId,
        priceMin,
        priceMax,
        sortBy,
        page,
        limit,
        showDeleted,
        search,
      } = req.query;

      const { products, total } = await Product.productStore({
        categoryId,
        priceMin,
        priceMax,
        sortBy,
        page,
        limit,
        includeDeleted: showDeleted === "true",
        search,
      });

      res.status(200).json({ products, total });
    } catch (err) {
      console.error("Lỗi lấy danh sách sản phẩm:", err);
      res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm" });
    }
  },

  getAllProduct: async (req, res) => {
    try {
      const { showDeleted } = req.query;
      const products = await Product.findAll(showDeleted === "true");
      res.status(200).json(products);
    } catch (err) {
      console.error("Lỗi lấy danh sách sản phẩm:", err);
      return res
        .status(500)
        .json({ message: "Lỗi khi lấy danh sách sản phẩm" });
    }
  },

  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const { showDeleted } = req.query;
      const product = await Product.findById(id, showDeleted === "true");

      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      return res.status(200).json(product);
    } catch (err) {
      console.error("Lỗi lấy sản phẩm:", err);
      return res.status(500).json({ message: "Lỗi khi lấy sản phẩm" });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const result = await Product.update(req.params.id, req.body);
      return res.status(200).json({
        message: "Cập nhật sản phẩm thành công",
        product: result,
      });
    } catch (err) {
      res.status(500).json({
        message: "Lỗi khi cập nhật sản phẩm",
        error: err.message,
      });
    }
  },

  updateThreshold: async (req, res) => {
    try {
      const { id } = req.params;
      const { min_stock_level, max_stock_level } = req.body;

      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }

      if (
        typeof min_stock_level !== "number" ||
        typeof max_stock_level !== "number"
      ) {
        return res.status(400).json({ message: "Ngưỡng tồn kho phải là số" });
      }

      if (min_stock_level < 0 || max_stock_level < 0) {
        return res
          .status(400)
          .json({ message: "Ngưỡng tồn kho phải là số dương" });
      }

      if (max_stock_level <= min_stock_level) {
        return res
          .status(400)
          .json({ message: "Ngưỡng tối đa phải lớn hơn ngưỡng tối thiểu" });
      }

      const updatedProduct = await Product.update(id, {
        min_stock_level,
        max_stock_level,
      });

      return res.status(200).json({
        message: "Cập nhật ngưỡng thành công",
        product: updatedProduct,
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật ngưỡng:", err);
      return res.status(500).json({
        message: "Lỗi khi cập nhật ngưỡng",
        error: err.message,
      });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }

      if (product.deleted_at) {
        return res.status(400).json({ message: "Sản phẩm đã bị xóa trước đó" });
      }

      await Product.delete(req.params.id);
      return res.status(200).json({ message: "Xóa sản phẩm thành công" });
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);
      return res.status(500).json({
        message: err.message || "Lỗi khi xóa sản phẩm",
      });
    }
  },

  restoreProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id, true);
      if (!product) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }

      if (!product.deleted_at) {
        return res.status(400).json({ message: "Sản phẩm chưa bị xóa" });
      }

      await Product.restore(req.params.id);
      return res.status(200).json({ message: "Khôi phục sản phẩm thành công" });
    } catch (err) {
      console.error("Lỗi khôi phục sản phẩm:", err);
      return res.status(500).json({
        message: err.message || "Lỗi khi khôi phục sản phẩm",
      });
    }
  },

  getDeletedProducts: async (req, res) => {
    try {
      const products = await Product.findDeleted();
      return res.status(200).json(products);
    } catch (err) {
      console.error("Lỗi lấy danh sách sản phẩm đã xóa:", err);
      return res.status(500).json({
        message: "Lỗi khi lấy danh sách sản phẩm đã xóa",
      });
    }
  },

  getProductsByStockStatus: async (req, res) => {
    try {
      const { type } = req.query;
      const { showDeleted } = req.query;

      const products = await Product.findAll(showDeleted === "true");

      const filtered = products.filter((product) => {
        const status = getStockStatus(product);
        if (type === "du-thua" && status === "Dư thừa") return true;
        if (type === "sap-het" && status === "Sắp hết hàng") return true;
        if (type === "con-du" && status === "Còn đủ") return true;
        if (type === "het-hang" && status === "Hết hàng") return true;
        return false;
      });

      const filteredWithStatus = filtered.map((product) => ({
        ...product,
        status: getStockStatus(product),
      }));

      return res.status(200).json(filteredWithStatus);
    } catch (err) {
      console.error("Lỗi lọc sản phẩm theo tình trạng:", err);
      return res.status(500).json({ message: "Lỗi khi lọc sản phẩm" });
    }
  },

  searchProducts: async (req, res) => {
    try {
      const { name, showDeleted } = req.query;
      if (!name) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập tên sản phẩm để tìm kiếm" });
      }

      const products = await Product.searchByName(name, showDeleted === "true");
      return res.status(200).json(products);
    } catch (err) {
      console.error("Lỗi tìm kiếm sản phẩm:", err);
      return res.status(500).json({ message: "Lỗi khi tìm kiếm sản phẩm" });
    }
  },
};

module.exports = productController;
