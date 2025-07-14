import { useSearchParams } from "react-router-dom";
import { Link, Navigate } from "react-router-dom";
import { CheckCircle, ArrowLeft, ShoppingBag, XCircle } from "lucide-react";

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const status = searchParams.get("status");

  const isSuccess = status === "success";
  if (!orderId || !["success", "failed", "cancel"].includes(status)) {
    return <Navigate to="/shop" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div
          className={`p-6 text-center ${isSuccess ? "bg-orange-500" : "bg-red-500"}`}
        >
          <div className="flex justify-center mb-4">
            {isSuccess ? (
              <CheckCircle className="h-12 w-12 text-white animate-bounce" />
            ) : (
              <XCircle className="h-12 w-12 text-white animate-pulse" />
            )}
          </div>
          <h1 className="text-3xl font-pacifico font-semibold text-white">
            {isSuccess ? "Đặt Hàng Thành Công!" : "Thanh Toán Thất Bại"}
          </h1>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          {isSuccess ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="h-20 w-20 bg-orange-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-10 w-10 text-orange-600" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <p className="text-base text-gray-700 mb-6">
                Cảm ơn bạn đã mua sắm tại WareTech. Đơn hàng #
                <span className="font-semibold">{orderId}</span> của bạn đang
                được xử lý.
              </p>

              <div className="space-y-4">
                <Link
                  to={`/order-detail/${orderId}`}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                  Xem chi tiết đơn hàng
                </Link>
                <Link
                  to="/shop"
                  className="flex items-center justify-center text-blue-600 hover:text-orange-600 text-base font-semibold"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Tiếp tục mua sắm
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-base text-gray-700 mb-6">
                Đơn hàng của bạn không được xử lý thành công. Vui lòng thử lại
                hoặc chọn phương thức thanh toán khác.
              </p>
              <Link
                to="/cart"
                className="block w-full bg-red-600 hover:bg-red-700 text-white text-base font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Thử lại thanh toán
              </Link>
              <div className="mt-4">
                <Link
                  to="/shop"
                  className="flex items-center justify-center text-blue-600 hover:text-orange-600 text-base font-semibold"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Tiếp tục mua sắm
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-5 text-center border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Cần hỗ trợ? Liên hệ
            <a
              href="mailto:thongngoc2k3@gmail.com"
              className="text-blue-600 hover:underline ml-1"
            >
              thongngoc2k3@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentResultPage;
