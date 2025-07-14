const prisma = require("../utils/prismaClient");
const Overview = {
  getTotalImportByMonthYear: async (month, year) => {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const result = await prisma.phieu_nhap.aggregate({
        _sum: { so_luong: true },
        where: {
          created_at: { gte: startDate, lte: endDate },
        },
      });

      return result._sum.so_luong || 0;
    } catch (error) {
      console.error("Lỗi tính tổng nhập kho:", error);
      throw new Error("Lỗi khi tính tổng nhập kho");
    }
  },

  getTotalExportByMonthYear: async (month, year) => {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const result = await prisma.phieu_xuat.aggregate({
        _sum: { so_luong: true },
        where: {
          created_at: { gte: startDate, lte: endDate },
        },
      });

      return result._sum.so_luong || 0;
    } catch (error) {
      console.error("Lỗi tính tổng xuất kho:", error);
      throw new Error("Lỗi khi tính tổng xuất kho");
    }
  },

  getCurrentStock: async (productId) => {
    try {
      const product = await prisma.products.findUnique({
        where: { id: Number(productId) },
        select: { stock_quantity: true },
      });

      return product?.stock_quantity || 0;
    } catch (error) {
      console.error("Lỗi lấy tồn kho:", error);
      throw new Error("Lỗi khi lấy tồn kho");
    }
  },

  getYearlyStats: async (year) => {
    try {
      const importStats = await prisma.phieu_nhap.groupBy({
        by: ["created_at"],
        _sum: { so_luong: true },
        where: {
          created_at: {
            gte: new Date(`${year}-01-01T00:00:00Z`),
            lte: new Date(`${year}-12-31T23:59:59Z`),
          },
        },
      });

      const exportStats = await prisma.phieu_xuat.groupBy({
        by: ["created_at"],
        _sum: { so_luong: true },
        where: {
          created_at: {
            gte: new Date(`${year}-01-01T00:00:00Z`),
            lte: new Date(`${year}-12-31T23:59:59Z`),
          },
        },
      });

      const monthlyImport = Array(12).fill(0);
      const monthlyExport = Array(12).fill(0);

      importStats.forEach((item) => {
        const month = new Date(item.created_at).getMonth();
        monthlyImport[month] += item._sum.so_luong || 0;
      });

      exportStats.forEach((item) => {
        const month = new Date(item.created_at).getMonth();
        monthlyExport[month] += item._sum.so_luong || 0;
      });

      const stats = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        total_import: monthlyImport[i],
        total_export: monthlyExport[i],
        total_stock: monthlyImport[i] - monthlyExport[i],
      }));

      return stats;
    } catch (error) {
      console.error("Lỗi lấy thống kê năm:", error);
      throw new Error("Lỗi khi lấy thống kê năm");
    }
  },

  getMonthlyStats: async (month, year) => {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const [imports, exports] = await Promise.all([
        prisma.phieu_nhap.findMany({
          where: {
            created_at: { gte: startDate, lte: endDate },
          },
          include: {
            products: true,
            users: true,
            suppliers: true,
          },
        }),
        prisma.phieu_xuat.findMany({
          where: {
            created_at: { gte: startDate, lte: endDate },
          },
          include: {
            products: true,
            users: true,
          },
        }),
      ]);

      return {
        imports,
        exports,
        total_import: imports.reduce((sum, item) => sum + item.so_luong, 0),
        total_export: exports.reduce((sum, item) => sum + item.so_luong, 0),
      };
    } catch (error) {
      console.error("Lỗi lấy thống kê tháng:", error);
      throw new Error("Lỗi khi lấy thống kê tháng");
    }
  },

  warehouseOverview: async () => {
    try {
      const phieuNhap = await prisma.phieu_nhap.findMany({
        select: {
          id: true,
          so_luong: true,
          created_at: true,
          users: { select: { fullname: true } },
          suppliers: { select: { name: true } },
          products: {
            select: {
              product_code: true,
              product_name: true,
            },
          },
        },
      });

      const phieuXuat = await prisma.phieu_xuat.findMany({
        select: {
          id: true,
          so_luong: true,
          created_at: true,
          users: { select: { fullname: true } },
          products: {
            select: {
              product_code: true,
              product_name: true,
            },
          },
        },
      });

      // Gộp dữ liệu và phân biệt loại phiếu
      const data = [
        ...phieuNhap.map((pn) => ({
          ...pn,
          type: "Nhập kho",
          supplierName: pn.suppliers?.name || null,
        })),
        ...phieuXuat.map((px) => ({
          ...px,
          type: "Xuất kho",
          supplierName: null,
        })),
      ];

      return data;
    } catch (error) {
      console.error("Lỗi lấy danh sách kho tổng hợp:", error);
      throw error;
    }
  },

  getStockPercentageByCategory: async () => {
    try {
      // Lấy tổng tồn kho toàn bộ sản phẩm
      const totalStock = await prisma.products.aggregate({
        _sum: { stock_quantity: true },
      });

      const total = totalStock._sum.stock_quantity || 0;

      if (total === 0) return [];

      // Nhóm theo category và tính tổng tồn kho mỗi nhóm
      const grouped = await prisma.products.groupBy({
        by: ["category_id"],
        _sum: { stock_quantity: true },
      });

      // Lấy tên danh mục
      const categories = await prisma.categories.findMany({
        select: { id: true, categorie_name: true },
      });

      // Gộp dữ liệu lại
      const result = grouped.map((group) => {
        const category = categories.find((c) => c.id === group.category_id);
        const quantity = group._sum.stock_quantity || 0;
        const percentage = Number(((quantity / total) * 100).toFixed(2));
        return {
          category: category?.categorie_name || "Không rõ",
          quantity,
          percentage,
        };
      });

      return result;
    } catch (error) {
      console.error("Lỗi khi tính phần trăm tồn kho:", error);
      throw new Error("Không thể tính phần trăm tồn kho theo nhóm sản phẩm");
    }
  },
};
module.exports = Overview;
