const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const userController = {
  // Tạo người dùng mới
  createUser: async (req, res) => {
    try {
      if (req.user.permission !== "admin") {
        return res
          .status(403)
          .json({ message: "Bạn không có quyền tạo tài khoản" });
      }

      const {
        username,
        password,
        fullname,
        phone,
        gender,
        address,
        avatar,
        permission,
      } = req.body;
      const userRole = permission || "staff";

      if (!username || !password) {
        return res.status(400).json({ message: "Thiếu thông tin tài khoản" });
      }

      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Tài khoản đã tồn tại" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        username,
        password: hashedPassword,
        fullname,
        phone,
        gender,
        address,
        avatar,
        permission: userRole,
      });

      return res
        .status(201)
        .json({ message: "Tạo tài khoản thành công", user: newUser });
    } catch (err) {
      console.error("Lỗi tạo người dùng:", err);
      return res.status(500).json({ message: "Lỗi khi tạo người dùng" });
    }
  },

  // Lấy danh sách tất cả người dùng
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      return res.status(200).json(users);
    } catch (err) {
      console.error("Lỗi lấy danh sách người dùng:", err);
      return res
        .status(500)
        .json({ message: "Lỗi khi lấy danh sách người dùng" });
    }
  },

  // Lấy thông tin người dùng theo ID
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
      return res.status(200).json(user);
    } catch (err) {
      console.error("Lỗi lấy thông tin người dùng:", err);
      return res
        .status(500)
        .json({ message: "Lỗi khi lấy thông tin người dùng" });
    }
  },

  // Cập nhật thông tin người dùng
  updateUser: async (req, res) => {
    try {
      const { password, ...userData } = req.body; // Không cho phép cập nhật password ở đây
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      await User.update(req.params.id, userData);
      return res
        .status(200)
        .json({ message: "Cập nhật người dùng thành công" });
    } catch (err) {
      console.error("Lỗi cập nhật người dùng:", err);
      return res.status(500).json({ message: "Lỗi khi cập nhật người dùng" });
    }
  },

  // Xóa người dùng
  deleteUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      await User.delete(req.params.id);
      return res.status(200).json({ message: "Xóa người dùng thành công" });
    } catch (err) {
      console.error("Lỗi xóa người dùng:", err);
      return res.status(500).json({ message: "Lỗi khi xóa người dùng" });
    }
  },
};

module.exports = userController;
