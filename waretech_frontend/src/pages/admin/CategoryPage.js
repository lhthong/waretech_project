import { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import {
  addCategories,
  getCategories,
  deleteCategories,
  updateCategories,
} from "../../services/CategoryApi";
import {
  getProducts,
  updateStockThreshold,
  getProductsByStockStatus,
} from "../../services/ProductApi";
import Pagination from "../../components/admin/buttons/Pagination";
import CategoryForm from "../../components/admin/forms/CategoryForm";
import ThresholdForm from "../../components/admin/forms/ThresholdForm";
import ProductCategoryTable from "../../components/admin/tables/ProductCategoryTable";
import { getStockStatus } from "../../utils/productUtils";

const INITIAL_CATEGORY_FORM = { categorie_name: "", icon: "" };
const INITIAL_THRESHOLD_FORM = { min_stock_level: "", max_stock_level: "" };

const STATUS_FILTERS = [
  {
    label: "Dư thừa",
    value: "du-thua",
    activeClass: "bg-blue-500 text-white border-blue-500",
    inactiveClass: "border-gray-300 text-gray-700 hover:border-blue-300",
  },
  {
    label: "Sắp hết hàng",
    value: "sap-het",
    activeClass: "bg-yellow-400 text-white border-yellow-400",
    inactiveClass: "border-gray-300 text-gray-700 hover:border-yellow-300",
  },
  {
    label: "Còn đủ",
    value: "con-du",
    activeClass: "bg-green-500 text-white border-green-500",
    inactiveClass: "border-gray-300 text-gray-700 hover:border-green-300",
  },
  {
    label: "Hết hàng",
    value: "het-hang",
    activeClass: "bg-red-600 text-white border-red-600",
    inactiveClass: "border-gray-300 text-gray-700 hover:border-red-300",
  },
];

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState(
    INITIAL_CATEGORY_FORM
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [filterCategoryId, setFilterCategoryId] = useState(null);
  const [thresholdFormData, setThresholdFormData] = useState(
    INITIAL_THRESHOLD_FORM
  );
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchInitialData = useCallback(async () => {
    const [categoryData, productData] = await Promise.all([
      getCategories(),
      getProducts(),
    ]);

    const productWithStatus = productData.map((product) => ({
      ...product,
      status: getStockStatus(product),
    }));

    setCategories(categoryData);
    setProducts(productWithStatus);
    setFilteredProducts(productWithStatus);
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const applyFilters = useCallback(async (newStatus, newCategoryId) => {
    try {
      let filteredData;

      if (newStatus) {
        filteredData = await getProductsByStockStatus(newStatus);
      } else {
        const products = await getProducts();
        filteredData = products.map((product) => ({
          ...product,
          status: getStockStatus(product),
        }));
      }

      if (newCategoryId) {
        filteredData = filteredData.filter(
          (p) => p.category_id === newCategoryId
        );
      }

      setFilteredProducts(filteredData);
      setCurrentPage(1);
    } catch (err) {
      console.error("Lỗi khi áp dụng bộ lọc:", err);
    }
  }, []);

  const handleFilterByStatus = useCallback(
    (newStatus) => {
      const updatedStatus = status === newStatus ? null : newStatus;
      setStatus(updatedStatus);
      applyFilters(updatedStatus, filterCategoryId);
    },
    [status, filterCategoryId, applyFilters]
  );

  const handleFilterByCategory = useCallback(
    (categoryId) => {
      const updatedCategoryId =
        filterCategoryId === categoryId ? null : categoryId;
      setFilterCategoryId(updatedCategoryId);
      applyFilters(status, updatedCategoryId);
    },
    [filterCategoryId, status, applyFilters]
  );

  const handleCategoryFormChange = (e) => {
    setCategoryFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryFormData.categorie_name.trim()) {
      alert("Vui lòng nhập tên danh mục!");
      return;
    }
    await addCategories(categoryFormData);
    fetchInitialData();
    resetCategoryForm();
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!selectedCategoryId) return;
    await updateCategories(selectedCategoryId, categoryFormData);
    fetchInitialData();
    resetCategoryForm();
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
      await deleteCategories(id);
      fetchInitialData();
      resetCategoryForm();
    }
  };

  const handleSelectCategory = (id) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      setSelectedCategoryId(category.id);
      setCategoryFormData({ categorie_name: category.categorie_name });
      window.scrollTo({ top: 40, behavior: "smooth" });
    }
  };

  const resetCategoryForm = () => {
    setCategoryFormData(INITIAL_CATEGORY_FORM);
    setSelectedCategoryId(null);
  };

  const handleThresholdFormChange = (e) => {
    setThresholdFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditThreshold = (product) => {
    setSelectedProduct(product);
    setThresholdFormData({
      min_stock_level: product.min_stock_level || "",
      max_stock_level: product.max_stock_level || "",
    });
    window.scrollTo({ top: 50, behavior: "smooth" });
  };

  const handleUpdateThreshold = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const formData = {
      min_stock_level: parseInt(thresholdFormData.min_stock_level) || 0,
      max_stock_level: parseInt(thresholdFormData.max_stock_level) || 0,
    };

    if (isNaN(formData.min_stock_level) || isNaN(formData.max_stock_level)) {
      alert("Vui lòng nhập số nguyên hợp lệ");
      return;
    }

    if (formData.min_stock_level < 0 || formData.max_stock_level < 0) {
      alert("Giá trị ngưỡng không được âm");
      return;
    }

    if (formData.max_stock_level <= formData.min_stock_level) {
      alert("Ngưỡng tối đa phải lớn hơn ngưỡng tối thiểu");
      return;
    }

    try {
      await updateStockThreshold(selectedProduct.id, formData);
      fetchInitialData();
      resetThresholdForm();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật ngưỡng";
      alert(`Lỗi: ${errorMsg}`);
    }
  };

  const resetThresholdForm = () => {
    setThresholdFormData(INITIAL_THRESHOLD_FORM);
    setSelectedProduct(null);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = products.filter(
      (p) =>
        p?.product_code.toLowerCase().includes(value) ||
        p?.product_name.toLowerCase().includes(value)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const pageItems = filteredProducts.slice(
    (currentPage - 1) * 5,
    currentPage * 5
  );

  return (
    <div className="w-full bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={faRegularStar}
          className="mr-2 text-[#012970] text-lg"
        />
        <h2 className="text-xl sm:text-2xl font-semibold">
          Danh mục & ngưỡng tồn kho
        </h2>
      </div>
      <hr className="my-4 border-t-2 border-gray-300" />

      {/* Bộ lọc */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Status Filter */}
        <div>
          <h2 className="mb-2 sm:mb-3 text-lg font-medium">Tình trạng</h2>
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((button) => (
              <button
                key={button.value}
                className={`px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg border-2 transition-all ${
                  status === button.value
                    ? button.activeClass
                    : button.inactiveClass
                }`}
                onClick={() => handleFilterByStatus(button.value)}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <h2 className="mb-2 sm:mb-3 text-lg font-medium">Danh mục</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg border-2 transition-all ${
                  filterCategoryId === category.id
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-gray-300 text-gray-700 hover:border-blue-300"
                }`}
                onClick={() => handleFilterByCategory(category.id)}
              >
                {category.categorie_name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="border border-gray-200 rounded-lg shadow-sm p-3 sm:p-4">
          <CategoryForm
            formData={categoryFormData}
            handleChange={handleCategoryFormChange}
            onAdd={handleAddCategory}
            onUpdate={handleUpdateCategory}
            onDelete={handleDeleteCategory}
            onReset={resetCategoryForm}
            selectedCategoryId={selectedCategoryId}
            categories={categories}
            onSelectCategory={handleSelectCategory}
          />
        </div>
        <div className="border border-gray-200 rounded-lg shadow-sm p-3 sm:p-4">
          <ThresholdForm
            formData={thresholdFormData}
            onChange={handleThresholdFormChange}
            onupdate={handleUpdateThreshold}
            onReset={resetThresholdForm}
            selectedProduct={selectedProduct}
          />
        </div>
      </div>

      {/* Product table */}
      <div className="border border-gray-200 rounded-lg shadow-sm p-3 sm:p-4">
        <div className="mb-3 sm:mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="🔍 Tìm theo mã hoặc tên sản phẩm"
            className="border p-2 border-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm sm:text-base"
          />
        </div>
        <hr className="my-3 sm:my-4 border-gray-300" />
        <h3 className="text-md sm:text-lg font-semibold mb-3 sm:mb-4">
          Danh sách sản phẩm tồn kho
        </h3>
        <ProductCategoryTable
          currentProducts={pageItems}
          indexOfFirstItem={(currentPage - 1) * 5}
          handleEdit={handleEditThreshold}
          categories={categories}
        />
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredProducts.length / 5)}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
