import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  getCartByToken,
  updateCart,
  deleteCart,
  deleteCartMany,
} from "../../services/CartApi";
import { getProductStore } from "../../services/ProductApi";
import { getImageUrl } from "../../services/ProductImageApi";
import { refetchCartItemCount } from "../../components/customer/layouts/Header";
import { addCart } from "../../services/CartApi";
import { toast } from "react-toastify";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const cartData = await getCartByToken();
        const formattedCartItems = cartData.map((item) => ({
          id: item.id,
          productId: item.products.id,
          name: item.products.product_name,
          image: getImageUrl(item.products.product_images[0]?.image_url),
          price: item.products.sell_price,
          quantity: item.quantity,
        }));
        setCartItems(formattedCartItems);

        const productsData = await getProductStore({ limit: 5 });
        setRecommendedProducts(productsData.products);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu giỏ hàng:", error);
        toast.error("Có lỗi xảy ra khi tải giỏ hàng");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  const toggleItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      await deleteCartMany(selectedItems);
      await refetchCartItemCount();
      setCartItems((prev) =>
        prev.filter((item) => !selectedItems.includes(item.id))
      );
      setSelectedItems([]);
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Có lỗi xảy ra khi xóa sản phẩm");
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteCart(id);
      await refetchCartItemCount();
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Có lỗi xảy ra khi xóa sản phẩm");
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCart(id, { quantity: newQuantity });
      await refetchCartItemCount();
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
      toast.success("Đã cập nhật số lượng");
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
      toast.error("Có lỗi xảy ra khi cập nhật số lượng");
    }
  };

  const total = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8 text-center">
        <div className="animate-pulse text-gray-600">Đang tải giỏ hàng...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="relative mb-6 sm:mb-8 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 rounded-full p-1 sm:p-2 transition hover:bg-gray-100"
          aria-label="Quay lại"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.5L1 8.5M1 8.5L8 1M1 8.5L8 16"
              stroke="#121219"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="mx-auto bg-clip-text bg-gradient-to-r from-blue-500 to-orange-500 py-2 sm:py-4 font-pacifico text-2xl sm:text-4xl font-semibold text-transparent">
          Giỏ hàng của bạn
        </h1>
      </div>

      {/* Empty Cart */}
      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-8 sm:py-12 text-center"
        >
          <div className="mb-4 text-base sm:text-lg text-gray-500">
            Giỏ hàng của bạn đang trống
          </div>
          <button
            onClick={() => navigate("/shop")}
            className="rounded-lg bg-blue-600 px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base text-white transition hover:bg-blue-700"
          >
            Tiếp tục mua sắm
          </button>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="space-y-3 sm:space-y-4 lg:col-span-2">
            {/* Cart Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col sm:flex-row items-center justify-between rounded-lg border border-gray-300 bg-white p-3 sm:p-4 shadow-sm sm:shadow-md"
            >
              <div className="flex items-center mb-2 sm:mb-0">
                <input
                  type="checkbox"
                  checked={
                    selectedItems.length === cartItems.length &&
                    cartItems.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="h-4 w-4 sm:h-5 sm:w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 sm:ml-3 text-sm sm:text-base font-medium text-gray-700">
                  Chọn tất cả ({cartItems.length})
                </label>
              </div>
              <button
                onClick={handleDeleteSelected}
                disabled={selectedItems.length === 0}
                className={`rounded-md px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition ${
                  selectedItems.length === 0
                    ? "cursor-not-allowed text-gray-400"
                    : "text-red-500 hover:bg-red-50"
                }`}
              >
                Xóa đã chọn
              </button>
            </motion.div>

            {/* Cart Items List */}
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start sm:items-center gap-3 sm:gap-4 rounded-lg border border-gray-200 bg-white p-3 sm:p-4 shadow-sm transition hover:shadow-md"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleItem(item.id)}
                    className="h-4 w-4 sm:h-5 sm:w-5 cursor-pointer accent-blue-600 mt-1 sm:mt-0"
                  />
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-contain"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-bold text-base sm:text-lg text-orange-500">
                        {item.price.toLocaleString()}₫
                      </span>
                    </div>
                    <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <span className="text-xs sm:text-sm text-gray-700">
                        Số lượng:
                      </span>
                      <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="bg-gray-100 px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-200"
                        >
                          -
                        </button>
                        <span className="w-8 sm:w-12 bg-white py-1 text-center text-xs sm:text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="bg-gray-100 px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1 sm:p-2 text-gray-500 transition hover:text-red-500"
                    aria-label="Xóa sản phẩm"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M13.9999 4H10.6666V2.88666C10.6509 2.45988 10.4667 2.0567 10.1543 1.76553C9.84188 1.47435 9.42675 1.31893 8.99992 1.33333H6.99992C6.57309 1.31893 6.15796 1.47435 5.84554 1.76553C5.53312 2.0567 5.34889 2.45988 5.33325 2.88666V4H1.99992C1.82311 4 1.65354 4.07024 1.52851 4.19526C1.40349 4.32028 1.33325 4.48985 1.33325 4.66666C1.33325 4.84348 1.40349 5.01305 1.52851 5.13807C1.65354 5.26309 1.82311 5.33333 1.99992 5.33333H2.66659V12.6667C2.66659 13.1971 2.8773 13.7058 3.25237 14.0809C3.62744 14.456 4.13615 14.6667 4.66659 14.6667H11.3333C11.8637 14.6667 12.3724 14.456 12.7475 14.0809C13.1225 13.7058 13.3333 13.1971 13.3333 12.6667V5.33333H13.9999C14.1767 5.33333 14.3463 5.26309 14.4713 5.13807C14.5963 5.01305 14.6666 4.84348 14.6666 4.66666C14.6666 4.48985 14.5963 4.32028 14.4713 4.19526C14.3463 4.07024 14.1767 4 13.9999 4ZM6.66659 2.88666C6.66659 2.78 6.80659 2.66666 6.99992 2.66666H8.99992C9.19325 2.66666 9.33325 2.78 9.33325 2.88666V4H6.66659V2.88666ZM11.9999 12.6667C11.9999 12.8435 11.9297 13.013 11.8047 13.1381C11.6796 13.2631 11.5101 13.3333 11.3333 13.3333H4.66659C4.48977 13.3333 4.32021 13.2631 4.19518 13.1381C4.07016 13.013 3.99992 12.8435 3.99992 12.6667V5.33333H11.9999V12.6667Z" />
                      <path d="M5.99992 11.3333C6.17673 11.3333 6.3463 11.2631 6.47132 11.1381C6.59635 11.013 6.66658 10.8435 6.66658 10.6667V8C6.66658 7.82319 6.59635 7.65362 6.47132 7.5286C6.3463 7.40357 6.17673 7.33334 5.99992 7.33334C5.82311 7.33334 5.65354 7.40357 5.52851 7.5286C5.40349 7.65362 5.33325 7.82319 5.33325 8V10.6667C5.33325 10.8435 5.40349 11.013 5.52851 11.1381C5.65354 11.2631 5.82311 11.3333 5.99992 11.3333Z" />
                      <path d="M9.99992 11.3333C10.1767 11.3333 10.3463 11.2631 10.4713 11.1381C10.5963 11.013 10.6666 10.8435 10.6666 10.6667V8C10.6666 7.82319 10.5963 7.65362 10.4713 7.5286C10.3463 7.40357 10.1767 7.33334 9.99992 7.33334C9.82311 7.33334 9.65354 7.40357 9.52851 7.5286C9.40349 7.65362 9.33325 7.82319 9.33325 8V10.6667C9.33325 10.8435 9.40349 11.013 9.52851 11.1381C9.65354 11.2631 9.82311 11.3333 9.99992 11.3333Z" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="sticky top-4 sm:top-20 h-fit space-y-3 sm:space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-lg border border-gray-300 bg-white p-4 sm:p-6 shadow-md sm:shadow-lg"
            >
              <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-gray-800">
                Tổng thanh toán
              </h3>
              <div className="mb-4 sm:mb-6 space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between text-base sm:text-lg font-bold text-gray-800">
                  <div className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Tạm tính:</span>
                  </div>
                  <span className="text-orange-500">
                    {total.toLocaleString()}₫
                  </span>
                </div>
              </div>
              <button
                onClick={() =>
                  navigate("/check-out", { state: { selectedItems } })
                }
                disabled={selectedItems.length === 0}
                className={`w-full rounded-lg py-2 sm:py-3 text-sm sm:text-base font-medium transition ${
                  selectedItems.length === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Tiến hành thanh toán
              </button>
              {selectedItems.length === 0 && (
                <p className="mt-2 text-center text-xs sm:text-sm text-gray-500">
                  Vui lòng chọn ít nhất 1 sản phẩm
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="rounded-lg border border-gray-100 bg-white p-3 sm:p-4 shadow-sm"
            >
              <div className="flex items-center">
                <div className="mr-2 sm:mr-3 rounded-full bg-blue-100 p-1 sm:p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm sm:text-base font-medium text-gray-800">
                    Giao hàng nhanh
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Nhận hàng trong 1-2 ngày
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <div className="mt-8 sm:mt-12">
          <div className="mb-3 sm:mb-4 flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Có thể bạn sẽ thích
            </h3>
            <button
              onClick={() => navigate("/shop")}
              className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Xem tất cả
            </button>
          </div>
          <div className="grid grid-cols-5 gap-3 sm:gap-4">
            {recommendedProducts.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-lg sm:rounded-xl bg-white shadow-sm sm:shadow-md transition-shadow hover:shadow-md sm:hover:shadow-lg"
              >
                <div className="relative bg-gray-100 pt-[100%] overflow-hidden">
                  <img
                    src={getImageUrl(product.product_images[0]?.image_url)}
                    alt={product.product_name}
                    className="absolute left-0 top-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        await addCart({ product_id: product.id });
                        await refetchCartItemCount();
                        toast.success("Đã thêm vào giỏ hàng!");
                      } catch (error) {
                        console.error("Lỗi khi thêm sản phẩm:", error);
                        toast.error("Có lỗi xảy ra");
                      }
                    }}
                    className="absolute right-2 top-2 sm:right-3 sm:top-3 rounded-full bg-white p-1 sm:p-2 shadow-sm sm:shadow-md hover:bg-orange-500 hover:text-white"
                    aria-label="Thêm vào giỏ hàng"
                  >
                    <FaShoppingCart className="text-xs sm:text-sm" />
                  </motion.button>
                </div>
                <div className="flex flex-col p-2 sm:p-4">
                  <h3
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="mb-1 text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 cursor-pointer hover:text-blue-600"
                  >
                    {product.product_name}
                  </h3>
                  <div className="mt-auto">
                    <span className="text-sm sm:text-base font-bold text-orange-500">
                      {product.sell_price?.toLocaleString()}₫
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
