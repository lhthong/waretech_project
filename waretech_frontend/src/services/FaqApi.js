import apiClient from "./apiClient";

// Thêm FAQ mới
export const addFaq = async (faqData) => {
  try {
    const response = await apiClient.post("/faqs", faqData);
    return response.data; // Trả về dữ liệu FAQ vừa thêm
  } catch (error) {
    console.error("Lỗi khi thêm FAQ:", error.response?.data || error.message);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Lấy danh sách FAQ
export const getAllFaqs = async (params = {}) => {
  try {
    const response = await apiClient.get("/faqs", { params });
    return response.data; // Trả về danh sách FAQ
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách FAQ:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Lấy FAQ theo ID
export const getFaqById = async (id) => {
  try {
    const response = await apiClient.get(`/faqs/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy FAQ theo id:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Xóa FAQ theo ID
export const deleteFaq = async (id) => {
  try {
    const response = await apiClient.delete(`/faqs/${id}`);
    return response.data; // Trả về phản hồi sau khi xóa
  } catch (error) {
    console.error("Lỗi khi xóa FAQ:", error.response?.data || error.message);
    throw error;
  }
};

// Sửa thông tin FAQ
export const updateFaq = async (id, updatedData) => {
  try {
    const response = await apiClient.put(`/faqs/${id}`, updatedData);
    return response.data; // Trả về dữ liệu sau khi cập nhật
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật FAQ:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Cập nhật trạng thái FAQ
export const updateFaqStatus = async (id, status) => {
  try {
    const response = await apiClient.patch(`/faqs/${id}/status`, { status });
    return response.data; // Trả về dữ liệu sau khi cập nhật trạng thái
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật trạng thái FAQ:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Xử lý câu hỏi chatbot
export const ChatbotQuestion = async (question) => {
  try {
    const response = await apiClient.post("/faqs/chatbot", { question });
    // Kiểm tra cấu trúc phản hồi
    if (response.data && response.data.answer) {
      return response.data;
    }
    throw new Error("Không nhận được câu trả lời từ server");
  } catch (error) {
    console.error(
      "Lỗi khi xử lý câu hỏi chatbot:",
      error.response?.data || error.message
    );
    throw error;
  }
};
