import apiClient from "./apiClient";

// Thêm hình ảnh sản phẩm
export const addProductImage = async (imageData) => {
  try {
    const response = await apiClient.post("/product-images", imageData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // Trả về dữ liệu hình ảnh vừa thêm
  } catch (error) {
    console.error(
      "Lỗi khi thêm hình ảnh sản phẩm:",
      error.response?.data || error.message
    );
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Thêm nhiều hình ảnh sản phẩm
export const addMultipleProductImages = async (imagesData) => {
  try {
    const response = await apiClient.post("/product-images/many", imagesData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // Trả về danh sách hình ảnh vừa thêm
  } catch (error) {
    console.error(
      "Lỗi khi thêm nhiều hình ảnh sản phẩm:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Lấy danh sách hình ảnh sản phẩm
export const getProductImages = async () => {
  try {
    const response = await apiClient.get("/product-images");
    return response.data; // Trả về danh sách hình ảnh
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách hình ảnh sản phẩm:",
      error.response?.data || error.message
    );
    return []; // Trả về mảng rỗng trong trường hợp lỗi
  }
};

export const setAsMainProductImage = async (id, updatedData) => {
  try {
    const response = await apiClient.put(`/product-images/${id}`, updatedData);
    return response.data; // Trả về dữ liệu sau khi cập nhật
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật hình ảnh sản phẩm:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Xóa hình ảnh sản phẩm
export const deleteProductImage = async (id) => {
  try {
    const response = await apiClient.delete(`/product-images/${id}`);
    return response.data; // Trả về phản hồi sau khi xóa
  } catch (error) {
    console.error(
      "Lỗi khi xóa hình ảnh sản phẩm:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Xóa nhiều hình ảnh sản phẩm
export const deleteManyProductImages = async (ids) => {
  try {
    const response = await apiClient.post("/product-images/delete-many", {
      ids,
    });
    return response.data; // Trả về phản hồi sau khi xóa nhiều hình ảnh
  } catch (error) {
    console.error(
      "Lỗi khi xóa nhiều hình ảnh sản phẩm:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const getImageUrl = (url) => {
  const fallback = "/placeholder.png";
  const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  return url
    ? url.startsWith("http")
      ? url
      : `${baseUrl}/${url.replace(/^\/+/, "")}`
    : fallback;
};
