import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
  faFilter,
  faThLarge,
  faThList,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import { getCategories } from "../../services/CategoryApi";
import { getImageUrl } from "../../services/ProductImageApi";
import { getProductStore } from "../../services/ProductApi";
import { addCart } from "../../services/CartApi";
import { refetchCartItemCount } from "../../components/customer/layouts/Header";
import { toast } from "react-toastify";

const PRICE_RANGES = [
  { label: "Dưới 5 triệu", min: 0, max: 5000000 },
  { label: "5-10 triệu", min: 5000000, max: 10000000 },
  { label: "10-20 triệu", min: 10000000, max: 20000000 },
  { label: "Trên 20 triệu", min: 20000000, max: Infinity },
];

const ShopPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [layout, setLayout] = useState("grid");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const filterParams = useMemo(
    () => ({
      page,
      limit,
      ...(selectedCategoryId && { categoryId: selectedCategoryId }),
      ...(selectedPriceRange && {
        priceMin: selectedPriceRange.min,
        ...(selectedPriceRange.max !== Infinity && {
          priceMax: selectedPriceRange.max,
        }),
      }),
      ...(sortOption && { sortBy: sortOption }),
      ...(searchTerm && { search: searchTerm }),
    }),
    [
      page,
      limit,
      selectedCategoryId,
      selectedPriceRange,
      sortOption,
      searchTerm,
    ]
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi tải danh mục sản phẩm:", error);
      }
    };
    fetchCategories();
  }, []);

  const parseUrlParams = useCallback(() => {
    const params = new URLSearchParams(location.search);
    setSelectedCategoryId(
      params.get("categoryId") ? Number(params.get("categoryId")) : null
    );
    setSelectedPriceRange(
      params.get("priceRange")
        ? PRICE_RANGES.find((r) => r.label === params.get("priceRange")) || null
        : null
    );
    setSortOption(params.get("sort") || "");
    setPage(params.get("page") ? Math.max(1, Number(params.get("page"))) : 1);
    setSearchTerm(params.get("search") || "");
  }, [location.search]);

  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedCategoryId) params.set("categoryId", selectedCategoryId);
    if (selectedPriceRange) params.set("priceRange", selectedPriceRange.label);
    if (sortOption) params.set("sort", sortOption);
    if (page > 1) params.set("page", page);
    if (searchTerm) params.set("search", searchTerm);
    navigate({ search: params.toString() }, { replace: true });
  }, [
    selectedCategoryId,
    selectedPriceRange,
    sortOption,
    page,
    searchTerm,
    navigate,
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { products: rawData, total } =
          await getProductStore(filterParams);
        const formatted = rawData.map((item) => ({
          id: item.id,
          name: item.product_name,
          description: item.description,
          price: item.sell_price.toLocaleString("vi-VN") + "₫",
          image:
            getImageUrl(item.product_images?.[0]?.image_url) ||
            "/placeholder-product.jpg",
          isNew: item.featured_products?.length > 0,
        }));
        setProducts(formatted);
        setTotal(total);
      } catch (err) {
        console.error("Lỗi khi tải danh sách sản phẩm:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [filterParams]);

  useEffect(() => parseUrlParams(), [parseUrlParams]);
  useEffect(() => updateUrlParams(), [updateUrlParams]);

  const handleCategoryClick = useCallback((id) => {
    setSelectedCategoryId((prev) => (prev === id ? null : id));
    setPage(1);
  }, []);

  const handlePriceRangeClick = useCallback((range) => {
    setSelectedPriceRange((prev) =>
      prev?.label === range.label ? null : range
    );
    setPage(1);
  }, []);

  const handleSortChange = useCallback((value) => {
    setSortOption(value);
    setPage(1);
  }, []);

  const totalPages = Math.ceil(total / limit);
  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [totalPages]
  );

  const handleProductClick = useCallback(
    (id) => navigate(`/product-detail/${id}`),
    [navigate]
  );

  const productList = useMemo(() => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-xl bg-gray-100 h-80"
            ></div>
          ))}
        </div>
      );
    }

    return layout === "grid" ? (
      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductGridItem
            key={product.id}
            idProduct={product.id}
            product={product}
            onClick={handleProductClick}
          />
        ))}
      </div>
    ) : (
      <div className="space-y-4 sm:space-y-5">
        {products.map((product) => (
          <ProductListItem
            key={product.id}
            idProduct={product.id}
            product={product}
            onClick={handleProductClick}
          />
        ))}
      </div>
    );
  }, [layout, products, handleProductClick, isLoading]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="md:hidden mb-4">
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="flex w-full items-center justify-between rounded-lg bg-blue-600 px-4 py-3 text-white shadow-md"
        >
          <span className="font-medium">Bộ lọc sản phẩm</span>
          <FontAwesomeIcon icon={faFilter} className="text-lg" />
        </button>
      </div>

      <div className="flex flex-col gap-6 lg:gap-8 md:flex-row">
        <div
          className={`w-full space-y-6 md:w-1/4 lg:w-1/5 ${
            mobileFilterOpen ? "block" : "hidden md:block"
          }`}
        >
          <CategoryFilter
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategoryClick={handleCategoryClick}
          />
          <PriceFilter
            priceRanges={PRICE_RANGES}
            selectedPriceRange={selectedPriceRange}
            onPriceRangeClick={handlePriceRangeClick}
          />
        </div>

        <div className="w-full md:w-3/4 lg:w-4/5">
          <FilterBar
            total={total}
            sortOption={sortOption}
            onSortChange={handleSortChange}
            layout={layout}
            onLayoutChange={setLayout}
          />

          {!isLoading && products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Không tìm thấy sản phẩm phù hợp
              </p>
            </div>
          ) : (
            productList
          )}

          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const ProductGridItem = ({ idProduct, product, onClick }) => (
  <motion.div
    whileHover={{ y: -5 }}
    onClick={() => onClick(product.id)}
    className="group relative flex h-full flex-col cursor-pointer overflow-hidden rounded-lg sm:rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
  >
    <div className="absolute left-2 top-2 z-10">
      {product.isNew && (
        <span className="inline-block rounded-full bg-blue-500 px-2 py-1 text-xs font-bold text-white">
          MỚI
        </span>
      )}
    </div>
    <div className="relative aspect-square overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        onError={(e) => (e.target.src = "/placeholder-product.jpg")}
      />
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="absolute right-2 top-2 rounded-full bg-white p-2 shadow-md hover:bg-orange-500 hover:text-white"
        onClick={async (e) => {
          e.stopPropagation();
          try {
            await addCart({ product_id: idProduct });
            await refetchCartItemCount();
            toast.success("Đã thêm vào giỏ hàng!");
          } catch (error) {
            toast.error("Vui lòng đăng nhập trước khi thêm vào giỏ hàng!");
            console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
          }
        }}
      >
        <FaShoppingCart className="text-lg" />
      </motion.button>
    </div>
    <div className="flex flex-grow flex-col p-3 sm:p-4">
      <h3 className="mb-1 line-clamp-2 text-sm sm:text-base font-medium text-gray-800 group-hover:text-blue-600">
        {product.name}
      </h3>
      <div className="mt-auto pt-2">
        <span className="font-bold text-orange-500">{product.price}</span>
      </div>
    </div>
  </motion.div>
);

const ProductListItem = ({ idProduct, product, onClick }) => (
  <motion.div
    whileHover={{ y: -2 }}
    onClick={() => onClick(product.id)}
    className="flex flex-col gap-4 sm:gap-5 cursor-pointer rounded-lg sm:rounded-xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm transition-all duration-300 hover:shadow-md sm:flex-row"
  >
    <div className="relative aspect-square w-full sm:w-1/4">
      <img
        src={product.image}
        alt={product.name}
        className="h-full w-full rounded-lg object-cover"
        loading="lazy"
        onError={(e) => (e.target.src = "/placeholder-product.jpg")}
      />
      {product.isNew && (
        <span className="absolute left-2 top-2 rounded-full bg-blue-500 px-2 py-1 text-xs font-bold text-white">
          MỚI
        </span>
      )}
    </div>
    <div className="w-full sm:w-3/4">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-medium sm:font-semibold text-gray-800 group-hover:text-blue-600">
            {product.name}
          </h3>
          <div className="mt-1 sm:mt-2 flex items-center">
            <span className="font-bold text-orange-500">{product.price}</span>
          </div>
          <p className="mt-2 sm:mt-3 line-clamp-2 text-sm text-gray-600">
            {product.description}
          </p>
        </div>
        <div className="mt-4 sm:mt-6 flex justify-end">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="rounded-full bg-white p-2 shadow-md hover:bg-orange-500 hover:text-white"
            onClick={async (e) => {
              e.stopPropagation();
              try {
                await addCart({ product_id: idProduct });
                await refetchCartItemCount();
                toast.success("Đã thêm vào giỏ hàng!");
              } catch (error) {
                toast.error("Lỗi khi thêm vào giỏ hàng!");
                console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
              }
            }}
          >
            <FaShoppingCart className="text-lg" />
          </motion.button>
        </div>
      </div>
    </div>
  </motion.div>
);

const CategoryFilter = ({
  categories,
  selectedCategoryId,
  onCategoryClick,
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
    <h2 className="mb-3 sm:mb-4 flex items-center text-base sm:text-lg font-bold">
      <span className="mr-2 h-5 w-1 rounded-full bg-gradient-to-b from-blue-500 to-orange-500" />
      Danh mục sản phẩm
    </h2>
    <ul className="space-y-1 sm:space-y-2">
      {categories.map((category) => (
        <li key={category.id}>
          <button
            onClick={() => onCategoryClick(category.id)}
            className={`flex w-full items-center justify-between rounded px-2 py-1.5 sm:py-2 text-left text-sm sm:text-base transition-colors ${
              selectedCategoryId === category.id
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-blue-50"
            }`}
          >
            <span>{category.categorie_name}</span>
          </button>
        </li>
      ))}
    </ul>
  </div>
);

const PriceFilter = ({
  priceRanges,
  selectedPriceRange,
  onPriceRangeClick,
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
    <h2 className="mb-3 sm:mb-4 flex items-center text-base sm:text-lg font-bold">
      <span className="mr-2 h-5 w-1 rounded-full bg-gradient-to-b from-blue-500 to-orange-500" />
      Khoảng giá
    </h2>
    <ul className="space-y-2 sm:space-y-3">
      {priceRanges.map((range) => (
        <li key={range.label}>
          <button
            onClick={() => onPriceRangeClick(range)}
            className={`flex w-full cursor-pointer items-center space-x-3 rounded px-2 py-1.5 sm:py-2 text-left text-sm sm:text-base transition-colors ${
              selectedPriceRange?.label === range.label
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-blue-50"
            }`}
          >
            <input
              type="radio"
              name="price-range"
              checked={selectedPriceRange?.label === range.label}
              readOnly
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>{range.label}</span>
          </button>
        </li>
      ))}
    </ul>
  </div>
);

const FilterBar = ({
  total,
  sortOption,
  onSortChange,
  layout,
  onLayoutChange,
}) => (
  <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 rounded-xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm">
    <div className="text-sm text-gray-500">
      Tìm thấy <span className="font-medium text-gray-700">{total}</span> sản
      phẩm
    </div>
    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
      <div className="flex items-center">
        <span className="mr-2 text-sm text-gray-500 whitespace-nowrap">
          Sắp xếp:
        </span>
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
          className="block w-full sm:w-48 rounded-md border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        >
          <option value="">Mặc định</option>
          <option value="priceAsc">Giá thấp đến cao</option>
          <option value="priceDesc">Giá cao đến thấp</option>
        </select>
      </div>
      <div className="flex rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => onLayoutChange("grid")}
          className={`p-2 rounded-lg ${layout === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
          aria-label="Grid view"
        >
          <FontAwesomeIcon icon={faThLarge} className="text-gray-600" />
        </button>
        <button
          onClick={() => onLayoutChange("list")}
          className={`p-2 rounded-lg ${layout === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
          aria-label="List view"
        >
          <FontAwesomeIcon icon={faThList} className="text-gray-600" />
        </button>
      </div>
    </div>
  </div>
);

const Pagination = ({ page, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="mt-8 sm:mt-12 flex justify-center">
      <nav className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3" />
        </button>

        {getPageNumbers().map((num, index) =>
          num === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
          ) : (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg text-sm ${
                page === num
                  ? "bg-blue-600 text-white font-medium"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {num}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" />
        </button>
      </nav>
    </div>
  );
};

export default ShopPage;
