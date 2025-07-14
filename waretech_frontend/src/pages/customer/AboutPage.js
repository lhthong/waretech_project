import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Hằng số chứa danh sách đánh giá từ khách hàng
const testimonials = [
  {
    message:
      "Giao diện thân thiện, tốc độ tải nhanh và rất dễ sử dụng. Tôi có thể tìm kiếm sản phẩm mình cần chỉ trong vài cú nhấp chuột.",
    author: "Nguyễn Minh Anh, sinh viên CNTT",
    role: "Khách hàng",
  },
  {
    message:
      "Dù chỉ là một đồ án, nhưng hệ thống Waretech hoạt động rất mượt, tính năng đặt hàng, giỏ hàng và thanh toán đều hoàn chỉnh.",
    author: "Ths. Nguyễn Thị Kim Phụng, giảng viên hướng dẫn",
    role: "Đối tác",
  },
  {
    message:
      "Waretech có giao diện hiện đại, dễ dùng, rất thích hợp để học tập và mở rộng sau này thành dự án thực tế.",
    author: "Lê Thị Hằng, sinh viên CNTT",
    role: "Khách hàng",
  },
];

// AboutPage: Component chính cho trang Giới thiệu của Waretech
const AboutPage = () => {
  const [index, setIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Xử lý chuyển đến đánh giá trước đó
  const handlePrev = () => {
    setIsAutoPlaying(false);
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  // Xử lý chuyển đến đánh giá tiếp theo
  const handleNext = () => {
    setIsAutoPlaying(false);
    setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  // Tự động chuyển đổi đánh giá mỗi 5 giây nếu đang ở chế độ tự động
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <div className="mx-auto max-w-6xl space-y-16 px-4 py-12">
      {/* Phần đầu: Giới thiệu tổng quan */}
      <section className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-pacifico mb-6 text-5xl font-bold text-gray-700 md:text-6xl"
        >
          Giới thiệu về{" "}
          <span className="bg-clip-text bg-gradient-to-r from-blue-500 to-orange-500 text-transparent">
            WareTech
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-3xl text-xl text-gray-600"
        >
          Hệ thống bán hàng trực tuyến hiện đại, chuyên cung cấp các sản phẩm
          công nghệ chất lượng cao với trải nghiệm người dùng tối ưu.
        </motion.p>
      </section>

      {/* Phần 1: Giới thiệu chung về Waretech */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid items-center gap-12 md:grid-cols-2"
      >
        <div className="space-y-6">
          <h2 className="bg-clip-text bg-gradient-to-r from-blue-500 to-orange-500 py-4 font-pacifico text-3xl font-semibold text-transparent">
            Chúng tôi là ai?
          </h2>
          <p className="text-lg leading-relaxed text-gray-600">
            Waretech là một dự án được xây dựng trong khuôn khổ đồ án tốt
            nghiệp, với mục tiêu phát triển một hệ thống bán hàng trực tuyến
            hiện đại, chuyên cung cấp các sản phẩm công nghệ, phần mềm và thiết
            bị điện tử.
          </p>
          <p className="text-lg leading-relaxed text-gray-600">
            Dự án được thiết kế nhằm giải quyết nhu cầu mua sắm tiện lợi, minh
            bạch và tối ưu trải nghiệm người dùng. Bằng cách tích hợp các công
            nghệ tiên tiến, Waretech cam kết mang đến cho khách hàng những sản
            phẩm chất lượng cao với giá cả hợp lý.
          </p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-8 shadow-sm">
          <div className="grid gap-8">
            <div className="rounded-xl border-l-4 border-orange-500 bg-white p-6 shadow-xs">
              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                Tầm nhìn
              </h3>
              <p className="text-gray-600">
                Trở thành nền tảng bán hàng trực tuyến uy tín và thân thiện với
                người dùng, góp phần thúc đẩy chuyển đổi số trong lĩnh vực bán
                lẻ tại Việt Nam.
              </p>
            </div>
            <div className="rounded-xl border-l-4 border-blue-500 bg-white p-6 shadow-xs">
              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                Sứ mệnh
              </h3>
              <p className="text-gray-600">
                Xây dựng một hệ sinh thái thương mại điện tử hiện đại, hỗ trợ
                người dùng dễ dàng tiếp cận các sản phẩm công nghệ chất lượng
                cao với dịch vụ chuyên nghiệp.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Phần 2: Giá trị cốt lõi */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h2 className="bg-clip-text bg-gradient-to-r from-blue-500 to-orange-500 py-4 font-pacifico text-4xl font-semibold text-transparent">
            Giá trị cốt lõi
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-gray-500">
            Những điều làm nên sự khác biệt của Waretech
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="group rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="mb-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-orange-100">
                <svg
                  className="h-6 w-6 text-blue-600 transition-colors group-hover:text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mt-2 text-xl font-semibold text-orange-500">
                Chất lượng sản phẩm
              </h3>
            </div>
            <p className="text-gray-600">
              Cung cấp các mặt hàng được chọn lọc kỹ lưỡng, đảm bảo nguồn gốc rõ
              ràng và tiêu chuẩn kỹ thuật.
            </p>
          </div>
          <div className="group rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 transition-colors group-hover:bg-blue-100">
                <svg
                  className="h-6 w-6 text-orange-600 transition-colors group-hover:text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="mt-2 text-xl font-semibold text-blue-800">
                Dịch vụ khách hàng
              </h3>
            </div>
            <p className="text-gray-600">
              Hệ thống hỗ trợ trực tuyến, phản hồi nhanh chóng và chính sách đổi
              trả minh bạch.
            </p>
          </div>
          <div className="group rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-orange-100">
                <svg
                  className="h-6 w-6 text-blue-600 transition-colors group-hover:text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h3 className="mt-2 text-xl font-semibold text-orange-500">
                Công nghệ tiên tiến
              </h3>
            </div>
            <p className="text-gray-600">
              Ứng dụng ReactJS, Node.js, và Prisma để xây dựng nền tảng hiệu
              quả, dễ mở rộng và bảo mật cao.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Phần 3: Lịch sử hình thành và phát triển */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h2 className="bg-clip-text bg-gradient-to-r from-blue-500 to-orange-500 py-4 font-pacifico text-4xl font-semibold text-transparent">
            Hành trình phát triển
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-gray-500">
            Những mốc quan trọng trong quá trình xây dựng Waretech
          </p>
        </div>
        <div className="relative">
          {/* Đường thời gian dọc giữa các mốc */}
          <div className="absolute left-1/2 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-blue-400 to-orange-400 hidden md:block" />
          <div className="space-y-8 md:space-y-0">
            {[
              {
                year: "2024 (Cuối năm)",
                title: "Khởi đầu",
                content:
                  "Lên ý tưởng và khảo sát thị trường, xác định các chức năng chính cần thiết cho hệ thống.",
                position: "left",
                color: "blue",
              },
              {
                year: "2025 (Tháng 1 - 3)",
                title: "Xây dựng nền tảng",
                content:
                  "Thiết kế cơ sở dữ liệu, xây dựng API backend với Node.js và Prisma.",
                position: "right",
                color: "orange",
              },
              {
                year: "2025 (Tháng 4)",
                title: "Phát triển giao diện",
                content:
                  "Phát triển giao diện người dùng bằng React và Tailwind CSS, tích hợp các tính năng như phân loại sản phẩm, giỏ hàng, thanh toán.",
                position: "left",
                color: "blue",
              },
              {
                year: "2025 (Tháng 5)",
                title: "Hoàn thiện",
                content:
                  "Kiểm thử, tối ưu và triển khai demo phục vụ báo cáo đồ án tốt nghiệp.",
                position: "right",
                color: "orange",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative md:flex ${item.position === "left" ? "md:flex-row" : "md:flex-row-reverse"} items-center`}
              >
                <div className="md:w-1/2">
                  <div
                    className={`rounded-xl border-t-4 bg-white p-4 shadow-sm ${item.position === "left" ? "md:mr-8" : "md:ml-8"} ${item.color === "blue" ? "border-blue-500" : "border-orange-500"}`}
                  >
                    <span
                      className={`text-sm font-medium ${item.color === "blue" ? "text-blue-600" : "text-orange-600"}`}
                    >
                      {item.year}
                    </span>
                    <h3 className="mt-1 text-xl font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-gray-600">{item.content}</p>
                  </div>
                </div>
                <div
                  className={`absolute left-1/2 h-4 w-4 -translate-x-1/2 rounded-full ${item.color === "blue" ? "bg-blue-500" : "bg-orange-500"} hidden md:block`}
                />
                <div className="md:w-1/2 p-4">
                  <div className="flex h-full items-center justify-center">
                    <span
                      className={`text-4xl font-bold ${item.color === "blue" ? "text-blue-200" : "text-orange-200"}`}
                    >
                      {item.year.split(" ")[0]}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Phần 4: Cảm nhận khách hàng - Carousel */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h2 className="bg-clip-text bg-gradient-to-r from-blue-500 to-orange-500 py-4 font-pacifico text-4xl font-semibold text-transparent">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-gray-500">
            Những phản hồi từ người dùng hệ thống Waretech
          </p>
        </div>
        <div className="relative mx-auto max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-8 shadow-sm"
            >
              <Quote className="mb-4 h-8 w-8 text-blue-400" />
              <p className="text-lg italic text-gray-700">
                "{testimonials[index].message}"
              </p>
              <div className="mt-6">
                <p className="font-semibold text-gray-800">
                  {testimonials[index].author}
                </p>
                <p className="text-sm text-orange-400">
                  {testimonials[index].role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-6 flex justify-center space-x-4">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setIndex(i);
                }}
                className={`h-3 w-3 rounded-full transition-colors ${i === index ? "bg-orange-500" : "bg-gray-300"}`}
                aria-label={`Chuyển đến đánh giá ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 rounded-full border border-orange-200 bg-white p-2 shadow-md transition-colors hover:bg-orange-50"
            aria-label="Đánh giá trước đó"
          >
            <ChevronLeft className="h-5 w-5 text-orange-600" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 translate-x-4 -translate-y-1/2 rounded-full border border-orange-200 bg-white p-2 shadow-md transition-colors hover:bg-orange-50"
            aria-label="Đánh giá tiếp theo"
          >
            <ChevronRight className="h-5 w-5 text-orange-600" />
          </button>
        </div>
      </motion.section>

      {/* Phần kêu gọi hành động */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 p-8 text-center text-white"
      >
        <h2 className="mb-4 text-2xl font-bold">
          Bạn đã sẵn sàng trải nghiệm?
        </h2>
        <p className="mx-auto mb-6 max-w-2xl text-blue-100">
          Khám phá ngay các sản phẩm công nghệ chất lượng cao với ưu đãi đặc
          biệt dành cho khách hàng mới.
        </p>
        <Link to="/shop">
          <button className="rounded-lg bg-white px-6 py-3 font-medium text-blue-600 shadow-md transition-colors hover:bg-orange-50 hover:text-orange-600">
            Truy cập cửa hàng
          </button>
        </Link>
      </motion.section>
    </div>
  );
};

export default AboutPage;
