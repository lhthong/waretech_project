const Overview = require("../models/overviewModel");

const OverviewController = {
  getInventoryStats: async (req, res) => {
    try {
      const { year } = req.query;
      if (!year) {
        return res.status(400).json({
          success: false,
          message: "Thiếu tham số năm",
        });
      }

      const stats = await Overview.getYearlyStats(Number(year));
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (err) {
      console.error("Lỗi lấy thống kê kho:", err);
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy thống kê kho",
        error: err.message,
      });
    }
  },

  getMonthlyStats: async (req, res) => {
    try {
      const { month, year } = req.query;
      if (!month || !year) {
        return res.status(400).json({
          success: false,
          message: "Thiếu tham số tháng hoặc năm",
        });
      }

      const stats = await Overview.getMonthlyStats(Number(month), Number(year));
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (err) {
      console.error("Lỗi lấy thống kê tháng:", err);
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy thống kê tháng",
        error: err.message,
      });
    }
  },

  getCurrentStock: async (req, res) => {
    try {
      const { productId } = req.params;
      const stock = await Overview.getCurrentStock(Number(productId));
      res.status(200).json({
        success: true,
        data: { stock },
      });
    } catch (err) {
      console.error("Lỗi lấy tồn kho:", err);
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy tồn kho",
        error: err.message,
      });
    }
  },

  getWarehouseOverview: async (req, res) => {
    try {
      const overview = await Overview.warehouseOverview();
      res.status(200).json(overview);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
      res.status(500).json({ message: "Lỗi khi lấy dữ liệu" });
    }
  },

  getStockPercentageByCategory: async (req, res) => {
    try {
      const percentageByCategory =
        await Overview.getStockPercentageByCategory();
      res.status(200).json(percentageByCategory);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
      res.status(500).json({ message: "Lỗi khi lấy dữ liệu" });
    }
  },
};
module.exports = OverviewController;
