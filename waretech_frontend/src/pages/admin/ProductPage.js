import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import {
  getProducts,
  addProducts,
  deleteProducts,
  updateProducts,
  restoreProduct,
  getDeletedProducts,
} from "../../services/ProductApi";
import { getCategories } from "../../services/CategoryApi";
import Pagination from "../../components/admin/buttons/Pagination";
import ProductForm from "../../components/admin/forms/ProductForm";
import ProductTable from "../../components/admin/tables/ProductTable";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleted, setShowDeleted] = useState(false);
  const itemsPerPage = 5;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    product_name: "",
    product_code: "",
    description: "",
    category_id: "",
    import_price: "",
    sell_price: "",
    price_adjustment: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData, deletedData] = await Promise.all([
        getProducts(),
        getCategories(),
        getDeletedProducts(),
      ]);
      setProducts(productsData);
      setFilteredProducts(productsData);
      setCategories(categoriesData);
      setDeletedProducts(deletedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = {
      ...formData,
      [name]: value,
    };

    if (name === "import_price" || name === "price_adjustment") {
      const giaNhap = parseFloat(
        name === "import_price" ? value : updatedFormData.import_price
      );
      const [kieu, phanTramStr] = (
        name === "price_adjustment" ? value : formData.price_adjustment || ""
      ).split("-");
      const phanTram = parseFloat(phanTramStr);

      if (!isNaN(giaNhap) && !isNaN(phanTram)) {
        let giaBan = 0;
        if (kieu === "tang") giaBan = giaNhap + (giaNhap * phanTram) / 100;
        else if (kieu === "giam") giaBan = giaNhap - (giaNhap * phanTram) / 100;
        updatedFormData.sell_price = giaBan.toFixed(0);
      } else {
        updatedFormData.sell_price = "";
      }
    }

    setFormData(updatedFormData);
  };

  const handleEdit = (product) => {
    if (showDeleted) return;

    setSelectedProduct(product);
    setFormData({
      product_name: product.product_name || "",
      product_code: product.product_code || "",
      description: product.description || "",
      category_id: product.category_id?.toString() || "",
      import_price: product.import_price || "",
      sell_price: product.sell_price || "",
      price_adjustment: "",
    });
  };

  const handleDelete = async (id) => {
    const action = showDeleted ? "khôi phục" : "xóa";
    if (window.confirm(`Bạn có chắc muốn ${action} sản phẩm này?`)) {
      try {
        if (showDeleted) {
          await restoreProduct(id);
        } else {
          await deleteProducts(id);
        }
        await fetchData();
        resetForm();
      } catch (error) {
        console.error(
          `Error ${showDeleted ? "restoring" : "deleting"} product:`,
          error
        );
        alert(`Có lỗi xảy ra khi ${action} sản phẩm!`);
      }
    }
  };

  const formatProductData = (formData) => {
    return {
      product_name: formData.product_name,
      product_code: formData.product_code,
      description: formData.description,
      category_id: Number(formData.category_id),
      import_price: Number(formData.import_price),
      sell_price: Number(formData.sell_price),
    };
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!formData.product_name || !formData.product_code) {
      alert("Vui lòng nhập đầy đủ các trường bắt buộc!");
      return;
    }

    const { price_adjustment, ...dataToSend } = formData;

    try {
      const formattedData = formatProductData(dataToSend);
      await addProducts(formattedData);
      await fetchData();
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Có lỗi xảy ra khi thêm sản phẩm!");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const { price_adjustment, ...dataToSend } = formData;

    try {
      const formattedData = formatProductData(dataToSend);
      await updateProducts(selectedProduct.id, formattedData);
      await fetchData();
      resetForm();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Có lỗi xảy ra khi cập nhật sản phẩm!");
    }
  };

  const resetForm = () => {
    setFormData({
      product_name: "",
      product_code: "",
      description: "",
      category_id: "",
      import_price: "",
      sell_price: "",
      price_adjustment: "",
    });
    setSelectedProduct(null);
    setSearchTerm("");
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const productsToFilter = showDeleted ? deletedProducts : products;
    const filtered = productsToFilter.filter((product) =>
      Object.values(product).some((field) =>
        String(field).toLowerCase().includes(value)
      )
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const toggleShowDeleted = (show) => {
    setShowDeleted(show);
    setFilteredProducts(show ? deletedProducts : products);
    setCurrentPage(1);
    resetForm();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={faRegularStar}
          className="mr-2 text-[#012970] text-lg"
        />
        <h2 className="text-xl font-semibold">Thông tin sản phẩm</h2>
      </div>

      <hr className="my-4 border-t-2 border-gray-300" />

      <ProductForm
        formData={formData}
        handleChange={handleChange}
        categories={categories}
        selectedProduct={selectedProduct}
        handleAdd={handleAdd}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
        resetForm={resetForm}
      />

      <div className="border border-[#074EE8] p-4 rounded-lg mt-4">
        <div className="flex items-center gap-2 mb-4 w-full overflow-hidden">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="🔍 Tìm kiếm theo mã, tên sản phẩm..."
            className="border p-2 border-gray-400 rounded-lg flex-1 focus:outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-200 flex-shrink min-w-0"
          />
          <select
            value={showDeleted ? "deleted" : "active"}
            onChange={(e) => toggleShowDeleted(e.target.value === "deleted")}
            className="border p-2 border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-200 flex-none"
          >
            <option value="active">Hiện có</option>
            <option value="deleted">Đã xóa</option>
          </select>
        </div>

        <hr className="my-4 border-gray-300" />
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Danh sách sản phẩm
        </h3>

        <ProductTable
          currentProducts={currentProducts}
          handleEdit={handleEdit}
          indexOfFirstItem={indexOfFirstItem}
          selectedProduct={selectedProduct}
          handleDelete={handleDelete}
          categories={categories}
          showDeleted={showDeleted}
        />

        {filteredProducts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default ProductPage;
