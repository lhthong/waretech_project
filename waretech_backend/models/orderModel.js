const prisma = require("../utils/prismaClient");

const generateOrderCode = () => {
  return `DH-${Date.now()}`;
};

const Order = {
  // Tạo đơn hàng và tính tổng tiền
  create: async (orderData) => {
    try {
      let tongTien = 0;

      // Lấy tất cả thông tin sản phẩm và tính tổng tiền
      const enrichedDetails = await Promise.all(
        orderData.order_details.create.map(async (item) => {
          const product = await prisma.products.findUnique({
            where: { id: item.product_id },
          });

          if (!product) {
            throw new Error(
              `Không tìm thấy sản phẩm với ID ${item.product_id}`
            );
          }

          const donGia = product.sell_price;
          const thanhTien = item.so_luong * donGia;
          tongTien += thanhTien;

          return {
            products: {
              connect: { id: item.product_id },
            },
            so_luong: item.so_luong,
            tong_tien: thanhTien,
          };
        })
      );

      // Map shipping_method từ frontend (standard/express) sang enum (tieuchuan/nhanh)
      const shippingMethodMap = {
        standard: "tieuchuan",
        express: "nhanh",
      };
      const shippingMethod =
        shippingMethodMap[orderData.shipping_info?.shipping_method] ||
        "tieuchuan";

      // Tính tổng tiền bao gồm phí vận chuyển
      const shippingFee = orderData.shipping_info?.shipping_fee || 0;
      tongTien += shippingFee;

      const newOrder = await prisma.orders.create({
        data: {
          ma_don_hang: generateOrderCode(),
          user_id: orderData.user_id,
          trang_thai: orderData.trang_thai || "choxacnhan",
          tong_tien: tongTien,
          order_details: {
            create: enrichedDetails,
          },
          shipping_info: {
            create: {
              recipient_name: orderData.shipping_info.recipient_name,
              phone: orderData.shipping_info.phone,
              street_address: orderData.shipping_info.street_address,
              ward: orderData.shipping_info.ward,
              district: orderData.shipping_info.district,
              province: orderData.shipping_info.province,
              note: orderData.shipping_info.note,
              shipping_method: shippingMethod,
              shipping_fee: shippingFee,
            },
          },
        },
        include: {
          order_details: {
            include: {
              products: {
                select: {
                  id: true,
                  product_code: true,
                  product_name: true,
                  sell_price: true,
                  product_images: {
                    where: { is_main: true },
                    select: { image_url: true },
                  },
                },
              },
            },
          },
          shipping_info: true,
        },
      });

      return newOrder;
    } catch (error) {
      console.error("Lỗi tạo đơn hàng:", error);
      throw new Error("Lỗi khi tạo đơn hàng");
    }
  },

  // Lấy tất cả đơn hàng
  findAll: async () => {
    try {
      return await prisma.orders.findMany({
        include: {
          users: {
            select: {
              iduser: true,
              username: true,
              fullname: true,
              phone: true,
              address: true,
            },
          },
          order_details: {
            include: {
              products: {
                select: {
                  id: true,
                  product_code: true,
                  product_name: true,
                  sell_price: true,
                  product_images: {
                    where: { is_main: true },
                    select: { image_url: true },
                  },
                },
              },
            },
          },
          shipping_info: true,
        },
        orderBy: { created_at: "desc" },
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách đơn hàng:", error);
      throw new Error("Lỗi khi lấy danh sách đơn hàng");
    }
  },

  // Lấy đơn hàng theo ID
  findById: async (id) => {
    const orderId = Number(id);
    if (!orderId || isNaN(orderId)) {
      throw new Error("Thiếu hoặc id không hợp lệ khi lấy đơn hàng");
    }

    try {
      return await prisma.orders.findUnique({
        where: { id: orderId },
        include: {
          users: {
            select: {
              iduser: true,
              username: true,
              fullname: true,
              phone: true,
              address: true,
            },
          },
          order_details: {
            include: {
              products: {
                select: {
                  id: true,
                  product_code: true,
                  product_name: true,
                  sell_price: true,
                  product_images: {
                    where: { is_main: true },
                    select: { image_url: true },
                  },
                },
              },
            },
          },
          shipping_info: true,
          payments: true,
        },
      });
    } catch (error) {
      console.error("Lỗi lấy đơn hàng theo ID:", error);
      throw new Error("Lỗi khi lấy thông tin đơn hàng");
    }
  },

  // Lấy đơn hàng theo user_id
  findByUserId: async (userId) => {
    try {
      return await prisma.orders.findMany({
        where: { user_id: Number(userId) },
        include: {
          order_details: {
            include: {
              products: {
                select: {
                  id: true,
                  product_code: true,
                  product_name: true,
                  sell_price: true,
                  product_images: {
                    where: { is_main: true },
                    select: { image_url: true },
                  },
                },
              },
            },
          },
          shipping_info: true,
        },
        orderBy: { created_at: "desc" },
      });
    } catch (error) {
      console.error("Lỗi lấy đơn hàng theo user:", error);
      throw new Error("Lỗi khi lấy đơn hàng của người dùng");
    }
  },

  // Cập nhật trạng thái đơn hàng
  updateStatus: async (id, trang_thai) => {
    try {
      const orderId = Number(id);
      const updates = [];

      // Cập nhật trạng thái đơn hàng
      updates.push(
        prisma.orders.update({
          where: { id: orderId },
          data: { trang_thai },
          include: { shipping_info: true },
        })
      );

      // Nếu trạng thái là "hoanthanh", cập nhật payment và giảm stock_quantity
      if (trang_thai === "hoanthanh") {
        // Cập nhật payment cho đơn hàng COD đang chờ
        updates.push(
          prisma.payments.updateMany({
            where: {
              don_hang_id: orderId,
              method: "COD",
              status: "dangcho",
            },
            data: {
              status: "dathanhtoan",
              pay_date: new Date(),
            },
          })
        );

        // Lấy chi tiết đơn hàng để giảm số lượng tồn kho
        const orderDetails = await prisma.order_details.findMany({
          where: { don_hang_id: orderId },
          select: {
            product_id: true,
            so_luong: true,
          },
        });

        // Tạo các truy vấn giảm tồn kho
        const stockUpdates = orderDetails.map((item) =>
          prisma.products.update({
            where: { id: item.product_id },
            data: {
              stock_quantity: {
                decrement: item.so_luong,
              },
            },
          })
        );

        updates.push(...stockUpdates);
      }

      // Thực hiện tất cả các cập nhật trong một transaction
      const [updatedOrder] = await prisma.$transaction(updates);
      return updatedOrder;
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái đơn hàng:", error);
      throw new Error("Lỗi khi cập nhật trạng thái đơn hàng");
    }
  },

  // Lọc đơn hàng theo trạng thái
  findByStatus: async (trang_thai) => {
    try {
      return await prisma.orders.findMany({
        where: { trang_thai },
        include: {
          users: {
            select: {
              iduser: true,
              username: true,
              fullname: true,
              phone: true,
              address: true,
            },
          },
          order_details: {
            include: {
              products: {
                select: {
                  id: true,
                  product_code: true,
                  product_name: true,
                  sell_price: true,
                  product_images: {
                    where: { is_main: true },
                    select: { image_url: true },
                  },
                },
              },
            },
          },
          shipping_info: true,
        },
        orderBy: { created_at: "desc" },
      });
    } catch (error) {
      console.error("Lỗi lấy đơn hàng theo trạng thái:", error);
      throw new Error("Lỗi khi lấy đơn hàng theo trạng thái");
    }
  },
};

module.exports = Order;
