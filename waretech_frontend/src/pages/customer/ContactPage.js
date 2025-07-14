import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  AlertCircle,
  Check,
} from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await emailjs.send(
        "service_kv9xobq",
        "template_lgrbq2o",
        { ...formData, date: new Date().toLocaleString() },
        "2Q_CjQw2Ox8IeBSS9" // PUBLIC_KEY của bạn
      );
      setSuccessMessage(
        "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất."
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Lỗi khi gửi form:", error);
      setErrorMessage("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Hero Section */}
      <section className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-pacifico text-4xl font-semibold text-gray-700 md:text-6xl mb-6"
        >
          Liên hệ với{" "}
          <span className="bg-gradient-to-r from-blue-500 to-orange-500 text-transparent bg-clip-text">
            WareTech
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Chúng tôi luôn sẵn sàng hỗ trợ bạn! Hãy gửi thông tin hoặc liên hệ
          trực tiếp qua các kênh dưới đây.
        </motion.p>
      </section>
      {/* Contact Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 py-12">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-xl shadow-md border-t-4 border-orange-500 text-center"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Địa chỉ</h3>
          <p className="text-gray-600">
            178 Phan Văn Hân, Phường 17, Bình Thạnh, TP. Hồ Chí Minh, Việt Nam
          </p>
        </motion.div>
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500 text-center"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Email</h3>
          <p className="text-gray-600">support@waretech.co</p>
          <p className="text-gray-600">sales@waretech.co</p>
        </motion.div>
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-xl shadow-md border-t-4 border-orange-500 text-center"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Phone className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Điện thoại
          </h3>
          <p className="text-gray-600">+84 28 1234 5678</p>
          <p className="text-gray-600">Hotline: 1900 1234</p>
        </motion.div>
      </div>
      {/* Contact Form & Map Section */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
          >
            <h2 className="text-3xl font-pacifico font-bold text-gray-700 mb-6 text-center">
              Gửi tin nhắn cho chúng tôi
            </h2>
            {successMessage && (
              <div className="mb-4 flex items-center rounded-md bg-green-50 p-3 text-green-600">
                <Check className="mr-2 h-5 w-5" />
                <span>{successMessage}</span>
              </div>
            )}
            {errorMessage && (
              <div className="mb-4 flex items-center rounded-md bg-red-50 p-3 text-red-600">
                <AlertCircle className="mr-2 h-5 w-5" />
                <span>{errorMessage}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">
                    Họ và tên*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập họ tên"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">
                    Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập email"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-gray-700 mb-2">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tiêu đề"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 mb-2">
                  Nội dung*
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập nội dung..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full md:w-auto px-6 py-3 rounded-lg text-white transition-colors shadow-md ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
              </button>
            </form>
          </motion.section>
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="rounded-xl overflow-hidden shadow-md h-80"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.22310035701!2d106.7020379731697!3d10.794217558869104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528b5d7d64ee5%3A0xf4ce34e5ddadf55a!2zMTc4IFBoYW4gVsSDbiBIw6JuLCBQaMaw4budbmcgMTcsIELDrG5oIFRo4bqhbmgsIEjhu5MgQ2jDrSBNaW5oLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1749484266977!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Waretech Office Location"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Kết nối với chúng tôi
              </h3>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://www.facebook.com/waretech.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-6 h-6 text-blue-600" />
                </a>
                <a
                  href="https://www.instagram.com/waretech_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center hover:bg-orange-200 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-6 h-6 text-orange-600" />
                </a>
                <a
                  href="https://www.linkedin.com/company/waretech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-6 h-6 text-blue-600" />
                </a>
                <a
                  href="https://twitter.com/waretech_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-6 h-6 text-blue-600" />
                </a>
              </div>
              <p className="text-gray-600 mt-4">
                Theo dõi chúng tôi để cập nhật sản phẩm mới nhất và các chương
                trình khuyến mãi!
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-blue-600 text-white py-12 mt-12"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Bạn cần hỗ trợ ngay lập tức?
          </h3>
          <p className="text-blue-100 mb-6">
            Đội ngũ hỗ trợ của chúng tôi sẵn sàng giải đáp mọi thắc mắc 24/7
          </p>
          <button className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-md flex items-center mx-auto">
            <Phone className="w-5 h-5 mr-2" />
            Gọi ngay: 1900 1234
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;
