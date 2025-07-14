import apiClient from "./apiClient";

// Thêm sản phẩm vào giỏ hàng
export const addCart = async (cartData) => {
  try {
    const response = await apiClient.post("/carts", cartData);
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi thêm sản phẩm vào giỏ hàng:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Lấy giỏ hàng từ token (GET /carts/user)
export const getCartByToken = async () => {
  try {
    const response = await apiClient.get("/carts/user");
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy giỏ hàng:",
      error.response?.data || error.message
    );
    return [];
  }
};

// Cập nhật sản phẩm trong giỏ hàng
export const updateCart = async (id, updatedData) => {
  try {
    const response = await apiClient.put(`/carts/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật giỏ hàng:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Xóa 1 sản phẩm
export const deleteCart = async (id) => {
  try {
    const response = await apiClient.delete(`/carts/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi xóa sản phẩm:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Xóa nhiều sản phẩm
export const deleteCartMany = async (ids) => {
  try {
    const response = await apiClient.post("/carts/delete-many", { ids });
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi xóa nhiều sản phẩm:",
      error.response?.data || error.message
    );
    throw error;
  }
};
