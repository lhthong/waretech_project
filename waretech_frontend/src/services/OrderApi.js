import apiClient from "./apiClient";

// Tạo đơn hàng mới
export const addOrder = async (orderData) => {
  try {
    const response = await apiClient.post("/orders", orderData);
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi tạo đơn hàng:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Lấy toàn bộ danh sách đơn hàng
export const getAllOrders = async () => {
  try {
    const response = await apiClient.get("/orders");
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách đơn hàng:",
      error.response?.data || error.message
    );
    return [];
  }
};

// Lấy đơn hàng theo ID
export const getOrderById = async (id) => {
  try {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy đơn hàng theo id:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Lọc đơn hàng theo trạng thái
export const getOrdersByStatus = async (trang_thai) => {
  try {
    const response = await apiClient.get("/orders/filter/by-status", {
      params: { trang_thai },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi lọc theo trạng thái:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Lấy đơn hàng theo người dùng
export const getOrdersByUserId = async (userId) => {
  try {
    const response = await apiClient.get(`/orders/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi tìm kiếm đơn hàng theo người dùng:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (id, trang_thai) => {
  try {
    const response = await apiClient.patch(`/orders/${id}/status`, {
      trang_thai,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error.response?.data || error.message);
    throw error;
  }
};

// Xuất danh sách đơn hàng ra file Excel
export const exportOrdersToExcel = async () => {
  try {
    const response = await apiClient.get("/orders/export/excel", {
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error(
      "Lỗi khi xuất thành file excel:",
      error.response?.data || error.message
    );
  }
};
