import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
const SupplierTable = ({
  currentSuppliers,
  handleEdit,
  indexOfFirstItem,
  selectedSupplier,
  handleDelete,
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
      <table>
        <thead>
          <tr>
            {[
              "#",
              "Tên nhà cung cấp",
              "Điện thoại",
              "Email",
              "Địa chỉ",
              "Thao tác",
            ].map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentSuppliers.map((supplier, index) => (
            <tr key={supplier.id} onClick={() => handleEdit(supplier)}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{supplier.name}</td>
              <td>{supplier.phone}</td>
              <td>{supplier.email}</td>
              <td
                className="max-w-[150px] truncate  hover:text-orange-600 cursor-pointer"
                onClick={(e) => handleAddressClick(e, supplier.address)}
              >
                {supplier.address}
              </td>
              <td>
                <div className="flex justify-center items-center h-full">
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    onClick={() =>
                      selectedSupplier && handleDelete(selectedSupplier.id)
                    }
                    className="text-red-500 hover:text-red-700 text-lg"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

export default SupplierTable;
