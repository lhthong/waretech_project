import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  User,
  Phone,
  ChevronDown,
  ChevronUp,
  Package,
} from "lucide-react";
import { getOrderById } from "../../services/OrderApi";
import { getImageUrl } from "../../services/ProductImageApi";

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [expandedSection, setExpandedSection] = useState({
    customer: true,
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrderById(id);
        // Map API data to UI-compatible structure
        const formattedOrder = {
          id: orderData.ma_don_hang,
          date: orderData.created_at,
          status: mapStatus(orderData.trang_thai),
          total: orderData.tong_tien || 0,
          subtotal: calculateSubtotal(orderData.order_details),
          shippingFee: orderData.shipping_info?.shipping_fee || 0,
          paymentMethod: mapPaymentMethod(orderData.payments?.[0]?.method),
          paymentStatus: mapPaymentStatus(orderData.payments?.[0]?.status),
          method: mapShippingMethod(orderData.shipping_info?.shipping_method),
          transactionId: orderData.payments?.[0]?.transaction_id || null,
          customer: {
            name:
              orderData.shipping_info?.recipient_name ||
              orderData.users?.fullname ||
              "Không có",
            phone:
              orderData.shipping_info?.phone ||
              orderData.users?.phone ||
              "Không có",
            email: orderData.users?.username || "Không có",
            address: formatAddress(orderData.shipping_info),
          },
          products: orderData.order_details.map((detail) => ({
            id: detail.products.id,
            name: detail.products.product_name,
            price: detail.products.sell_price,
            quantity: detail.so_luong,
            image: detail.products.product_images?.[0]?.image_url
              ? getImageUrl(detail.products.product_images[0].image_url)
              : "/placeholder.png",
            total: detail.tong_tien,
          })),
        };
        setOrder(formattedOrder);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Không thể tải thông tin đơn hàng. Vui lòng thử lại.");
      }
    };

    fetchOrder();
  }, [id]);

  // Map trang_thai to user-friendly text
  const mapStatus = (trang_thai) => {
    const statusMap = {
      choxacnhan: "Chờ xác nhận",
      daxacnhan: "Đã xác nhận",
      danggiao: "Đang giao hàng",
      hoanthanh: "Đã giao hàng",
      dahuy: "Đã hủy",
    };
    return statusMap[trang_thai] || "Không xác định";
  };

  // Map payment method
  const mapPaymentMethod = (method) => {
    const methodMap = {
      COD: "Thanh toán khi nhận hàng",
      Momo: "Momo",
      Paypal: "Paypal",
    };
    return methodMap[method] || "Không xác định";
  };

  // Map payment status
  const mapPaymentStatus = (status) => {
    const statusMap = {
      dangcho: "Đang chờ",
      dathanhtoan: "Đã thanh toán",
      loithanhtoan: "Lỗi thanh toán",
    };
    return statusMap[status] || "Không xác định";
  };

  // Map shipping method
  const mapShippingMethod = (method) => {
    const methodMap = {
      tieuchuan: "Giao hàng tiêu chuẩn",
      nhanh: "Giao hàng nhanh",
    };
    return methodMap[method] || "Không xác định";
  };

  // Calculate subtotal from order_details
  const calculateSubtotal = (orderDetails) => {
    return orderDetails.reduce(
      (sum, detail) => sum + (detail.tong_tien || 0),
      0
    );
  };

  // Format address from shipping_info
  const formatAddress = (shippingInfo) => {
    if (!shippingInfo) return "Không có";
    const parts = [
      shippingInfo.street_address,
      shippingInfo.ward,
      shippingInfo.district,
      shippingInfo.province,
    ].filter(Boolean);
    return parts.join(", ") || "Không có";
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <Link
            to="/orders"
            className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại danh sách đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Không tìm thấy đơn hàng.</p>
          <Link
            to="/orders"
            className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại danh sách đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Link
            to="/customer-account?tab=orders"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại
          </Link>
          <div className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200 text-sm text-gray-600 flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-500" />
            <span>
              Mã đơn hàng:{" "}
              <span className="font-semibold text-orange-600">{order.id}</span>
            </span>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow border p-6 max-h-[290px] overflow-auto scrollbar-hide">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Sản phẩm đã mua
              </h2>
              {order.products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center space-x-4 py-4 border-b last:border-0"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/80";
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(product.price)} x {product.quantity}
                    </p>
                  </div>
                  <div className="text-right font-semibold text-orange-600">
                    {formatCurrency(product.total)}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Info */}
            <div className="bg-white rounded-lg shadow border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Thông tin đơn hàng
              </h2>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày đặt:</span>
                <span className="text-gray-900">{formatDate(order.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <span
                  className={`font-medium ${
                    order.status === "Đã giao hàng" ||
                    order.status === "Đã xác nhận"
                      ? "text-green-600"
                      : order.status === "Đã hủy"
                        ? "text-red-600"
                        : "text-yellow-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thanh toán:</span>
                <span className="text-orange-600 font-medium">
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái thanh toán:</span>
                <span
                  className={`font-medium ${
                    order.paymentStatus === "Đã thanh toán"
                      ? "text-green-600"
                      : order.paymentStatus === "Lỗi thanh toán"
                        ? "text-red-600"
                        : "text-yellow-600"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vận chuyển:</span>
                <span className="font-medium">{order.method}</span>
              </div>
              {order.transactionId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <span className="font-mono text-blue-600">
                    {order.transactionId}
                  </span>
                </div>
              )}
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div
                className="px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() =>
                  setExpandedSection({
                    ...expandedSection,
                    customer: !expandedSection.customer,
                  })
                }
              >
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Thông tin khách hàng
                  </h2>
                </div>
                {expandedSection.customer ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
              {expandedSection.customer && (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Họ và tên
                      </h3>
                      <p className="text-gray-900 font-medium">
                        {order.customer.name}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Số điện thoại
                      </h3>
                      <p className="text-gray-900 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {order.customer.phone}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Địa chỉ giao hàng
                      </h3>
                      <p className="text-gray-900 flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        {order.customer.address}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg shadow border p-6 h-fit sticky top-20">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Tổng kết đơn hàng
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-medium">
                  {formatCurrency(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="font-medium">
                  {formatCurrency(order.shippingFee)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="text-base font-semibold">Tổng cộng:</span>
                <span className="text-base font-semibold text-orange-600">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/shop"
                className="w-full flex justify-center items-center px-4 py-3 rounded-lg text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
