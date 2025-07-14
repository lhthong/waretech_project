import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

const formatDate = (date) => {
  if (!date) return "Lỗi hiển thị";

  const formattedDate = new Date(date);
  return `${formattedDate.getDate().toString().padStart(2, "0")}/${(formattedDate.getMonth() + 1).toString().padStart(2, "0")}/${formattedDate.getFullYear()}`;
};

const WarehouseTable = ({ currentWarehouses, indexOfFirstItem, onEdit }) => {
  return (
    <table className="mb-4">
      <thead>
        <tr>
          {[
            "#",
            "Mã sản phẩm",
            "Người nhập",
            "Người xuất",
            "SL nhập",
            "SL xuất",
            "Tồn kho",
            "Ngày nhập",
            "Ngày xuất",
            "Thao tác",
          ].map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {currentWarehouses.map((warehouse, index) => (
          <tr key={warehouse.id}>
            <td>{indexOfFirstItem + index + 1}</td>
            <td className="whitespace-nowrap">
              {warehouse.products?.product_code || "Lỗi hiển thị"}
            </td>

            <td className="whitespace-nowrap">
              {warehouse.users?.fullname || "Lỗi hiển thị"}
            </td>
            <td className="whitespace-nowrap">
              {warehouse.products?.phieu_xuat?.users?.fullname ||
                "Lỗi hiển thị"}
            </td>
            <td>{warehouse.so_luong || 0}</td>
            <td>{warehouse.products?.phieu_xuat?.so_luong || 0}</td>
            <td>{warehouse.products.stock_quantity || 0}</td>
            <td>{formatDate(warehouse.created_at)}</td>
            <td>{formatDate(warehouse.products?.phieu_xuat?.created_at)}</td>
            <td>
              <div className="flex flex-col items-center space-y-2">
                <button
                  onClick={() => onEdit(warehouse, "import")}
                  className="bg-blue-500 text-white rounded-lg px-3 py-1 text-xs hover:bg-blue-600 transition duration-200 flex items-center"
                >
                  <FontAwesomeIcon icon={faPenToSquare} className="mr-1" />
                  Nhập
                </button>
                <button
                  onClick={() => onEdit(warehouse, "export")}
                  className="bg-blue-500 text-white rounded-lg px-3 py-1 text-xs hover:bg-blue-600 transition duration-200 flex items-center"
                >
                  <FontAwesomeIcon icon={faPenToSquare} className="mr-1" />
                  Xuất
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WarehouseTable;
