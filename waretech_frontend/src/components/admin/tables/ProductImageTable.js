import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faExpand,
  faTrash,
  faStar,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { getImageUrl } from "../../../services/ProductImageApi";

const MainImage = ({ url, imageId, onDelete }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="relative group w-20 h-20 mx-auto cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {url ? (
        <>
          <img
            src={getImageUrl(url)}
            alt="Ảnh chính"
            className="w-full h-full object-cover rounded shadow-md border"
            onError={(e) => (e.target.src = "/path/to/default-placeholder.png")}
          />
          {hover && imageId && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("Bạn có chắc muốn xóa ảnh chính?")) {
                  onDelete(imageId);
                }
              }}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600"
            >
              <FontAwesomeIcon icon={faTrash} size="xs" />
            </button>
          )}
        </>
      ) : (
        <span className="text-gray-400 text-sm flex items-center justify-center h-full">
          Không có ảnh
        </span>
      )}
    </div>
  );
};

const ProductImageTable = ({
  currentProductImages = [],
  handleEdit,
  indexOfFirstItem = 0,
  selectedProImages,
  handleDeleteMainImage,
  handleDeleteSubImages,
  handleSetMainImage,
}) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentSubImages, setCurrentSubImages] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const openPopup = (images) => {
    setCurrentSubImages(images);
    setSelectedIds([]);
    setPopupVisible(true);
  };

  const toggleImage = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const handleDelete = () => {
    if (!selectedIds.length) return;
    if (window.confirm(`Xóa ${selectedIds.length} ảnh phụ?`)) {
      handleDeleteSubImages(selectedIds);
      setPopupVisible(false);
    }
  };

  const handleSetMain = () => {
    if (selectedIds.length === 1) {
      handleSetMainImage(selectedIds[0]);
      setPopupVisible(false);
    }
  };

  if (!currentProductImages.length) {
    return (
      <div className="text-center text-gray-500 py-6">Không có dữ liệu.</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Ảnh chính</th>
            <th>Ảnh phụ</th>
            <th>Mã sản phẩm</th>
            <th>Tên sản phẩm</th>
          </tr>
        </thead>
        <tbody>
          {currentProductImages.map((item, idx) => {
            const isSelected =
              selectedProImages?.product_id === item.product_id;
            const { product_info: p = {} } = item;

            return (
              <tr
                key={item.product_id}
                className={`border-t hover:bg-gray-50 transition-colors ${isSelected ? "bg-blue-50" : ""}`}
                onClick={() => handleEdit(item)}
              >
                <td>{indexOfFirstItem + idx + 1}</td>
                <td>
                  <MainImage
                    url={item.main_image_url}
                    imageId={item.main_image_id}
                    onDelete={handleDeleteMainImage}
                  />
                </td>
                <td>
                  {item.sub_images?.length ? (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        openPopup(item.sub_images);
                      }}
                      className="relative group cursor-pointer w-24 h-16 mx-auto"
                      title={`Xem ${item.sub_images.length} ảnh phụ`}
                    >
                      {item.sub_images.slice(0, 3).map((img, i) => (
                        <img
                          key={img.id}
                          src={getImageUrl(img.url)}
                          className="absolute w-12 h-12 object-cover rounded border-2 border-white"
                          style={{ left: `${i * 15}%`, zIndex: i }}
                          alt={`Sub ${i + 1}`}
                          onError={(e) =>
                            (e.target.src = "/path/to/default-placeholder.png")
                          }
                        />
                      ))}
                      {item.sub_images.length > 3 && (
                        <div className="absolute right-0 bottom-0 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                          +{item.sub_images.length - 3}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded">
                        <FontAwesomeIcon
                          icon={faExpand}
                          className="text-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Không có</span>
                  )}
                </td>
                <td>{p.product_code || "N/A"}</td>
                <td>{p.product_name || "N/A"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Popup */}
      {popupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-[#012970]">
                Ảnh phụ ({currentSubImages.length})
              </h3>
              <button
                onClick={() => setPopupVisible(false)}
                className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-200"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 overflow-y-auto flex-grow">
              {currentSubImages.map((img) => (
                <div
                  key={img.id}
                  className={`relative group border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedIds.includes(img.id)
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  onClick={() => toggleImage(img.id)}
                >
                  <img
                    src={getImageUrl(img.url)}
                    alt={`Sub ${img.id}`}
                    className="w-full h-32 object-cover"
                    onError={(e) =>
                      (e.target.src = "/path/to/default-placeholder.png")
                    }
                  />
                  <div className="absolute top-2 left-2 w-5 h-5 bg-white bg-opacity-80 rounded flex items-center justify-center border-2">
                    {selectedIds.includes(img.id) && (
                      <FontAwesomeIcon icon={faCheck} size="xs" color="blue" />
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100">
                    ID: {img.id}
                  </div>
                </div>
              ))}
            </div>

            {selectedIds.length > 0 && (
              <div className="p-4 border-t flex justify-end gap-2 sticky bottom-0 bg-white z-10">
                {selectedIds.length === 1 && (
                  <button
                    onClick={handleSetMain}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    <FontAwesomeIcon icon={faStar} /> Đặt làm ảnh chính
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  <FontAwesomeIcon icon={faTrash} /> Xóa {selectedIds.length}{" "}
                  ảnh
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageTable;
