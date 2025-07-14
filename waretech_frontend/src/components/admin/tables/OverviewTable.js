import React from "react";
import { motion } from "framer-motion";
import { FiSearch, FiChevronDown, FiFilter } from "react-icons/fi";
import Pagination from "../buttons/Pagination";

const OverviewTable = ({
  filter,
  setFilter,
  search,
  setSearch,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  currentItems,
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  return (
    <>
      {/* Bộ lọc */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row items-center gap-3 mb-6"
      >
        {/* Phần select filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="whitespace-nowrap text-sm font-medium text-gray-600 hidden xl:block">
            Lọc theo:
          </label>
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Tất cả</option>
              <option value="import">Nhập kho</option>
              <option value="export">Xuất kho</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Phần ngày tháng */}
        <div className="flex flex-row gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600 whitespace-nowrap">
              Từ:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg py-2 px-3 text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600 whitespace-nowrap">
              Đến:
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg py-2 px-3 text-sm"
            />
          </div>
        </div>

        {/* Nút xóa lọc */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setFilter("");
            setSearch("");
            setStartDate("");
            setEndDate("");
            setCurrentPage(1);
          }}
          className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-md w-full sm:w-auto"
        >
          <FiFilter className="mr-2" /> Xóa lọc
        </motion.button>
      </motion.div>

      {/* Bảng dữ liệu */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="border border-blue-200 p-4 rounded-xl overflow-hidden shadow-sm bg-white"
      >
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm kiếm theo tên sản phẩm hoặc người thực hiện..."
              className="w-full border p-2 pl-10 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200"
            />
          </div>
        </div>

        <hr className="w-full my-4 border-gray-200" />
        <h3 className="text-md font-semibold mb-4">Lịch sử nhập & xuất kho:</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium">
                  #
                </th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium">
                  Mã SP
                </th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium hidden sm:table-cell">
                  Tên sản phẩm
                </th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium">
                  Loại
                </th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium">
                  SL
                </th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium hidden sm:table-cell">
                  Người thực hiện
                </th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium">
                  Ngày
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-3 py-2 sm:px-4 sm:py-3">{item.id}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 font-medium text-blue-600">
                      {item.code}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 hidden sm:table-cell">
                      {item.name}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.type === "Nhập kho"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.type.charAt(0)}
                      </span>
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 font-medium">
                      {item.quantity}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 hidden sm:table-cell">
                      {item.user}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-500 whitespace-nowrap">
                      {item.date}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr className="border-t">
                  <td
                    colSpan="7"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    Không tìm thấy dữ liệu phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default OverviewTable;
