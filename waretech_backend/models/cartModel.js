const prisma = require("../utils/prismaClient");

const Cart = {
  // Thêm sản phẩm vào giỏ hàng
  create: async (cartData) => {
    try {
      const { user_id, product_id, quantity } = cartData;

      const existingItem = await prisma.cart_items.findFirst({
        where: {
          user_id: Number(user_id),
          product_id: Number(product_id),
        },
      });

      if (existingItem) {
        return await prisma.cart_items.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + (quantity || 1),
          },
        });
      } else {
        const data = {
          user_id: Number(user_id),
          product_id: Number(product_id),
        };
        if (quantity) data.quantity = quantity;

        return await prisma.cart_items.create({ data });
      }
    } catch (error) {
      console.error("Lỗi thêm sản phẩm vào giỏ hàng:", error);
      throw new Error("Lỗi khi thêm sản phẩm vào giỏ hàng");
    }
  },

  // Lấy danh sách sản phẩm trong giỏ hàng của 1 người dùng
  findByUserId: async (userId) => {
    try {
      return await prisma.cart_items.findMany({
        where: { user_id: Number(userId) },
        include: {
          products: {
            select: {
              id: true,
              product_code: true,
              product_name: true,
              sell_price: true,
              product_images: {
                where: { is_main: true },
                select: { image_url: true },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error("Lỗi lấy giỏ hàng theo user:", error);
      throw new Error("Lỗi khi lấy giỏ hàng người dùng");
    }
  },

  // Cập nhật số lượng hoặc thông tin sản phẩm trong giỏ hàng
  update: async (id, cartData) => {
    try {
      return await prisma.cart_items.update({
        where: { id: Number(id) },
        data: cartData,
      });
    } catch (error) {
      console.error("Lỗi cập nhật giỏ hàng:", error);
      throw new Error("Lỗi khi cập nhật giỏ hàng");
    }
  },

  // Xóa một sản phẩm khỏi giỏ hàng
  delete: async (id) => {
    try {
      return await prisma.cart_items.delete({ where: { id: Number(id) } });
    } catch (error) {
      console.error("Lỗi xóa sản phẩm khỏi giỏ hàng:", error);
      throw new Error("Lỗi khi xóa sản phẩm khỏi giỏ hàng");
    }
  },

  // Xóa nhiều sản phẩm cùng lúc
  deleteMany: async (ids) => {
    try {
      return await prisma.cart_items.deleteMany({
        where: {
          id: {
            in: ids.map((id) => Number(id)),
          },
        },
      });
    } catch (error) {
      console.error("Lỗi xóa nhiều sản phẩm:", error);
      throw new Error("Lỗi khi xóa nhiều sản phẩm khỏi giỏ hàng");
    }
  },
};

module.exports = Cart;
