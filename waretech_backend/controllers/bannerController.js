const fs = require("fs").promises;
const path = require("path");
const Banner = require("../models/bannerModel");

const bannerController = {
  //Tạo mới banner
  createBanner: async (req, res) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "Vui lòng chọn file ảnh" });
      }

      const imageUrl = `/uploads/banners/${file.filename}`;

      const newBanner = await Banner.create({ image_url: imageUrl });
      return res.status(201).json({
        message: "Tạo banner thành công",
        banner: newBanner,
      });
    } catch (err) {
      console.error("Lỗi tạo banner:", err);
      return res.status(500).json({ message: "Lỗi khi tạo banner" });
    }
  },

  //Lấy banner đang hiển thị (cho client)
  getActiveBanners: async (_req, res) => {
    try {
      const banners = await Banner.findAllActive();
      return res.status(200).json(banners);
    } catch (err) {
      console.error("Lỗi lấy banner đang hiển thị:", err);
      return res.status(500).json({ message: "Lỗi khi lấy danh sách banner" });
    }
  },

  // Lấy toàn bộ banner
  getAllBanners: async (_req, res) => {
    try {
      const banners = await Banner.findAll();
      return res.status(200).json(banners);
    } catch (err) {
      console.error("Lỗi lấy toàn bộ banner:", err);
      return res.status(500).json({ message: "Lỗi khi lấy danh sách banner" });
    }
  },

  // Xem chi tiết banner
  getBannerById: async (req, res) => {
    try {
      const banner = await Banner.findById(req.params.id);
      if (!banner) {
        return res.status(404).json({ message: "Không tìm thấy banner" });
      }
      return res.status(200).json(banner);
    } catch (err) {
      console.error("Lỗi lấy banner theo ID:", err);
      return res.status(500).json({ message: "Lỗi khi lấy banner" });
    }
  },

  //toggle - Bật/tắt trạng thái hiển thị
  toggleBannerActive: async (req, res) => {
    try {
      const updated = await Banner.toggleActive(
        req.params.id,
        req.body.is_active
      );
      return res.status(200).json({
        message: "Cập nhật trạng thái thành công",
        banner: updated,
      });
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      return res
        .status(400)
        .json({ message: err.message || "Lỗi khi cập nhật trạng thái" });
    }
  },

  //Xóa banner
  deleteBanner: async (req, res) => {
    try {
      const banner = await Banner.findById(req.params.id);
      if (!banner) {
        return res.status(404).json({ message: "Banner không tồn tại" });
      }
      // Lấy đường dẫn file ảnh
      const imagePath = path.join(__dirname, "..", banner.image_url);
      // Xóa file ảnh vật lý nếu tồn tại
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        if (err.code !== "ENOENT") {
          console.error("Lỗi xóa file ảnh:", err);
        }
      }
      // Xóa bản ghi trong database
      await Banner.delete(req.params.id);
      return res.status(200).json({ message: "Xóa banner thành công" });
    } catch (err) {
      console.error("Lỗi xóa banner:", err);
      return res.status(500).json({ message: "Lỗi khi xóa banner" });
    }
  },
};

module.exports = bannerController;
