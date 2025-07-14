const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prismaClient");
require("dotenv").config();

// Tạo token đăng nhập
const generateToken = (user) => {
  const payload = {
    userId: user.iduser,
    role: user.permission,
    tokenVersion: user.tokenVersion,
  };

  const options =
    user.permission === "admin" || user.permission === "staff"
      ? { expiresIn: "1h" }
      : undefined;

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

const authController = {
  // Đăng nhập
  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await prisma.users.findUnique({ where: { username } });

      if (!user)
        return res.status(404).json({ message: "Tài khoản không tồn tại" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Sai mật khẩu" });

      const token = generateToken(user);

      return res.status(200).json({
        message: "Đăng nhập thành công",
        token,
        user: {
          id: user.iduser,
          username: user.username,
          role: user.permission,
        },
      });
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }
  },

  // Đăng ký
  registerUser: async (req, res) => {
    try {
      const { username, fullname, password } = req.body;

      const existingUser = await prisma.users.findUnique({
        where: { username },
      });

      if (existingUser)
        return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.users.create({
        data: {
          username,
          fullname,
          password: hashedPassword,
          permission: "client",
          tokenVersion: 0,
        },
      });

      const token = generateToken(newUser);

      return res.status(201).json({
        message: "Đăng ký thành công",
        token,
        user: {
          id: newUser.iduser,
          username: newUser.username,
          fullname: newUser.fullname,
          role: newUser.permission,
        },
      });
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      return res.status(500).json({ message: "Lỗi server khi đăng ký" });
    }
  },

  // Đăng xuất
  logoutUser: async (req, res) => {
    try {
      await prisma.users.update({
        where: { iduser: req.user.id },
        data: { tokenVersion: { increment: 1 } },
      });
      return res.status(200).json({ message: "Đăng xuất thành công" });
    } catch (err) {
      console.error("Lỗi đăng xuất:", err);
      return res.status(500).json({ message: "Lỗi khi đăng xuất" });
    }
  },

  // Đổi mật khẩu
  changePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = await prisma.users.findUnique({
        where: { iduser: req.user.id },
      });

      if (!user)
        return res.status(404).json({ message: "Người dùng không tồn tại" });

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Mật khẩu cũ không đúng" });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.users.update({
        where: { iduser: req.user.id },
        data: { password: hashedPassword },
      });

      return res.status(200).json({ message: "Đổi mật khẩu thành công" });
    } catch (err) {
      console.error("Lỗi đổi mật khẩu:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }
  },

  // Lấy thông tin người dùng hiện tại
  getCurrentUser: async (req, res) => {
    try {
      const user = await prisma.users.findUnique({
        where: { iduser: req.user.iduser },
        select: {
          iduser: true,
          username: true,
          fullname: true,
          permission: true,
          phone: true,
          gender: true,
          address: true,
          avatar: true,
        },
      });

      if (!user)
        return res.status(404).json({ message: "Không tìm thấy người dùng" });

      return res.status(200).json(user);
    } catch (err) {
      console.error("Lỗi lấy thông tin user:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }
  },

  // Cập nhật thông tin người dùng hiện tại
  updateUser: async (req, res) => {
    try {
      const { fullname, phone, gender, address } = req.body;
      const file = req.file;

      // Tạo đối tượng dữ liệu cập nhật
      const dataToUpdate = {};

      // Kiểm tra và thêm các trường không rỗng vào đối tượng cập nhật
      if (fullname) dataToUpdate.fullname = fullname;
      if (phone) dataToUpdate.phone = phone;
      if (gender) dataToUpdate.gender = gender;
      if (address) dataToUpdate.address = address;

      // Nếu có file, thêm đường dẫn vào đối tượng dữ liệu
      if (file) {
        const imageUrl = `/uploads/avatars/${file.filename}`;
        dataToUpdate.avatar = imageUrl;
      }

      const updatedUser = await prisma.users.update({
        where: { iduser: req.user.iduser },
        data: dataToUpdate,
        select: {
          iduser: true,
          username: true,
          fullname: true,
          phone: true,
          gender: true,
          address: true,
          avatar: true,
        },
      });

      return res.status(200).json({
        message: "Cập nhật thông tin thành công",
        user: updatedUser,
      });
    } catch (err) {
      console.error("Lỗi cập nhật thông tin user:", err);
      return res
        .status(500)
        .json({ message: "Lỗi server khi cập nhật thông tin" });
    }
  },
};

module.exports = authController;
