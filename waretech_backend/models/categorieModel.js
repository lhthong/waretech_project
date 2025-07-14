const prisma = require("../utils/prismaClient");

const Categorie = {
  create: async (categorieData) => {
    try {
      return await prisma.categories.create({ data: categorieData });
    } catch (error) {
      console.error("Lỗi tạo danh mục:", error);
      throw new Error("Lỗi khi tạo danh mục");
    }
  },

  findAll: async () => {
    try {
      return await prisma.categories.findMany();
    } catch (error) {
      console.error("Lỗi lấy danh sách danh mục:", error);
      throw new Error("Lỗi khi lấy danh sách danh mục");
    }
  },
  findById: async (id) => {
    try {
      return await prisma.categories.findUnique({ where: { id: Number(id) } });
    } catch (error) {
      console.error("Lỗi tìm danh mục theo ID:", error);
      throw new Error("Lỗi khi tìm danh mục");
    }
  },
  update: async (id, categorieData) => {
    try {
      return await prisma.categories.update({
        where: { id: Number(id) },
        data: categorieData,
      });
    } catch (error) {
      console.error("Lỗi cập nhật danh mục:", error);
      throw new Error("Lỗi khi cập nhật danh mục");
    }
  },
  delete: async (id) => {
    try {
      return await prisma.categories.delete({ where: { id: Number(id) } });
    } catch (error) {
      console.error("Lỗi xóa danh mục:", error);
      throw new Error("Lỗi khi xóa danh mục");
    }
  },
};

module.exports = Categorie;
