import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const FAQTable = ({
  currentFaqs,
  handleEdit,
  indexOfFirstItem,
  handleDelete,
  handleToggleStatus,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selected, setSelected] = useState("");

  const handleAddressClick = (e, address) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra toàn bộ hàng
    setSelected(address);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            {[
              "#",
              "Câu hỏi",
              "Câu trả lời",
              "Từ khóa",
              "Câu hỏi thay thế",
              "Trạng thái",
              "Thao tác",
            ].map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentFaqs.length > 0 ? (
            currentFaqs.map((faq, index) => (
              <tr key={faq.id} onClick={() => handleEdit(faq)}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td className="min-w-[120px] break-words whitespace-normal">
                  {faq.question}
                </td>
                <td
                  className="p-2 border-b max-w-[100px] sm:max-w-[200px] truncate hover:text-orange-600 cursor-pointer no-underline"
                  onClick={(e) => handleAddressClick(e, faq.answer)}
                >
                  {faq.answer}
                </td>
                <td className="min-w-[120px] break-words whitespace-normal">
                  {faq.keywords || "N/A"}
                </td>
                <td>{faq.alternative_questions || "N/A"}</td>
                <td>
                  <div className="flex justify-center items-center">
                    {faq.status ? (
                      <FontAwesomeIcon
                        icon={faCheck}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(faq.id, faq.status);
                        }}
                        className="text-blue-500 hover:text-blue-600 text-lg cursor-pointer"
                        title="Bật - Click để tắt"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faTimes}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(faq.id, faq.status);
                        }}
                        className="text-red-500 hover:text-red-600 text-lg cursor-pointer"
                        title="Tắt - Click để bật"
                      />
                    )}
                  </div>
                </td>
                <td>
                  <div className="flex justify-center items-center h-full">
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(faq.id);
                      }}
                      className="text-red-500 hover:text-red-700 text-lg cursor-pointer"
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="p-3 text-center text-gray-500">
                Không tìm thấy FAQ
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold">Câu trả lời</h3>
              <button
                onClick={closePopup}
                className="text-gray-500 hover:text-orange-500"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="p-4 whitespace-pre-wrap">{selected}</div>
          </div>
        </div>
      )}
    </>
  );
};
export default FAQTable;
