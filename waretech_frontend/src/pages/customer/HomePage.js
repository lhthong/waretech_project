import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import * as FaIcons from "react-icons/fa";
import AppleLogo from "../../assets/images/Apple_Logo.png";
import SamsungLogo from "../../assets/images/Samsung_Logo.png";
import DellLogo from "../../assets/images/Dell_Logo.png";
import AsusLogo from "../../assets/images/ASUS_Logo.png";
import SonyLogo from "../../assets/images/Sony-Logo.png";
import HpLogo from "../../assets/images/HP_Logo.png";
import LenovoLogo from "../../assets/images/Lenovo_Logo.png";
import XiaomiLogo from "../../assets/images/Xiaomi_Logo.png";
import { getCategories } from "../../services/CategoryApi";
import { getFeaturedProducts } from "../../services/FeaturedProductApi";
import { getImageUrl } from "../../services/ProductImageApi";
import { getActiveBanners } from "../../services/BannerApi";
import { addCart } from "../../services/CartApi";
import { refetchCartItemCount } from "../../components/customer/layouts/Header";
import { toast } from "react-toastify";

// Hằng số cho thời gian chuyển đổi và hiệu ứng banner
const BANNER_INTERVAL = 8000;
const BANNER_TRANSITION = { duration: 1 };
const BUTTON_TRANSITION = { duration: 0.8 };

const HeroSection = () => {
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const activeBanners = await getActiveBanners();
        const formattedBanners = activeBanners.map((banner) => ({
          ...banner,
          image_url: getImageUrl(banner.image_url),
        }));
        setBanners(formattedBanners);
      } catch (error) {
        console.error("Lỗi khi tải danh sách banner:", error);
        setBanners([]);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, BANNER_INTERVAL);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <section className="relative h-[280px] xs:h-[320px] sm:h-[400px] md:h-[480px] overflow-hidden">
      {banners.map((banner, i) => (
        <motion.div
          key={banner.id || i}
          initial={{ opacity: 0 }}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={BANNER_TRANSITION}
          className="absolute inset-0 h-full w-full bg-center bg-cover"
          style={{ backgroundImage: `url(${banner.image_url})` }}
        />
      ))}
      <div className="absolute inset-0 bg-black/50 z-10" />
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 mx-auto max-w-7xl text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={BUTTON_TRANSITION}
        >
          <h1 className="mb-2 xs:mb-4 sm:mb-6 text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-greatvibes font-semibold leading-tight text-white">
            <div className="mb-1 xs:mb-2 sm:mb-4 md:mb-6">
              Công nghệ <span className="text-orange-400">đỉnh cao</span>
            </div>
            <div>
              Giá cả <span className="text-orange-400">hợp lý</span>
            </div>
          </h1>
          <p className="mx-auto mb-4 xs:mb-6 sm:mb-8 max-w-2xl text-xs xs:text-sm sm:text-base md:text-lg text-white">
            Khám phá thế giới công nghệ với những sản phẩm chất lượng cao, chính
            hãng và giá tốt nhất thị trường
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full bg-orange-500 px-4 py-2 xs:px-6 xs:py-2 sm:px-8 sm:py-3 font-medium text-white shadow-lg hover:bg-orange-600 text-xs xs:text-sm sm:text-base"
            onClick={() => navigate("/shop")}
          >
            Mua ngay
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

const SectionHeader = ({ title }) => (
  <div className="mb-8 sm:mb-10 md:mb-12 text-center">
    <h2 className="bg-clip-text bg-gradient-to-r from-blue-500 to-orange-500 py-2 sm:py-3 md:py-4 font-pacifico text-2xl sm:text-3xl md:text-4xl font-semibold text-transparent">
      {title}
    </h2>
    <div className="mt-1 sm:mt-2 flex items-center justify-center gap-2">
      <div className="h-1 w-12 sm:w-16 md:w-20 rounded-full bg-orange-400 shadow-md" />
      <div className="h-3 w-3 sm:h-4 sm:w-4 animate-bounce rounded-full bg-blue-500 shadow-lg" />
      <div className="h-1 w-12 sm:w-16 md:w-20 rounded-full bg-orange-400 shadow-md" />
    </div>
  </div>
);

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) =>
    navigate(`/shop?categoryId=${categoryId}`);

  return (
    <section className="my-4 sm:my-6 md:my-8 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 sm:mb-8 md:mb-10 px-4 text-center">
          <SectionHeader title="Danh mục sản phẩm" />
          <p className="mx-auto mt-2 sm:mt-3 md:mt-4 max-w-xl text-xs sm:text-sm md:text-base text-gray-500">
            Khám phá những danh mục sản phẩm chất lượng, được lựa chọn kỹ lưỡng
            cho nhu cầu của bạn.
          </p>
        </div>
        <div className="grid grid-cols-4 xs:grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 md:gap-4">
          {categories.map((category) => {
            const Icon = FaIcons[category.icon] || FaIcons.FaBox;
            return (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleCategoryClick(category.id)}
                className="group cursor-pointer rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-200 bg-white p-2 sm:p-3 md:p-4 text-center shadow-sm sm:shadow-md transition-all hover:bg-orange-50 hover:shadow-md sm:hover:shadow-lg"
              >
                <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-2 md:space-y-3">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-md sm:rounded-lg bg-blue-50 shadow-sm transition-colors duration-300 group-hover:bg-orange-100">
                    <Icon className="text-lg sm:text-xl md:text-2xl text-blue-500 transition-colors duration-300 group-hover:text-orange-500" />
                  </div>
                  <span className="whitespace-nowrap text-xs sm:text-sm md:text-base font-medium text-gray-700 transition-colors duration-300 group-hover:text-orange-600">
                    {category.categorie_name}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({ idProduct, name, price, image, onClick }) => (
  <motion.div
    whileHover={{ y: -5 }}
    onClick={onClick}
    className="flex h-full flex-col overflow-hidden rounded-lg sm:rounded-xl bg-white shadow-sm sm:shadow-md transition-shadow hover:shadow-md sm:hover:shadow-lg"
  >
    <div className="relative bg-gray-100 pt-[100%]">
      <img
        src={image}
        alt={name}
        className="absolute left-0 top-0 h-full w-full object-cover"
        loading="lazy"
      />
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="absolute right-2 top-2 sm:right-3 sm:top-3 rounded-full bg-white p-1 sm:p-2 shadow-sm hover:bg-orange-500 hover:text-white"
        onClick={async (e) => {
          e.stopPropagation();
          try {
            await addCart({ product_id: idProduct });
            await refetchCartItemCount();
            toast.success("Đã thêm vào giỏ hàng!");
          } catch (error) {
            toast.error("Lỗi khi thêm vào giỏ hàng!");
            console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
          }
        }}
      >
        <FaShoppingCart className="text-base sm:text-lg" />
      </motion.button>
    </div>
    <div className="flex flex-grow flex-col p-2 sm:p-3 md:p-4">
      <h3 className="mb-1 text-xs sm:text-sm md:text-base break-words font-medium sm:font-semibold text-gray-800 transition-colors hover:text-blue-600 line-clamp-2">
        {name}
      </h3>
      <span className="mt-auto text-sm sm:text-base font-bold text-orange-500">
        {price.toLocaleString("vi-VN")}₫
      </span>
    </div>
  </motion.div>
);

const SkeletonCard = () => (
  <div className="h-64 sm:h-72 md:h-80 animate-pulse rounded-lg sm:rounded-xl bg-gray-200"></div>
);

const ProductSection = ({ title, type, gridCols }) => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getFeaturedProducts(type);
        if (!Array.isArray(res)) throw new Error("Dữ liệu không hợp lệ");
        const formatted = res.map((item) => ({
          id: item.id,
          idProduct: item.products?.id,
          name: item.products?.product_name || "Không rõ tên",
          price: item.products?.sell_price || 0,
          image: getImageUrl(item.products?.product_images?.[0]?.image_url),
        }));
        setProducts(formatted);
        setStatus("success");
      } catch (err) {
        console.error(
          `Lỗi khi tải danh sách ${type === "featured" ? "sản phẩm nổi bật" : "hàng mới về"}:`,
          err
        );
        setStatus("error");
      }
    };
    fetchProducts();
  }, [type]);

  const handleProductClick = (id) => navigate(`/product-detail/${id}`);

  return (
    <section
      className={`bg-${type === "featured" ? "gray-50" : "white"} mb-6 sm:mb-8 md:mb-10`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader title={title} />
        {status === "loading" && (
          <div
            className={`grid gap-3 sm:gap-4 md:gap-6 grid-cols-5 sm:grid-cols-3 md:grid-cols-5 ${gridCols}`}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}
        {status === "error" && (
          <p className="text-center text-red-500 text-sm sm:text-base">
            Không thể tải {title.toLowerCase()}
          </p>
        )}
        {status === "success" &&
          (products.length > 0 ? (
            <div
              className={`grid gap-3 sm:gap-4 md:gap-6 grid-cols-5 sm:grid-cols-5 md:grid-cols-5 ${gridCols}`}
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onClick={() => handleProductClick(product.idProduct)}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm sm:text-base">
              Không có {title.toLowerCase()} nào
            </p>
          ))}
      </div>
    </section>
  );
};

const TopBrands = () => {
  const brands = [
    { name: "Apple", logo: AppleLogo, color: "from-gray-100 to-gray-200" },
    { name: "Samsung", logo: SamsungLogo, color: "from-blue-50 to-blue-100" },
    { name: "Dell", logo: DellLogo, color: "from-blue-100 to-indigo-100" },
    { name: "Asus", logo: AsusLogo, color: "from-red-50 to-red-100" },
    { name: "Sony", logo: SonyLogo, color: "from-black to-gray-100" },
    { name: "HP", logo: HpLogo, color: "from-blue-50 to-blue-200" },
    { name: "Lenovo", logo: LenovoLogo, color: "from-red-50 to-red-200" },
    { name: "Xiaomi", logo: XiaomiLogo, color: "from-orange-50 to-orange-100" },
  ];

  return (
    <section className="my-6 sm:my-8 md:my-10 bg-gradient-to-br from-gray-50 to-gray-100 pb-6 sm:pb-8 md:pb-10 pt-3 sm:pt-4 md:pt-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader title="Thương hiệu nổi bật" />
        <div className="grid grid-cols-4 xs:grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 md:gap-4">
          {brands.map((brand, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{
                y: -8,
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
              }}
              className={`flex flex-col items-center rounded-lg sm:rounded-xl md:rounded-2xl border border-white/30 bg-gradient-to-br ${brand.color} p-2 sm:p-3 md:p-4 shadow-sm sm:shadow-md transition-all duration-300 cursor-pointer hover:shadow-md sm:hover:shadow-lg`}
            >
              <div className="mb-1 sm:mb-2 md:mb-3 h-10 sm:h-12 md:h-14 w-full p-1 sm:p-2 flex items-center justify-center">
                <motion.img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-full w-full object-contain"
                  whileHover={{ scale: 1.1 }}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "/images/default-brand.svg";
                    e.target.className =
                      "h-full w-full object-contain opacity-70";
                  }}
                />
              </div>
              <motion.span
                className="text-[10px] xs:text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-700"
                whileHover={{ color: "#f97316" }}
              >
                {brand.name}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQSection = () => {
  const [activeId, setActiveId] = useState(null);
  const faqs = [
    {
      id: 1,
      question: "Thời gian giao hàng bao lâu?",
      answer:
        "Thông thường từ 3-4 ngày đối với các tỉnh thành, và 1-2 ngày đối với nội thành Hà Nội và TP.HCM.",
      icon: "🚀",
      color: "#6C5CE7",
      bgColor: "bg-purple-100",
    },
    {
      id: 2,
      question: "Làm sao kiểm tra chính hãng?",
      answer: "Quét QR code trên tem chống giả để xác thực từ nhà sản xuất.",
      icon: "🔍",
      color: "#FF7675",
      bgColor: "bg-red-100",
    },
    {
      id: 3,
      question: "Có được đổi trả sản phẩm không?",
      answer:
        "Bạn được đổi trả trong 7 ngày nếu sản phẩm có lỗi kỹ thuật từ nhà sản xuất. Đối với đổi trả do không ưng ý, vui lòng liên hệ bộ phận CSKH để được hướng dẫn cụ thể.",
      icon: "🔄",
      color: "#00B894",
      bgColor: "bg-green-100",
    },
    {
      id: 4,
      question: "Chính sách bảo hành như thế nào?",
      answer:
        "Chúng tôi bảo hành chính hãng 12 tháng cho tất cả sản phẩm. Một số sản phẩm có thời gian bảo hành dài hơn theo quy định của nhà sản xuất.",
      icon: "🛡️",
      color: "#FDCB6E",
      bgColor: "bg-yellow-100",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-6 sm:py-8 md:py-10">
      <div className="absolute left-0 top-0 h-full w-full opacity-20">
        <div className="absolute left-10 sm:left-20 top-10 sm:top-20 h-40 sm:h-48 md:h-64 w-40 sm:w-48 md:w-64 rounded-full bg-purple-200 blur-[80px] sm:blur-[100px]" />
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 h-40 sm:h-48 md:h-64 w-40 sm:w-48 md:w-64 rounded-full bg-cyan-200 blur-[80px] sm:blur-[100px]" />
      </div>
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-10 md:mb-12 text-center"
        >
          <h2 className="pb-4 font-pacifico text-2xl sm:text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
            Câu Hỏi Thường Gặp
          </h2>
          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-gray-600">
            Giải đáp mọi thắc mắc của bạn một cách nhanh chóng
          </p>
        </motion.div>
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 md:grid-cols-2">
          {faqs.map((faq) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="relative"
            >
              <motion.div
                className={`p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 ${faq.bgColor} ${activeId === faq.id ? "ring-2 ring-offset-2" : "shadow-sm sm:shadow-md"}`}
                style={{ borderColor: faq.color }}
                onClick={() => setActiveId(activeId === faq.id ? null : faq.id)}
              >
                <div className="flex items-start">
                  <div
                    className="mr-2 sm:mr-3 md:mr-4 flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-md sm:rounded-lg text-base sm:text-lg md:text-xl"
                    style={{ background: faq.color, color: "white" }}
                  >
                    {faq.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 sm:mb-2 text-sm sm:text-base md:text-lg font-medium sm:font-semibold text-gray-800">
                      {faq.question}
                    </h3>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: activeId === faq.id ? "auto" : 0,
                        opacity: activeId === faq.id ? 1 : 0,
                      }}
                      className="overflow-hidden"
                    >
                      <p className="pt-1 sm:pt-2 text-xs sm:text-sm md:text-base text-gray-600">
                        {faq.answer}
                      </p>
                    </motion.div>
                  </div>
                  <motion.div
                    animate={{ rotate: activeId === faq.id ? 180 : 0 }}
                    className="ml-1 sm:ml-2 text-gray-500"
                  >
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function HomePageTechStore() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <main className="flex-grow">
        <HeroSection />
        <CategorySection />
        <ProductSection
          title="Sản phẩm nổi bật"
          type="featured"
          gridCols="lg:grid-cols-5"
        />
        <TopBrands />
        <ProductSection
          title="Hàng mới về"
          type="new"
          gridCols="lg:grid-cols-5"
        />
        <FAQSection />
      </main>
    </div>
  );
}
