import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import {
  faTimes,
  faArrowUpFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const ProductTable = ({
  currentProducts,
  handleEdit,
  indexOfFirstItem,
  selectedProduct,
  handleDelete,
  categories,
  showDeleted,
}) => {
  const [showDescriptionPopup, setShowDescriptionPopup] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");

  const handleDescriptionClick = (e, description) => {
    e.stopPropagation();
    setSelectedDescription(description);
    setShowDescriptionPopup(true);
  };

  const closePopup = () => {
    setShowDescriptionPopup(false);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {[
              "#",
              "Mã SP",
              "Tên sản phẩm",
              "Giá nhập",
              "Giá bán",
              "Nhóm",
              "Mô tả",
              "Thao tác",
            ].map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentProducts.length > 0 ? (
            currentProducts.map((product, index) => (
              <tr
                key={product.id}
                onClick={() => !showDeleted && handleEdit(product)}
              >
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{product.product_code}</td>
                <td>{product.product_name}</td>
                <td>{parseInt(product.import_price).toLocaleString()}</td>
                <td>{parseInt(product.sell_price).toLocaleString()}</td>
                <td>
                  {categories.find((cat) => cat.id === product.category_id)
                    ?.categorie_name || "Không xác định"}
                </td>
                <td
                  className="p-2 border-b max-w-[200px] truncate hover:text-orange-600 cursor-pointer no-underline"
                  onClick={(e) =>
                    handleDescriptionClick(e, product.description)
                  }
                >
                  {product.description || "Không có mô tả"}
                </td>
                <td>
                  <div className="flex justify-center items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(product.id);
                      }}
                      className={`p-2 rounded-full ${
                        showDeleted
                          ? "text-orange-500 hover:bg-orange-50"
                          : "text-red-500 hover:bg-red-50"
                      }`}
                      title={
                        showDeleted ? "Khôi phục sản phẩm" : "Xóa sản phẩm"
                      }
                    >
                      <FontAwesomeIcon
                        icon={showDeleted ? faArrowUpFromBracket : faTrashCan}
                        size="lg"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="py-4 text-center text-gray-500">
                {showDeleted
                  ? "Không có sản phẩm nào đã bị xóa"
                  : "Không tìm thấy sản phẩm nào"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showDescriptionPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold">Chi tiết mô tả sản phẩm</h3>
              <button
                onClick={closePopup}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
            <div className="p-4 whitespace-pre-wrap">
              {selectedDescription || "Không có mô tả chi tiết"}
            </div>
            <div className="border-t p-4 flex justify-end">
              <button
                onClick={closePopup}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
