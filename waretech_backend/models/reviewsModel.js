const prisma = require("../utils/prismaClient");

const Reviews = {
  create: async (reviewData) => {
    try {
      return await prisma.product_reviews.create({ data: reviewData });
    } catch (error) {
      console.error("Lỗi tạo đánh giá sản phẩm:", error);
      throw new Error("Lỗi khi tạo đánh giá sản phẩm");
    }
  },

  findAll: async () => {
    try {
      return await prisma.product_reviews.findMany({
        include: {
          users: {
            select: {
              fullname: true,
            },
          },
          products: {
            select: {
              product_name: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách đánh giá sản phẩm:", error);
      throw new Error("Lỗi khi lấy danh sách đánh giá sản phẩm");
    }
  },

  findById: async (id) => {
    try {
      return await prisma.product_reviews.findUnique({
        where: { id: Number(id) },
      });
    } catch (error) {
      console.error("Lỗi lấy đánh giá sản phẩm theo ID:", error);
      throw new Error("Lỗi khi lấy thông tin đánh giá sản phẩm");
    }
  },

  findByUserAndProduct: async (user_id, product_id) => {
    try {
      return await prisma.product_reviews.findFirst({
        where: {
          user_id: Number(user_id),
          product_id: Number(product_id),
        },
      });
    } catch (error) {
      console.error("Lỗi tìm đánh giá theo người dùng và sản phẩm:", error);
      throw new Error("Lỗi khi kiểm tra đánh giá tồn tại");
    }
  },

  update: async (id, reviewsData) => {
    try {
      return await prisma.product_reviews.update({
        where: { id: Number(id) },
        data: reviewsData,
      });
    } catch (error) {
      console.error("Lỗi cập nhật đánh giá sản phẩm:", error);
      throw new Error("Lỗi khi cập nhật đánh giá sản phẩm");
    }
  },

  delete: async (id) => {
    try {
      return await prisma.product_reviews.delete({ where: { id: Number(id) } });
    } catch (error) {
      console.error("Lỗi xóa đánh giá sản phẩm:", error);
      throw new Error("Lỗi khi xóa đánh giá sản phẩm");
    }
  },
};

module.exports = Reviews;
