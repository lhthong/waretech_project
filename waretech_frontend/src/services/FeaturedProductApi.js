import apiClient from "./apiClient";

// Lấy danh sách sản phẩm đặc trưng
export const getFeaturedProducts = async (type = null) => {
  try {
    const url = type ? `/features?type=${type}` : "/features";
    const response = await apiClient.get(url);
    return response.data; // Trả về danh sách sản phẩm đặc trưng
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách sản phẩm đặc trưng:",
      error.response?.data || error.message
    );
    return []; // Trả về mảng rỗng trong trường hợp lỗi
  }
};
export const getFeaturedProductById = async (id) => {
  try {
    const response = await apiClient.get(`/features/${id}`);
    return response.data; // Trả về phản hồi sau khi xóa
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách sản phẩm đặc trưng theo id:",
      error.response?.data || error.message
    );
    throw error;
  }
};
// Thêm sản phẩm đặc trưng mới
export const createFeaturedProduct = async (featureData) => {
  try {
    const response = await apiClient.post("/features", featureData);
    return response.data; // Trả về dữ liệu sản phẩm đặc trưng vừa thêm
  } catch (error) {
    console.error(
      "Lỗi khi thêm sản phẩm đặc trưng:",
      error.response?.data || error.message
    );
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Xóa sản phẩm đặc trưng theo ID
export const deleteFeaturedProduct = async (id) => {
  try {
    const response = await apiClient.delete(`/features/${id}`);
    return response.data; // Trả về phản hồi sau khi xóa
  } catch (error) {
    console.error(
      "Lỗi khi xóa sản phẩm đặc trưng:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Sửa thông tin sản phẩm đặc trưng
export const updateFeaturedProduct = async (id, updatedData) => {
  try {
    const response = await apiClient.put(`/features/${id}`, updatedData);
    return response.data; // Trả về dữ liệu sau khi cập nhật
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật sản phẩm đặc trưng:",
      error.response?.data || error.message
    );
    throw error;
  }
};
