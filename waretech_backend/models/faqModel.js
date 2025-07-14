const prisma = require("../utils/prismaClient");
const stringSimilarity = require("string-similarity");

// Hàm chuẩn hóa chuỗi: loại bỏ dấu, chuyển về chữ thường, loại bỏ khoảng trắng thừa
const normalizeString = (str) => {
  return str
    .normalize("NFD") // Phân tách dấu
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
    .toLowerCase()
    .trim();
};

const Faq = {
  // Tạo FAQ
  create: async (faqData) => {
    try {
      // Kiểm tra dữ liệu đầu vào
      if (!faqData.question || !faqData.answer) {
        throw new Error("Câu hỏi và câu trả lời không được để trống");
      }
      // Tự động tạo updated_at
      faqData.updated_at = new Date();
      return await prisma.faq.create({ data: faqData });
    } catch (error) {
      console.error("Lỗi tạo FAQ:", error);
      throw new Error("Không thể tạo FAQ: " + error.message);
    }
  },

  // Tìm tất cả FAQ (hỗ trợ lọc theo từ khóa, trạng thái)
  findAll: async (filter = {}) => {
    try {
      const whereClause = {};

      // Lọc theo trạng thái nếu có truyền
      if (filter.status !== undefined) {
        whereClause.status = Boolean(filter.status);
      }

      // Lọc theo từ khóa nếu có
      if (filter.keyword) {
        const keyword = normalizeString(filter.keyword);
        whereClause.OR = [
          { question: { contains: keyword, mode: "insensitive" } },
          { answer: { contains: keyword, mode: "insensitive" } },
          { keywords: { contains: keyword, mode: "insensitive" } },
          { alternative_questions: { contains: keyword, mode: "insensitive" } },
        ];
      }

      return await prisma.faq.findMany({
        where: whereClause,
        orderBy: { updated_at: "desc" },
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách FAQ:", error);
      throw new Error("Không thể lấy danh sách FAQ: " + error.message);
    }
  },

  // Tìm 1 FAQ theo ID
  findById: async (id) => {
    try {
      // Kiểm tra ID hợp lệ
      if (isNaN(id)) {
        throw new Error("ID không hợp lệ");
      }
      return await prisma.faq.findUnique({
        where: { id: Number(id) },
      });
    } catch (error) {
      console.error("Lỗi lấy FAQ theo ID:", error);
      throw new Error("Không thể lấy FAQ: " + error.message);
    }
  },

  // Cập nhật FAQ theo ID
  update: async (id, faqData) => {
    try {
      // Kiểm tra ID và dữ liệu đầu vào
      if (isNaN(id)) {
        throw new Error("ID không hợp lệ");
      }
      if (!faqData.question || !faqData.answer) {
        throw new Error("Câu hỏi và câu trả lời không được để trống");
      }
      // Tự động cập nhật updated_at
      faqData.updated_at = new Date();
      return await prisma.faq.update({
        where: { id: Number(id) },
        data: faqData,
      });
    } catch (error) {
      console.error("Lỗi cập nhật FAQ:", error);
      throw new Error("Không thể cập nhật FAQ: " + error.message);
    }
  },

  // Xóa FAQ
  delete: async (id) => {
    try {
      // Kiểm tra ID hợp lệ
      if (isNaN(id)) {
        throw new Error("ID không hợp lệ");
      }
      return await prisma.faq.delete({ where: { id: Number(id) } });
    } catch (error) {
      console.error("Lỗi xóa FAQ:", error);
      throw new Error("Không thể xóa FAQ: " + error.message);
    }
  },

  // Bật/tắt status
  updateStatus: async (id, status) => {
    try {
      // Kiểm tra ID hợp lệ
      if (isNaN(id)) {
        throw new Error("ID không hợp lệ");
      }
      return await prisma.faq.update({
        where: { id: Number(id) },
        data: { status: Boolean(status) },
      });
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái FAQ:", error);
      throw new Error("Không thể cập nhật trạng thái FAQ: " + error.message);
    }
  },

  // Tìm câu hỏi khớp với input người dùng
  findBestMatch: async (inputText) => {
    try {
      if (!inputText || typeof inputText !== "string") {
        throw new Error("Câu hỏi không hợp lệ");
      }

      const normalizedInput = normalizeString(inputText);

      // Lấy tất cả FAQ có status = true
      const faqs = await prisma.faq.findMany({
        where: {
          status: true,
        },
      });

      if (!faqs.length) {
        console.log("Không tìm thấy FAQ nào với status = true");
        return null;
      }

      let bestMatch = null;
      let bestScore = 0;

      for (const faq of faqs) {
        const questionScore = stringSimilarity.compareTwoStrings(
          normalizedInput,
          normalizeString(faq.question || "")
        );
        const altQuestionScore = faq.alternative_questions
          ? stringSimilarity.compareTwoStrings(
              normalizedInput,
              normalizeString(faq.alternative_questions)
            )
          : 0;
        const keywordsScore = faq.keywords
          ? stringSimilarity.compareTwoStrings(
              normalizedInput,
              normalizeString(faq.keywords)
            )
          : 0;

        const maxScore = Math.max(
          questionScore,
          altQuestionScore,
          keywordsScore
        );

        if (maxScore > bestScore && maxScore >= 0.3) {
          // Ngưỡng tối thiểu 0.3
          bestMatch = faq;
          bestScore = maxScore;
        }
      }

      if (bestMatch) {
        console.log(
          "Kết quả phù hợp nhất đã tìm thấy:",
          bestMatch.question,
          "Score:",
          bestScore
        );
      } else {
        console.log("Không tìm thấy kết quả phù hợp cho đầu vào:", inputText);
      }

      return bestMatch;
    } catch (error) {
      console.error("Lỗi tìm kiếm FAQ:", error);
      throw new Error("Không thể tìm kiếm FAQ: " + error.message);
    }
  },
};

module.exports = Faq;
