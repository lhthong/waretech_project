import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";

const FeaturedProductForm = ({
  formData,
  handleChange,
  selectedFeature,
  handleAdd,
  handleDelete,
  handleUpdate,
  resetForm,
  products,
}) => {
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProductOption, setSelectedProductOption] = useState(null);
  const [selectedTypeOption, setSelectedTypeOption] = useState(null);

  // Options cho trường Loại
  const typeOptions = useMemo(
    () => [
      { value: "featured", label: "Nổi bật" },
      { value: "new", label: "Mới" },
    ],
    []
  );

  // Khởi tạo giá trị cho select
  useEffect(() => {
    if (products?.length) {
      const options = products.map((product) => ({
        value: product.id,
        label: product.product_name,
      }));
      setProductOptions(options);

      if (selectedFeature) {
        const currentProduct = options.find(
          (option) => option.value === selectedFeature.product_id
        );
        setSelectedProductOption(currentProduct);

        const currentType = typeOptions.find(
          (option) => option.value === selectedFeature.type
        );
        setSelectedTypeOption(currentType);
      }
    }
  }, [products, selectedFeature, typeOptions]);

  // Xử lý khi chọn sản phẩm
  const handleProductChange = (selectedOption) => {
    setSelectedProductOption(selectedOption);
    handleChange({
      target: {
        name: "product_id",
        value: selectedOption?.value || "",
      },
    });
  };

  // Xử lý khi chọn loại
  const handleTypeChange = (selectedOption) => {
    setSelectedTypeOption(selectedOption);
    handleChange({
      target: {
        name: "type",
        value: selectedOption?.value || "featured",
      },
    });
  };

  // Hàm reset form
  const handleReset = () => {
    setSelectedProductOption(null);
    setSelectedTypeOption(null);
    resetForm(); // Gọi hàm reset từ props
  };

  // Xử lý khi thêm mới
  const handleAddClick = (e) => {
    e.preventDefault();
    handleAdd(e);
    handleReset(); // Reset form sau khi thêm
  };

  // Xử lý khi cập nhật
  const handleUpdateClick = (e) => {
    e.preventDefault();
    handleUpdate(e);
    handleReset(); // Reset form sau khi cập nhật
  };

  return (
    <form className="border border-[#074EE8] p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 mb-4 sm:mb-6">
        {/* Trường sản phẩm */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="text-sm sm:text-base font-medium text-gray-700 sm:w-24 whitespace-nowrap">
            Sản phẩm
          </label>
          <Select
            className="w-full sm:w-64"
            classNamePrefix="select"
            options={productOptions}
            value={selectedProductOption}
            onChange={handleProductChange}
            placeholder="Chọn sản phẩm..."
            isSearchable
            noOptionsMessage={() => "Không tìm thấy sản phẩm"}
            styles={{
              control: (base) => ({
                ...base,
                minHeight: "36px",
                borderColor: "#d1d5db",
                borderRadius: "0.375rem",
                fontSize: "14px",
                "&:hover": { borderColor: "#3b82f6" },
                "&:focus-within": {
                  borderColor: "#3b82f6",
                  boxShadow: "0 0 0 1px #3b82f6",
                },
              }),
            }}
          />
        </div>

        {/* Trường Loại */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="text-sm sm:text-base font-medium text-gray-700 sm:w-24 whitespace-nowrap">
            Đặc trưng
          </label>
          <Select
            className="w-full sm:w-64"
            classNamePrefix="select"
            options={typeOptions}
            value={selectedTypeOption}
            onChange={handleTypeChange}
            placeholder="Chọn loại..."
            styles={{
              control: (base) => ({
                ...base,
                minHeight: "36px",
                borderColor: "#d1d5db",
                borderRadius: "0.375rem",
                fontSize: "14px",
                "&:hover": { borderColor: "#3b82f6" },
                "&:focus-within": {
                  borderColor: "#3b82f6",
                  boxShadow: "0 0 0 1px #3b82f6",
                },
              }),
            }}
          />
        </div>

        {/* Trường Ưu tiên */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:col-span-2">
          <label className="text-sm sm:text-base font-medium text-gray-700 sm:w-24 whitespace-nowrap">
            Ưu tiên
          </label>
          <input
            type="number"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full sm:w-64 px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 text-sm sm:text-base"
            min="0"
          />
        </div>
      </div>

      <hr className="w-full my-3 sm:my-4 border-gray-300" />

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
        <button
          type="button"
          onClick={handleAddClick}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base min-w-[70px] sm:w-[85px]"
        >
          Thêm
        </button>
        <button
          type="button"
          onClick={() => selectedFeature && handleDelete(selectedFeature.id)}
          className={`bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base min-w-[70px] sm:w-[85px] ${
            !selectedFeature ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!selectedFeature}
        >
          Xóa
        </button>
        <button
          type="button"
          onClick={handleUpdateClick}
          className={`bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base min-w-[85px] ${
            !selectedFeature ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!selectedFeature}
        >
          Cập nhật
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base min-w-[70px] sm:w-[85px]"
        >
          Làm lại
        </button>
      </div>
    </form>
  );
};

export default FeaturedProductForm;
