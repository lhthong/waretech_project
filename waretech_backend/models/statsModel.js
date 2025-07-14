const prisma = require("../utils/prismaClient");

const Stats = {
  // Tính tiền lời hôm nay
  dailyProfit: async (date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await prisma.orders.findMany({
      where: {
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
        trang_thai: "hoanthanh",
      },
      include: {
        order_details: {
          include: {
            products: true,
          },
        },
      },
    });

    let totalProfit = 0;
    for (const order of orders) {
      for (const detail of order.order_details) {
        const profit =
          (detail.products.sell_price - detail.products.import_price) *
          detail.so_luong;
        totalProfit += profit;
      }
    }
    return totalProfit;
  },

  // Tính doanh thu hôm nay
  dailyRevenue: async (date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await prisma.orders.findMany({
      where: {
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
        trang_thai: "hoanthanh",
      },
    });

    return orders.reduce((sum, order) => sum + (order.tong_tien || 0), 0);
  },

  // Đếm số đơn hàng hôm nay
  countDailyOrders: async (date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await prisma.orders.count({
      where: {
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
  },

  // Tính số sản phẩm đã bán hôm nay
  dailySoldProducts: async (date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await prisma.orders.findMany({
      where: {
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
        trang_thai: "hoanthanh",
      },
      include: {
        order_details: true,
      },
    });

    return orders.reduce((sum, order) => {
      return (
        sum +
        order.order_details.reduce(
          (sumDetail, detail) => sumDetail + (detail.so_luong || 0),
          0
        )
      );
    }, 0);
  },

  // Tính tổng số sản phẩm tồn kho
  totalInventory: async () => {
    const products = await prisma.products.findMany();
    return products.reduce((sum, product) => sum + product.stock_quantity, 0);
  },

  // Doanh thu theo ngày trong tháng
  revenueByDay: async (month, year) => {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    const orders = await prisma.orders.findMany({
      where: {
        created_at: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        trang_thai: "hoanthanh",
      },
      include: {
        order_details: true,
      },
    });

    const revenueByDay = {};
    for (const order of orders) {
      const day = order.created_at.getDate();
      const key = `${day.toString().padStart(2, "0")}/${month
        .toString()
        .padStart(2, "0")}`;
      revenueByDay[key] = (revenueByDay[key] || 0) + (order.tong_tien || 0);
    }

    return Object.entries(revenueByDay).map(([name, revenue]) => ({
      name,
      revenue,
    }));
  },

  // Doanh thu theo tháng trong năm
  revenueByMonth: async (year) => {
    const orders = await prisma.orders.findMany({
      where: {
        created_at: {
          gte: new Date(year, 0, 1),
          lte: new Date(year, 11, 31),
        },
        trang_thai: "hoanthanh",
      },
    });

    const revenueByMonth = Array(12).fill(0);
    for (const order of orders) {
      const month = order.created_at.getMonth();
      revenueByMonth[month] += order.tong_tien || 0;
    }

    return revenueByMonth.map((revenue, index) => ({
      name: `T${index + 1}`,
      revenue,
    }));
  },

  // Doanh thu theo năm
  revenueByYear: async (startYear, endYear) => {
    const orders = await prisma.orders.findMany({
      where: {
        created_at: {
          gte: new Date(startYear, 0, 1),
          lte: new Date(endYear, 11, 31),
        },
        trang_thai: "hoanthanh",
      },
    });

    const revenueByYear = {};
    for (const order of orders) {
      const year = order.created_at.getFullYear();
      revenueByYear[year] = (revenueByYear[year] || 0) + (order.tong_tien || 0);
    }

    return Object.entries(revenueByYear)
      .filter(([year]) => year >= startYear && year <= endYear)
      .map(([name, revenue]) => ({ name, revenue }));
  },

  // Lấy sản phẩm bán chạy
  getBestSellingProducts: async (limit = 6) => {
    const orderDetails = await prisma.order_details.groupBy({
      by: ["product_id"],
      _sum: {
        so_luong: true,
      },
      orderBy: {
        _sum: {
          so_luong: "desc",
        },
      },
      take: limit,
    });

    const productIds = orderDetails.map((detail) => detail.product_id);
    const products = await prisma.products.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        product_name: true,
        sell_price: true,
      },
    });

    return orderDetails.map((detail) => {
      const product = products.find((p) => p.id === detail.product_id);
      return {
        name: product.product_name,
        sold: detail._sum.so_luong,
        price: product.sell_price,
      };
    });
  },

  // Lấy sản phẩm tồn kho nhiều nhất
  getTopInventoryProducts: async (limit = 4) => {
    const products = await prisma.products.findMany({
      orderBy: {
        stock_quantity: "desc",
      },
      take: limit,
      include: {
        categories: {
          select: {
            categorie_name: true,
          },
        },
      },
    });

    return products.map((product) => ({
      name: product.product_name,
      stock: product.stock_quantity,
      category: product.categories?.categorie_name || "Không có danh mục",
    }));
  },
};

module.exports = Stats;
