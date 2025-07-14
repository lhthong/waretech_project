const axios = require("axios");
const crypto = require("crypto");
const paypal = require("@paypal/checkout-server-sdk");
const Payment = require("../models/paymentModel");
const Order = require("../models/orderModel");
const prisma = require("../utils/prismaClient");

// ========== Utils ==========
const verifyMomoSignature = (params, secretKey) => {
  const {
    partnerCode,
    orderId,
    requestId,
    amount,
    orderInfo,
    orderType,
    transId,
    resultCode,
    message,
    payType,
    responseTime,
    extraData,
  } = params;

  // Tạo rawSignature từ các trường cần thiết
  const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

  const expectedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  console.log("Signature verification:", {
    rawSignature,
    expectedSignature,
    receivedSignature: params.signature,
  });

  return params.signature === expectedSignature;
};
// ========== Payment Controller (Chung) ==========
const paymentController = {
  getPaymentByOrderId: async (req, res) => {
    try {
      const { orderId } = req.params;

      // Validate input
      if (!orderId || isNaN(Number(orderId))) {
        return res.status(400).json({ error: "orderId không hợp lệ" });
      }

      // Tìm các bản ghi thanh toán
      const payments = await Payment.findByOrderId(Number(orderId));
      if (!payments || payments.length === 0) {
        return res
          .status(404)
          .json({ error: "Không tìm thấy thanh toán cho đơn hàng" });
      }

      console.log("Payment retrieved successfully", {
        don_hang_id: orderId,
        paymentCount: payments.length,
        timestamp: new Date().toISOString(),
      });

      res.status(200).json({
        message: "Lấy thông tin thanh toán thành công",
        payments,
      });
    } catch (error) {
      console.error("Get payment error:", {
        error: error.message,
        orderId: req.params.orderId,
        timestamp: new Date().toISOString(),
      });
      res.status(500).json({
        error: "Lỗi hệ thống",
        details: error.message,
      });
    }
  },
};
// ========== Momo ==========
const momoController = {
  createPayment: async (req, res) => {
    try {
      const { orderId, paymentType = "qr" } = req.body;

      // Validate input
      if (!orderId) {
        return res.status(400).json({ error: "Thiếu thông tin đơn hàng" });
      }

      // Validate paymentType
      if (!["qr", "atm"].includes(paymentType)) {
        return res.status(400).json({
          error: "Loại thanh toán không hợp lệ. Chọn 'qr' hoặc 'atm'.",
        });
      }

      // Kiểm tra đơn hàng
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
      }
      if (order.trang_thai !== "choxacnhan") {
        return res
          .status(400)
          .json({ error: "Đơn hàng không hợp lệ để thanh toán" });
      }

      // Kiểm tra xem đã có thanh toán thành công chưa
      const existingPayment = await Payment.findOne({
        don_hang_id: Number(orderId),
        method: "Momo",
        status: "dathanhtoan",
      });
      if (existingPayment) {
        return res.status(400).json({ error: "Đơn hàng đã được thanh toán" });
      }

      // Sử dụng order.tong_tien làm amount
      const amount = order.tong_tien;

      // Tạo orderId và requestId duy nhất
      const timestamp = Date.now();
      const randomSuffix = Math.floor(Math.random() * 1000);
      const momoOrderId = `${orderId}-${timestamp}-${randomSuffix}`;
      const requestId = `req-${timestamp}-${randomSuffix}`;

      const orderInfo = `Thanh toán đơn hàng #${orderId}`;

      // Chọn requestType dựa trên paymentType
      const requestType = paymentType === "qr" ? "captureWallet" : "payWithATM";

      // Tạo signature
      const rawSignature = [
        `accessKey=${process.env.MOMO_ACCESS_KEY}`,
        `amount=${amount}`,
        `extraData=`,
        `ipnUrl=${process.env.MOMO_NOTIFY_URL}`,
        `orderId=${momoOrderId}`,
        `orderInfo=${orderInfo}`,
        `partnerCode=${process.env.MOMO_PARTNER_CODE}`,
        `redirectUrl=${process.env.MOMO_RETURN_URL}`,
        `requestId=${requestId}`,
        `requestType=${requestType}`,
      ].join("&");

      const signature = crypto
        .createHmac("sha256", process.env.MOMO_SECRET_KEY)
        .update(rawSignature)
        .digest("hex");

      // Lưu thông tin thanh toán vào DB
      const newPayment = await Payment.create({
        orderId: Number(orderId),
        amount: Number(amount),
        method: "Momo",
        status: "dangcho",
      });
      console.log("MoMo payment record created:", newPayment);

      // Gọi API MoMo
      const response = await axios.post(
        `${process.env.MOMO_ENDPOINT}/v2/gateway/api/create`,
        {
          partnerCode: process.env.MOMO_PARTNER_CODE,
          accessKey: process.env.MOMO_ACCESS_KEY,
          requestId,
          amount,
          orderId: momoOrderId,
          orderInfo,
          redirectUrl: process.env.MOMO_RETURN_URL,
          ipnUrl: process.env.MOMO_NOTIFY_URL,
          requestType,
          extraData: "",
          signature,
          lang: "vi",
        }
      );

      console.log("MoMo payment created:", {
        systemOrderId: orderId,
        momoOrderId,
        requestId,
        payUrl: response.data.payUrl,
        paymentType,
      });

      res.json({
        payUrl: response.data.payUrl,
        momoOrderId,
        systemOrderId: orderId,
        paymentType,
      });
    } catch (error) {
      console.error("MoMo create error:", {
        error: error.response?.data || error.message,
        orderId: req.body.orderId,
        paymentType: req.body.paymentType,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({
        error: "Lỗi hệ thống",
        details: error.response?.data || error.message,
      });
    }
  },

  handleIPN: async (req, res) => {
    try {
      const params = req.body;
      console.log("MoMo IPN received:", params);

      // Kiểm tra chữ ký
      if (!verifyMomoSignature(params, process.env.MOMO_SECRET_KEY)) {
        console.error("MoMo IPN: Invalid signature", {
          signature: params.signature,
        });
        return res.status(401).json({ error: "Invalid signature" });
      }

      const { orderId: momoOrderId, resultCode, transId, amount } = params;
      console.log("MoMo IPN data:", {
        momoOrderId,
        resultCode,
        transId,
        amount,
      });

      // Lấy originalOrderId
      const originalOrderId = momoOrderId.split("-")[0];
      if (!originalOrderId || isNaN(Number(originalOrderId))) {
        console.error("MoMo IPN: Invalid momoOrderId format", { momoOrderId });
        return res.status(400).json({ error: "Invalid orderId format" });
      }

      // Kiểm tra bản ghi thanh toán
      const payment = await Payment.findOne({
        don_hang_id: Number(originalOrderId),
        method: "Momo",
        status: "dangcho",
      });

      if (!payment) {
        console.error("MoMo IPN: No pending payment found", {
          don_hang_id: originalOrderId,
          method: "Momo",
        });
        return res.status(200).json({ message: "No pending payment found" });
      }

      // Kiểm tra thanh toán đã xử lý chưa
      const existingPayment = await Payment.findOne({
        don_hang_id: Number(originalOrderId),
        method: "Momo",
        status: "dathanhtoan",
      });

      if (existingPayment) {
        console.log("MoMo IPN: Payment already processed", {
          don_hang_id: originalOrderId,
        });
        return res.status(200).json({ message: "Payment already processed" });
      }

      // Xử lý trạng thái thanh toán
      if (resultCode === 0) {
        // Thanh toán thành công
        const order = await prisma.orders.findUnique({
          where: { id: Number(originalOrderId) },
        });

        const orderDetails = await prisma.order_details.findMany({
          where: { don_hang_id: order.id },
          select: { product_id: true },
        });

        const productIdsInOrder = orderDetails.map((item) => item.product_id);

        await prisma.$transaction([
          Payment.update({
            paymentId: payment.id,
            status: "dathanhtoan",
            transaction_id: transId.toString(),
            pay_date: new Date(),
          }),
          prisma.orders.update({
            where: { id: Number(originalOrderId) },
            data: { trang_thai: "daxacnhan" },
          }),
          prisma.cart_items.deleteMany({
            where: {
              user_id: order.user_id,
              product_id: { in: productIdsInOrder },
            },
          }),
        ]);
        console.log("MoMo IPN: Payment updated successfully", {
          don_hang_id: originalOrderId,
          transId,
        });
      } else {
        // Thanh toán thất bại (bao gồm hủy giao dịch)
        await Payment.update({
          paymentId: payment.id,
          status: "loithanhtoan",
          transaction_id: transId ? transId.toString() : null,
          pay_date: new Date(),
        });
        console.warn("MoMo IPN: Transaction failed", { resultCode });
        return res
          .status(200)
          .json({ message: "Transaction not successful", resultCode });
      }

      res.status(204).end();
    } catch (error) {
      console.error("MoMo IPN error:", {
        error: error.message,
        body: req.body,
        timestamp: new Date().toISOString(),
      });
      res.status(500).json({ error: "Internal server error" });
    }
  },

  handleReturn: async (req, res) => {
    const { orderId: momoOrderId, resultCode } = req.query;
    const originalOrderId = momoOrderId.split("-")[0];
    const status = resultCode === "0" ? "success" : "failed";

    console.log("MoMo return:", { momoOrderId, originalOrderId, status });

    res.redirect(
      `${process.env.FRONTEND_URL}/payment-result?orderId=${originalOrderId}&status=${status}`
    );
  },
};
//========== COD ==========
const codController = {
  createPayment: async (req, res) => {
    try {
      const { orderId } = req.body;
      if (!orderId) {
        return res.status(400).json({ error: "Thiếu thông tin đơn hàng" });
      }

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
      }

      // Kiểm tra đơn hàng đã có trạng thái choxacnhan chưa
      if (order.trang_thai !== "choxacnhan") {
        return res
          .status(400)
          .json({ error: "Đơn hàng không hợp lệ để thanh toán COD" });
      }

      const existingPayment = await Payment.findOne({
        don_hang_id: Number(orderId),
        status: "dathanhtoan",
      });
      if (existingPayment) {
        return res.status(400).json({ error: "Đơn hàng đã được thanh toán" });
      }

      const amount = order.tong_tien;

      const orderDetails = await prisma.order_details.findMany({
        where: { don_hang_id: order.id },
        select: { product_id: true },
      });
      const productIds = orderDetails.map((item) => item.product_id);

      await prisma.$transaction([
        prisma.payments.create({
          data: {
            amount: Number(amount),
            method: "COD",
            status: "dangcho",
            orders: {
              connect: {
                id: Number(orderId),
              },
            },
          },
        }),
        prisma.cart_items.deleteMany({
          where: {
            user_id: order.user_id,
            product_id: { in: productIds },
          },
        }),
      ]);

      res.status(201).json({ message: "Thanh toán COD được tạo thành công" });
    } catch (error) {
      console.error("COD create error:", error);
      res.status(500).json({ error: "Lỗi hệ thống", details: error.message });
    }
  },

  updatePaymentStatus: async (req, res) => {
    try {
      const { paymentId } = req.params;
      const { status } = req.body;

      // Validate input
      if (!paymentId || !status) {
        return res.status(400).json({ error: "Thiếu paymentId hoặc status" });
      }
      if (!["dathanhtoan", "loithanhtoan"].includes(status)) {
        return res.status(400).json({
          error: "Status không hợp lệ. Chọn 'dathanhtoan' hoặc 'loithanhtoan'",
        });
      }

      // Kiểm tra bản ghi thanh toán
      const payment = await Payment.findOne({
        id: Number(paymentId),
        method: "COD",
        status: "dangcho",
      });

      if (!payment) {
        return res
          .status(404)
          .json({ error: "Không tìm thấy thanh toán COD đang chờ" });
      }

      const updateData = {
        paymentId: payment.id,
        status,
        pay_date: new Date(),
      };

      if (status === "dathanhtoan") {
        await Payment.update(updateData);
        console.log("COD payment marked as paid manually", {
          paymentId,
          status,
        });
      } else {
        await Payment.update(updateData);
        console.log("COD payment marked as failed", {
          paymentId,
          status,
        });
      }

      res.status(200).json({
        message: `Cập nhật trạng thái COD thành ${status}`,
        paymentId,
        status,
      });
    } catch (error) {
      console.error("COD update error:", {
        error: error.message,
        paymentId: req.params.paymentId,
        status: req.body.status,
        timestamp: new Date().toISOString(),
      });
      res.status(500).json({
        error: "Lỗi hệ thống",
        details: error.message,
      });
    }
  },
};
// ========== PayPal ==========
const paypalController = {
  // Khởi tạo client PayPal với môi trường sandbox
  initializePaypalClient() {
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_SECRET) {
      throw new Error("Thông tin đăng nhập PayPal bị thiếu");
    }
    const environment = new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_SECRET
    );
    return new paypal.core.PayPalHttpClient(environment);
  },

  // Kiểm tra đơn hàng
  async validateOrder(orderId) {
    if (!orderId) {
      throw new Error("Thiếu thông tin đơn hàng");
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    if (order.trang_thai !== "choxacnhan") {
      throw new Error("Đơn hàng không hợp lệ để thanh toán");
    }

    const existingPayment = await Payment.findOne({
      don_hang_id: Number(orderId),
      method: "Paypal",
      status: "dathanhtoan",
    });

    if (existingPayment) {
      throw new Error("Đơn hàng đã được thanh toán");
    }

    return order;
  },

  //  Tạo body yêu cầu thanh toán PayPal
  createPaypalRequestBody(order, paymentId) {
    if (!process.env.BASE_URL) {
      throw new Error("BASE_URL không được định nghĩa trong biến môi trường");
    }

    return {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: (order.tong_tien / 26000).toFixed(2),
          },
          description: `Thanh toán đơn hàng #${order.id}`,
          custom_id: order.id.toString(),
        },
      ],
      application_context: {
        brand_name: process.env.APP_NAME,
        user_action: "PAY_NOW",
        return_url: `${process.env.BASE_URL}/api/payment/paypal-capture?orderId=${order.id}&paymentId=${paymentId}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-result?orderId=${order.id}&status=cancelled`,
      },
    };
  },

  // Tạo thanh toán PayPal mới
  createPayment: async (req, res) => {
    try {
      const { orderId } = req.body;

      // Kiểm tra đơn hàng
      const order = await paypalController.validateOrder(orderId);

      // Tạo bản ghi thanh toán
      const newPayment = await Payment.create({
        orderId: Number(orderId),
        amount: Number(order.tong_tien),
        method: "Paypal",
        status: "dangcho",
      });

      // Khởi tạo client PayPal và tạo yêu cầu
      const client = paypalController.initializePaypalClient();
      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer("return=representation");
      request.requestBody(
        paypalController.createPaypalRequestBody(order, newPayment.id)
      );

      // Thực thi yêu cầu PayPal
      const response = await client.execute(request);
      const approvalUrl = response.result.links.find(
        (link) => link.rel === "approve"
      )?.href;

      if (!approvalUrl) {
        throw new Error("Không tìm thấy approval URL");
      }

      console.log("Tạo thanh toán PayPal thành công:", {
        orderId,
        paymentId: newPayment.id,
        paypalOrderId: response.result.id,
        approvalUrl,
      });

      res.json({
        approvalUrl,
        paypalOrderId: response.result.id,
        systemOrderId: orderId,
      });
    } catch (error) {
      console.error("Lỗi khi tạo thanh toán PayPal:", {
        error: error.message,
        orderId: req.body.orderId,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({
        error: "Lỗi hệ thống",
        details: error.message,
      });
    }
  },

  // Cập nhật đơn hàng và xóa giỏ hàng sau khi thanh toán thành công
  async updateOrderAndClearCart(orderId, paymentId, transactionId) {
    const order = await prisma.orders.findUnique({
      where: { id: Number(orderId) },
    });

    const orderDetails = await prisma.order_details.findMany({
      where: { don_hang_id: order.id },
      select: { product_id: true },
    });

    const productIdsInOrder = orderDetails.map((item) => item.product_id);

    await prisma.$transaction([
      Payment.update({
        paymentId,
        status: "dathanhtoan",
        transaction_id: transactionId,
        pay_date: new Date(),
      }),
      prisma.orders.update({
        where: { id: Number(orderId) },
        data: { trang_thai: "daxacnhan" },
      }),
      prisma.cart_items.deleteMany({
        where: {
          user_id: order.user_id,
          product_id: { in: productIdsInOrder },
        },
      }),
    ]);
  },

  //  Xử lý việc ghi nhận thanh toán PayPal
  capturePayment: async (req, res) => {
    try {
      const { orderId, token, paymentId } = req.query;

      // Kiểm tra các tham số đầu vào
      if (!orderId || !token || !paymentId) {
        throw new Error("Thiếu tham số bắt buộc");
      }

      // Kiểm tra bản ghi thanh toán
      const payment = await Payment.findOne({
        id: Number(paymentId),
        don_hang_id: Number(orderId),
        method: "Paypal",
        status: "dangcho",
      });

      if (!payment) {
        console.error("Không tìm thấy thanh toán hoặc đã được xử lý", {
          paymentId,
          orderId,
        });
        throw new Error("Không tìm thấy thanh toán hoặc đã được xử lý");
      }

      // Khởi tạo client PayPal và tạo yêu cầu ghi nhận
      const client = paypalController.initializePaypalClient();
      const request = new paypal.orders.OrdersCaptureRequest(token);
      request.requestBody({});

      // Thực thi ghi nhận
      const response = await client.execute(request);
      const redirectUrl = `${process.env.FRONTEND_URL}/payment-result?orderId=${orderId}&status=`;

      if (response.result.status === "COMPLETED") {
        await paypalController.updateOrderAndClearCart(
          orderId,
          payment.id,
          response.result.id
        );

        console.log("Thanh toán PayPal đã được xử lý thành công", {
          orderId,
          paymentId,
          paypalOrderId: response.result.id,
        });

        return res.redirect(redirectUrl + "success");
      } else {
        await Payment.update({
          paymentId: payment.id,
          status: "loithanhtoan",
          pay_date: new Date(),
        });

        console.warn("Thanh toán PayPal không hoàn tất", {
          orderId,
          paymentId,
          status: response.result.status,
        });

        return res.redirect(redirectUrl + "failed");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý thanh toán PayPal:", {
        error: error.message,
        orderId: req.query.orderId,
        paymentId: req.query.paymentId,
        timestamp: new Date().toISOString(),
      });

      const redirectUrl = req.query.orderId
        ? `${process.env.FRONTEND_URL}/payment-result?orderId=${req.query.orderId}&status=failed`
        : `${process.env.FRONTEND_URL}/payment-result?status=failed`;

      return res.redirect(redirectUrl);
    }
  },
};

module.exports = {
  momoController,
  codController,
  paypalController,
  paymentController,
};
