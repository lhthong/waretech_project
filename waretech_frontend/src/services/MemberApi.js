import apiClient from "./apiClient";

export const MemberService = {
  getMembers: async () => {
    try {
      const response = await apiClient.get("/users");
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thành viên:", error);
      throw error;
    }
  },

  addMember: async (memberData) => {
    try {
      const response = await apiClient.post("/users", memberData);
      return response.data;
    } catch (error) {
      console.error("lỗi khi thêm thành viên:", error);
      throw error;
    }
  },

  deleteMember: async (id) => {
    try {
      const response = await apiClient.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi xóa thành viên:", error);
      throw error;
    }
  },

  updateMember: async (iduser, updatedData) => {
    try {
      const response = await apiClient.put(`/users/${iduser}`, updatedData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật thành viên:", error);
      throw error;
    }
  },
};
