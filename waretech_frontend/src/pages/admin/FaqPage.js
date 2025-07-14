import { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import {
  addFaq,
  getAllFaqs,
  deleteFaq,
  updateFaq,
  updateFaqStatus,
} from "../../services/FaqApi";
import Pagination from "../../components/admin/buttons/Pagination";
import FAQForm from "../../components/admin/forms/FaqForm";
import FAQTable from "../../components/admin/tables/FaqTable";

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    keywords: "",
    alternative_questions: "",
    status: true,
  });

  const fetchFaqs = useCallback(async () => {
    try {
      const response = await getAllFaqs();
      const data = Array.isArray(response.data) ? response.data : [];
      setFaqs(data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setFaqs([]);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  useEffect(() => {
    let filtered = [...faqs];

    if (searchTerm.trim() !== "") {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (faq) =>
          String(faq.question).toLowerCase().includes(lower) ||
          String(faq.answer).toLowerCase().includes(lower) ||
          String(faq.keywords || "")
            .toLowerCase()
            .includes(lower) ||
          String(faq.alternative_questions || "")
            .toLowerCase()
            .includes(lower)
      );
    }

    if (statusFilter === "active") {
      filtered = filtered.filter((faq) => faq.status);
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter((faq) => !faq.status);
    }

    setFilteredFaqs(filtered);
    setCurrentPage(1);
  }, [faqs, searchTerm, statusFilter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (faq) => {
    setSelectedFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      keywords: faq.keywords || "",
      alternative_questions: faq.alternative_questions || "",
      status: faq.status,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa FAQ này?")) {
      try {
        await deleteFaq(id);
        fetchFaqs();
        resetForm();
      } catch (error) {
        console.error("Lỗi đang xóa FAQ:", error);
      }
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) {
      alert("Vui lòng nhập đầy đủ các trường bắt buộc!");
      return;
    }
    try {
      await addFaq(formData);
      fetchFaqs();
      resetForm();
    } catch (error) {
      console.error("Lỗi thêm FAQ:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (selectedFaq) {
      try {
        await updateFaq(selectedFaq.id, formData);
        fetchFaqs();
        resetForm();
      } catch (error) {
        console.error("Lỗi cập nhật FAQ:", error);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await updateFaqStatus(id, !currentStatus);
      fetchFaqs();
    } catch (error) {
      console.error("Error toggling FAQ status:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      question: "",
      answer: "",
      keywords: "",
      alternative_questions: "",
      status: true,
    });
    setSelectedFaq(null);
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleStatusFilter = (e) => setStatusFilter(e.target.value);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFaqs = filteredFaqs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <div className="flex">
        <FontAwesomeIcon
          icon={faRegularStar}
          className="mt-1 mr-2 text-[#012970] text-lg"
        />
        <h2 className="mb-5">Thông tin chatbot</h2>
      </div>

      <hr className="mb-5 border-t-2 border-gray-300" />
      <FAQForm
        formData={formData}
        handleChange={handleChange}
        selectedFaq={selectedFaq}
        handleAdd={handleAdd}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
        resetForm={resetForm}
      />
      <div className="border border-[#074EE8] p-4 rounded-lg">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="🔍 Tìm kiếm theo câu hỏi, câu trả lời, từ khóa..."
            className="border p-2 border-gray-400 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200"
          />
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="w-full sm:w-auto border p-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang bật</option>
            <option value="inactive">Đã tắt</option>
          </select>
        </div>

        <hr className="w-full my-4 border-gray-300" />
        <h3 className="text-md font-semibold mb-4">Danh sách chatbot:</h3>
        <div className="overflow-x-auto">
          <FAQTable
            currentFaqs={currentFaqs}
            handleEdit={handleEdit}
            indexOfFirstItem={indexOfFirstItem}
            selectedFaq={selectedFaq}
            handleDelete={handleDelete}
            handleToggleStatus={handleToggleStatus}
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

export default FAQPage;
