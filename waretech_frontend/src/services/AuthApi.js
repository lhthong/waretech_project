import apiClient from "./apiClient";

// Xử lý lỗi API
const handleError = (error) => {
  console.error("API Error:", error);
  return error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
};

// Đăng nhập
export const login = async (username, password) => {
  try {
    const response = await apiClient.post("/auth/login", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const register = async (data) => {
  try {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Kiểm tra trạng thái đăng nhập
export const checkAuth = async () => {
  try {
    const response = await apiClient.get("/auth/me"); // token sẽ tự động thêm
    return response.data;
  } catch (error) {
    return null;
  }
};

// Đổi mật khẩu
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await apiClient.put("/auth/change_password", {
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Lấy thông tin người dùng hiện tại
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get("/auth/me");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Cập nhật thông tin người dùng hiện tại
export const updateUser = async (updatedData) => {
  try {
    const response = await apiClient.put("/auth/update_user", updatedData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // Trả về dữ liệu sau khi cập nhật
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật đánh giá sản phẩm:",
      error.response?.data || error.message
    );
    throw error;
  }
};
