import apiClient from "./apiClient";

// Lấy tất cả banner
export const getBanners = async () => {
  try {
    const response = await apiClient.get("/banners");
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách banner:",
      error.response?.data || error.message
    );
    return [];
  }
};

// Lấy danh sách banner đang hiển thị
export const getActiveBanners = async () => {
  try {
    const response = await apiClient.get("/banners/active");
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy banner đang hiển thị:",
      error.response?.data || error.message
    );
    return [];
  }
};

//Tạo banner mới (upload ảnh)
export const addBanner = async (formData) => {
  try {
    const response = await apiClient.post("/banners", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi thêm banner:",
      error.response?.data || error.message
    );
    throw error;
  }
};

//Bật/tắt trạng thái hiển thị của banner
export const toggleBannerActive = async (id, isActive) => {
  try {
    const response = await apiClient.patch(`/banners/${id}/toggle`, {
      is_active: isActive,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật trạng thái banner:",
      error.response?.data || error.message
    );
    throw error;
  }
};

//Xóa banner
export const deleteBanner = async (id) => {
  try {
    const response = await apiClient.delete(`/banners/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa banner:", error.response?.data || error.message);
    throw error;
  }
};
