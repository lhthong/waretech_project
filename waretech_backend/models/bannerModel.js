const prisma = require("../utils/prismaClient");

const Banner = {
  create: async (bannerData) => {
    try {
      if (!bannerData || !bannerData.image_url) {
        throw new Error("Dữ liệu hình ảnh không hợp lệ");
      }
      return await prisma.banners.create({ data: bannerData });
    } catch (error) {
      console.error("Lỗi tạo banner:", error.message || error);
      throw new Error("Lỗi khi tạo banner");
    }
  },

  //  Lấy danh sách banner đang hiển thị (client-side)
  findAllActive: async () => {
    try {
      return await prisma.banners.findMany({
        where: { is_active: true },
        orderBy: { id: "desc" },
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách banner:", error);
      throw new Error("Lỗi khi lấy danh sách banner");
    }
  },

  //Lấy tất cả banner (bao gồm đang ẩn và đang hiển thị)
  findAll: async () => {
    try {
      return await prisma.banners.findMany({
        orderBy: { id: "desc" },
      });
    } catch (error) {
      console.error("Lỗi lấy tất cả banner (admin):", error);
      throw new Error("Lỗi khi lấy danh sách banner");
    }
  },

  // Tìm banner theo ID (admin xem chi tiết)
  findById: async (id) => {
    try {
      const numericId = Number(id);
      if (!numericId || isNaN(numericId)) return null;

      return await prisma.banners.findUnique({
        where: { id: numericId },
      });
    } catch (error) {
      console.error("Lỗi tìm banner theo ID:", error);
      throw new Error("Lỗi khi tìm banner");
    }
  },

  //Cập nhật trạng thái hiển thị (on/off)
  toggleActive: async (id, isActive) => {
    try {
      return await prisma.banners.update({
        where: { id: Number(id) },
        data: { is_active: Boolean(isActive) },
      });
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái banner:", error);
      throw new Error("Lỗi khi cập nhật trạng thái banner");
    }
  },

  //Xóa banner vĩnh viễn
  delete: async (id) => {
    try {
      return await prisma.banners.delete({ where: { id: Number(id) } });
    } catch (error) {
      console.error("Lỗi xóa banner:", error);
      throw new Error("Lỗi khi xóa banner");
    }
  },
};

module.exports = Banner;
