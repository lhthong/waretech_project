import apiClient from "./apiClient";

// Lấy danh sách nhà cung cấp
export const getSuppliers = async () => {
  try {
    const response = await apiClient.get("/suppliers");
    return response.data; // Trả về danh sách nhà cung cấp
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách nhà cung cấp:",
      error.response?.data || error.message
    );
    return []; // Trả về mảng rỗng trong trường hợp lỗi
  }
};

// Thêm nhà cung cấp mới
export const addSuppliers = async (supplierData) => {
  try {
    const response = await apiClient.post("/suppliers", supplierData);
    return response.data; // Trả về dữ liệu nhà cung cấp vừa thêm
  } catch (error) {
    console.error(
      "Lỗi khi thêm nhà cung cấp:",
      error.response?.data || error.message
    );
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Xóa nhà cung cấp theo ID
export const deleteSupplier = async (id) => {
  try {
    const response = await apiClient.delete(`/suppliers/${id}`);
    return response.data; // Trả về phản hồi sau khi xóa
  } catch (error) {
    console.error(
      "Lỗi khi xóa nhà cung cấp:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Sửa thông tin nhà cung cấp
export const updateSupplier = async (id, updatedData) => {
  try {
    const response = await apiClient.put(`/suppliers/${id}`, updatedData);
    return response.data; // Trả về dữ liệu sau khi cập nhật
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật nhà cung cấp:",
      error.response?.data || error.message
    );
    throw error;
  }
};
