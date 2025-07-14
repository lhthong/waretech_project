const prisma = require("../utils/prismaClient");

const Supplier = {
  create: async (supplierData) => {
    try {
      return await prisma.suppliers.create({ data: supplierData });
    } catch (error) {
      console.error("Lỗi tạo nhà cung cấp:", error);
      throw new Error("Lỗi khi tạo nhà cung cấp");
    }
  },

  findAll: async () => {
    try {
      return await prisma.suppliers.findMany();
    } catch (error) {
      console.error("Lỗi lấy danh sách nhà cung cấp:", error);
      throw new Error("Lỗi khi lấy danh sách nhà cung cấp");
    }
  },

  findById: async (id) => {
    try {
      return await prisma.suppliers.findUnique({
        where: { id: Number(id) },
      });
    } catch (error) {
      console.error("Lỗi lấy nhà cung cấp theo ID:", error);
      throw new Error("Lỗi khi lấy thông tin nhà cung cấp");
    }
  },

  findByName: async (name) => {
    try {
      return await prisma.suppliers.findUnique({ where: { name } });
    } catch (error) {
      console.error("Lỗi lấy nhà cung cấp theo name:", error);
      throw new Error("Lỗi khi lấy thông tin nhà cung cấp");
    }
  },

  update: async (id, supplierData) => {
    try {
      return await prisma.suppliers.update({
        where: { id: Number(id) },
        data: supplierData,
      });
    } catch (error) {
      console.error("Lỗi cập nhật nhà cung cấp:", error);
      throw new Error("Lỗi khi cập nhật nhà cung cấp");
    }
  },

  delete: async (id) => {
    try {
      return await prisma.suppliers.delete({ where: { id: Number(id) } });
    } catch (error) {
      console.error("Lỗi xóa nhà cung cấp:", error);
      throw new Error("Lỗi khi xóa nhà cung cấp");
    }
  },
};

module.exports = Supplier;
