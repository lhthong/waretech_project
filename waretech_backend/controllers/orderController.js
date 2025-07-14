const Order = require("../models/orderModel");
const ExcelJS = require("exceljs");

const orderController = {
  // Tạo đơn hàng
  createOrder: async (req, res) => {
    try {
      const { order_details, shipping_info } = req.body;
      const user_id = req.user.iduser;

      if (!order_details?.create?.length || !shipping_info) {
        return res.status(400).json({
          message: "Thiếu order_details hoặc shipping_info",
        });
      }

      // Validate shipping_info
      if (
        !shipping_info.recipient_name ||
        !shipping_info.phone ||
        !shipping_info.street_address ||
        !shipping_info.shipping_method
      ) {
        return res.status(400).json({
          message:
            "Thiếu thông tin bắt buộc trong shipping_info: recipient_name, phone, street_address, hoặc shipping_method",
        });
      }

      const validShippingMethods = ["standard", "express"];
      if (!validShippingMethods.includes(shipping_info.shipping_method)) {
        return res.status(400).json({
          message: "Phương thức vận chuyển không hợp lệ",
        });
      }

      // Tạo orderData với user_id động
      const orderData = {
        user_id,
        order_details,
        shipping_info,
        trang_thai: "choxacnhan",
      };

      const newOrder = await Order.create(orderData);
      return res.status(201).json({
        message: "Tạo đơn hàng thành công",
        order: newOrder,
      });
    } catch (err) {
      console.error("Lỗi tạo đơn hàng:", err);
      return res
        .status(500)
        .json({ message: err.message || "Lỗi khi tạo đơn hàng" });
    }
  },

  // Lấy tất cả đơn hàng
  getAllOrder: async (req, res) => {
    try {
      const orders = await Order.findAll();
      return res.status(200).json(orders);
    } catch (err) {
      console.error("Lỗi lấy danh sách đơn hàng:", err);
      return res
        .status(500)
        .json({ message: "Lỗi khi lấy danh sách đơn hàng" });
    }
  },

  // Lấy đơn hàng theo ID
  getOrderById: async (req, res) => {
    try {
      const id = req.params.id;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }

      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }

      return res.status(200).json(order);
    } catch (err) {
      console.error("Lỗi lấy đơn hàng:", err);
      return res.status(500).json({ message: "Lỗi khi lấy đơn hàng" });
    }
  },

  // Lấy đơn hàng theo User ID
  getOrdersByUserId: async (req, res) => {
    try {
      const userId = req.params.userId;
      const orders = await Order.findByUserId(userId);
      return res.status(200).json(orders);
    } catch (err) {
      console.error("Lỗi lấy đơn hàng của người dùng:", err);
      return res
        .status(500)
        .json({ message: "Lỗi khi lấy đơn hàng người dùng" });
    }
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (req, res) => {
    try {
      const { trang_thai } = req.body;
      if (!trang_thai) {
        return res
          .status(400)
          .json({ message: "Vui lòng cung cấp trạng thái" });
      }

      const validStatuses = [
        "choxacnhan",
        "daxacnhan",
        "danggiao",
        "hoanthanh",
        "dahuy",
      ];
      if (!validStatuses.includes(trang_thai)) {
        return res.status(400).json({ message: "Trạng thái không hợp lệ" });
      }

      const updated = await Order.updateStatus(req.params.id, trang_thai);
      return res.status(200).json({
        message: "Cập nhật trạng thái thành công",
        order: updated,
      });
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      return res
        .status(500)
        .json({ message: "Lỗi khi cập nhật trạng thái đơn hàng" });
    }
  },

  // Lọc theo trạng thái
  getOrdersByStatus: async (req, res) => {
    try {
      const { trang_thai } = req.query;
      if (!trang_thai) {
        return res
          .status(400)
          .json({ message: "Vui lòng cung cấp trạng thái" });
      }

      const validStatuses = [
        "choxacnhan",
        "daxacnhan",
        "danggiao",
        "hoanthanh",
        "dahuy",
      ];
      if (!validStatuses.includes(trang_thai)) {
        return res.status(400).json({ message: "Trạng thái không hợp lệ" });
      }

      const orders = await Order.findByStatus(trang_thai);
      return res.status(200).json(orders);
    } catch (err) {
      console.error("Lỗi lọc đơn hàng theo trạng thái:", err);
      return res.status(500).json({ message: "Lỗi khi lọc đơn hàng" });
    }
  },

  // Xuất Excel
  exportOrdersToExcel: async (req, res) => {
    try {
      const orders = await Order.findAll();

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Orders");

      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Mã đơn hàng", key: "ma_don_hang", width: 15 },
        { header: "Khách hàng", key: "ten_khach_hang", width: 25 },
        { header: "Số điện thoại", key: "sdt", width: 15 },
        { header: "Địa chỉ", key: "diachi", width: 30 },
        { header: "Phương thức vận chuyển", key: "shipping_method", width: 20 },
        { header: "Phí vận chuyển", key: "shipping_fee", width: 15 },
        { header: "Trạng thái", key: "trang_thai", width: 15 },
        { header: "Tổng tiền", key: "tong_tien", width: 15 },
        { header: "Ngày tạo", key: "created_at", width: 20 },
      ];

      orders.forEach((order) => {
        const shippingMethodMap = {
          tieuchuan: "Tiêu chuẩn",
          nhanh: "Nhanh",
        };
        worksheet.addRow({
          id: order.id,
          ma_don_hang: order.ma_don_hang,
          ten_khach_hang:
            order.shipping_info?.recipient_name ||
            order.users?.fullname ||
            "Không có",
          sdt: order.shipping_info?.phone || order.users?.phone || "Không có",
          diachi: order.shipping_info
            ? `${order.shipping_info.street_address || ""}${
                order.shipping_info.ward ? ", " + order.shipping_info.ward : ""
              }${
                order.shipping_info.district
                  ? ", " + order.shipping_info.district
                  : ""
              }${
                order.shipping_info.province
                  ? ", " + order.shipping_info.province
                  : ""
              }`
            : order.users?.address || "Không có",
          shipping_method: order.shipping_info
            ? shippingMethodMap[order.shipping_info.shipping_method] ||
              order.shipping_info.shipping_method
            : "Không có",
          shipping_fee: order.shipping_info?.shipping_fee || 0,
          trang_thai: order.trang_thai,
          tong_tien: order.tong_tien,
          created_at: order.created_at,
        });
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=orders.xlsx");

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
      res.status(500).json({ message: "Lỗi khi xuất file Excel" });
    }
  },
};

module.exports = orderController;
