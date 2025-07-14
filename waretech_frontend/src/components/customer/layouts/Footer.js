import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 pt-12 md:pt-16 pb-6 md:pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6 md:gap-8">
      {/* Column 1: Contact Info */}
      <div className="col-span-2 sm:col-span-1 flex flex-col space-y-3 md:space-y-4">
        <h4 className="text-white text-lg md:text-xl font-bold mb-2 md:mb-4 flex items-center">
          <span className="bg-gradient-to-r from-blue-500 to-orange-500 text-transparent bg-clip-text">
            WareTech
          </span>
        </h4>
        <div className="space-y-2 md:space-y-3">
          <p className="flex items-start text-xs sm:text-sm">
            <FaMapMarkerAlt className="w-3 h-3 mt-0.5 mr-2 flex-shrink-0" />
            <span>123 Đường Công Nghệ, Quận IT, TP.HCM</span>
          </p>
          <p className="flex items-center text-xs sm:text-sm">
            <FaEnvelope className="w-3 h-3 mr-2 flex-shrink-0" />
            <span>support@waretech.vn</span>
          </p>
          <p className="flex items-center text-xs sm:text-sm">
            <FaPhoneAlt className="w-3 h-3 mr-2 flex-shrink-0" />
            <span>1900 1234</span>
          </p>
        </div>
      </div>

      {/* Column 2: About Us */}
      <div>
        <h5 className="text-white text-base md:text-lg font-semibold mb-3 md:mb-4 pb-2 border-b border-gray-700">
          Về chúng tôi
        </h5>
        <ul className="space-y-2 md:space-y-3">
          {["Giới thiệu", "Tuyển dụng", "Tin tức", "Hệ thống cửa hàng"].map(
            (item) => (
              <motion.li
                key={item}
                whileHover={{ x: 5 }}
                className="hover:text-orange-400 cursor-pointer transition-colors flex items-center text-xs sm:text-sm"
              >
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400 rounded-full mr-2"></span>
                {item}
              </motion.li>
            )
          )}
        </ul>
      </div>

      {/* Column 3: Customer Support */}
      <div>
        <h5 className="text-white text-base md:text-lg font-semibold mb-3 md:mb-4 pb-2 border-b border-gray-700">
          Hỗ trợ khách hàng
        </h5>
        <ul className="space-y-2 md:space-y-3">
          {[
            "Chính sách bảo hành",
            "Hướng dẫn mua hàng",
            "Thanh toán",
            "Vận chuyển",
            "Đổi trả",
            "Câu hỏi thường gặp",
          ].map((item) => (
            <motion.li
              key={item}
              whileHover={{ x: 5 }}
              className="hover:text-orange-400 cursor-pointer transition-colors flex items-center text-xs sm:text-sm"
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400 rounded-full mr-2"></span>
              {item}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Column 4: Social & Payment */}
      <div className="col-span-2 sm:col-span-1">
        <div className="mb-4 md:mb-6">
          <h5 className="text-white text-base md:text-lg font-semibold mb-3 md:mb-4 pb-2 border-b border-gray-700">
            Kết nối với chúng tôi
          </h5>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {[
              {
                icon: <FaFacebook />,
                color: "text-blue-500",
                name: "Facebook",
              },
              {
                icon: <FaInstagram />,
                color: "text-pink-500",
                name: "Instagram",
              },
              { icon: <FaYoutube />, color: "text-red-500", name: "YouTube" },
              { icon: <FaTiktok />, color: "text-gray-200", name: "TikTok" },
            ].map((social) => (
              <motion.a
                key={social.name}
                href="#"
                whileHover={{ y: -3 }}
                className={`text-xl md:text-2xl ${social.color} hover:opacity-80 transition-opacity flex flex-col items-center`}
                aria-label={social.name}
              >
                {social.icon}
                <span className="text-xs mt-0.5 md:mt-1 text-gray-400">
                  {social.name}
                </span>
              </motion.a>
            ))}
          </div>
        </div>

        <div>
          <h5 className="text-white text-base md:text-lg font-semibold mb-2 md:mb-3 pb-2 border-b border-gray-700">
            Thanh toán
          </h5>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2">
            {[
              {
                img: "https://img.mservice.io/momo-payment/icon/images/logo512.png",
                alt: "MoMo",
              },
              {
                img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png",
                alt: "PayPal",
              },
              {
                img: "https://cdn-icons-png.flaticon.com/512/2489/2489138.png",
                alt: "COD",
              },
            ].map((method) => (
              <motion.div
                key={method.alt}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-0.5 sm:p-1 rounded-md shadow-sm flex items-center justify-center h-8 sm:h-10"
              >
                <img
                  src={method.img}
                  alt={method.alt}
                  className="h-full object-contain"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="border-t border-gray-800 mt-8 md:mt-12 pt-4 md:pt-6 text-center text-xs sm:text-sm">
      <p>© 2025 WareTech. Hệ thống bán sản phẩm trực tuyến</p>
    </div>
  </footer>
);

export default Footer;
