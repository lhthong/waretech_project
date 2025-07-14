import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FaStar } from "react-icons/fa";

const FeedbackTable = ({
  currentFeedbacks = [],
  indexOfFirstItem,
  handleDelete,
}) => {
  return (
    <table>
      <thead>
        <tr>
          {[
            "#",
            "Người gửi",
            "Tên sản phẩm",
            "Xếp hạng",
            "Nội dung",
            "Thao tác",
          ].map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {currentFeedbacks.map((feedback, index) => (
          <tr key={feedback.id}>
            <td>{indexOfFirstItem + index + 1}</td>
            <td className="whitespace-nowrap">{feedback.users?.fullname}</td>
            <td>{feedback.products?.product_name}</td>
            <td>
              <div className="flex items-center justify-center gap-1">
                <span className="font-medium">{feedback.rating}</span>
                <FaStar className="text-yellow-400 text-lg" />
              </div>
            </td>
            <td>{feedback.comment}</td>
            <td>
              <div className="flex justify-center items-center h-full">
                <FontAwesomeIcon
                  icon={faTrashCan}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(feedback.id);
                  }}
                  className="text-red-500 hover:text-red-700 text-lg"
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FeedbackTable;
