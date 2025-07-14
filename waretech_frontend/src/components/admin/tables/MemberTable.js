import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
const MemberTable = ({
  currentMembers,
  indexOfFirstItem,
  selectedMember,
  handleDelete,
  handleEdit,
}) => {
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");

  const handleAddressClick = (e, address) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra toàn bộ hàng
    setSelectedAddress(address);
    setShowAddressPopup(true);
  };

  const closePopup = () => {
    setShowAddressPopup(false);
  };

  return (
    <>
      <table className="w-full mb-4">
        <thead>
          <tr>
            <th className="p-3 text-left text-sm md:text-md w-12">#</th>
            <th className="p-3 text-left text-sm md:text-md">Tài khoản</th>
            <th className="p-3 text-left text-sm md:text-md hidden sm:table-cell">
              Họ tên
            </th>
            <th className="p-3 text-left text-sm md:text-md hidden md:table-cell">
              Giới tính
            </th>
            <th className="p-3 text-left text-sm md:text-md">SĐT</th>
            <th className="p-3 text-left text-sm md:text-md">Địa chỉ</th>
            <th className="p-3 text-left text-sm md:text-md hidden sm:table-cell">
              Quyền
            </th>
            <th className="p-3 text-center text-sm md:text-md">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {currentMembers.map((member, index) => (
            <tr key={member.iduser} onClick={() => handleEdit(member)}>
              <td className="p-3 border-b">{indexOfFirstItem + index + 1}</td>
              <td className="p-3 border-b font-medium">{member.username}</td>
              <td className="p-3 border-b hidden sm:table-cell">
                {member.fullname}
              </td>
              <td className="p-3 border-b hidden md:table-cell">
                {member.gender === "male"
                  ? "Nam"
                  : member.gender === "female"
                    ? "Nữ"
                    : "Khác"}
              </td>
              <td className="p-3 border-b">{member.phone || "..."}</td>
              <td
                className="p-3 border-b max-w-[150px] truncate hover:text-orange-600 cursor-pointer"
                onClick={(e) => handleAddressClick(e, member.address)}
              >
                {member.address || "..."}
              </td>
              <td className="p-3 border-b hidden sm:table-cell">
                {member.permission === "admin"
                  ? "Quản trị"
                  : member.permission === "staff"
                    ? "Nhân viên"
                    : "Khách hàng"}
              </td>
              <td className="p-3 border-b">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(member);
                      window.scrollTo(0, 0);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(member.iduser);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Address Popup */}
      {showAddressPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold">Chi tiết địa chỉ</h3>
              <button
                onClick={closePopup}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="p-4 whitespace-pre-wrap break-words">
              {selectedAddress || "Không có địa chỉ"}
            </div>
            <div className="border-t p-4 flex justify-end">
              <button
                onClick={closePopup}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MemberTable;
