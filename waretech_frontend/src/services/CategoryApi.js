import apiClient from "./apiClient";

export const addCategories = async (categoryData) => {
  try {
    const response = await apiClient.post("/categories", categoryData);
    return response.data; // Trả về dữ liệu vừa thêm
  } catch (error) {
    console.error(
      "Lỗi khi thêm danh mục:",
      error.response?.data || error.message
    );
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};
// Lấy danh sách danh mục
export const getCategories = async () => {
  try {
    const response = await apiClient.get("/categories");
    return response.data; // Trả về danh sách danh mục
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh mục:",
      error.response?.data || error.message
    );
    return []; // Trả về mảng rỗng trong trường hợp lỗi
  }
};
export const updateCategories = async (id, updatedData) => {
  try {
    const response = await apiClient.put(`/categories/${id}`, updatedData);
    return response.data; // Trả về dữ liệu sau khi cập nhật
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật nhà cung cấp:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const deleteCategories = async (id) => {
  try {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data; // Trả về phản hồi sau khi xóa
  } catch (error) {
    console.error(
      "Lỗi khi xóa danh mục:",
      error.response?.data || error.message
    );
    throw error;
  }
};
