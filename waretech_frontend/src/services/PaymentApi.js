import apiClient from "./apiClient";

// API cho MoMo
export const createMomoPayment = async (orderId, paymentType = "atm") => {
  try {
    const response = await apiClient.post("/payment/momo", {
      orderId,
      paymentType,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message;
    const statusCode = error.response?.status || 500;
    console.error(
      `Lỗi khi tạo thanh toán MoMo (HTTP ${statusCode}):`,
      errorMessage
    );
    throw new Error(`Tạo thanh toán MoMo thất bại: ${errorMessage}`);
  }
};
// API cho PayPal
export const createPaypalPayment = async (orderId) => {
  try {
    const response = await apiClient.post("/payment/paypal", { orderId });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message;
    const statusCode = error.response?.status || 500;
    console.error(
      `Lỗi khi tạo thanh toán PayPal (HTTP ${statusCode}):`,
      errorMessage
    );
    throw new Error(`Tạo thanh toán PayPal thất bại: ${errorMessage}`);
  }
};
// API cho COD
export const createCODPayment = async (orderId) => {
  try {
    const response = await apiClient.post("/payment/cod", { orderId });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message;
    const statusCode = error.response?.status || 500;
    console.error(
      `Lỗi khi tạo thanh toán COD (HTTP ${statusCode}):`,
      errorMessage
    );
    throw new Error(`Tạo thanh toán COD thất bại: ${errorMessage}`);
  }
};

// Cập nhật trạng thái COD
export const updateCODStatus = async (paymentId, status) => {
  try {
    const response = await apiClient.patch(`/payment/cod/${paymentId}`, {
      status,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message;
    const statusCode = error.response?.status || 500;
    console.error(
      `Lỗi khi cập nhật trạng thái COD (HTTP ${statusCode}):`,
      errorMessage
    );
    throw new Error(`Cập nhật trạng thái COD thất bại: ${errorMessage}`);
  }
};

// Lấy thông tin thanh toán theo orderId
export const getPaymentByOrderId = async (orderId) => {
  try {
    const response = await apiClient.get(`/payment/order/${orderId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message;
    const statusCode = error.response?.status || 500;
    console.error(
      `Lỗi khi lấy thanh toán theo orderId (HTTP ${statusCode}):`,
      errorMessage
    );
    throw new Error(`Lấy thông tin thanh toán thất bại: ${errorMessage}`);
  }
};
