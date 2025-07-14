import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

const FeaturedProductTable = ({
  currentFeatures = [],
  handleEdit,
  indexOfFirstItem,
  handleDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <table>
        <thead>
          <tr>
            {["#", "Tên Sản phẩm", "Đặc trưng", "Ưu tiên", "Thao tác"].map(
              (header, index) => (
                <th key={index}>{header}</th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {currentFeatures.map((product, index) => (
            <tr key={product.id} onClick={() => handleEdit(product)}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{product.products?.product_name}</td>
              <td>{product.type === "featured" ? "Nổi bật" : "Mới"}</td>
              <td>{product.priority}</td>
              <td>
                <div className="ml-5">
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(product.id);
                    }}
                    className="text-red-500 hover:text-red-700 text-lg"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeaturedProductTable;
