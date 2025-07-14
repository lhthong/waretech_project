import apiClient from "./apiClient";

export const getWarehousesInfo = async () => {
  try {
    const response = await apiClient.get("/warehouses/warehouse-info");
    return response.data; // Trả về danh sách sản phẩm
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách:",
      error.response?.data || error.message
    );
    return []; // Trả về mảng rỗng trong trường hợp lỗi
  }
};
// Thêm thông tin
export const addPhieuNhap = async (nhapData) => {
  try {
    const response = await apiClient.post("/warehouses/phieu_nhap", nhapData);
    return response.data; // Trả về dữ liệu sản phẩm vừa thêm
  } catch (error) {
    console.error("Lỗi khi thêm:", error.response?.data || error.message);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};
export const addPhieuXuat = async (xuatData) => {
  try {
    const response = await apiClient.post("/warehouses/phieu_xuat", xuatData);
    return response.data; // Trả về dữ liệu vừa thêm
  } catch (error) {
    console.error("Lỗi khi thêm:", error.response?.data || error.message);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};
// Sửa thông tin
export const updatePhieuNhap = async (id, updatedData) => {
  try {
    const response = await apiClient.put(
      `/warehouses/phieu_nhap/${id}`,
      updatedData
    );
    return response.data; // Trả về dữ liệu sau khi cập nhật
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error.response?.data || error.message);
    throw error;
  }
};
export const updatePhieuXuat = async (id, updatedData) => {
  try {
    const response = await apiClient.put(
      `/warehouses/phieu_xuat/${id}`,
      updatedData
    );
    return response.data; // Trả về dữ liệu sau khi cập nhật
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error.response?.data || error.message);
    throw error;
  }
};
