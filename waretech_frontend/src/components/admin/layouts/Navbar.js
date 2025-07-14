import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { changePassword, getCurrentUser } from "../../../services/AuthApi";
import avatar from "../../../assets/images/WaretechLogo.png";
import { getImageUrl } from "../../../services/ProductImageApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileModal from "../../modals/ProfileModal";
import {
  faBars,
  faSignOutAlt,
  faKey,
  faTimes,
  faStore,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setDropdownOpen(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        setUserAvatar(userData?.avatar || null);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !isModalOpen &&
        !showChangePassword
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen, isModalOpen, showChangePassword]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return setError("Mật khẩu mới và xác nhận mật khẩu không khớp!");
    }

    try {
      await changePassword(formData.oldPassword, formData.newPassword);
      alert("Mật khẩu đã được cập nhật!");
      setShowChangePassword(false);
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setError("");
    } catch (error) {
      setError("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-white h-16 flex items-center px-4 sm:px-6 fixed top-0 left-0 w-full z-50 border-b border-gray-200 shadow-md">
      <div className="flex items-center flex-1">
        <Link to="/members">
          <img
            src={avatar}
            alt="Avatar"
            className="w-16 sm:w-20 md:w-24 mt-3 h-auto object-contain cursor-pointer"
          />
        </Link>
        <FontAwesomeIcon
          icon={faBars}
          className="ml-4 sm:ml-16 sm:pl-16 text-xl sm:text-2xl md:text-3xl text-[#012970] cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      <div className="flex items-center relative">
        <img
          src={getImageUrl(userAvatar)}
          alt="User Avatar"
          className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover cursor-pointer border-2 border-blue-500"
          onClick={toggleDropdown}
        />
        {dropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-12 sm:top-12 right-0 w-48 bg-white border border-gray-400 shadow-lg rounded-lg z-50"
          >
            <button
              className="flex items-center w-full px-3 sm:px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 text-sm sm:text-base"
              onClick={() => setIsModalOpen(true)}
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Tài khoản
            </button>
            <ProfileModal isOpen={isModalOpen} onClose={handleModalClose} />
            <button
              className="flex items-center w-full px-3 sm:px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 text-sm sm:text-base"
              onClick={() => {
                navigate("/home");
                setDropdownOpen(false);
              }}
            >
              <FontAwesomeIcon icon={faStore} className="mr-2" />
              Trang khách hàng
            </button>
            <button
              className="flex items-center w-full px-3 sm:px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 text-sm sm:text-base"
              onClick={() => {
                setShowChangePassword(true);
                setDropdownOpen(false);
              }}
            >
              <FontAwesomeIcon icon={faKey} className="mr-2" />
              Đổi mật khẩu
            </button>
            <button
              className="flex items-center w-full px-3 sm:px-4 py-2 text-red-500 hover:bg-gray-100 text-sm sm:text-base"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              Đăng xuất
            </button>
          </div>
        )}
      </div>

      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">Đổi mật khẩu</h2>
              <FontAwesomeIcon
                icon={faTimes}
                className="text-gray-600 cursor-pointer text-base sm:text-lg"
                onClick={() => setShowChangePassword(false)}
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <form onSubmit={handleChangePassword}>
              <input
                type="password"
                name="oldPassword"
                placeholder="Mật khẩu cũ"
                value={formData.oldPassword}
                onChange={handleChange}
                className="w-full border p-2 mb-2 rounded text-sm sm:text-base"
                required
              />
              <input
                type="password"
                name="newPassword"
                placeholder="Mật khẩu mới"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full border p-2 mb-2 rounded text-sm sm:text-base"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu mới"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border p-2 mb-2 rounded text-sm sm:text-base"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="bg-gray-500 text-white px-3 py-1 rounded text-sm sm:text-base"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm sm:text-base"
                >
                  Đổi mật khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
