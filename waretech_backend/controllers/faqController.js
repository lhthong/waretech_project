const Faq = require("../models/faqModel");

const faqController = {
  // Tạo FAQ mới
  createFaq: async (req, res) => {
    try {
      const faqData = req.body;
      const newFaq = await Faq.create(faqData);
      res.status(201).json({ message: "Tạo FAQ thành công", data: newFaq });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy danh sách FAQ
  getAllFaqs: async (req, res) => {
    try {
      const { status, keyword } = req.query;
      const filter = {
        status: status ? status === "true" : undefined,
        keyword,
      };
      const faqs = await Faq.findAll(filter);
      res.status(200).json({ data: faqs });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy FAQ theo ID
  getFaqById: async (req, res) => {
    try {
      const { id } = req.params;
      const faq = await Faq.findById(id);
      if (!faq) {
        return res.status(404).json({ error: "FAQ không tồn tại" });
      }
      res.status(200).json({ data: faq });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cập nhật FAQ
  updateFaq: async (req, res) => {
    try {
      const { id } = req.params;
      const faqData = req.body;
      const updatedFaq = await Faq.update(id, faqData);
      res
        .status(200)
        .json({ message: "Cập nhật FAQ thành công", data: updatedFaq });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Xóa FAQ
  deleteFaq: async (req, res) => {
    try {
      const { id } = req.params;
      await Faq.delete(id);
      res.status(200).json({ message: "Xóa FAQ thành công" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cập nhật trạng thái FAQ
  updateFaqStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedFaq = await Faq.updateStatus(id, status);
      res.status(200).json({
        message: "Cập nhật trạng thái FAQ thành công",
        data: updatedFaq,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Xử lý câu hỏi chatbot
  handleChatbotQuestion: async (req, res) => {
    try {
      const { question } = req.body;
      const faq = await Faq.findBestMatch(question);
      if (faq) {
        res.status(200).json({ answer: faq.answer });
      } else {
        res.status(200).json({
          answer:
            "Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Vui lòng thử lại hoặc liên hệ hỗ trợ.",
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Lỗi hệ thống, vui lòng thử lại sau." });
    }
  },
};

module.exports = faqController;
