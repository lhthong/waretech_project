const statsModel = require("../models/statsModel");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const statsController = {
  getDailyProfit: async (req, res) => {
    try {
      const date = req.query.date ? new Date(req.query.date) : new Date();
      const profit = await statsModel.dailyProfit(date);
      res.json({ profit });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Lỗi khi tính tiền lời", details: error.message });
    }
  },

  getDailyRevenue: async (req, res) => {
    try {
      const date = req.query.date ? new Date(req.query.date) : new Date();
      const revenue = await statsModel.dailyRevenue(date);
      res.json({ revenue });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Lỗi khi tính doanh thu", details: error.message });
    }
  },

  getDailyOrders: async (req, res) => {
    try {
      const date = req.query.date ? new Date(req.query.date) : new Date();
      const orders = await statsModel.countDailyOrders(date);
      res.json({ orders });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Lỗi khi đếm đơn hàng", details: error.message });
    }
  },

  getDailySoldProducts: async (req, res) => {
    try {
      const date = req.query.date ? new Date(req.query.date) : new Date();
      const sold = await statsModel.dailySoldProducts(date);
      res.json({ sold });
    } catch (error) {
      res.status(500).json({
        error: "Lỗi khi tính sản phẩm đã bán",
        details: error.message,
      });
    }
  },

  getTotalInventory: async (req, res) => {
    try {
      const inventory = await statsModel.totalInventory();
      res.json({ inventory });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Lỗi khi tính tồn kho", details: error.message });
    }
  },

  getRevenueByDay: async (req, res) => {
    try {
      const { month, year } = req.query;
      if (!month || !year) {
        return res.status(400).json({ error: "Thiếu tham số month hoặc year" });
      }
      const data = await statsModel.revenueByDay(Number(month), Number(year));
      res.json(data);
    } catch (error) {
      res.status(500).json({
        error: "Lỗi khi lấy doanh thu theo ngày",
        details: error.message,
      });
    }
  },

  getRevenueByMonth: async (req, res) => {
    try {
      const { year } = req.query;
      if (!year) {
        return res.status(400).json({ error: "Thiếu tham số year" });
      }
      const data = await statsModel.revenueByMonth(Number(year));
      res.json(data);
    } catch (error) {
      res.status(500).json({
        error: "Lỗi khi lấy doanh thu theo tháng",
        details: error.message,
      });
    }
  },

  getRevenueByYear: async (req, res) => {
    try {
      const { startYear, endYear } = req.query;
      if (!startYear || !endYear) {
        return res
          .status(400)
          .json({ error: "Thiếu tham số startYear hoặc endYear" });
      }
      const data = await statsModel.revenueByYear(
        Number(startYear),
        Number(endYear)
      );
      res.json(data);
    } catch (error) {
      res.status(500).json({
        error: "Lỗi khi lấy doanh thu theo năm",
        details: error.message,
      });
    }
  },

  getBestSellingProducts: async (req, res) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 6;
      const data = await statsModel.getBestSellingProducts(limit);
      res.json(data);
    } catch (error) {
      res.status(500).json({
        error: "Lỗi khi lấy sản phẩm bán chạy",
        details: error.message,
      });
    }
  },

  getTopInventoryProducts: async (req, res) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 4;
      const data = await statsModel.getTopInventoryProducts(limit);
      res.json(data);
    } catch (error) {
      res.status(500).json({
        error: "Lỗi khi lấy sản phẩm tồn kho",
        details: error.message,
      });
    }
  },

  exportStatsToPDF: async (req, res) => {
    try {
      const exporterName = req.user.fullname;

      // Lấy các tham số từ query
      const {
        timeRange,
        selectedMonth,
        selectedYear,
        yearRangeStart,
        yearRangeEnd,
      } = req.query;
      if (
        !timeRange ||
        !selectedYear ||
        (timeRange === "day" && !selectedMonth) ||
        (timeRange === "year" && (!yearRangeStart || !yearRangeEnd))
      ) {
        return res.status(400).json({ error: "Thiếu tham số cần thiết" });
      }

      // Fetch data from model
      const [
        profit,
        revenue,
        orders,
        sold,
        inventory,
        bestSelling,
        topInventory,
      ] = await Promise.all([
        statsModel.dailyProfit(new Date()),
        statsModel.dailyRevenue(new Date()),
        statsModel.countDailyOrders(new Date()),
        statsModel.dailySoldProducts(new Date()),
        statsModel.totalInventory(),
        statsModel.getBestSellingProducts(6), // Limit to 6 products
        statsModel.getTopInventoryProducts(4), // Limit to 4 products
      ]);

      let revenueData;
      if (timeRange === "day") {
        revenueData = await statsModel.revenueByDay(
          Number(selectedMonth),
          Number(selectedYear)
        );
      } else if (timeRange === "month") {
        revenueData = await statsModel.revenueByMonth(Number(selectedYear));
      } else {
        revenueData = await statsModel.revenueByYear(
          Number(yearRangeStart),
          Number(yearRangeEnd)
        );
      }

      // Filter revenueData for timeRange=month to include only months with revenue > 0
      let filteredRevenueData = revenueData;
      if (timeRange === "month") {
        filteredRevenueData = revenueData.filter((item) => item.revenue > 0);
      }

      // Check for empty data
      if (
        !filteredRevenueData.length ||
        !bestSelling.length ||
        !topInventory.length
      ) {
        return res
          .status(400)
          .json({ error: "Dữ liệu không đầy đủ để xuất báo cáo" });
      }

      // Clean topInventory data
      const cleanedTopInventory = topInventory.map((item) => ({
        name: item.name || "Không xác định",
        stock: parseInt(item.stock.toString().replace(/[^0-9]/g, ""), 10) || 0,
        category: item.category || "Không xác định",
      }));

      // Create PDF
      const doc = new PDFDocument({ margin: 40, size: "A4" });

      // Register DejaVu Sans font
      const fontPath = path.join(__dirname, "../fonts", "DejaVuSans.ttf");
      if (!fs.existsSync(fontPath)) {
        throw new Error("Không tìm thấy file font DejaVuSans.ttf");
      }
      doc.registerFont("DejaVuSans", fontPath);
      doc.font("DejaVuSans");

      // Buffer to return PDF file
      let buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="bao-cao-thong-ke-${
            new Date().toISOString().split("T")[0]
          }.pdf"`
        );
        res.end(pdfData);
      });

      // Check page height before adding content
      const checkPageHeight = (currentY, requiredHeight) => {
        const pageHeight = doc.page.height - doc.page.margins.bottom; // ~842 for A4
        if (currentY + requiredHeight > pageHeight) {
          doc.addPage();
          return doc.page.margins.top; // Reset Y to top of new page
        }
        return currentY;
      };

      // Report title
      doc.fontSize(20).text("Báo Cáo Thống Kê", 50, 30, { align: "center" });
      doc
        .fontSize(12)
        .text(`Người xuất: ${exporterName}`, 50, 80, { align: "center" });
      doc.fontSize(12).text(
        `Ngày xuất: ${new Date().toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}`,
        50,
        60,
        { align: "center" }
      );

      // Overview statistics
      let currentY = 110;
      doc.fontSize(16).text("Thống Kê Tổng Quan", 50, currentY);
      currentY += 20;
      doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
      doc.fontSize(11);
      const statsTable = [
        {
          label: "Tiền lời hôm nay",
          value: `${profit.toLocaleString("vi-VN")} VNĐ`,
        },
        {
          label: "Doanh thu hôm nay",
          value: `${revenue.toLocaleString("vi-VN")} VNĐ`,
        },
        { label: "Đơn hàng hôm nay", value: `${orders} đơn` },
        { label: "Sản phẩm đã bán", value: `${sold} sản phẩm` },
        { label: "Sản phẩm tồn kho", value: `${inventory} sản phẩm` },
      ];
      statsTable.forEach((item, index) => {
        currentY = checkPageHeight(currentY + 10, 20);
        doc.text(item.label, 60, currentY + 10);
        doc.text(item.value, 250, currentY + 10);
        currentY += 20;
      });

      // Revenue
      currentY = checkPageHeight(
        currentY + 30,
        50 + filteredRevenueData.length * 20
      );
      let revenueTitle = "Doanh Thu";
      if (timeRange === "day") {
        revenueTitle += ` (Tháng ${selectedMonth}/${selectedYear})`;
      } else if (timeRange === "month") {
        revenueTitle += ` (Năm ${selectedYear})`;
      } else {
        revenueTitle += ` (${yearRangeStart} - ${yearRangeEnd})`;
      }
      doc.fontSize(16).text(revenueTitle, 50, currentY);
      currentY += 20;
      doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
      doc.fontSize(11);
      if (filteredRevenueData.length === 0) {
        // Handle case with no revenue data
        currentY = checkPageHeight(currentY + 10, 20);
        doc.text(
          "Không có dữ liệu doanh thu cho khoảng thời gian này.",
          60,
          currentY + 10
        );
        currentY += 20;
      } else {
        // Render revenue table
        currentY = checkPageHeight(currentY + 10, 35);
        doc.text("Thời gian", 60, currentY);
        doc.text("Doanh thu (VNĐ)", 300, currentY);
        currentY += 20;
        doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
        filteredRevenueData.forEach((item, index) => {
          currentY = checkPageHeight(currentY + 5, 20);
          doc.text(item.name, 60, currentY + 5);
          doc.text(item.revenue.toLocaleString("vi-VN"), 300, currentY + 5);
          currentY += 20;
        });
      }

      // Best-selling products
      currentY = checkPageHeight(currentY + 30, 50 + bestSelling.length * 20);
      doc.fontSize(16).text("Sản Phẩm Bán Chạy", 50, currentY);
      currentY += 20;
      doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
      doc.fontSize(11);
      currentY = checkPageHeight(currentY + 10, 35);
      doc.text("Tên sản phẩm", 60, currentY);
      doc.text("Số lượng bán", 300, currentY);
      doc.text("Giá bán (VNĐ)", 400, currentY);
      currentY += 20;
      doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
      bestSelling.forEach((item, index) => {
        currentY = checkPageHeight(currentY + 5, 20);
        doc.text(item.name, 60, currentY + 5);
        doc.text(item.sold.toString(), 300, currentY + 5);
        doc.text(item.price.toLocaleString("vi-VN"), 400, currentY + 5);
        currentY += 20;
      });

      // Inventory products
      currentY = checkPageHeight(
        currentY + 30,
        50 + cleanedTopInventory.length * 20
      );
      doc.fontSize(16).text("Sản Phẩm Tồn Kho Nhiều Nhất", 50, currentY);
      currentY += 20;
      doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
      doc.fontSize(11);
      currentY = checkPageHeight(currentY + 10, 35);
      doc.text("Tên sản phẩm", 60, currentY);
      doc.text("Tồn kho", 300, currentY);
      doc.text("Danh mục", 400, currentY);
      currentY += 20;
      doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
      cleanedTopInventory.forEach((item, index) => {
        currentY = checkPageHeight(currentY + 5, 20);
        // Truncate long names to avoid overflow
        const name =
          item.name.length > 40
            ? item.name.substring(0, 37) + "..."
            : item.name;
        doc.text(name, 60, currentY + 5);
        doc.text(item.stock.toString(), 300, currentY + 5);
        doc.text(item.category, 400, currentY + 5);
        currentY += 20;
      });

      // End document
      doc.end();
    } catch (error) {
      console.error("Lỗi khi xuất PDF:", error);
      res.status(500).json({
        error: "Không thể xuất báo cáo PDF",
        details: error.message || "Unknown error",
      });
    }
  },
};

module.exports = statsController;
