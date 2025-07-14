const prisma = require("../utils/prismaClient");

const Payment = {
  // Tạo Payment mới
  create: async ({
    orderId,
    amount,
    method,
    status,
    transaction_id,
    bank_code,
    pay_date,
  }) => {
    if (!orderId || !amount || !method || !status) {
      throw new Error("Thiếu tham số bắt buộc khi tạo Payment");
    }
    try {
      return await prisma.payments.create({
        data: {
          don_hang_id: Number(orderId),
          amount: Number(amount),
          method,
          status,
          transaction_id,
          bank_code,
          pay_date,
        },
      });
    } catch (error) {
      throw new Error(`Tạo Payment thất bại: ${error.message}`);
    }
  },

  // Lấy danh sách Payment theo orderId
  findByOrderId: async (orderId) => {
    if (!orderId) throw new Error("Thiếu orderId khi lấy Payment");
    try {
      return await prisma.payments.findMany({
        where: { don_hang_id: Number(orderId) },
        select: {
          id: true,
          don_hang_id: true,
          amount: true,
          method: true,
          status: true,
          created_at: true,
          transaction_id: true,
          bank_code: true,
          pay_date: true,
        },
        orderBy: { created_at: "desc" },
      });
    } catch (error) {
      throw new Error(`Lấy Payment theo orderId thất bại: ${error.message}`);
    }
  },

  // Cập nhật trạng thái và thông tin Payment
  update: ({ paymentId, status, transaction_id, bank_code, pay_date }) => {
    if (!paymentId || !status) {
      throw new Error("Thiếu tham số khi cập nhật Payment");
    }
    try {
      return prisma.payments.update({
        where: { id: Number(paymentId) },
        data: {
          status,
          transaction_id,
          bank_code,
          pay_date,
        },
      });
    } catch (error) {
      throw new Error(`Cập nhật Payment thất bại: ${error.message}`);
    }
  },

  // Tìm một Payment theo điều kiện
  findOne: async (where) => {
    try {
      return await prisma.payments.findFirst({ where });
    } catch (error) {
      throw new Error(`Tìm Payment thất bại: ${error.message}`);
    }
  },
};

module.exports = Payment;
