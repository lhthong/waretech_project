const FAQForm = ({
  formData,
  handleChange,
  selectedFaq,
  handleAdd,
  handleDelete,
  handleUpdate,
  resetForm,
}) => {
  return (
    <form className="border border-[#074EE8] p-6 rounded-lg mb-6 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Question */}
        <div className="space-y-2">
          <label className="block text-md font-medium text-gray-700">
            Câu hỏi
          </label>
          <input
            type="text"
            name="question"
            value={formData.question}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200"
            placeholder="Nhập câu hỏi"
          />
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <label className="block text-md font-medium text-gray-700">
            Từ khóa
          </label>
          <input
            type="text"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200"
            placeholder="Nhập từ khóa, cách nhau bởi dấu phẩy"
          />
        </div>

        {/* Answer */}
        <div className="space-y-2">
          <label className="block text-md font-medium text-gray-700">
            Câu trả lời
          </label>
          <textarea
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200"
            placeholder="Nhập câu trả lời"
            rows="2"
          />
        </div>

        {/* Alternative Questions */}
        <div className="space-y-2">
          <label className="block text-md font-medium text-gray-700">
            Câu hỏi thay thế
          </label>
          <textarea
            name="alternative_questions"
            value={formData.alternative_questions}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200"
            placeholder="Nhập câu hỏi thay thế"
          />
        </div>
      </div>

      <hr className="w-full my-6 border-gray-200" />

      {/* Action Buttons */}
      <div className="flex flex-nowrap gap-1 sm:gap-2 justify-center sm:justify-start items-center">
        <button
          type="button"
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded min-w-[70px] sm:w-[85px]"
        >
          Thêm
        </button>
        <button
          type="button"
          onClick={() => selectedFaq && handleDelete(selectedFaq.id)}
          className={`bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded min-w-[70px] sm:w-[85px] ${
            !selectedFaq ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
          }`}
          disabled={!selectedFaq}
        >
          Xóa
        </button>
        <button
          type="button"
          onClick={(e) => selectedFaq && handleUpdate(e)}
          className={`bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded min-w-[80px] sm:min-w-[100px] ${
            !selectedFaq ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
          disabled={!selectedFaq}
        >
          Cập nhật
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded min-w-[70px] sm:w-[85px]"
        >
          Làm lại
        </button>
      </div>
    </form>
  );
};

export default FAQForm;
