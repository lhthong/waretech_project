import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaTimes,
  FaSignOutAlt,
  FaUserFriends,
  FaUserCircle,
  FaBars,
} from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import avatar from "../../../assets/images/WaretechLogo.png";
import { getCartByToken } from "../../../services/CartApi";
import { getCurrentUser } from "../../../services/AuthApi";
import { getImageUrl } from "../../../services/ProductImageApi";
import { searchProductsByName } from "../../../services/ProductApi";

export let refetchCartItemCount = () => {};

const Header = () => {
  const [userAvatar, setUserAvatar] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userDropdown, setUserDropdown] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const { isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: "Trang chủ", path: "/home" },
    { name: "Cửa hàng", path: "/shop" },
    { name: "Giới thiệu", path: "/about" },
    { name: "Liên hệ", path: "/contact" },
  ];

  // Xử lý click outside cho dropdown và mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdown(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated) {
        try {
          const userData = await getCurrentUser();
          setUserAvatar(userData?.avatar || null);
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
          setUserAvatar(null);
        }
      } else {
        setUserAvatar(null);
      }
    };
    fetchUserData();
  }, [isAuthenticated]);

  // Fetch cart count
  useEffect(() => {
    refetchCartItemCount = async () => {
      try {
        const cart = await getCartByToken();
        setCartItemCount(cart.length);
      } catch (error) {
        console.error("Lỗi khi làm mới giỏ hàng:", error);
        setCartItemCount(0);
      }
    };

    if (isAuthenticated) {
      refetchCartItemCount();
    }
  }, [isAuthenticated]);

  // Hàm tìm kiếm sản phẩm
  const handleSearch = async (term) => {
    if (term.length > 0) {
      try {
        const results = await searchProductsByName(term);
        setSearchResults(results);
        setShowSuggestions(true);
      } catch (error) {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  };

  // Xử lý submit search
  const handleSearchSubmit = (term) => {
    navigate(`/shop?search=${encodeURIComponent(term)}`);
    setSearchOpen(false);
    setShowSuggestions(false);
    setSearchTerm("");
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setCartItemCount(0);
    setUserDropdown(false);
    setUserAvatar(null);
    toast.success("Đăng xuất thành công!");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-5 py-0 flex justify-between items-center min-h-[56px] sm:min-h-[64px]">
        {/* Logo */}
        <Link
          to="/home"
          className="relative h-12 sm:h-14 w-[80px] sm:w-[100px] overflow-visible flex items-center"
          onClick={() => setMobileMenuOpen(false)}
        >
          <img
            src={avatar}
            alt="Waretech Logo"
            className="absolute top-7 sm:top-9 left-0 transform -translate-y-1/2 w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] object-contain hover:opacity-90 transition-opacity"
            loading="lazy"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center space-x-0 xs:space-x-1">
          {navItems.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={item.path}
                className="px-2 xs:px-3 py-1 text-sm xs:text-sm rounded-md text-gray-700 hover:text-orange-500 font-medium uppercase transition-colors whitespace-nowrap"
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Icons Section */}
        <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-4 text-gray-600">
          {/* Search */}
          {searchOpen ? (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 160 }}
              className="relative flex items-center bg-gray-100 rounded-full h-8 sm:h-9 overflow-visible"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearchSubmit(searchTerm);
                }}
                className="flex-1 flex"
              >
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  placeholder="Tìm kiếm..."
                  className="w-full px-3 sm:px-4 text-xs sm:text-sm bg-transparent outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setShowSuggestions(false);
                    setSearchTerm("");
                  }}
                  className="px-2 text-gray-500 hover:text-orange-500"
                >
                  <FaTimes className="text-xs sm:text-sm" />
                </button>
              </form>

              {/* Search Suggestions */}
              {showSuggestions && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                >
                  <div className="py-1">
                    {searchResults.slice(0, 5).map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSearchSubmit(product.product_name)}
                        className="block w-full px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 text-left"
                      >
                        {product.product_name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearchOpen(true)}
              className="p-1 sm:p-2 hover:text-orange-500"
            >
              <FaSearch className="text-base sm:text-lg" />
            </motion.button>
          )}

          {/* Cart */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              navigate("/cart");
              setMobileMenuOpen(false);
            }}
            className="relative p-1 sm:p-2 hover:text-orange-500"
          >
            <FaShoppingCart className="text-base sm:text-lg" />
            {isAuthenticated && cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] xs:text-xs w-4 h-4 xs:w-5 xs:h-5 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            )}
          </motion.button>

          {/* User Section */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setUserDropdown(!userDropdown)}
                className="p-1 sm:p-2 hover:text-orange-500"
              >
                {userAvatar ? (
                  <img
                    src={getImageUrl(userAvatar)}
                    alt="User Avatar"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-blue-500"
                    loading="lazy"
                  />
                ) : (
                  <FaUser className="text-base sm:text-lg" />
                )}
              </motion.button>

              {userDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-10 sm:top-11 mt-2 w-32 sm:w-36 bg-white border border-gray-200 sm:border-2 rounded-md sm:rounded-lg shadow-md sm:shadow-lg z-50"
                >
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate("/customer-account");
                        setUserDropdown(false);
                      }}
                      className="flex items-center w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    >
                      <FaUserCircle className="mr-2" />
                      Tài khoản
                    </button>
                    <div className="border-t border-gray-300 my-1"></div>
                    {(role === "admin" || role === "staff") && (
                      <button
                        onClick={() => {
                          navigate("/members");
                          setUserDropdown(false);
                        }}
                        className="flex items-center w-full text-left px-3 py-2 text-xs sm:text-sm text-blue-600 hover:bg-orange-50 hover:text-orange-600"
                      >
                        <FaUserFriends className="mr-2" />
                        Trang nội bộ
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-3 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50"
                    >
                      <FaSignOutAlt className="mr-2 text-red-500" />
                      Đăng xuất
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/login")}
              className="p-1 sm:p-2 text-sm sm:text-md text-gray-700 hover:text-orange-500 font-medium whitespace-nowrap"
            >
              Đăng nhập
            </motion.button>
          )}

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-orange-500"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-white shadow-md sm:hidden z-40"
          ref={mobileMenuRef}
        >
          <div className="px-4 py-2">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="block px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-orange-50 hover:text-orange-500 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
