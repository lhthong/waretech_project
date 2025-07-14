import { useState, useEffect } from "react";
import axios from "axios";
import {
  CreditCard,
  Truck,
  Wallet,
  ShieldCheck,
  RefreshCw,
  Check,
  MapPin,
  AlertCircle,
  ChevronDown,
  QrCode,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCcPaypal } from "@fortawesome/free-brands-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { getCartByToken } from "../../services/CartApi";
import { getImageUrl } from "../../services/ProductImageApi";
import { addOrder } from "../../services/OrderApi";
import {
  createMomoPayment,
  createCODPayment,
  createPaypalPayment,
} from "../../services/PaymentApi";

// API key của OpenRouteService
const ORS_API_KEY = "5b3ce3597851110001cf62489ce26f2baeab44bcba1691be0fb61148";
// Địa chỉ kho hàng (tọa độ [kinh độ, vĩ độ])
const WAREHOUSE_LOCATION = [106.70463, 10.7946];

// API endpoint cho dữ liệu địa chỉ Việt Nam
const PROVINCE_API = "https://provinces.open-api.vn/api/p/";
const DISTRICT_API = "https://provinces.open-api.vn/api/d/";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State quản lý form
  const [formData, setFormData] = useState({
    recipient_name: "",
    phone: "",
    street_address: "",
    province: "",
    district: "",
    ward: "",
    note: "",
  });

  // State cho dữ liệu địa chỉ
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWards, setIsLoadingWards] = useState(false);

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [momoMethod, setMomoMethod] = useState("qr");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [distance, setDistance] = useState(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [deliveryEstimate, setDeliveryEstimate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [successMessage, setSuccessMessage] = useState(""); // Thêm state cho thông báo thành công

  // State cho thanh tiến trình
  const steps = [
    { name: "Giỏ hàng", path: "/cart", step: 1 },
    { name: "Thông tin", path: "/checkout", step: 2 },
    { name: "Hoàn tất", path: "/payment-result", step: 3 },
  ];
  const [currentStep, setCurrentStep] = useState(2); // Mặc định là bước "Thông tin" (checkout)

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (location.state?.buyNow) {
          // Trường hợp "Mua ngay": Sử dụng sản phẩm từ state
          setCartItems([location.state.product]);
        } else {
          // Trường hợp từ giỏ hàng: Lấy sản phẩm từ API
          const cartData = await getCartByToken();
          const selected = location.state?.selectedItems || [];
          const filteredItems = cartData
            .filter((item) => selected.includes(item.id))
            .map((item) => ({
              id: item.id,
              product_id: item.products.id,
              name: item.products.product_name,
              image: getImageUrl(item.products.product_images[0]?.image_url),
              price: item.products.sell_price,
              quantity: item.quantity,
            }));
          setCartItems(filteredItems);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
        setErrorMessage("Không thể tải thông tin sản phẩm");
      }
    };

    fetchCartItems();
  }, [location.state]);

  // Lấy danh sách tỉnh/thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const response = await axios.get(`${PROVINCE_API}?depth=1`);
        setProvinces(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh/thành:", error);
        setErrorMessage("Không thể tải danh sách tỉnh/thành");
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);

  // Lấy danh sách quận/huyện khi tỉnh/thành thay đổi
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!formData.province) return;

      setIsLoadingDistricts(true);
      setDistricts([]);
      setWards([]);
      setFormData((prev) => ({ ...prev, district: "", ward: "" }));

      try {
        const response = await axios.get(
          `${PROVINCE_API}${formData.province}?depth=2`
        );
        setDistricts(response.data.districts);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quận/huyện:", error);
        setErrorMessage("Không thể tải danh sách quận/huyện");
      } finally {
        setIsLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, [formData.province]);

  // Lấy danh sách phường/xã khi quận/huyện thay đổi
  useEffect(() => {
    const fetchWards = async () => {
      if (!formData.district) return;

      setIsLoadingWards(true);
      setWards([]);
      setFormData((prev) => ({ ...prev, ward: "" }));

      try {
        const response = await axios.get(
          `${DISTRICT_API}${formData.district}?depth=2`
        );
        setWards(response.data.wards);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phường/xã:", error);
        setErrorMessage("Không thể tải danh sách phường/xã");
      } finally {
        setIsLoadingWards(false);
      }
    };

    fetchWards();
  }, [formData.district]);

  // Tính toán tổng tiền
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Tính phí vận chuyển dựa trên khoảng cách và phương thức
  const calculateShippingFee = (method = shippingMethod) => {
    if (!distance) return 0;

    const baseFee = method === "express" ? 30000 : 0;
    const perKmFee = method === "express" ? 3000 : 2000;
    const calculatedFee = baseFee + Math.round(distance * perKmFee);
    return method === "express"
      ? Math.min(calculatedFee, 150000)
      : Math.min(calculatedFee, 100000);
  };

  const shippingFee = calculateShippingFee();
  const total = subtotal + shippingFee;

  // Hàm lấy tọa độ từ địa chỉ
  const geocodeAddress = async (address) => {
    try {
      const response = await axios.get(
        `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(
          address
        )}&boundary.country=VNM`
      );

      if (response.data.features && response.data.features.length > 0) {
        return response.data.features[0].geometry.coordinates;
      }
      throw new Error("Không tìm thấy tọa độ cho địa chỉ");
    } catch (error) {
      console.error("Lỗi khi geocode địa chỉ:", error);
      setErrorMessage("Không thể xác định vị trí địa chỉ giao hàng");
      return null;
    }
  };

  // Hàm tính khoảng cách giữa 2 điểm
  const calculateDistance = async (start, end) => {
    try {
      const response = await axios.post(
        `https://api.openrouteservice.org/v2/directions/driving-car`,
        {
          coordinates: [start, end],
        },
        {
          headers: {
            Authorization: ORS_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.routes && response.data.routes.length > 0) {
        return response.data.routes[0].summary.distance / 1000;
      }
      throw new Error("Không thể tính khoảng cách");
    } catch (error) {
      console.error("Lỗi khi tính khoảng cách:", error);
      setErrorMessage("Không thể tính toán khoảng cách vận chuyển");
      return null;
    }
  };

  // Tính toán khoảng cách khi địa chỉ thay đổi
  useEffect(() => {
    const calculateShipping = async () => {
      if (
        formData.province &&
        formData.district &&
        formData.ward &&
        formData.street_address
      ) {
        setIsCalculatingShipping(true);
        setDistance(null);
        setDeliveryEstimate("");
        setErrorMessage("");

        try {
          const province =
            provinces.find((p) => p.code === parseInt(formData.province))
              ?.name || "";
          const district =
            districts.find((d) => d.code === parseInt(formData.district))
              ?.name || "";
          const ward =
            wards.find((w) => w.code === parseInt(formData.ward))?.name || "";
          const fullAddress = `${formData.street_address}, ${ward}, ${district}, ${province}, Việt Nam`;
          const deliveryCoords = await geocodeAddress(fullAddress);

          if (deliveryCoords) {
            const dist = await calculateDistance(
              WAREHOUSE_LOCATION,
              deliveryCoords
            );

            if (dist) {
              setDistance(dist);
              const estimateDays =
                shippingMethod === "express"
                  ? Math.max(1, Math.ceil(dist / 150))
                  : Math.max(2, Math.ceil(dist / 80));
              setDeliveryEstimate(`${estimateDays}-${estimateDays + 1} ngày`);
            }
          }
        } catch (error) {
          console.error("Lỗi khi tính toán vận chuyển:", error);
          setErrorMessage("Có lỗi xảy ra khi tính phí vận chuyển");
        } finally {
          setIsCalculatingShipping(false);
        }
      }
    };

    calculateShipping();
  }, [
    formData.province,
    formData.district,
    formData.ward,
    formData.street_address,
    shippingMethod,
    provinces,
    districts,
    wards,
  ]);

  // Xử lý thanh toán
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (isCalculatingShipping) {
      setErrorMessage("Vui lòng đợi hệ thống tính toán phí vận chuyển");
      return;
    }

    if (errorMessage) {
      return;
    }

    setIsProcessing(true);

    try {
      // Tạo dữ liệu đơn hàng
      const province =
        provinces.find((p) => p.code === parseInt(formData.province))?.name ||
        "";
      const district =
        districts.find((d) => d.code === parseInt(formData.district))?.name ||
        "";
      const ward =
        wards.find((w) => w.code === parseInt(formData.ward))?.name || "";

      const orderData = {
        trang_thai: "choxacnhan",
        order_details: {
          create: cartItems.map((item) => ({
            product_id: item.product_id,
            so_luong: item.quantity,
          })),
        },
        shipping_info: {
          recipient_name: formData.recipient_name,
          phone: formData.phone,
          street_address: formData.street_address,
          ward,
          district,
          province,
          note: formData.note,
          shipping_method: shippingMethod,
          shipping_fee: shippingFee,
        },
      };

      // Tạo đơn hàng
      const orderResponse = await addOrder(orderData);
      const orderId = orderResponse.order.id;

      // Cập nhật bước tiến trình và hiển thị thông báo thành công
      setCurrentStep(3);
      setSuccessMessage("Đơn hàng của bạn đã được xác nhận!");

      // Tạm dừng 2 giây để người dùng thấy trạng thái "Hoàn tất"
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Xử lý thanh toán
      if (paymentMethod === "momo") {
        const paymentResponse = await createMomoPayment(orderId, momoMethod);
        if (paymentResponse.payUrl) {
          window.location.href = paymentResponse.payUrl;
        } else {
          throw new Error("Không nhận được URL thanh toán từ MoMo");
        }
      } else if (paymentMethod === "paypal") {
        const paymentResponse = await createPaypalPayment(orderId);
        if (paymentResponse.approvalUrl) {
          window.location.href = paymentResponse.approvalUrl;
        } else {
          throw new Error("Không nhận được URL thanh toán từ PayPal");
        }
      } else if (paymentMethod === "cod") {
        await createCODPayment(orderId);
        navigate(`/payment-result?orderId=${orderId}&status=success`);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý thanh toán:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi xử lý thanh toán";
      setErrorMessage(errorMsg);
      setCurrentStep(2); // Quay lại bước "Thông tin" nếu có lỗi
    } finally {
      setIsProcessing(false);
      setSuccessMessage(""); // Xóa thông báo sau khi chuyển hướng
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.recipient_name.trim())
      errors.recipient_name = "Vui lòng nhập họ & tên";
    if (!formData.phone.trim()) errors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.street_address.trim())
      errors.street_address = "Vui lòng nhập địa chỉ chi tiết";
    if (!formData.province) errors.province = "Vui lòng chọn tỉnh/thành";
    if (!formData.district) errors.district = "Vui lòng chọn quận/huyện";
    if (!formData.ward) errors.ward = "Vui lòng chọn phường/xã";

    if (formData.phone && !/^(0[0-9]{9,10})$/.test(formData.phone)) {
      errors.phone = "Số điện thoại không hợp lệ";
    }

    return errors;
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  // Xử lý điều hướng khi nhấp vào bước
  const handleStepClick = (step) => {
    if (step.step < currentStep) {
      navigate(step.path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Thanh tiến trình */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {steps.map((step, index) => {
              const isCompleted = step.step < currentStep;
              const isActive = step.step === currentStep;

              return (
                <div key={index} className="flex items-center">
                  <div
                    className={`flex flex-col items-center cursor-pointer ${
                      isActive
                        ? "text-blue-600"
                        : isCompleted
                          ? "text-orange-600"
                          : "text-gray-400"
                    } ${isCompleted ? "cursor-pointer" : "cursor-default"}`}
                    onClick={() => handleStepClick(step)}
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : isCompleted
                            ? "bg-orange-500 text-white"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : step.step}
                    </div>
                    <span className="mt-2 text-sm font-medium">
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 ${
                        step.step < currentStep ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">
          {/* Phần thông tin giao hàng và thanh toán */}
          <div className="lg:w-3/5">
            <form onSubmit={handleSubmit}>
              {/* Thông báo thành công */}
              {successMessage && (
                <div className="flex items-center bg-green-50 text-green-600 p-3 rounded-md mb-4">
                  <Check className="w-5 h-5 mr-2" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Thông báo lỗi */}
              {errorMessage && (
                <div className="flex items-center bg-red-50 text-red-600 p-3 rounded-md mb-4">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Thông tin giao hàng */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center">
                  <Truck className="mr-2 text-blue-500" />
                  Thông tin giao hàng
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ & tên*
                    </label>
                    <input
                      type="text"
                      name="recipient_name"
                      value={formData.recipient_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 text-xs sm:text-sm border rounded-md ${
                        formErrors.recipient_name
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Nguyễn Văn A"
                    />
                    {formErrors.recipient_name && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.recipient_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại*
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md ${
                        formErrors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="0912345678"
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Địa chỉ giao hàng*
                  </h3>

                  {/* Dropdown chọn Tỉnh/Thành và Quận/Huyện */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-2 sm:mb-3">
                    {/* Tỉnh/Thành phố */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tỉnh/Thành phố*
                      </label>
                      <div className="relative">
                        <select
                          name="province"
                          value={formData.province}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 text-xs sm:text-sm border rounded-md appearance-none ${
                            formErrors.province
                              ? "border-red-500"
                              : "border-gray-300"
                          } ${isLoadingProvinces ? "opacity-70" : ""}`}
                          disabled={isLoadingProvinces}
                        >
                          <option value="">Chọn tỉnh/thành</option>
                          {provinces.map((province) => (
                            <option key={province.code} value={province.code}>
                              {province.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          {isLoadingProvinces ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                      {formErrors.province && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.province}
                        </p>
                      )}
                    </div>

                    {/* Quận/Huyện */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quận/Huyện*
                      </label>
                      <div className="relative">
                        <select
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          disabled={!formData.province || isLoadingDistricts}
                          className={`w-full px-4 py-2 border rounded-md text-sm appearance-none ${
                            formErrors.district
                              ? "border-red-500"
                              : "border-gray-300"
                          } ${isLoadingDistricts ? "opacity-70" : ""} ${
                            !formData.province ? "bg-gray-100" : ""
                          }`}
                        >
                          <option value="">Chọn quận/huyện</option>
                          {districts.map((district) => (
                            <option key={district.code} value={district.code}>
                              {district.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          {isLoadingDistricts ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                      {formErrors.district && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.district}
                        </p>
                      )}
                    </div>

                    {/* Phường/Xã */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phường/Xã*
                      </label>
                      <div className="relative">
                        <select
                          name="ward"
                          value={formData.ward}
                          onChange={handleInputChange}
                          disabled={!formData.district || isLoadingWards}
                          className={`w-full px-4 py-2 border rounded-md text-sm appearance-none ${
                            formErrors.ward
                              ? "border-red-500"
                              : "border-gray-300"
                          } ${isLoadingWards ? "opacity-70" : ""} ${
                            !formData.district ? "bg-gray-100" : ""
                          }`}
                        >
                          <option value="">Chọn phường/xã</option>
                          {wards.map((ward) => (
                            <option key={ward.code} value={ward.code}>
                              {ward.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          {isLoadingWards ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                      {formErrors.ward && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.ward}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Ô nhập địa chỉ chi tiết */}
                  <div className="mt-4">
                    <div className="flex items-center mb-1">
                      <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                      <label className="text-sm text-gray-700">
                        Địa chỉ chi tiết*
                      </label>
                    </div>
                    <input
                      type="text"
                      name="street_address"
                      value={formData.street_address}
                      onChange={handleInputChange}
                      placeholder="Số nhà, tên đường, tòa nhà..."
                      className={`w-full px-4 py-2 border rounded-md ${
                        formErrors.street_address
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.street_address && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.street_address}
                      </p>
                    )}
                  </div>
                </div>
                {/* Ghi chú đơn hàng */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú đơn hàng (tùy chọn)
                  </label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="Ghi chú về đơn hàng, địa chỉ giao hàng..."
                  ></textarea>
                </div>
              </div>

              {/* Phương thức vận chuyển */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <Truck className="mr-2 text-blue-500" />
                  Phương thức vận chuyển
                </h2>

                <div className="space-y-3">
                  {/* Giao hàng tiêu chuẩn */}
                  <div
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                      shippingMethod === "standard"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => setShippingMethod("standard")}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                          shippingMethod === "standard"
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {shippingMethod === "standard" && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Giao hàng tiêu chuẩn</p>
                        <p className="text-sm text-gray-500">
                          {deliveryEstimate ||
                            "Nhận hàng trong 2-5 ngày làm việc"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Phí cơ bản: 0đ + 2,000đ/km (tối đa 100,000đ)
                        </p>
                      </div>
                    </div>
                    <span className="font-medium">
                      {isCalculatingShipping ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : shippingFee === 0 ? (
                        "Miễn phí"
                      ) : (
                        `${calculateShippingFee("standard").toLocaleString()}đ`
                      )}
                    </span>
                  </div>

                  {/* Giao hàng nhanh */}
                  <div
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                      shippingMethod === "express"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => setShippingMethod("express")}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                          shippingMethod === "express"
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {shippingMethod === "express" && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Giao hàng nhanh</p>
                        <p className="text-sm text-gray-500">
                          {deliveryEstimate || "Nhận hàng trong 1-2 ngày"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Phí cơ bản: 30,000đ + 3,000đ/km (tối đa 150,000đ)
                        </p>
                      </div>
                    </div>
                    <span className="font-medium">
                      {isCalculatingShipping ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        `${calculateShippingFee("express").toLocaleString()}đ`
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <CreditCard className="mr-2 text-blue-500" />
                  Phương thức thanh toán
                </h2>

                <div className="space-y-3">
                  {/* Ví điện tử Momo - Cha */}
                  <div
                    className={`p-4 border rounded-lg ${
                      paymentMethod === "momo"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => setPaymentMethod("momo")}
                  >
                    <div className="flex items-center cursor-pointer">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                          paymentMethod === "momo"
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === "momo" && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <Wallet className="text-gray-500 mr-3" />
                      <span className="font-medium">Ví điện tử Momo</span>
                    </div>

                    {/* Các tùy chọn con của Momo */}
                    {paymentMethod === "momo" && (
                      <div className="mt-3 pl-8 space-y-2">
                        <div
                          className={`flex items-center p-3 rounded-md cursor-pointer ${
                            momoMethod === "qr" ? "bg-blue-100" : "bg-gray-50"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setMomoMethod("qr");
                          }}
                        >
                          <div className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center mr-3">
                            {momoMethod === "qr" && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <QrCode className="text-gray-600 mr-2" />
                          <span>Quét QR Code</span>
                        </div>

                        <div
                          className={`flex items-center p-3 rounded-md cursor-pointer ${
                            momoMethod === "atm" ? "bg-blue-100" : "bg-gray-50"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setMomoMethod("atm");
                          }}
                        >
                          <div className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center mr-3">
                            {momoMethod === "atm" && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <CreditCard className="text-gray-600 mr-2" />
                          <span>Thẻ ATM</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* PayPal */}
                  <div
                    className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                      paymentMethod === "paypal"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => setPaymentMethod("paypal")}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                        paymentMethod === "paypal"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === "paypal" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <FontAwesomeIcon
                      icon={faCcPaypal}
                      className="text-xl text-gray-500 mr-3"
                    />
                    <span className="font-medium">PayPal</span>
                  </div>
                  {/* COD */}
                  <div
                    className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                      paymentMethod === "cod"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                        paymentMethod === "cod"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === "cod" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <Truck className="text-gray-500 mr-3" />
                    <span className="font-medium">
                      Thanh toán khi nhận hàng (COD)
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Phần tóm tắt đơn hàng */}
          <div className="lg:w-2/5">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:sticky lg:top-20">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
                Đơn hàng của bạn
              </h2>
              {/* Danh sách sản phẩm */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md mr-3 sm:mr-4"
                      />
                      <span className="absolute -top-0 -right-0 bg-orange-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                    </div>
                    <div className="font-medium">
                      {(item.price * item.quantity).toLocaleString()}đ
                    </div>
                  </div>
                ))}
              </div>

              {/* Tóm tắt giá */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span>{subtotal.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span>
                    {isCalculatingShipping ? (
                      <RefreshCw className="w-4 h-4 animate-spin inline" />
                    ) : distance ? (
                      shippingFee === 0 ? (
                        "Miễn phí"
                      ) : (
                        `${shippingFee.toLocaleString()}đ (${distance.toFixed(
                          1
                        )} km)`
                      )
                    ) : (
                      "Đang tính..."
                    )}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng:</span>
                    <span className="text-orange-500">
                      {total.toLocaleString()}đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Nút thanh toán */}
              <button
                onClick={handleSubmit}
                disabled={isProcessing || isCalculatingShipping || errorMessage}
                className={`w-full py-2 sm:py-3 rounded-lg font-medium text-white text-sm sm:text-base transition flex items-center justify-center ${
                  isProcessing || isCalculatingShipping || errorMessage
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : isCalculatingShipping ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Đang tính phí...
                  </>
                ) : (
                  "Đặt hàng ngay"
                )}
              </button>

              {/* Chính sách */}
              <div className="grid grid-cols-2 sm:grid-cols-2 mt-4 sm:mt-6 border-t border-gray-200 pt-3 sm:pt-4 gap-2 sm:gap-4">
                <div className="flex items-start">
                  <ShieldCheck className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Bảo hành chính hãng
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Bảo hành 12 tháng
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Truck className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Giao hàng toàn quốc
                    </p>
                    <p className="text-xs text-gray-500">Giao hàng đúng hẹn</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <RefreshCw className="text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Đổi trả dễ dàng
                    </p>
                    <p className="text-xs text-gray-500">Trong 7 ngày</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CreditCard className="text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Thanh toán linh hoạt
                    </p>
                    <p className="text-xs text-gray-500">Nhiều phương thức</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
