const ThresholdForm = ({
  formData,
  onChange,
  onupdate,
  onReset,
  selectedProduct,
}) => {
  const handleNumberInput = (e) => {
    const { name, value } = e.target;
    const numValue = value.replace(/[^0-9]/g, "");
    onChange({ target: { name, value: numValue } });
  };

  return (
    <form className="border border-[#074EE8] p-3 sm:p-4 rounded-lg">
      {selectedProduct && (
        <>
          <div className="mb-3 sm:mb-4">
            <label className="block font-medium mb-1 text-sm sm:text-base">
              Tên sản phẩm
            </label>
            <input
              type="text"
              value={selectedProduct.product_name || ""}
              readOnly
              className="bg-gray-100 border border-gray-400 p-2 rounded-lg w-full text-sm sm:text-base"
            />
          </div>

          <div className="mb-3 sm:mb-4">
            <label className="block font-medium mb-1 text-sm sm:text-base">
              Số lượng tồn kho hiện tại
            </label>
            <input
              type="number"
              value={selectedProduct.stock_quantity || ""}
              readOnly
              className="bg-gray-100 border border-gray-400 p-2 rounded-lg w-full text-sm sm:text-base"
            />
          </div>
        </>
      )}

      <div className="mb-3 sm:mb-4">
        <label className="block font-medium mb-1 text-sm sm:text-base">
          Ngưỡng tồn kho tối thiểu
        </label>
        <input
          type="text"
          name="min_stock_level"
          value={formData.min_stock_level}
          onChange={handleNumberInput}
          placeholder="Nhập số ≥ 0"
          className="border border-gray-400 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm sm:text-base"
          required
        />
      </div>

      <div className="mb-3 sm:mb-4">
        <label className="block font-medium mb-1 text-sm sm:text-base">
          Ngưỡng tồn kho tối đa
        </label>
        <input
          type="text"
          name="max_stock_level"
          value={formData.max_stock_level}
          onChange={handleNumberInput}
          placeholder="Nhập số > ngưỡng tối thiểu"
          className="border border-gray-400 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm sm:text-base"
          required
        />
      </div>

      <hr className="my-3 sm:my-4 border-gray-300" />

      <div className="flex flex-wrap gap-2 sm:gap-4">
        <button
          type="button"
          className={`bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg sm:w-[100px] text-sm sm:text-base hover:bg-blue-600 transition-colors ${
            !selectedProduct ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={onupdate}
          disabled={!selectedProduct}
        >
          Cập nhật
        </button>

        <button
          type="button"
          onClick={onReset}
          className="bg-gray-400 text-white px-3 sm:px-4 py-2 rounded-lg sm:w-[100px] text-sm sm:text-base hover:bg-gray-500 transition-colors"
        >
          Làm lại
        </button>
      </div>
    </form>
  );
};

export default ThresholdForm;
