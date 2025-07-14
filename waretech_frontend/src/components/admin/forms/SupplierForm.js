const SupplierForm = ({
  formData,
  handleChange,
  selectedSupplier,
  handleAdd,
  handleDelete,
  handleUpdate,
  resetForm,
}) => {
  return (
    <form className="border border-[#074EE8] p-4 rounded-lg mb-6">
      {/* Form fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Tên cung cấp */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <label className="text-sm sm:text-md font-medium text-gray-700 w-full sm:w-32">
            Tên cung cấp
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 border-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200"
          />
        </div>

        {/* Điện thoại */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <label className="text-sm sm:text-md font-medium text-gray-700 w-full sm:w-32">
            Điện thoại
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="border p-2 border-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200"
          />
        </div>

        {/* Địa chỉ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <label className="text-sm sm:text-md font-medium text-gray-700 w-full sm:w-32">
            Địa chỉ
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="border p-2 border-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <label className="text-sm sm:text-md font-medium text-gray-700 w-full sm:w-32">
            Email
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 border-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200"
          />
        </div>
      </div>

      <hr className="w-full my-4 border-gray-300" />

      {/* Action buttons */}
      <div className="flex flex-nowrap gap-1 sm:gap-2 justify-center sm:justify-start items-center">
        <button
          type="button"
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded min-w-[70px] sm:w-[85px]"
        >
          Thêm
        </button>

        <button
          type="button"
          onClick={() => selectedSupplier && handleDelete(selectedSupplier.id)}
          className={`bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded min-w-[70px] sm:w-[85px] ${
            !selectedSupplier ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!selectedSupplier}
        >
          Xóa
        </button>

        <button
          type="button"
          onClick={(e) => selectedSupplier && handleUpdate(e)}
          className={`bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded min-w-[80px] sm:min-w-[100px] ${
            !selectedSupplier ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!selectedSupplier}
        >
          Cập nhật
        </button>

        <button
          type="button"
          onClick={resetForm}
          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded min-w-[70px] sm:w-[85px]"
        >
          Làm lại
        </button>
      </div>
    </form>
  );
};

export default SupplierForm;
