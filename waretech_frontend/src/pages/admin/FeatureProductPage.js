import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import {
  getFeaturedProducts,
  createFeaturedProduct,
  deleteFeaturedProduct,
  updateFeaturedProduct,
} from "../../services/FeaturedProductApi";
import { getProducts } from "../../services/ProductApi";
import Pagination from "../../components/admin/buttons/Pagination";
import FeaturedProductForm from "../../components/admin/forms/FeaturedProductForm";
import FeaturedProductTable from "../../components/admin/tables/FeaturedProductTable";
const FeaturedProductsPage = () => {
  const [features, setFeatures] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFeatures, setFilteredFeatures] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [formData, setFormData] = useState({
    product_id: "",
    type: "featured",
    priority: "",
  });

  useEffect(() => {
    fetchFeaturedProducts();
    fetchAllProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const data = await getFeaturedProducts();
      setFeatures(data || []); // Đảm bảo luôn là mảng
      setFilteredFeatures(data || []);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
      setFeatures([]);
      setFilteredFeatures([]);
    }
  };
  const fetchAllProducts = async () => {
    try {
      const data = await getProducts();
      setAllProducts(data || []);
    } catch (error) {
      console.error("Lỗi khi tải tất cả sản phẩm:", error);
      setAllProducts([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "priority" ? value : value,
    });
  };

  const handleEdit = (product) => {
    setSelectedFeature(product);
    setFormData({
      product_id: product.product_id,
      type: product.type,
      priority: product.priority,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm nổi bật này?")) {
      await deleteFeaturedProduct(id);
      fetchFeaturedProducts();
      resetForm();
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    await createFeaturedProduct({
      ...formData,
      priority: parseInt(formData.priority) || 0,
    });

    fetchFeaturedProducts();
    resetForm();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (selectedFeature) {
      await updateFeaturedProduct(selectedFeature.id, {
        ...formData,
        priority: parseInt(formData.priority) || 0,
      });

      fetchFeaturedProducts();
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      product_id: "",
      type: "featured",
      priority: "",
    });
    setSelectedFeature(null);
    setSearchTerm("");
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = features.filter(
      (feature) =>
        String(feature.products?.product_name).toLowerCase().includes(value) ||
        feature.type.toLowerCase().includes(value)
    );
    setFilteredFeatures(filtered);
    setCurrentPage(1);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFeatures = filteredFeatures.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredFeatures.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <div className="flex">
        <FontAwesomeIcon
          icon={faRegularStar}
          className="mt-1 mr-2 text-[#012970] text-lg"
        />
        <h2 className="mb-5">Sản phẩm đặc trưng</h2>
      </div>
      <hr className="mb-5 border-t-2 border-gray-300" />

      <FeaturedProductForm
        formData={formData}
        handleChange={handleChange}
        selectedFeature={selectedFeature}
        handleAdd={handleAdd}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
        resetForm={resetForm}
        products={allProducts}
      />

      <div className="border border-[#074EE8] p-4 rounded-lg">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="🔍 Tìm kiếm theo ID sản phẩm hoặc loại..."
            className="border p-2 border-gray-400 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200"
          />
        </div>

        <hr className="w-full my-4 border-gray-300" />
        <h3 className="text-md font-semibold mb-4">
          Danh sách sản phẩm đặc trưng:
        </h3>

        <FeaturedProductTable
          currentFeatures={currentFeatures}
          handleEdit={handleEdit}
          indexOfFirstItem={indexOfFirstItem}
          handleDelete={handleDelete}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default FeaturedProductsPage;
