const prisma = require("../utils/prismaClient");
const Warehouse = {
  createPhieuNhap: async (phieunhapData) => {
    try {
      return await prisma.phieu_nhap.create({ data: phieunhapData });
    } catch (error) {
      console.error("Lỗi tạo phiếu nhập:", error);
      throw new Error("Lỗi khi tạo phiếu nhập");
    }
  },
  // findAllPhieuNhap: async () => {
  //   try {
  //     return await prisma.phieu_nhap.findMany();
  //   } catch (error) {
  //     console.error("Lỗi lấy danh sách:", error);
  //     throw new Error("Lỗi khi lấy danh sách");
  //   }
  // },
  findByIdPhieuNhap: async (id) => {
    try {
      return await prisma.phieu_nhap.findUnique({ where: { id: Number(id) } });
    } catch (error) {
      console.error("Lỗi lấy sản phẩm theo ID:", error);
      throw new Error("Lỗi khi lấy sản phẩm");
    }
  },

  updatePhieuNhap: async (id, phieunhapData) => {
    try {
      return await prisma.phieu_nhap.update({
        where: { id: Number(id) },
        data: phieunhapData,
      });
    } catch (error) {
      console.error("Lỗi cập nhật sản phẩm:", error);
      throw new Error("Lỗi khi cập nhật sản phẩm");
    }
  },
  createPhieuxuat: async (phieuxuatData) => {
    try {
      return await prisma.phieu_xuat.create({ data: phieuxuatData });
    } catch (error) {
      console.error("Lỗi tạo phiếu nhập:", error);
      throw new Error("Lỗi khi tạo phiếu nhập");
    }
  },
  findAllPhieuxuat: async () => {
    try {
      return await prisma.phieu_xuat.findMany();
    } catch (error) {
      console.error("Lỗi lấy danh sách:", error);
      throw new Error("Lỗi khi lấy danh sách");
    }
  },
  findByIdPhieuxuat: async (id) => {
    try {
      return await prisma.phieu_xuat.findUnique({ where: { id: Number(id) } });
    } catch (error) {
      console.error("Lỗi lấy sản phẩm theo ID:", error);
      throw new Error("Lỗi khi lấy sản phẩm");
    }
  },

  updatePhieuxuat: async (id, phieuxuatData) => {
    try {
      return await prisma.phieu_xuat.update({
        where: { id: Number(id) },
        data: phieuxuatData,
      });
    } catch (error) {
      console.error("Lỗi cập nhật sản phẩm:", error);
      throw new Error("Lỗi khi cập nhật sản phẩm");
    }
  },
  findAllWarehousesInfo: async () => {
    try {
      return await prisma.phieu_nhap.findMany({
        select: {
          id: true,
          so_luong: true,
          created_at: true,
          users: {
            select: {
              iduser: true,
              fullname: true,
            },
          },
          suppliers: {
            select: {
              id: true,
              name: true,
            },
          },
          products: {
            select: {
              id: true,
              product_name: true,
              product_code: true,
              stock_quantity: true,
              categories: { select: { categorie_name: true } },
              phieu_xuat: {
                select: {
                  id: true,
                  so_luong: true,
                  created_at: true,
                  users: {
                    select: {
                      iduser: true,
                      fullname: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách phiếu nhập:", error);
      throw new Error("Lỗi khi lấy danh sách phiếu nhập");
    }
  },
};

module.exports = Warehouse;
