const prisma = require("../utils/prismaClient");

const ProductImage = {
  create: async (productImageData) => {
    try {
      if (
        !productImageData ||
        !productImageData.product_id ||
        !productImageData.image_url
      ) {
        throw new Error("Dữ liệu hình ảnh sản phẩm không hợp lệ");
      }
      return await prisma.product_images.create({ data: productImageData });
    } catch (error) {
      console.error("Lỗi tạo hình ảnh sản phẩm:", error.message || error);
      throw new Error("Lỗi khi tạo hình ảnh sản phẩm");
    }
  },

  findAll: async () => {
    try {
      return await prisma.product_images.findMany();
    } catch (error) {
      console.error("Lỗi lấy danh sách hình ảnh sản phẩm:", error);
      throw new Error("Lỗi khi lấy danh sách hình ảnh sản phẩm");
    }
  },
  findById: async (id) => {
    try {
      const numericId = Number(id);
      if (!numericId || isNaN(numericId)) return null;

      return await prisma.product_images.findUnique({
        where: { id: numericId },
      });
    } catch (error) {
      console.error("Lỗi tìm hình ảnh sản phẩm theo ID:", error);
      throw new Error("Lỗi khi tìm hình ảnh sản phẩm");
    }
  },
  update: async (id, productImageData) => {
    try {
      return await prisma.product_images.update({
        where: { id: Number(id) },
        data: productImageData,
      });
    } catch (error) {
      console.error("Lỗi cập nhật hình ảnh sản phẩm:", error);
      throw new Error("Lỗi khi cập nhật hình ảnh sản phẩm");
    }
  },
  delete: async (id) => {
    try {
      return await prisma.product_images.delete({ where: { id: Number(id) } });
    } catch (error) {
      console.error("Lỗi xóa hình ảnh sản phẩm:", error);
      throw new Error("Lỗi khi xóa hình ảnh sản phẩm");
    }
  },
};

module.exports = ProductImage;
