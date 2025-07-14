import { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import { getReviews, deleteReviews } from "../../services/FeedbackApi";
import Pagination from "../../components/admin/buttons/Pagination";
import FeedbackTable from "../../components/admin/tables/FeedbackTable";
import Select from "react-select";
import { FaStar } from "react-icons/fa";

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const data = await getReviews();
        setFeedback(data || []);
        setFilteredFeedbacks(data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách phản hồi:", error);
        setFeedback([]);
        setFilteredFeedbacks([]);
      }
    };
    fetchFeedback();
  }, []);

  const filterFeedbacks = useCallback(() => {
    const filtered = feedback.filter((item) => {
      const productName = item.products?.product_name?.toLowerCase() || "";
      const userName = item.users?.fullname?.toLowerCase() || "";
      const matchesSearch =
        productName.includes(searchTerm.toLowerCase()) ||
        userName.includes(searchTerm.toLowerCase());
      const matchesRating = ratingFilter ? item.rating === ratingFilter : true;
      return matchesSearch && matchesRating;
    });
    setFilteredFeedbacks(filtered);
    setCurrentPage(1);
  }, [feedback, searchTerm, ratingFilter]);

  useEffect(() => {
    filterFeedbacks();
  }, [filterFeedbacks]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa đánh giá này?")) {
      await deleteReviews(id);
      const data = await getReviews();
      setFeedback(data || []);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const ratingOptions = [
    { value: null, label: "Tất cả" },
    ...[5, 4, 3, 2, 1].map((rating) => ({
      value: rating,
      label: (
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-1">{rating}</span>
          <FaStar className="text-yellow-400" />
        </div>
      ),
    })),
  ];

  const customStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "0.5rem",
      padding: "2px 4px",
      borderColor: "#d1d5db",
      boxShadow: "none",
      "&:hover": { borderColor: "#60a5fa" },
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? "#e0f2fe" : "white",
      color: "black",
    }),
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={faRegularStar}
          className="mr-2 text-[#012970] text-lg"
        />
        <h2 className="text-xl font-semibold">Thông tin người dùng đánh giá</h2>
      </div>

      <hr className="my-4 border-gray-300" />

      <div className="border border-[#074EE8] p-4 rounded-lg">
        <div className="flex flex-row gap-4 mb-4 items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="🔍 Tìm kiếm theo tên người gửi hoặc tên sản phẩm..."
            className="border p-2 border-gray-300 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200"
          />

          <div className="flex items-center space-x-2">
            <div className="text-md font-semibold text-gray-700 hidden sm:block">
              Lọc theo đánh giá:
            </div>
            <Select
              options={ratingOptions}
              styles={customStyles}
              onChange={(selectedOption) =>
                setRatingFilter(selectedOption?.value || null)
              }
              defaultValue={ratingOptions[0]}
              isSearchable={false}
            />
          </div>
        </div>

        <hr className="my-4 border-gray-200" />

        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-md font-semibold">Danh sách đánh giá:</h3>
        </div>
        <div className="overflow-x-auto">
          <FeedbackTable
            currentFeedbacks={currentFeedbacks}
            indexOfFirstItem={indexOfFirstItem}
            handleDelete={handleDelete}
          />
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default FeedbackPage;
