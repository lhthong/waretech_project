const jwt = require("jsonwebtoken");
const prisma = require("../utils/prismaClient");

// Middleware kiểm tra người dùng đã đăng nhập
const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Bạn cần đăng nhập trước." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.users.findUnique({
      where: { iduser: decoded.userId },
    });

    if (!user) {
      return res
        .status(403)
        .json({ message: "Tài khoản không hợp lệ hoặc đã bị xóa." });
    }

    if (user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({
        message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
      });
    }
    req.user = {
      ...user,
      id: user.iduser,
    };
    next();
  } catch (error) {
    console.error("Xác thực thất bại:", error);
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};

// Middleware kiểm tra quyền truy cập
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.permission)) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền truy cập tài nguyên này" });
    }
    next();
  };
};

module.exports = { isAuth, authorizeRoles };
