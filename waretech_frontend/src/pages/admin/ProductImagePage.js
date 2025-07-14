import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import {
  addProductImage,
  addMultipleProductImages,
  getProductImages,
  setAsMainProductImage,
  deleteProductImage,
  deleteManyProductImages,
} from "../../services/ProductImageApi";
import { getProducts } from "../../services/ProductApi";
import Pagination from "../../components/admin/buttons/Pagination";
import ProductImageForm from "../../components/admin/forms/ProductImageForm";
import ProductImageTable from "../../components/admin/tables/ProductImageTable";

// --- Helper ---
const getImageUrl = (url) => {
  if (!url) return "";
  const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  return url.startsWith("http") ? url : `${baseUrl}/${url.replace(/^\/+/, "")}`;
};

const createObjectURL = (file) => (file ? URL.createObjectURL(file) : "");

const revokeObjectURLs = (urls) => {
  urls.forEach((url) => url?.startsWith("blob:") && URL.revokeObjectURL(url));
};

// --- Component ---
const ProductImagePage = () => {
  const [productImages, setProductImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProImages, setFilteredProImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedProImages, setSelectedProImages] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    mainImage: null,
    mainImagePreview: "",
    setMain: true,
    subImages: [],
    subImagePreviews: [],
  });

  // Fetch data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [imageList, productData] = await Promise.all([
        getProductImages(),
        getProducts(),
      ]);

      const grouped = imageList.reduce((acc, img) => {
        const pid = img.product_id;
        if (!acc[pid]) {
          acc[pid] = {
            product_id: pid,
            product_info: productData.find((p) => p.id === pid) || {},
            main_image_url: "",
            main_image_id: null,
            sub_images: [],
          };
        }

        if (img.is_main) {
          acc[pid].main_image_url = img.image_url;
          acc[pid].main_image_id = img.id;
        } else {
          acc[pid].sub_images.push({ id: img.id, url: img.image_url });
        }

        return acc;
      }, {});

      const result = Object.values(grouped);
      setProductImages(result);
      setFilteredProImages(result);
      setProducts(productData);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      setProductImages([]);
      setFilteredProImages([]);
      setProducts([]);
    }
  };

  // --- Handlers ---
  const handleChange = ({ target: { name, value } }) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      revokeObjectURLs([formData.mainImagePreview]);
      setFormData((prev) => ({
        ...prev,
        mainImage: file,
        mainImagePreview: createObjectURL(file),
      }));
    }
  };

  const handleSubImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(createObjectURL);
    setFormData((prev) => ({
      ...prev,
      subImages: [...prev.subImages, ...files],
      subImagePreviews: [...prev.subImagePreviews, ...previews],
    }));
  };

  const resetForm = () => {
    revokeObjectURLs([formData.mainImagePreview, ...formData.subImagePreviews]);
    setFormData({
      name: "",
      mainImage: null,
      mainImagePreview: "",
      setMain: true,
      subImages: [],
      subImagePreviews: [],
    });
    setSelectedProImages(null);
    setSearchTerm("");
    setResetKey((prev) => prev + 1);
  };

  const handleEdit = (group) => {
    resetForm();
    setSelectedProImages(group);
    setFormData({
      name: group.product_id,
      mainImage: null,
      mainImagePreview: getImageUrl(group.main_image_url),
      subImages: [],
      subImagePreviews: group.sub_images.map((img) => getImageUrl(img.url)),
      setMain: true,
    });
  };

  const handleDeleteMainImage = async (imageId) => {
    if (!imageId) return alert("Thiếu ID ảnh chính.");
    try {
      await deleteProductImage(imageId);
      alert("Xóa ảnh chính thành công!");
      fetchInitialData();
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Không thể xóa ảnh chính.");
    }
  };

  const handleDeleteSubImages = async (ids) => {
    if (!ids?.length) return;
    try {
      await deleteManyProductImages(ids);
      alert("Đã xóa ảnh phụ.");
      fetchInitialData();
    } catch (err) {
      console.error(err);
      alert("Không thể xóa ảnh phụ.");
    }
  };

  const handleSetMainImage = async (imageId) => {
    try {
      await setAsMainProductImage(imageId, { is_main: true });
      alert("Đã đặt ảnh chính!");
      fetchInitialData();
    } catch (err) {
      console.error(err);
      alert("Không thể cập nhật ảnh chính.");
    }
  };

  const uploadImages = async () => {
    const { name, mainImage, subImages } = formData;
    if (!name || (!mainImage && subImages.length === 0)) {
      alert("Vui lòng chọn sản phẩm và ảnh.");
      return;
    }

    let success = false;

    if (mainImage) {
      const form = new FormData();
      form.append("product_id", name);
      form.append("is_main", true);
      form.append("image", mainImage);
      try {
        await addProductImage(form);
        success = true;
      } catch (err) {
        alert("Không thể thêm ảnh chính.");
      }
    }

    if (subImages.length) {
      const form = new FormData();
      form.append("product_id", name);
      form.append("is_main", false);
      subImages.forEach((f) => form.append("images", f));
      try {
        await addMultipleProductImages(form);
        success = true;
      } catch (err) {
        alert("Không thể thêm ảnh phụ.");
      }
    }

    if (success) {
      alert("Tải ảnh thành công!");
      fetchInitialData();
      resetForm();
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    uploadImages();
  };

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);
    const filtered = productImages.filter(({ product_info }) => {
      const { product_code = "", product_name = "" } = product_info;
      return (
        product_code.toLowerCase().includes(keyword) ||
        product_name.toLowerCase().includes(keyword)
      );
    });
    setFilteredProImages(filtered);
    setCurrentPage(1);
  };

  // --- Pagination ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProductImages = filteredProImages.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProImages.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const productOptions = products.map((p) => ({
    label: `${p.product_code || "N/A"} - ${p.product_name || "N/A"}`,
    value: p.id,
  }));

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-5">
        <FontAwesomeIcon
          icon={faRegularStar}
          className="mr-2 text-[#012970] text-lg"
        />
        <h2 className="text-xl font-semibold text-[#012970]">
          Thông tin hình ảnh sản phẩm
        </h2>
      </div>
      <hr className="mb-5 border-t border-gray-300" />

      <ProductImageForm
        formData={formData}
        handleChange={handleChange}
        handleMainImageUpload={handleMainImageUpload}
        handleSubImagesUpload={handleSubImagesUpload}
        handleAdd={handleAdd}
        resetForm={resetForm}
        productOptions={productOptions}
        getImageUrl={getImageUrl}
        resetKey={resetKey}
      />

      <div className="mt-6 border border-[#074EE8] p-4 rounded-lg">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="🔍 Tìm kiếm theo mã hoặc tên sản phẩm..."
            className="border p-2 border-gray-400 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          />
        </div>
        <hr className="w-full my-4 border-gray-300" />
        <h3 className="text-lg font-semibold mb-4 text-[#012970]">
          Danh sách ảnh sản phẩm
        </h3>
        <ProductImageTable
          currentProductImages={currentProductImages}
          handleEdit={handleEdit}
          indexOfFirstItem={indexOfFirstItem}
          selectedProImages={selectedProImages}
          handleDeleteMainImage={handleDeleteMainImage}
          handleDeleteSubImages={handleDeleteSubImages}
          getImageUrl={getImageUrl}
          handleSetMainImage={handleSetMainImage}
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

export default ProductImagePage;
