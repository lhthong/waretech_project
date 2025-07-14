import Select from "react-select";

const CustomSelectField = ({ label, name, options, value, onChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2 sm:gap-0">
    <label className="sm:col-span-1 text-md font-medium text-gray-700">
      {label}
    </label>
    <Select
      name={name}
      options={options}
      onChange={(selectedOption) =>
        onChange({
          target: {
            name,
            value: selectedOption ? selectedOption.value : "",
          },
        })
      }
      placeholder={`Chọn ${label.toLowerCase()}`}
      className="sm:col-span-2 w-full"
      styles={{
        control: (provided) => ({
          ...provided,
          borderColor: "gray",
          borderRadius: "0.375rem",
          boxShadow: "none",
          "&:hover": {
            borderColor: "#074EE8",
          },
        }),
      }}
      isClearable
      value={value ? options.find((option) => option.value === value) : null}
    />
  </div>
);

const ImportForm = ({
  formData,
  onChange,
  onSubmit,
  onUpdate,
  selectedWarehouse,
  onReset,
  products = [],
  members = [],
  suppliers = [],
}) => {
  const productOptions = products.map((product) => ({
    value: product.id,
    label: product.product_code,
  }));

  const supplierOptions = suppliers.map((supplier) => ({
    value: supplier.id,
    label: supplier.name,
  }));

  const memberOptions = members.map((user) => ({
    value: user.iduser,
    label: user.fullname,
  }));

  return (
    <form
      onSubmit={onSubmit}
      className="border border-[#074EE8] p-4 rounded-lg mb-6 mt-3"
    >
      <div className="grid gap-y-4">
        <CustomSelectField
          label="Mã sản phẩm"
          name="product_id"
          options={productOptions}
          value={formData.product_id}
          onChange={onChange}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2 sm:gap-0">
          <label className="sm:col-span-1 text-md font-medium text-gray-700">
            Số lượng
          </label>
          <input
            type="number"
            name="so_luong"
            value={formData.so_luong}
            onChange={onChange}
            required
            className="sm:col-span-2 border p-2 border-gray-400 focus:outline-none focus:ring-1 focus:border-blue-700 w-full"
            style={{ borderRadius: "0.375rem" }}
          />
        </div>
        <CustomSelectField
          label="Nhà cung cấp"
          name="supplier_id"
          options={supplierOptions}
          value={formData.supplier_id}
          onChange={onChange}
        />
        <CustomSelectField
          label="Người thực hiện"
          name="user_id"
          options={memberOptions}
          value={formData.user_id}
          onChange={onChange}
        />
      </div>
      <div className="flex flex-col items-center">
        <hr className="w-full my-4 border-gray-300 mt-4 sm:mt-7" />
        <div className="flex flex-nowrap sm:flex-row justify-center w-full gap-2">
          <button
            type="button"
            onClick={onSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto sm:min-w-24 transition duration-200"
          >
            Thêm
          </button>
          <button
            type="button"
            onClick={onUpdate}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto sm:min-w-24 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedWarehouse}
          >
            Cập nhật
          </button>
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto sm:min-w-24"
            onClick={onReset}
          >
            Làm lại
          </button>
        </div>
      </div>
    </form>
  );
};

export default ImportForm;
