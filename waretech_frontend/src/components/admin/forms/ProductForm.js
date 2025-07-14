const ProductForm = ({
  formData,
  handleChange,
  categories,
  selectedProduct,
  handleAdd,
  handleDelete,
  handleUpdate,
  resetForm,
}) => {
  return (
    <form className="border border-[#074EE8] p-4 md:p-6 rounded-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Mã sản phẩm */}
        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] items-center gap-x-4 gap-y-2">
          <label className="text-sm md:text-base font-medium text-gray-700">
            Mã sản phẩm*
          </label>
          <input
            type="text"
            name="product_code"
            value={formData.product_code}
            onChange={handleChange}
            className="border p-2 md:p-3 border-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 text-sm md:text-base"
            required
          />
        </div>

        {/* Tên sản phẩm */}
        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] items-center gap-x-4 gap-y-2">
          <label className="text-sm md:text-base font-medium text-gray-700">
            Tên sản phẩm*
          </label>
          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            required
            className="border p-2 md:p-3 border-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 text-sm md:text-base"
          />
        </div>

        {/* Giá nhập */}
        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] items-center gap-x-4 gap-y-2">
          <label className="text-sm md:text-base font-medium text-gray-700">
            Giá nhập*
          </label>
          <input
            type="number"
            name="import_price"
            value={formData.import_price}
            onChange={handleChange}
            className="border p-2 md:p-3 border-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 text-sm md:text-base"
            min="0"
          />
        </div>

        {/* Nhóm sản phẩm */}
        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] items-center gap-x-4 gap-y-2">
          <label className="text-sm md:text-base font-medium text-gray-700">
            Nhóm*
          </label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="appearance-none border p-2 md:p-3 border-gray-400 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 text-sm md:text-base"
          >
            <option value="" className="text-center">
              Chọn nhóm
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.categorie_name}
              </option>
            ))}
          </select>
        </div>

        {/* Giá bán */}
        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] items-center gap-x-4 gap-y-2">
          <label className="text-sm md:text-base font-medium text-gray-700">
            Giá bán
          </label>
          <div className="flex gap-2 w-full">
            <input
              type="number"
              name="sell_price"
              value={formData.sell_price}
              readOnly
              className="border p-2 md:p-3 border-gray-400 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 cursor-not-allowed text-sm md:text-base md:w-40"
            />
            <select
              name="price_adjustment"
              onChange={handleChange}
              className="appearance-none border p-2 md:p-3 border-gray-400 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 text-sm md:text-base"
            >
              <option value="" className="text-center">
                Điều chỉnh
              </option>
              <option value="tang-5">Tăng 5%</option>
              <option value="tang-10">Tăng 10%</option>
              <option value="tang-15">Tăng 15%</option>
              <option value="giam-5">Giảm 5%</option>
              <option value="giam-10">Giảm 10%</option>
              <option value="giam-15">Giảm 15%</option>
            </select>
          </div>
        </div>

        {/* Mô tả */}
        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] items-center gap-x-4 gap-y-2 md:col-span-2">
          <label className="text-sm md:text-base font-medium text-gray-700">
            Mô tả
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 md:p-3 border-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 text-sm md:text-base"
            rows="3"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-nowrap gap-1 md:gap-3 justify-center md:justify-start">
        <button
          type="button"
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white px-2 md:px-3 py-1 md:py-2 rounded-lg min-w-[70px] md:min-w-[100px] text-xs md:text-sm md:md:text-base"
        >
          Thêm
        </button>

        <button
          type="button"
          onClick={() => selectedProduct && handleDelete(selectedProduct.id)}
          className={`bg-red-500 hover:bg-red-600 text-white px-2 md:px-3 py-1 md:py-2 rounded-lg min-w-[70px] md:min-w-[100px] text-xs md:text-sm md:md:text-base ${
            !selectedProduct ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!selectedProduct}
        >
          Xóa
        </button>

        <button
          type="button"
          onClick={(e) => selectedProduct && handleUpdate(e)}
          className={`bg-blue-500 hover:bg-blue-600 text-white px-2 md:px-3 py-1 md:py-2 rounded-lg min-w-[70px] md:min-w-[100px] text-xs md:text-sm md:md:text-base ${
            !selectedProduct ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!selectedProduct}
        >
          Cập nhật
        </button>

        <button
          type="button"
          onClick={resetForm}
          className="bg-gray-500 hover:bg-gray-600 text-white px-2 md:px-3 py-1 md:py-2 rounded-lg min-w-[70px] md:min-w-[100px] text-xs md:text-sm md:md:text-base"
        >
          Làm lại
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
