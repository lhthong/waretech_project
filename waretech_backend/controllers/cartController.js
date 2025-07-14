const Cart = require("../models/cartModel");

const cartController = {
  // Thêm sản phẩm vào giỏ hàng
  createCart: async (req, res) => {
    try {
      const userId = req.user.iduser;
      const { product_id, quantity } = req.body;

      if (!product_id) {
        return res.status(400).json({ message: "Thiếu thông tin sản phẩm" });
      }

      const newCart = await Cart.create({
        user_id: userId,
        product_id,
        quantity,
      });

      return res.status(201).json({
        message: "Thêm sản phẩm vào giỏ hàng thành công",
        cart: newCart,
      });
    } catch (err) {
      console.error("Lỗi thêm sản phẩm vào giỏ hàng:", err);
      return res
        .status(500)
        .json({ message: "Lỗi khi thêm sản phẩm vào giỏ hàng" });
    }
  },

  // Lấy giỏ hàng theo userId
  getCartByToken: async (req, res) => {
    try {
      const userId = req.user.id;
      const carts = await Cart.findByUserId(userId);
      res.status(200).json(carts);
    } catch (err) {
      console.error("Lỗi lấy giỏ hàng của người dùng:", err);
      res.status(500).json({ message: "Lỗi khi lấy giỏ hàng người dùng" });
    }
  },

  // Cập nhật thông tin sản phẩm trong giỏ hàng
  updateCart: async (req, res) => {
    try {
      const result = await Cart.update(req.params.id, req.body);
      return res.status(200).json({
        message: "Cập nhật sản phẩm trong giỏ hàng thành công",
        cart: result,
      });
    } catch (err) {
      res.status(500).json({
        message: "Lỗi khi cập nhật sản phẩm trong giỏ hàng",
        error: err.message,
      });
    }
  },

  // Xóa 1 sản phẩm trong giỏ hàng
  deleteCart: async (req, res) => {
    try {
      await Cart.delete(req.params.id);
      return res
        .status(200)
        .json({ message: "Xóa sản phẩm trong giỏ hàng thành công" });
    } catch (err) {
      console.error("Lỗi xóa sản phẩm trong giỏ hàng:", err);
      return res
        .status(500)
        .json({ message: "Lỗi khi xóa sản phẩm trong giỏ hàng" });
    }
  },

  // Xóa nhiều sản phẩm cùng lúc
  deleteCartMany: async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids)) {
        return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
      }
      await Cart.deleteMany(ids);
      return res.status(200).json({ message: "Xóa nhiều sản phẩm thành công" });
    } catch (err) {
      console.error("Lỗi xóa nhiều sản phẩm:", err);
      return res
        .status(500)
        .json({ message: "Lỗi khi xóa nhiều sản phẩm khỏi giỏ hàng" });
    }
  },
};

module.exports = cartController;
