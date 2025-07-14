import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import {
  getSuppliers,
  addSuppliers,
  deleteSupplier,
  updateSupplier,
} from "../../services/SupplierApi";
import Pagination from "../../components/admin/buttons/Pagination";
import SupplierForm from "../../components/admin/forms/SupplierForm";
import SupplierTable from "../../components/admin/tables/SupplierTable";
const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]); // State quản lý danh sách
  const [searchTerm, setSearchTerm] = useState(""); // State lưu từ khóa tìm kiếm
  const [filteredSuppliers, setFilteredSuppliers] = useState([]); // State lưu danh sách sau khi lọc tìm kiếm
  const [currentPage, setCurrentPage] = useState(1); // State lưu trang hiện tại trong phân trang
  const itemsPerPage = 5; // Số lượng hiển thị trên mỗi trang
  const [selectedSupplier, setSelectedSupplier] = useState(null); // State lưu thông tin  đang được chọn để chỉnh sửa
  // State lưu dữ liệu của form nhập thông tin
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
  });
  // useEffect để gọi API lấy danh sách khi component được render lần đầu
  useEffect(() => {
    fetchSuppliers();
  }, []);
  // Hàm lấy danh sách từ API
  const fetchSuppliers = async () => {
    const data = await getSuppliers();
    setSuppliers(data); // Lưu danh sách vào state
    setFilteredSuppliers(data); // Hiển thị danh sách ban đầu
  };
  // Hàm xử lý khi có sự thay đổi trong ô input của form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Hàm xử lý khi click vào một trong bảng để chỉnh sửa
  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier); // Lưu được chọn
    setFormData(supplier); // Điền thông tin vào form
  };
  // Hàm xóa
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa thành viên này?")) {
      await deleteSupplier(id);
      fetchSuppliers(); // Cập nhật lại danh sách sau khi xóa
      resetForm(); // Reset form về trạng thái ban đầu
    }
  };
  // Hàm thêm mới
  const handleAdd = async (e) => {
    e.preventDefault();
    // Kiểm tra nếu một số trường bắt buộc bị bỏ trống
    if (!formData.name || !formData.email || !formData.address) {
      alert("Vui lòng nhập đầy đủ các trường bắt buộc!");
      return;
    }
    await addSuppliers(formData);
    fetchSuppliers(); // Cập nhật lại danh sách sau khi thêm
    resetForm(); // Reset form về trạng thái ban đầu
  };
  // Hàm cập nhật thông tin
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (selectedSupplier) {
      await updateSupplier(selectedSupplier.id, formData);
      fetchSuppliers(); // Cập nhật lại danh sách sau khi sửa
      resetForm(); // Reset form về trạng thái ban đầu
    }
  };
  // Hàm đặt lại form về trạng thái ban đầu
  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      address: "",
      email: "",
    });
    setSelectedSupplier(null); // Bỏ chọn
    setSearchTerm(""); // Reset tìm kiếm
  };
  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    // Lọc danh sách theo từ khóa tìm kiếm
    const filtered = suppliers.filter((supplier) =>
      Object.values(supplier).some((field) =>
        String(field).toLowerCase().includes(value)
      )
    );
    setFilteredSuppliers(filtered);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  // Phân trang: Lấy danh sách theo trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  // Hàm xử lý khi người dùng chuyển trang
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
        <h2 className="mb-5 ">Thông tin nhà cung cấp</h2>
      </div>

      <hr className="mb-5 border-t-2 border-gray-300" />
      <SupplierForm
        formData={formData}
        handleChange={handleChange}
        selectedSupplier={selectedSupplier}
        handleAdd={handleAdd}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
        resetForm={resetForm}
      />
      <div className="border border-[#074EE8] p-4 rounded-lg">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch} // Tự động lọc danh sách khi nhập
            placeholder="🔍 Tìm kiếm theo tên nhà cung cấp,..."
            className="border p-2 border-gray-400 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200"
          />
        </div>

        <hr className="w-full my-4 border-gray-300" />
        <h3 className="text-md font-semibold mb-4">Danh sách nhà cung cấp:</h3>
        <div className="overflow-x-auto">
          <SupplierTable
            currentSuppliers={currentSuppliers}
            handleEdit={handleEdit}
            indexOfFirstItem={indexOfFirstItem}
            selectedSupplier={selectedSupplier}
            handleDelete={handleDelete}
          />
        </div>
        {/* Component phân trang */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};
export default SupplierPage;
