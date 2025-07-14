import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LogOut,
  User,
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Edit,
  Check,
  X,
  Truck,
  CheckCircle,
  Clock,
  Circle,
  ArrowRight,
  Camera,
  UserCircle,
  Heart,
  ChevronDown,
} from "lucide-react";
import { getImageUrl } from "../../services/ProductImageApi";
import { getCurrentUser, updateUser, logout } from "../../services/AuthApi";
import { getOrdersByUserId, updateOrderStatus } from "../../services/OrderApi";

const CustomerAccountPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [orderFilter, setOrderFilter] = useState("all");
  const fileInputRef = useRef(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [ordersError, setOrdersError] = useState(null);

  // Thông tin cá nhân
  const [userInfo, setUserInfo] = useState({
    iduser: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: null,
    gender: "",
    username: "",
  });

  const [tempInfo, setTempInfo] = useState({
    ...userInfo,
    gender: userInfo.gender || "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  // Dữ liệu đơn hàng động
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "orders") {
      setActiveTab("orders");
    }
  }, [location.search]);
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          const newUserInfo = {
            iduser: userData.iduser || "",
            name: userData.fullname || "",
            email: userData.username || "",
            phone: userData.phone || "",
            address: userData.address || "",
            avatar: userData.avatar || null,
            gender: userData.gender || "",
            username: userData.username || "",
          };
          setUserInfo(newUserInfo);
          setTempInfo({
            ...newUserInfo,
            gender: userData.gender || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Fetch orders when activeTab is "orders" or userInfo.iduser changes
  useEffect(() => {
    if (activeTab === "orders" && userInfo.iduser) {
      // Định nghĩa ánh xạ trạng thái và phương thức vận chuyển
      const statusMap = {
        choxacnhan: "pending",
        daxacnhan: "confirmed",
        danggiao: "shipping",
        hoanthanh: "completed",
        dahuy: "cancelled",
      };

      const shippingMethodMap = {
        tieuchuan: "Giao hàng tiêu chuẩn",
        nhanh: "Giao hàng nhanh",
      };

      const fetchOrders = async () => {
        setOrdersError(null);
        try {
          const ordersData = await getOrdersByUserId(userInfo.iduser);
          // Chuyển đổi dữ liệu đơn hàng từ API
          const formattedOrders = ordersData.map((order) => ({
            id: order.id,
            ma_don_hang: order.ma_don_hang,
            date: order.created_at,
            status: statusMap[order.trang_thai],
            total: order.tong_tien,
            items: order.order_details.length,
            shippingMethod:
              shippingMethodMap[order.shipping_info?.shipping_method],
          }));
          setOrders(formattedOrders);
        } catch (error) {
          console.error("Lỗi khi tải đơn hàng:", error);
          setOrdersError("Không thể tải đơn hàng, vui lòng thử lại.");
        }
      };

      fetchOrders();
    }
  }, [activeTab, userInfo.iduser]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Xử lý thay đổi avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
        setAvatarFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Xử lý cập nhật thông tin cá nhân
  const handleSave = async () => {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      const formData = new FormData();
      if (tempInfo.name) formData.append("fullname", tempInfo.name);
      if (tempInfo.phone) formData.append("phone", tempInfo.phone);
      if (tempInfo.gender) formData.append("gender", tempInfo.gender);
      if (tempInfo.address) formData.append("address", tempInfo.address);
      if (avatarFile) formData.append("avatar", avatarFile);

      const updatedUser = await updateUser(formData);

      const newUserInfo = {
        ...userInfo,
        name: updatedUser.user.fullname || userInfo.name,
        phone: updatedUser.user.phone || userInfo.phone,
        gender: updatedUser.user.gender || userInfo.gender,
        address: updatedUser.user.address || userInfo.address,
        avatar: updatedUser.user.avatar || userInfo.avatar,
      };

      setUserInfo(newUserInfo);
      setTempInfo(newUserInfo);
      setEditMode(false);
      setAvatarPreview(null);
      setAvatarFile(null);
    } catch (error) {
      console.error("Update user error:", error);
      setUpdateError(
        error.response?.data?.message ||
          "Lỗi khi cập nhật thông tin, vui lòng thử lại"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setTempInfo(userInfo);
    setEditMode(false);
    setAvatarPreview(null);
    setAvatarFile(null);
    setUpdateError(null);
  };

  // Xử lý hủy đơn hàng
  const handleCancelOrder = async (orderId) => {
    if (!orderId) {
      console.error("Order ID is missing");
      return;
    }

    if (window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) {
      try {
        console.log("Cancelling order with ID:", orderId);

        // Gọi API cập nhật trạng thái
        await updateOrderStatus(orderId, "dahuy");

        // Cập nhật state local
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  trang_thai: "dahuy",
                  status: "cancelled",
                }
              : order
          )
        );
        setOrdersError(null);
      } catch (error) {
        console.error("Error cancelling order:", error);
        setOrdersError("Không thể hủy đơn hàng, vui lòng thử lại.");
      }
    }
  };

  // Xử lý đơn hàng
  const filteredOrders =
    orderFilter === "all"
      ? orders
      : orders.filter((order) => order.status === orderFilter);

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="h-4 w-4 text-yellow-500" />,
          text: "Chờ xác nhận",
          color: "bg-yellow-100 text-yellow-800",
        };
      case "confirmed":
        return {
          icon: <Check className="h-4 w-4 text-blue-500" />,
          text: "Đã xác nhận",
          color: "bg-blue-100 text-blue-800",
        };
      case "shipping":
        return {
          icon: <Truck className="h-4 w-4 text-purple-500" />,
          text: "Đang giao hàng",
          color: "bg-purple-100 text-purple-800",
        };
      case "completed":
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          text: "Đã giao hàng",
          color: "bg-green-100 text-green-800",
        };
      case "cancelled":
        return {
          icon: <X className="h-4 w-4 text-red-500" />,
          text: "Đã hủy",
          color: "bg-red-100 text-red-800",
        };
      default:
        return {
          icon: <Circle className="h-4 w-4 text-gray-500" />,
          text: "Không xác định",
          color: "bg-gray-100 text-gray-800",
        };
    }
  };

  const formatCurrency = (v) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(v);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Sidebar Navigation */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 h-fit lg:sticky lg:top-20">
          <div className="flex flex-col items-center mb-3 sm:mb-4">
            <div className="relative mb-2 sm:mb-3">
              {userInfo.avatar ? (
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-gray-200 sm:border-2">
                  <img
                    src={getImageUrl(userInfo.avatar)}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <UserCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
              )}
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate max-w-full px-1">
              {userInfo.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              {userInfo.username}
            </p>
          </div>

          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            Tài khoản của tôi
          </h2>

          <nav className="space-y-1 sm:space-y-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === "profile"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                <User className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3 text-blue-500" />
                Thông tin cá nhân
              </div>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === "orders"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3 text-blue-500" />
                Đơn hàng của tôi
              </div>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </nav>

          <button
            onClick={handleLogout}
            className="w-full flex items-center mt-4 sm:mt-6 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3" />
            Đăng xuất
          </button>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          {/* Profile Section */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Thông tin cá nhân
                </h2>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="inline-flex items-center text-xs sm:text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-blue-500" />
                    Chỉnh sửa
                  </button>
                )}
              </div>

              {editMode ? (
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Avatar Upload Section */}
                  <div className="flex flex-col items-center">
                    <div className="relative mb-3 sm:mb-4">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border sm:border-2 border-gray-200 bg-gray-100">
                        {avatarPreview || userInfo.avatar ? (
                          <img
                            src={avatarPreview || getImageUrl(userInfo.avatar)}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserCircle className="w-full h-full text-gray-400" />
                        )}
                      </div>
                      <button
                        onClick={triggerFileInput}
                        className="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-gray-300 cursor-pointer hover:bg-gray-100"
                      >
                        <Camera className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>
                    <button
                      onClick={triggerFileInput}
                      className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {avatarPreview || userInfo.avatar
                        ? "Cập nhật ảnh"
                        : "Chọn ảnh"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Họ tên
                      </label>
                      <input
                        type="text"
                        value={tempInfo.name}
                        onChange={(e) =>
                          setTempInfo({ ...tempInfo, name: e.target.value })
                        }
                        className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="relative">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Giới tính
                      </label>
                      <select
                        value={tempInfo.gender}
                        onChange={(e) =>
                          setTempInfo({ ...tempInfo, gender: e.target.value })
                        }
                        className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md appearance-none pr-7"
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                      </select>
                      <ChevronDown className="absolute right-2 sm:right-3 bottom-1.5 sm:bottom-2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={tempInfo.email}
                        disabled
                        className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={tempInfo.phone}
                        onChange={(e) =>
                          setTempInfo({ ...tempInfo, phone: e.target.value })
                        }
                        className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Địa chỉ
                      </label>
                      <textarea
                        value={tempInfo.address}
                        onChange={(e) =>
                          setTempInfo({ ...tempInfo, address: e.target.value })
                        }
                        rows={3}
                        className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {updateError && (
                    <div className="text-red-500 text-xs sm:text-sm mt-2">
                      {updateError}
                    </div>
                  )}

                  <div className="flex justify-end space-x-2 sm:space-x-3 pt-3 sm:pt-4">
                    <button
                      onClick={handleCancel}
                      disabled={isUpdating}
                      className="px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                      Hủy
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isUpdating}
                      className="px-3 sm:px-4 py-1 sm:py-2 border border-transparent rounded-md text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isUpdating ? (
                        <>
                          <span className="inline-block animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-t-2 border-b-2 border-white mr-1"></span>
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <Check className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                          Lưu thay đổi
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 sm:p-6">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center mb-4 sm:mb-6">
                    <div className="relative group">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border sm:border-2 border-white shadow-sm ring-1 ring-gray-200 bg-gradient-to-br from-gray-100 to-gray-50">
                        {userInfo.avatar ? (
                          <img
                            src={getImageUrl(userInfo.avatar)}
                            alt="Avatar"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <UserCircle className="w-full h-full text-gray-300" />
                        )}
                      </div>
                    </div>
                    <h2 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-gray-800">
                      {userInfo.name}
                    </h2>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      {userInfo.username}
                    </p>
                  </div>

                  {/* Personal Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Name Card */}
                    <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="flex-shrink-0 bg-blue-50 p-2 sm:p-3 rounded-md sm:rounded-lg">
                          <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Họ tên
                          </h3>
                          <p className="mt-1 text-sm sm:text-base text-gray-800 font-medium">
                            {userInfo.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Gender Card */}
                    <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="flex-shrink-0 bg-blue-50 p-2 sm:p-3 rounded-md sm:rounded-lg">
                          <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Giới tính
                          </h3>
                          <p className="mt-1 text-sm sm:text-base text-gray-800 font-medium">
                            {userInfo.gender === "male"
                              ? "Nam"
                              : userInfo.gender === "female"
                                ? "Nữ"
                                : "Khác"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Email Card */}
                    <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="flex-shrink-0 bg-blue-50 p-2 sm:p-3 rounded-md sm:rounded-lg">
                          <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </h3>
                          <p className="mt-1 text-sm sm:text-base text-gray-800 font-medium">
                            {userInfo.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Phone Card */}
                    <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="flex-shrink-0 bg-green-50 p-2 sm:p-3 rounded-md sm:rounded-lg">
                          <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                        </div>
                        <div>
                          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Điện thoại
                          </h3>
                          <p className="mt-1 text-sm sm:text-base text-gray-800 font-medium">
                            {userInfo.phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Address Card */}
                    <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow sm:col-span-2">
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <div className="flex-shrink-0 bg-purple-50 p-2 sm:p-3 rounded-md sm:rounded-lg">
                          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Địa chỉ
                          </h3>
                          <p className="mt-1 text-sm sm:text-base text-gray-800 font-medium">
                            {userInfo.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Orders Section */}
          {activeTab === "orders" && (
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    Đơn hàng của tôi
                  </h2>

                  {/* Order Status Filter */}
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-0 overflow-x-auto pb-2 sm:pb-0">
                    {[
                      { key: "all", label: "Tất cả" },
                      { key: "pending", label: "Chờ xác nhận" },
                      { key: "confirmed", label: "Đã xác nhận" },
                      { key: "shipping", label: "Đang giao" },
                      { key: "completed", label: "Hoàn thành" },
                      { key: "cancelled", label: "Đã hủy" },
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setOrderFilter(item.key)}
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          orderFilter === item.key
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {ordersError && (
                  <div className="text-red-500 text-xs sm:text-sm mb-3 sm:mb-4">
                    {ordersError}
                  </div>
                )}

                <div className="space-y-3 sm:space-y-4">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => {
                      const statusInfo = getStatusInfo(order.status);
                      return (
                        <div
                          key={order.ma_don_hang}
                          className="bg-white rounded-lg sm:rounded-xl border p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 shadow-sm hover:shadow-md transition"
                        >
                          {/* Order Icon */}
                          <div className="w-full sm:w-16 flex items-center justify-center sm:justify-start">
                            <ShoppingBag
                              className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500"
                              aria-label="Biểu tượng đơn hàng"
                            />
                          </div>

                          {/* Order Content */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                              <div>
                                <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                                  Đơn hàng{" "}
                                  <span className="text-orange-600">
                                    #{order.ma_don_hang}
                                  </span>
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                  Ngày đặt: {formatDate(order.date)}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                  Sản phẩm: {order.items}
                                </p>
                              </div>
                              <div
                                className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                              >
                                {statusInfo.icon}
                                <span className="ml-1">{statusInfo.text}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm mt-3 sm:mt-4">
                              <div>
                                <p className="text-gray-500">Giao hàng</p>
                                <p className="text-blue-600 font-medium">
                                  {order.shippingMethod}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Tổng tiền</p>
                                <p className="font-semibold text-orange-600">
                                  {formatCurrency(order.total)}
                                </p>
                              </div>
                              <div className="flex gap-1 sm:gap-2 justify-end items-end sm:items-center">
                                {order.status === "pending" && (
                                  <button
                                    onClick={() => handleCancelOrder(order.id)}
                                    className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 border border-red-300 rounded-md text-xs sm:text-sm whitespace-nowrap font-medium text-red-700 bg-white hover:bg-red-50"
                                  >
                                    <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    Hủy đơn
                                  </button>
                                )}
                                <Link
                                  to={`/order-detail/${order.id}`}
                                  className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm whitespace-nowrap font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  Xem chi tiết{" "}
                                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <ShoppingBag
                        className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-blue-500"
                        aria-label="Biểu tượng đơn hàng"
                      />
                      <h3 className="mt-3 sm:mt-4 text-sm sm:text-base font-medium text-gray-900">
                        {orderFilter === "all"
                          ? "Bạn chưa có đơn hàng nào"
                          : `Không có đơn hàng nào ở trạng thái ${getStatusInfo(
                              orderFilter
                            ).text.toLowerCase()}`}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-gray-500">
                        {orderFilter === "all"
                          ? "Khi bạn đặt hàng, thông tin đơn hàng sẽ hiển thị tại đây"
                          : "Vui lòng kiểm tra các trạng thái đơn hàng khác"}
                      </p>
                      <Link
                        to="/products"
                        className="mt-3 sm:mt-4 inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent rounded-md text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Mua sắm ngay
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerAccountPage;
