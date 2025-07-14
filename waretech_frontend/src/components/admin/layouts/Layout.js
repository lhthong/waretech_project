import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "../../../utils/ScrollToTop";
import ScrollToTopButton from "../buttons/ScrollToTopButton";
import { useSession } from "../../../context/SessionContext";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(true); // Trạng thái Sidebar
  const { expiredSession, hideExpiredSession } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra xem route có được bảo vệ (các route admin) không
  const isProtectedRoute = [
    "/products",
    "/members",
    "/product-categories",
    "/stats",
    "/warehouse_overview",
    "/product_warehouse",
    "/feedbacks",
  ].some((path) => location.pathname.startsWith(path));

  // Chuyển hướng đến trang đăng nhập nếu phiên hết hạn trên các route được bảo vệ
  useEffect(() => {
    if (expiredSession && isProtectedRoute) {
      navigate("/login");
    }
  }, [expiredSession, isProtectedRoute, navigate]);

  // Xử lý sidebar responsive dựa trên kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 1024); // Hiển thị sidebar theo mặc định trên màn hình lớn (1024px) trở lên
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Đóng sidebar khi thay đổi route cho thiết bị di động
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [location]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Nội dung chính */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          isOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        {/* Navbar */}
        <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
        <ScrollToTop />

        {/* Nội dung chính */}
        <main className="flex-1 bg-[#F1F4FC] p-4 sm:p-6 sm:ml-6 mt-16 overflow-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />

        {/* Nút cuộn lên trên */}
        <ScrollToTopButton />
      </div>

      {/* Modal thông báo hết phiên đăng nhập */}
      {expiredSession && isProtectedRoute && (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-xs sm:max-w-sm p-4 bg-red-600 text-white rounded-lg shadow-lg md:p-6">
          <p className="text-sm sm:text-base">
            Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.
          </p>
          <button
            onClick={hideExpiredSession}
            className="mt-2 text-sm sm:text-base underline hover:text-gray-200"
          >
            Đóng
          </button>
        </div>
      )}
    </div>
  );
};

export default Layout;
