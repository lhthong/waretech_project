const prisma = require("../utils/prismaClient");

const User = {
  create: async (userData) => {
    try {
      return await prisma.users.create({ data: userData });
    } catch (error) {
      console.error("Lỗi tạo người dùng:", error);
      throw new Error("Lỗi khi tạo người dùng");
    }
  },

  findAll: async () => {
    try {
      return await prisma.users.findMany();
    } catch (error) {
      console.error("Lỗi lấy danh sách người dùng:", error);
      throw new Error("Lỗi khi lấy danh sách người dùng");
    }
  },

  findById: async (id) => {
    try {
      return await prisma.users.findUnique({ where: { iduser: Number(id) } });
    } catch (error) {
      console.error("Lỗi lấy người dùng theo ID:", error);
      throw new Error("Lỗi khi lấy thông tin người dùng");
    }
  },

  findByUsername: async (username) => {
    try {
      return await prisma.users.findUnique({ where: { username } });
    } catch (error) {
      console.error("Lỗi lấy người dùng theo username:", error);
      throw new Error("Lỗi khi lấy thông tin người dùng");
    }
  },

  update: async (id, userData) => {
    try {
      return await prisma.users.update({
        where: { iduser: Number(id) },
        data: userData,
      });
    } catch (error) {
      console.error("Lỗi cập nhật người dùng:", error);
      throw new Error("Lỗi khi cập nhật người dùng");
    }
  },

  delete: async (id) => {
    try {
      return await prisma.users.delete({ where: { iduser: Number(id) } });
    } catch (error) {
      console.error("Lỗi xóa người dùng:", error);
      throw new Error("Lỗi khi xóa người dùng");
    }
  },
};

module.exports = User;
