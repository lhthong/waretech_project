const Reviews = require("../models/reviewsModel");

const reviewsController = {
  createReviews: async (req, res) => {
    try {
      const { product_id, rating, comment } = req.body;
      const user_id = req.user.iduser; // Lấy từ middleware isAuth

      // Kiểm tra rating hợp lệ
      if (!rating || rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ message: "Đánh giá phải từ 1 đến 5 sao" });
      }

      // Kiểm tra người dùng đã đánh giá sản phẩm chưa
      const existingReview = await Reviews.findByUserAndProduct(
        user_id,
        product_id
      );

      if (existingReview) {
        // Nếu đã tồn tại, cập nhật lại
        const updatedReview = await Reviews.update(existingReview.id, {
          rating,
          comment,
        });

        return res.status(200).json({
          message:
            "Bạn đã đánh giá trước đó. Hệ thống đã cập nhật lại đánh giá của bạn.",
          reviews: updatedReview,
        });
      }

      // Nếu chưa có, tạo mới
      const newReview = await Reviews.create({
        user_id,
        product_id,
        rating,
        comment,
        created_at: new Date(),
      });

      return res.status(201).json({
        message: "Tạo đánh giá sản phẩm thành công",
        reviews: newReview,
      });
    } catch (err) {
      console.error("Lỗi tạo/cập nhật đánh giá sản phẩm:", err);
      return res
        .status(500)
        .json({ message: "Lỗi khi xử lý đánh giá sản phẩm" });
    }
  },

  getAllReviews: async (req, res) => {
    try {
      const reviews = await Reviews.findAll();
      res.status(200).json(reviews);
    } catch (err) {
      console.error("Lỗi lấy danh sách đánh giá sản phẩm:", err);
      return res
        .status(500)
        .json({ message: "Lỗi khi lấy danh sách đánh giá sản phẩm" });
    }
  },

  getReviewsById: async (req, res) => {
    try {
      const id = req.params.id;
      const reviews = await Reviews.findById(id);
      if (!reviews) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy đánh giá sản phẩm" });
      }
      return res.status(200).json(reviews);
    } catch (err) {
      console.error("Lỗi lấy đánh giá sản phẩm:", err);
      return res.status(500).json({ message: "Lỗi khi lấy đánh giá sản phẩm" });
    }
  },

  updateReviews: async (req, res) => {
    try {
      const { rating } = req.body;

      if (rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ message: "Đánh giá phải từ 1 đến 5 sao" });
      }

      const result = await Reviews.update(req.params.id, req.body);
      return res.status(200).json({
        message: "Cập nhật đánh giá sản phẩm thành công",
        reviews: result,
      });
    } catch (err) {
      res.status(500).json({
        message: "Lỗi khi cập nhật đánh giá sản phẩm",
        error: err.message,
      });
    }
  },

  deleteReviews: async (req, res) => {
    try {
      const reviews = await Reviews.findById(req.params.id);
      if (!reviews) {
        return res
          .status(404)
          .json({ message: "đánh giá sản phẩm không tồn tại" });
      }

      await Reviews.delete(req.params.id);
      return res
        .status(200)
        .json({ message: "Xóa đánh giá sản phẩm thành công" });
    } catch (err) {
      console.error("Lỗi xóa đánh giá sản phẩm:", err);
      return res.status(500).json({ message: "Lỗi khi xóa đánh giá sản phẩm" });
    }
  },
};

module.exports = reviewsController;
