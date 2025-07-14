import apiClient from "./apiClient";

export const getReviews = async () => {
  try {
    const response = await apiClient.get("/product-review");
    return response.data; // Trả về danh sách đánh giá sản phẩm
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách đánh giá sản phẩm:",
      error.response?.data || error.message
    );
    return []; // Trả về mảng rỗng trong trường hợp lỗi
  }
};

export const addReviews = async (reviewsData) => {
  try {
    const response = await apiClient.post("/product-review", reviewsData);
    return response.data; // Trả về dữ liệu đánh giá sản phẩm vừa thêm
  } catch (error) {
    console.error(
      "Lỗi khi thêm đánh giá sản phẩm:",
      error.response?.data || error.message
    );
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

export const deleteReviews = async (id) => {
  try {
    const response = await apiClient.delete(`/product-review/${id}`);
    return response.data; // Trả về phản hồi sau khi xóa
  } catch (error) {
    console.error(
      "Lỗi khi xóa đánh giá sản phẩm:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateReviews = async (id, updatedData) => {
  try {
    const response = await apiClient.put(`/product-review/${id}`, updatedData);
    return response.data; // Trả về dữ liệu sau khi cập nhật
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật đánh giá sản phẩm:",
      error.response?.data || error.message
    );
    throw error;
  }
};
