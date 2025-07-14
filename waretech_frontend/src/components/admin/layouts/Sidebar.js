import { Link } from "react-router-dom";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleRight } from "@fortawesome/free-regular-svg-icons";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [dropDownMenu, setDropDownMenu] = useState(false);
  const [dropDownWarehouse, setDropDownWarehouse] = useState(false);
  const [dropDownFaq, setDropDownFaq] = useState(false);

  return (
    <aside
      className={`fixed top-16 left-0 h-full bg-white p-4 shadow-md transition-transform duration-300 z-40 w-64 lg:w-72 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <ul className="mt-4 space-y-2">
        <li>
          <Link
            to="/members"
            className="block p-3 rounded bg-[#E1E9FF] text-blue-500 font-medium hover:text-orange-500 hover:bg-orange-100 text-sm md:text-base"
            onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
          >
            Quản lý tài khoản
          </Link>
        </li>
        <li
          className="p-2 rounded bg-[#E1E9FF]"
          onClick={() => setDropDownMenu(!dropDownMenu)}
        >
          <div className="bg-white rounded">
            <div className="flex justify-between items-center text-blue-500 hover:text-orange-500 font-medium cursor-pointer p-2 text-sm md:text-base">
              <span>Quản lý sản phẩm</span>
              {dropDownMenu ? (
                <FaChevronUp size={12} />
              ) : (
                <FaChevronDown size={12} />
              )}
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                dropDownMenu ? "max-h-60" : "max-h-0"
              }`}
            >
              <Link
                to="/products"
                className="flex items-center text-[#3e4f6f] hover:text-orange-500 font-medium space-x-2 p-3 hover:bg-orange-100 text-sm md:text-base"
                onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
              >
                <FontAwesomeIcon
                  icon={faCircleRight}
                  className="text-blue-500 text-sm"
                />
                <span>Thông tin sản phẩm</span>
              </Link>
              <Link
                to="/product-categories"
                className="flex items-center text-[#3e4f6f] hover:text-orange-500 font-medium space-x-2 p-3 hover:bg-orange-100 text-sm md:text-base"
                onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
              >
                <FontAwesomeIcon
                  icon={faCircleRight}
                  className="text-blue-500 text-sm"
                />
                <span>Danh mục & ngưỡng kho</span>
              </Link>
              <Link
                to="/product-images"
                className="flex items-center text-[#3e4f6f] hover:text-orange-500 font-medium space-x-2 p-3 hover:bg-orange-100 text-sm md:text-base"
                onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
              >
                <FontAwesomeIcon
                  icon={faCircleRight}
                  className="text-blue-500 text-sm"
                />
                <span>Hình ảnh sản phẩm</span>
              </Link>
              <Link
                to="/product-features"
                className="flex items-center text-[#3e4f6f] hover:text-orange-500 font-medium space-x-2 p-3 hover:bg-orange-100 text-sm md:text-base"
                onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
              >
                <FontAwesomeIcon
                  icon={faCircleRight}
                  className="text-blue-500 text-sm"
                />
                <span>Đặc trưng sản phẩm</span>
              </Link>
            </div>
          </div>
        </li>
        <li
          className="p-2 rounded bg-[#E1E9FF]"
          onClick={() => setDropDownWarehouse(!dropDownWarehouse)}
        >
          <div className="bg-white rounded">
            <div className="flex justify-between items-center text-blue-500 hover:text-orange-500 font-medium cursor-pointer p-2 text-sm md:text-base">
              <span>Quản lý kho</span>
              {dropDownWarehouse ? (
                <FaChevronUp size={12} />
              ) : (
                <FaChevronDown size={12} />
              )}
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                dropDownWarehouse ? "max-h-40" : "max-h-0"
              }`}
            >
              <Link
                to="/product_warehouse"
                className="flex items-center text-[#3e4f6f] hover:text-orange-500 font-medium space-x-2 p-3 hover:bg-orange-100 text-sm md:text-base"
                onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
              >
                <FontAwesomeIcon
                  icon={faCircleRight}
                  className="text-blue-500 text-sm"
                />
                <span>Nhập xuất kho</span>
              </Link>
              <Link
                to="/warehouse_overview"
                className="flex items-center text-[#3e4f6f] hover:text-orange-500 font-medium space-x-2 p-3 hover:bg-orange-100 text-sm md:text-base"
                onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
              >
                <FontAwesomeIcon
                  icon={faCircleRight}
                  className="text-blue-500 text-sm"
                />
                <span>Tổng quan kho hàng</span>
              </Link>
              <Link
                to="/suppliers"
                className="flex items-center text-[#3e4f6f] hover:text-orange-500 font-medium space-x-2 p-3 hover:bg-orange-100 text-sm md:text-base"
                onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
              >
                <FontAwesomeIcon
                  icon={faCircleRight}
                  className="text-blue-500 text-sm"
                />
                <span>Nhà cung cấp</span>
              </Link>
            </div>
          </div>
        </li>
        <li
          className="p-2 rounded bg-[#E1E9FF]"
          onClick={() => setDropDownFaq(!dropDownFaq)}
        >
          <div className="bg-white rounded">
            <div className="flex justify-between items-center text-blue-500 hover:text-orange-500 font-medium cursor-pointer p-2 text-sm md:text-base">
              <span>Chăm sóc Khách hàng</span>
              {dropDownFaq ? (
                <FaChevronUp size={12} />
              ) : (
                <FaChevronDown size={12} />
              )}
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                dropDownFaq ? "max-h-40" : "max-h-0"
              }`}
            >
              <Link
                to="/feedbacks"
                className="flex items-center text-[#3e4f6f] hover:text-orange-500 font-medium space-x-2 p-3 hover:bg-orange-100 text-sm md:text-base"
                onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
              >
                <FontAwesomeIcon
                  icon={faCircleRight}
                  className="text-blue-500 text-sm"
                />
                <span>Quản lý phản hồi</span>
              </Link>
              <Link
                to="/faqs"
                className="flex items-center text-[#3e4f6f] hover:text-orange-500 font-medium space-x-2 p-3 hover:bg-orange-100 text-sm md:text-base"
                onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
              >
                <FontAwesomeIcon
                  icon={faCircleRight}
                  className="text-blue-500 text-sm"
                />
                <span>Quản lý chatbot</span>
              </Link>
            </div>
          </div>
        </li>
        <li>
          <Link
            to="/banners"
            className="block p-3 rounded bg-[#E1E9FF] text-blue-500 font-medium hover:text-orange-500 hover:bg-orange-100 text-sm md:text-base"
            onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
          >
            Quản lý banner
          </Link>
        </li>
        <li>
          <Link
            to="/orders"
            className="block p-3 rounded bg-[#E1E9FF] text-blue-500 font-medium hover:text-orange-500 hover:bg-orange-100 text-sm md:text-base"
            onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
          >
            Quản lý đơn hàng
          </Link>
        </li>
        <li>
          <Link
            to="/stats"
            className="block p-3 rounded bg-[#E1E9FF] text-blue-500 font-medium hover:text-orange-500 hover:bg-orange-100 text-sm md:text-base"
            onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
          >
            Thống kê
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
