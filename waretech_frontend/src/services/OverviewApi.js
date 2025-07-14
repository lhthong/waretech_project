import apiClient from "./apiClient";

export const getYearlyStats = async (year) => {
  try {
    const response = await apiClient.get("/warehouse-overview/stats/yearly", {
      params: { year },
    });
    return response.data.data; // Trả về
  } catch (error) {
    console.error(
      "Lỗi tìm kiếm số liệu thống kê hàng năm:",
      error.response?.data || error.message
    );
    return []; // Trả về mảng rỗng trong trường hợp lỗi
  }
};

export const getMonthlyStats = async (month, year) => {
  try {
    const response = await apiClient.get("/warehouse-overview/stats/monthly", {
      params: { month, year },
    });
    return response.data.data; // Trả về
  } catch (error) {
    console.error(
      "Lỗi tìm kiếm số liệu thống kê hàng tháng:",
      error.response?.data || error.message
    );
    return []; // Trả về mảng rỗng trong trường hợp lỗi
  }
};

export const getCurrentStock = async (productId) => {
  try {
    const response = await apiClient.get(
      `/warehouse-overview/stock/${productId}`
    );
    return response.data.data.stock;
  } catch (error) {
    console.error(
      "Lỗi tìm kiếm số liệu tồn kho:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getWarehouseOverview = async () => {
  try {
    const response = await apiClient.get("/warehouse-overview/receipt-details");
    return response.data; // Trả về danh sách sản phẩm
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách:",
      error.response?.data || error.message
    );
    return []; // Trả về mảng rỗng trong trường hợp lỗi
  }
};

export const getStockByCategory = async () => {
  try {
    const response = await apiClient.get(
      "/warehouse-overview/stock-by-category"
    );
    return response.data; // Trả về danh sách sản phẩm
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách:",
      error.response?.data || error.message
    );
    return []; // Trả về mảng rỗng trong trường hợp lỗi
  }
};
