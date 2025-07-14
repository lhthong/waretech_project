import apiClient from "./apiClient";

export const getProductStore = async (params = {}) => {
  try {
    const response = await apiClient.get("/products/product-store", {
      params: {
        ...params,
        showDeleted: params.includeDeleted, // Đổi tên param cho nhất quán
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách sản phẩm:",
      error.response?.data || error.message
    );
    return { products: [], total: 0 };
  }
};

export const getProducts = async (includeDeleted = false) => {
  try {
    const response = await apiClient.get("/products", {
      params: { showDeleted: includeDeleted },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách sản phẩm:",
      error.response?.data || error.message
    );
    return [];
  }
};

export const addProducts = async (productData) => {
  try {
    const response = await apiClient.post("/products", productData);
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi thêm sản phẩm:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getProductById = async (id, includeDeleted = false) => {
  try {
    const response = await apiClient.get(`/products/${id}`, {
      params: { showDeleted: includeDeleted },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy sản phẩm theo id:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteProducts = async (id) => {
  try {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi xóa sản phẩm:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateProducts = async (id, updatedData) => {
  try {
    const response = await apiClient.put(`/products/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật sản phẩm:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateStockThreshold = async (id, formData) => {
  try {
    const response = await apiClient.put(`/products/${id}/threshold`, {
      min_stock_level: formData.min_stock_level,
      max_stock_level: formData.max_stock_level,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi cập nhật ngưỡng tồn kho:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getProductsByStockStatus = async (
  status,
  includeDeleted = false
) => {
  try {
    const response = await apiClient.get(`/products/stock-status`, {
      params: {
        type: status,
        showDeleted: includeDeleted,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi lọc sản phẩm theo trạng thái:",
      error.response?.data || error.message
    );
    return [];
  }
};

// Các hàm mới hỗ trợ Soft Delete
export const restoreProduct = async (id) => {
  try {
    const response = await apiClient.post(`/products/${id}/restore`);
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi khôi phục sản phẩm:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getDeletedProducts = async () => {
  try {
    const response = await apiClient.get("/products/deleted/list");
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách sản phẩm đã xóa:",
      error.response?.data || error.message
    );
    return [];
  }
};

export const searchProductsByName = async (name, includeDeleted = false) => {
  try {
    const response = await apiClient.get("/products/search/name", {
      params: {
        name: name,
        showDeleted: includeDeleted,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi tìm kiếm sản phẩm:",
      error.response?.data || error.message
    );
    return [];
  }
};
