import React from "react";
import Select from "react-select";

const ProductImageForm = ({
  formData,
  handleChange,
  handleAdd,
  resetForm,
  productOptions,
  handleMainImageUpload,
  handleSubImagesUpload,
  resetKey,
}) => {
  const { name, mainImagePreview, subImagePreviews } = formData;

  return (
    <form className="border border-[#074EE8] p-4 rounded-lg mb-6">
      {/* Chọn sản phẩm - Mobile optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4 sm:mb-6">
        <label className="text-left text-sm sm:text-md font-medium text-gray-700 sm:w-32">
          Tên sản phẩm
        </label>
        <div className="w-full">
          <Select
            options={productOptions}
            value={productOptions.find((opt) => opt.value === name) || null}
            onChange={(selected) =>
              handleChange({
                target: { name: "name", value: selected.value },
              })
            }
            placeholder="Chọn sản phẩm..."
            className="react-select-container"
            classNamePrefix="react-select"
            menuPlacement="auto"
          />
        </div>
      </div>

      {/* Grid ảnh chính và phụ */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 mb-4 sm:mb-6">
        {/* Ảnh chính */}
        <div className="space-y-2">
          <label className="font-medium text-sm sm:text-base block">
            Ảnh chính
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageUpload}
            className="border border-gray-300 rounded p-2 w-full text-sm sm:text-base"
            key={`main-${resetKey}`}
          />
          {mainImagePreview && (
            <img
              src={mainImagePreview}
              alt="Preview"
              className="w-20 h-20 sm:w-32 sm:h-32 mt-2 sm:mt-3 rounded shadow object-cover"
            />
          )}
        </div>

        {/* Ảnh phụ */}
        <div className="space-y-2">
          <label className="font-medium text-sm sm:text-base block">
            Ảnh phụ
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleSubImagesUpload}
            className="border border-gray-300 rounded p-2 w-full text-sm sm:text-base"
            key={`sub-${resetKey}`}
          />
          <div className="flex gap-2 mt-2 sm:mt-3 flex-wrap">
            {subImagePreviews.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Ảnh phụ ${idx + 1}`}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded shadow"
              />
            ))}
          </div>
        </div>
      </div>

      <hr className="w-full my-3 sm:my-4 border-gray-300" />

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
        <button
          type="button"
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base min-w-[70px] sm:w-[85px]"
        >
          Thêm
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base min-w-[70px] sm:w-[85px]"
        >
          Làm lại
        </button>
      </div>
    </form>
  );
};

export default ProductImageForm;
