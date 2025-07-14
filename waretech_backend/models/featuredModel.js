const prisma = require("../utils/prismaClient");

const FeaturedProduct = {
  create: async (featuredData) => {
    try {
      return await prisma.featured_products.create({
        data: {
          product_id: featuredData.product_id,
          type: featuredData.type,
          priority: featuredData.priority || 0,
        },
        include: {
          products: {
            select: {
              product_name: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Lỗi tạo sản phẩm đặc trưng:", error);
      throw new Error("Lỗi khi tạo sản phẩm đặc trưng");
    }
  },

  findAll: async (type = null) => {
    try {
      const whereClause = type ? { type } : {};

      return await prisma.featured_products.findMany({
        where: whereClause,
        orderBy: { priority: "desc" },
        select: {
          id: true,
          type: true,
          priority: true,
          product_id: true,
          products: {
            select: {
              id: true,
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
      console.error("Lỗi khi hiển thị sản phẩm nổi bật:", error);
      throw error;
    }
  },

  // Lấy sản phẩm nổi bật theo ID
  findById: async (id) => {
    try {
      return await prisma.featured_products.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          type: true,
          priority: true,
          product_id: true,
          products: {
            select: {
              product_name: true,
              sell_price: true,
              product_images: {
                where: {
                  is_main: true,
                },
                select: {
                  image_url: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error("Lỗi khi hiển thị sản phẩm nổi bật theo id:", error);
      throw error;
    }
  },

  update: async (id, featuredData) => {
    try {
      return await prisma.featured_products.update({
        where: { id: Number(id) },
        data: {
          product_id: featuredData.product_id,
          type: featuredData.type,
          priority: featuredData.priority,
        },
      });
    } catch (error) {
      console.error("Lỗi cập nhật sản phẩm đặc trưng:", error);
      throw new Error("Lỗi khi cập nhật sản phẩm đặc trưng");
    }
  },

  delete: async (id) => {
    try {
      return await prisma.featured_products.delete({
        where: { id: Number(id) },
      });
    } catch (error) {
      console.error("Lỗi xóa sản phẩm đặc trưng:", error);
      throw new Error("Lỗi khi xóa sản phẩm đặc trưng");
    }
  },

  // Thêm phương thức mới để kiểm tra trùng lặp
  checkExist: async (product_id, type) => {
    try {
      return await prisma.featured_products.findFirst({
        where: {
          product_id: Number(product_id),
          type: type,
        },
      });
    } catch (error) {
      console.error("Lỗi kiểm tra sản phẩm đặc trưng:", error);
      throw new Error("Lỗi khi kiểm tra sản phẩm đặc trưng");
    }
  },
};

module.exports = FeaturedProduct;
