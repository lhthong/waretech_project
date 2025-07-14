import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  StarIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import { getProductById, getProducts } from "../../services/ProductApi";
import { getProductImages, getImageUrl } from "../../services/ProductImageApi";
import { getCategories } from "../../services/CategoryApi";
import { getReviews, addReviews } from "../../services/FeedbackApi";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { addCart } from "../../services/CartApi";
import { refetchCartItemCount } from "../../components/customer/layouts/Header";

// DetailProductPage: Component chính cho trang chi tiết sản phẩm
const DetailProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [filterRating, setFilterRating] = useState(0);

  // Xử lý nhấp vào sản phẩm liên quan
  const handleProductClick = useCallback(
    (productId) => {
      navigate(`/product-detail/${productId}`);
      window.scrollTo(0, 0);
    },
    [navigate]
  );

  // Lấy dữ liệu sản phẩm, hình ảnh, danh mục, đánh giá và sản phẩm liên quan
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin sản phẩm chính
        const productData = await getProductById(id);
        setProduct(productData);

        // Lấy và sắp xếp hình ảnh sản phẩm
        const imagesData = await getProductImages();
        const productImages = imagesData
          .filter((img) => img.product_id === Number(id))
          .sort((a, b) => (b.is_main ? 1 : 0) - (a.is_main ? 1 : 0));
        setImages(productImages);

        // Lấy danh mục sản phẩm
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        // Lấy đánh giá sản phẩm
        const allReviews = await getReviews();
        const filteredReviews = allReviews
          .filter((review) => review.product_id === Number(id))
          .map((review) => ({
            id: review.id,
            name: review.users?.fullname || `Người dùng #${review.user_id}`,
            rating: review.rating,
            comment: review.comment,
            date: new Date(review.created_at).toLocaleDateString("vi-VN"),
          }));
        setReviews(filteredReviews);

        // Lấy sản phẩm liên quan
        if (productData.category_id) {
          const allProducts = await getProducts();
          const related = allProducts
            .filter(
              (p) =>
                p.category_id === productData.category_id && p.id !== Number(id)
            )
            .slice(0, 5);

          // Lấy hình ảnh chính cho sản phẩm liên quan
          const relatedWithImages = await Promise.all(
            related.map(async (product) => {
              const productImages = await getProductImages();
              const mainImage =
                productImages.find(
                  (img) => img.product_id === product.id && img.is_main
                ) || productImages.find((img) => img.product_id === product.id);
              return {
                ...product,
                imageUrl: mainImage
                  ? getImageUrl(mainImage.image_url)
                  : "/default-product-image.png",
              };
            })
          );
          setRelatedProducts(relatedWithImages);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu sản phẩm:", err);
        setError("Không thể tải thông tin sản phẩm");
      }
    };

    fetchData();
  }, [id]);

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập trước khi thanh toán.");
      return;
    }
    navigate("/check-out", {
      state: {
        buyNow: true,
        product: {
          id: Date.now(), // Tạo ID tạm thời (không trùng với giỏ hàng)
          product_id: product.id,
          name: product.product_name,
          image: getImageUrl(product.product_images[0]?.image_url),
          price: product.sell_price,
          quantity: quantity,
        },
      },
    });
  };

  // Xử lý gửi đánh giá sản phẩm
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Bạn cần đăng nhập để đánh giá sản phẩm");
      return;
    }
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao để đánh giá");
      return;
    }
    try {
      await addReviews({ product_id: Number(id), rating, comment });
      toast.success("Gửi đánh giá thành công!");
      setRating(0);
      setComment("");

      // Cập nhật danh sách đánh giá
      const allReviews = await getReviews();
      const filteredReviews = allReviews
        .filter((review) => review.product_id === Number(id))
        .map((review) => ({
          id: review.id,
          name: review.users?.fullname || `Người dùng #${review.user_id}`,
          rating: review.rating,
          comment: review.comment,
          date: new Date(review.created_at).toLocaleDateString("vi-VN"),
        }));
      setReviews(filteredReviews);
    } catch (err) {
      toast.error("Gửi đánh giá thất bại");
      console.error("Lỗi khi gửi đánh giá:", err);
    }
  };

  // Tăng/giảm số lượng sản phẩm
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="border-l-4 border-red-400 bg-red-50 p-4">
          <div className="flex">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị thông báo nếu không tìm thấy sản phẩm
  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-gray-500">Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  const productCategory = categories.find(
    (cat) => cat.id === product?.category_id
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <div className="breadcrumbs mb-6 text-sm text-gray-500">
        <ul className="flex space-x-4 font-semibold">
          <li>
            <a href="/home">Trang chủ</a>
          </li>
          {productCategory && (
            <li>
              <button
                onClick={() =>
                  navigate(`/shop?categoryId=${productCategory.id}`)
                }
                className="text-blue-600 no-underline"
              >
                {productCategory.categorie_name}
              </button>
            </li>
          )}
          <li className="text-gray-700 font-medium">{product.product_name}</li>
        </ul>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="grid items-start gap-8 md:grid-cols-2 lg:gap-12">
        {/* Hình ảnh sản phẩm */}
        <div className="mx-auto w-full max-w-md md:mx-0">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            {images.length > 0 ? (
              <img
                src={getImageUrl(images[selectedImage]?.image_url)}
                alt={product.product_name}
                className="absolute inset-0 h-full w-full object-contain"
                loading="eager"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <span className="text-gray-400">Không có hình ảnh</span>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="relative mt-3">
              {selectedImage > 0 && (
                <button
                  onClick={() =>
                    setSelectedImage((prev) => Math.max(0, prev - 4))
                  }
                  className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white w-8 h-8 flex items-center justify-center shadow transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
              <div className="overflow-hidden px-4 sm:px-6 md:px-8">
                <motion.div
                  className="flex gap-2"
                  animate={{ x: -selectedImage * 80 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {images.map((img, index) => (
                    <motion.button
                      key={img.id || index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-16 w-16 overflow-hidden rounded-md border-2 flex-shrink-0 transition-all duration-200 sm:h-18 sm:w-18 md:h-20 md:w-20 ${
                        selectedImage === index
                          ? "border-blue-500"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={getImageUrl(img.image_url)}
                        alt={`Hình ảnh ${index + 1}`}
                        className="absolute inset-0 h-full w-full object-cover bg-gray-100"
                        loading="lazy"
                      />
                    </motion.button>
                  ))}
                </motion.div>
              </div>
              {selectedImage < images.length - 4 && (
                <button
                  onClick={() =>
                    setSelectedImage((prev) =>
                      Math.min(images.length - 4, prev + 4)
                    )
                  }
                  className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white w-8 h-8 flex items-center justify-center shadow transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Chi tiết sản phẩm */}
        <div className="mx-auto w-full max-w-xl space-y-5 md:mx-0">
          <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
            {product.product_name}
          </h1>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-orange-500 lg:text-3xl">
                {product.sell_price?.toLocaleString()}₫
              </span>
            </div>
          </div>
          <div className="pt-2">
            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-700">Số lượng:</span>
              <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
                <button
                  onClick={decrementQuantity}
                  className="bg-gray-100 px-3 py-1 text-gray-600 font-medium hover:bg-gray-200"
                >
                  -
                </button>
                <span className="w-12 bg-white py-1 text-center">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="bg-gray-100 px-3 py-1 text-gray-600 font-medium hover:bg-gray-200"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-500">
                {product.stock_quantity || 0} sản phẩm có sẵn
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <button
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-700"
              onClick={async () => {
                try {
                  await addCart({ product_id: product.id, quantity });
                  await refetchCartItemCount();
                  toast.success("Đã thêm vào giỏ hàng!");
                } catch (err) {
                  console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", err);
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Thêm vào giỏ hàng
            </button>
            <button
              className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
              onClick={handleBuyNow}
            >
              Mua ngay
            </button>
          </div>
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <TruckIcon className="mt-0.5 h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">Giao hàng nhanh</p>
                  <p className="text-sm text-gray-500">
                    Dự kiến giao: 1-2 ngày
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheckIcon className="mt-0.5 h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">Bảo hành</p>
                  <p className="text-sm text-gray-500">12 tháng chính hãng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab thông tin */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <a
              href="#description"
              className="whitespace-nowrap border-b-2 border-blue-500 px-1 py-4 text-sm font-medium text-blue-600"
            >
              Mô tả sản phẩm
            </a>
            <a
              href="#parameter"
              className="whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              Thông số kỹ thuật
            </a>
            <a
              href="#reviews"
              className="whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              Đánh giá ({reviews.length})
            </a>
          </nav>
        </div>
        <div className="py-8">
          <div className="prose max-w-none">
            <div id="description">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Chi tiết sản phẩm
              </h3>
              <p className="mb-6 text-gray-700 whitespace-pre-line">
                {product.description || "Sản phẩm chưa có mô tả chi tiết"}
              </p>
            </div>
            <div id="parameter">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Thông số kỹ thuật
              </h3>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200 bg-white">
                    <tr>
                      <td className="w-1/3 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                        Mã sản phẩm
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {product.product_code || "N/A"}
                      </td>
                    </tr>
                    {productCategory && (
                      <tr>
                        <td className="w-1/3 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                          Danh mục
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <button
                            onClick={() =>
                              navigate(`/shop?categoryId=${productCategory.id}`)
                            }
                            className="text-blue-600 hover:underline"
                          >
                            {productCategory.categorie_name}
                          </button>
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className="w-1/3 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                        Số lượng tồn kho
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {product.stock_quantity || 0}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Đánh giá sản phẩm */}
      <div id="reviews" className="mt-6 sm:mt-8">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Đánh giá sản phẩm
          </h2>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {[0, 1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setFilterRating(star)}
                className={`flex items-center space-x-1 rounded px-2 py-1 text-xs sm:text-sm ${
                  filterRating === star
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {star === 0 ? (
                  <span>Tất cả</span>
                ) : (
                  <>
                    <span>{star}</span>
                    <FaStar
                      className="h-3 w-3 sm:h-4 sm:w-4"
                      color={filterRating === star ? "white" : "gold"}
                    />
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {reviews
              .filter((r) => filterRating === 0 || r.rating === filterRating)
              .map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-200 pb-4 sm:pb-6"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 font-medium">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {review.name}
                        </p>
                        <div className="flex items-center space-x-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                  i < review.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            {review.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base">
                    {review.comment}
                  </p>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500">
            Chưa có đánh giá nào cho sản phẩm này.
          </p>
        )}

        <div className="mt-6 sm:mt-8">
          <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-medium text-gray-900">
            Viết đánh giá của bạn
          </h3>
          <form
            className="space-y-3 sm:space-y-4"
            onSubmit={handleSubmitReview}
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Đánh giá
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`focus:outline-none ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    <StarIcon className="h-6 w-6 sm:h-8 sm:w-8" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Bình luận
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 sm:p-3 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                required
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 sm:px-6 py-2 font-medium text-white transition hover:bg-blue-700"
            >
              Gửi đánh giá
            </button>
          </form>
        </div>
      </div>

      {/* Sản phẩm liên quan */}
      {relatedProducts.length > 0 && (
        <div className="mt-8 sm:mt-12">
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Sản phẩm liên quan
            </h2>
            {productCategory && (
              <button
                onClick={() =>
                  navigate(`/shop?categoryId=${productCategory.id}`)
                }
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Xem tất cả
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-5">
            {relatedProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className="group flex h-full flex-col overflow-hidden rounded-lg sm:rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative bg-gray-100 pt-[100%] overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.product_name}
                    className="absolute left-0 top-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-2 top-2 rounded-full bg-white p-1 sm:p-2 shadow-sm sm:shadow-md hover:bg-orange-500 hover:text-white"
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        await addCart({ product_id: product.id });
                        await refetchCartItemCount();
                        toast.success("Đã thêm vào giỏ hàng!");
                      } catch (error) {
                        console.error(
                          "Lỗi khi thêm sản phẩm vào giỏ hàng:",
                          error
                        );
                        toast.error("Lỗi khi thêm vào giỏ hàng!");
                      }
                    }}
                  >
                    <FaShoppingCart className="text-xs sm:text-sm" />
                  </motion.button>
                </div>
                <div className="flex flex-grow flex-col p-2 sm:p-3">
                  <h3
                    onClick={() => navigate(`/product-detail/${product.id}`)}
                    className="mb-1 text-xs sm:text-sm line-clamp-2 font-medium text-gray-800 transition-colors cursor-pointer hover:text-blue-600"
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

export default DetailProductPage;
