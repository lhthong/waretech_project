const prisma = require("../utils/prismaClient");

// Hàm xử lý dữ liệu liên quan đến quan hệ (connect category)
const connectCategory = (data) => {
  const { category_id, ...rest } = data;
  return {
    ...rest,
    ...(category_id ? { categories: { connect: { id: category_id } } } : {}),
  };
};

const Product = {
  create: async (productData) => {
    try {
      const data = connectCategory(productData);
      return await prisma.products.create({ data });
    } catch (error) {
      console.error("Lỗi tạo sản phẩm:", error);
      throw new Error("Lỗi khi tạo sản phẩm");
    }
  },

  productStore: async ({
    categoryId,
    priceMin,
    priceMax,
    sortBy,
    page = 1,
    limit = 12,
    includeDeleted = false,
    search,
  } = {}) => {
    try {
      const whereClause = {
        ...(!includeDeleted && { deleted_at: null }),
        ...(categoryId && { category_id: Number(categoryId) }),
        ...(priceMin && { sell_price: { gte: Number(priceMin) } }),
        ...(priceMax && {
          sell_price: {
            ...(priceMin && { gte: Number(priceMin) }),
            lte: Number(priceMax),
          },
        }),
        ...(search && {
          product_name: {
            contains: search.toLowerCase(),
          },
        }),
      };

      let orderBy;
      if (sortBy === "priceAsc") orderBy = { sell_price: "asc" };
      else if (sortBy === "priceDesc") orderBy = { sell_price: "desc" };

      const skip = (Number(page) - 1) * Number(limit);

      const total = await prisma.products.count({ where: whereClause });

      const products = await prisma.products.findMany({
        where: whereClause,
        orderBy,
        skip,
        take: Number(limit),
        include: {
          product_images: {
            where: { is_main: true },
            select: { image_url: true },
          },
          featured_products: {
            where: { type: "new" },
            select: { id: true },
          },
        },
      });

      return { products, total };
    } catch (error) {
      console.error("Lỗi lấy danh sách sản phẩm:", error);
      throw new Error("Lỗi khi lấy danh sách sản phẩm");
    }
  },

  findAll: async (includeDeleted = false) => {
    try {
      return await prisma.products.findMany({
        where: includeDeleted ? {} : { deleted_at: null },
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách sản phẩm:", error);
      throw new Error("Lỗi khi lấy danh sách sản phẩm");
    }
  },

  findById: async (id, includeDeleted = false) => {
    try {
      return await prisma.products.findUnique({
        where: {
          id: Number(id),
          ...(!includeDeleted && { deleted_at: null }),
        },
        include: {
          product_images: {
            select: {
              image_url: true,
              is_main: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Lỗi lấy sản phẩm theo ID:", error);
      throw new Error("Lỗi khi lấy sản phẩm");
    }
  },

  update: async (id, productData) => {
    try {
      const data = connectCategory(productData);
      return await prisma.products.update({
        where: {
          id: Number(id),
          deleted_at: null, // Chỉ cập nhật sản phẩm chưa xóa
        },
        data,
      });
    } catch (error) {
      console.error("Lỗi cập nhật sản phẩm:", error);
      throw new Error("Lỗi khi cập nhật sản phẩm");
    }
  },

  delete: async (id) => {
    try {
      // Kiểm tra sản phẩm tồn tại và chưa bị xóa
      const product = await prisma.products.findUnique({
        where: { id: Number(id) },
      });

      if (!product) {
        throw new Error("Sản phẩm không tồn tại");
      }

      if (product.deleted_at) {
        throw new Error("Sản phẩm đã bị xóa trước đó");
      }

      return await prisma.products.update({
        where: { id: Number(id) },
        data: {
          deleted_at: new Date(),
        },
      });
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
      throw new Error(error.message || "Lỗi khi xóa sản phẩm");
    }
  },

  // Hàm mới: Khôi phục sản phẩm đã xóa
  restore: async (id) => {
    try {
      const product = await prisma.products.findUnique({
        where: { id: Number(id) },
      });

      if (!product) {
        throw new Error("Sản phẩm không tồn tại");
      }

      if (!product.deleted_at) {
        throw new Error("Sản phẩm chưa bị xóa");
      }

      return await prisma.products.update({
        where: { id: Number(id) },
        data: {
          deleted_at: null,
          // Có thể cập nhật các trường khác khi khôi phục
          // ví dụ: updated_at: new Date()
        },
      });
    } catch (error) {
      console.error("Lỗi khôi phục sản phẩm:", error);
      throw new Error(error.message || "Lỗi khi khôi phục sản phẩm");
    }
  },

  // Hàm mới: Lấy danh sách sản phẩm đã xóa
  findDeleted: async () => {
    try {
      return await prisma.products.findMany({
        where: {
          deleted_at: { not: null },
        },
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách sản phẩm đã xóa:", error);
      throw new Error("Lỗi khi lấy danh sách sản phẩm đã xóa");
    }
  },

  searchByName: async (name, includeDeleted = false) => {
    try {
      const searchTerm = name.toLowerCase();
      return await prisma.products.findMany({
        where: {
          product_name: {
            contains: searchTerm,
          },
          ...(!includeDeleted && { deleted_at: null }),
        },
        include: {
          product_images: {
            where: { is_main: true },
            select: { image_url: true },
          },
        },
      });
    } catch (error) {
      console.error("Lỗi tìm kiếm sản phẩm:", error);
      throw new Error("Lỗi khi tìm kiếm sản phẩm");
    }
  },
};

module.exports = Product;
