import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import { MemberService } from "../../services/MemberApi";
import Pagination from "../../components/admin/buttons/Pagination";
import MemberForm from "../../components/admin/forms/MemberForm";
import MemberTable from "../../components/admin/tables/MemberTable";

const MemberPage = () => {
  const [members, setMembers] = useState([]); // State quản lý danh sách
  const [searchTerm, setSearchTerm] = useState(""); // State lưu từ khóa tìm kiếm
  const [filteredMembers, setFilteredMembers] = useState([]); // State lưu danh sách sau khi lọc tìm kiếm
  const [currentPage, setCurrentPage] = useState(1); // State lưu trang hiện tại trong phân trang
  const itemsPerPage = 5; // Số lượng hiển thị trên mỗi trang
  const [selectedMember, setSelectedMember] = useState(null); // State lưu thông tin  đang được chọn để chỉnh sửa
  const [showPassword, setShowPassword] = useState(false);
  // State lưu dữ liệu của form nhập thông tin
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    password: "",
    address: "",
    gender: "",
    phone: "",
    permission: "",
  });
  // Kiểm tra token trước khi gọi API
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login"; // Nếu không có token, chuyển về trang login
    } else {
      fetchMembers();
    }
  }, []);
  // Hàm lấy danh sách từ API
  const fetchMembers = async () => {
    const data = await MemberService.getMembers();
    setMembers(data); // Lưu danh sách vào state
    setFilteredMembers(data); // Hiển thị danh sách ban đầu
  };
  // Hàm xử lý khi có sự thay đổi trong ô input của form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Hàm xử lý khi click vào một trong bảng để chỉnh sửa
  const handleEdit = (member) => {
    setSelectedMember(member); // Lưu được chọn
    setFormData(member); // Điền thông tin vào form
  };
  // Hàm xóa
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa thành viên này?")) {
      await MemberService.deleteMember(id);
      fetchMembers(); // Cập nhật lại danh sách sau khi xóa
      resetForm(); // Reset form về trạng thái ban đầu
    }
  };
  // Hàm thêm mới
  const handleAdd = async (e) => {
    e.preventDefault();
    // Kiểm tra nếu một số trường bắt buộc bị bỏ trống
    if (!formData.username || !formData.fullname || !formData.password) {
      alert("Vui lòng nhập đầy đủ các trường bắt buộc!");
      return;
    }
    await MemberService.addMember(formData);
    fetchMembers(); // Cập nhật lại danh sách sau khi thêm
    resetForm(); // Reset form về trạng thái ban đầu
  };
  // Hàm cập nhật thông tin
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (selectedMember) {
      await MemberService.updateMember(selectedMember.iduser, formData);
      fetchMembers(); // Cập nhật lại danh sách sau khi sửa
      resetForm(); // Reset form về trạng thái ban đầu
    }
  };
  // Hàm đặt lại form về trạng thái ban đầu
  const resetForm = () => {
    setFormData({
      username: "",
      fullname: "",
      password: "",
      address: "",
      gender: "",
      phone: "",
      permission: "",
    });
    setSelectedMember(null); // Bỏ chọn
    setSearchTerm(""); // Reset tìm kiếm
  };
  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    // Lọc danh sách theo từ khóa tìm kiếm
    const filtered = members.filter((member) =>
      Object.values(member).some((field) =>
        String(field).toLowerCase().includes(value)
      )
    );
    setFilteredMembers(filtered);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  // Phân trang: Lấy danh sách theo trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = filteredMembers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  // Hàm xử lý khi người dùng chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="w-full bg-white p-4 md:p-6 rounded-lg shadow-md mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={faRegularStar}
          className="mr-2 text-[#012970] text-lg"
        />
        <h2 className="text-xl font-semibold">Quản lý tài khoản</h2>
      </div>

      <hr className="my-4 border-t-2 border-gray-300" />

      {/* Form */}
      <MemberForm
        formData={formData}
        handleChange={handleChange}
        showPassword={showPassword}
        selectedMember={selectedMember}
        setShowPassword={setShowPassword}
        handleAdd={handleAdd}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
        resetForm={resetForm}
      />

      {/* Data Section */}
      <div className="border border-[#074EE8] p-3 md:p-4 rounded-lg">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="🔍 Tìm kiếm tài khoản..."
            className="border p-2 md:p-3 border-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200"
          />
        </div>

        <hr className="my-4 border-gray-300" />

        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Danh sách tài khoản
        </h3>

        {/* Table */}
        <div className="overflow-x-auto">
          <MemberTable
            currentMembers={currentMembers}
            indexOfFirstItem={indexOfFirstItem}
            selectedMember={selectedMember}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        </div>

        {/* Pagination */}
        <div className="mt-5">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default MemberPage;
