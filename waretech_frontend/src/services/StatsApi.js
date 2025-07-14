import apiClient from "./apiClient";

// Hàm lấy tiền lời hôm nay
export const getDailyProfit = async (date = new Date()) => {
  try {
    const response = await apiClient.get("/stats/daily-profit", {
      params: { date: date.toISOString().split("T")[0] },
    });
    return response.data.profit; // Trả về tiền lời hôm nay
  } catch (error) {
    console.error("Lỗi khi lấy tiền lời hôm nay:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Hàm lấy doanh thu hôm nay
export const getDailyRevenue = async (date = new Date()) => {
  try {
    const response = await apiClient.get("/stats/daily-revenue", {
      params: { date: date.toISOString().split("T")[0] },
    });
    return response.data.revenue; // Trả về doanh thu hôm nay
  } catch (error) {
    console.error("Lỗi khi lấy doanh thu hôm nay:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Hàm lấy số đơn hàng hôm nay
export const getDailyOrders = async (date = new Date()) => {
  try {
    const response = await apiClient.get("/stats/daily-orders", {
      params: { date: date.toISOString().split("T")[0] },
    });
    return response.data.orders; // Trả về số đơn hàng hôm nay
  } catch (error) {
    console.error("Lỗi khi lấy số đơn hàng hôm nay:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Hàm lấy số sản phẩm đã bán hôm nay
export const getDailySoldProducts = async (date = new Date()) => {
  try {
    const response = await apiClient.get("/stats/daily-sold-products", {
      params: { date: date.toISOString().split("T")[0] },
    });
    return response.data.sold; // Trả về số sản phẩm đã bán hôm nay
  } catch (error) {
    console.error("Lỗi khi lấy số sản phẩm đã bán:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Hàm lấy tổng số sản phẩm tồn kho
export const getTotalInventory = async () => {
  try {
    const response = await apiClient.get("/stats/total-inventory");
    return response.data.inventory; // Trả về tổng sản phẩm tồn kho
  } catch (error) {
    console.error("Lỗi khi lấy tổng tồn kho:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Hàm lấy doanh thu theo ngày trong tháng
export const getRevenueByDay = async (month, year) => {
  try {
    const response = await apiClient.get("/stats/revenue-by-day", {
      params: { month, year },
    });
    return response.data; // Trả về doanh thu theo ngày
  } catch (error) {
    console.error("Lỗi khi lấy doanh thu theo ngày:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Hàm lấy doanh thu theo tháng trong năm
export const getRevenueByMonth = async (year) => {
  try {
    const response = await apiClient.get("/stats/revenue-by-month", {
      params: { year },
    });
    return response.data; // Trả về doanh thu theo tháng
  } catch (error) {
    console.error("Lỗi khi lấy doanh thu theo tháng:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Hàm lấy doanh thu theo năm
export const getRevenueByYear = async (startYear, endYear) => {
  try {
    const response = await apiClient.get("/stats/revenue-by-year", {
      params: { startYear, endYear },
    });
    return response.data; // Trả về doanh thu theo năm
  } catch (error) {
    console.error("Lỗi khi lấy doanh thu theo năm:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Hàm lấy sản phẩm bán chạy
export const getBestSellingProducts = async (limit = 6) => {
  try {
    const response = await apiClient.get("/stats/best-selling-products", {
      params: { limit },
    });
    return response.data; // Trả về sản phẩm bán chạy
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm bán chạy:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Hàm lấy sản phẩm tồn kho nhiều nhất
export const getTopInventoryProducts = async (limit = 4) => {
  try {
    const response = await apiClient.get("/stats/top-inventory-products", {
      params: { limit },
    });
    return response.data; // Trả về sản phẩm tồn kho nhiều nhất
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm tồn kho:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

export const exportStatsToPDF = async (
  timeRange,
  selectedMonth,
  selectedYear,
  yearRangeStart,
  yearRangeEnd
) => {
  try {
    const response = await apiClient.get("/stats/export-pdf", {
      params: {
        timeRange,
        selectedMonth,
        selectedYear,
        yearRangeStart,
        yearRangeEnd,
      },
      responseType: "blob", // Để nhận file PDF
    });
    return response.data; // Trả về blob
  } catch (error) {
    console.error("Lỗi khi xuất PDF:", error);
    throw error;
  }
};
