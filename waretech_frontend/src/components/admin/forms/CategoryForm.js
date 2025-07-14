import Select from "react-select";

const CategoryForm = ({
  formData,
  handleChange,
  onAdd,
  onUpdate,
  onDelete,
  onReset,
  selectedCategoryId,
  categories,
  onSelectCategory,
}) => {
  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.categorie_name,
  }));

  const selectedOption = categoryOptions.find(
    (opt) => opt.value === selectedCategoryId
  );

  const handleSelectChange = (selected) => {
    if (selected) {
      onSelectCategory(selected.value);
    } else {
      onReset();
    }
  };

  return (
    <form className="border border-[#074EE8] p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
      <div className="mb-3 sm:mb-4">
        <label className="block mb-1 font-medium text-sm sm:text-base">
          Chọn danh mục để sửa / xóa
        </label>
        <Select
          options={categoryOptions}
          value={selectedOption || null}
          onChange={handleSelectChange}
          isClearable
          placeholder="🔍 Tìm và chọn danh mục..."
          className="text-sm sm:text-base"
          classNamePrefix="select"
          styles={{
            control: (base) => ({
              ...base,
              minHeight: "42px",
              fontSize: "14px",
              "@media (min-width: 640px)": {
                fontSize: "16px",
                minHeight: "44px",
              },
            }),
          }}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="mb-3 sm:mb-4 flex-1">
          <label className="block mb-1 font-medium text-sm sm:text-base">
            Tên danh mục
          </label>
          <input
            type="text"
            name="categorie_name"
            value={formData.categorie_name}
            onChange={handleChange}
            className="border p-2 border-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 text-sm sm:text-base"
          />
        </div>

        <div className="mb-3 sm:mb-4 flex-1">
          <label className="block mb-1 font-medium text-sm sm:text-base">
            Icon
          </label>
          <input
            type="text"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            className="border p-2 border-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 text-sm sm:text-base"
          />
        </div>
      </div>

      <hr className="mb-3 sm:mb-4 border-gray-300" />

      <div className="flex flex-wrap gap-2 sm:gap-3">
        <button
          type="button"
          onClick={selectedCategoryId ? onUpdate : onAdd}
          className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg flex-1 sm:flex-none sm:min-w-[100px] text-sm sm:text-base hover:bg-blue-600 transition-colors"
        >
          {selectedCategoryId ? "Cập nhật" : "Thêm"}
        </button>

        <button
          type="button"
          onClick={() => selectedCategoryId && onDelete(selectedCategoryId)}
          className={`bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg flex-1 sm:flex-none sm:min-w-[100px] text-sm sm:text-base hover:bg-red-600 transition-colors ${
            !selectedCategoryId ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!selectedCategoryId}
        >
          Xóa
        </button>

        <button
          type="button"
          onClick={onReset}
          className="bg-gray-400 text-white px-3 sm:px-4 py-2 rounded-lg flex-1 sm:flex-none sm:min-w-[100px] text-sm sm:text-base hover:bg-gray-500 transition-colors"
        >
          Làm lại
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
