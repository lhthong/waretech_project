import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      onPageChange(totalPages);
    }
  }, [currentPage, totalPages, onPageChange]);

  return (
    <div className="flex justify-end mt-4 space-x-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Trang trước"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="text-base" />
      </button>

      <span className="min-w-[2rem] h-8 px-1 bg-blue-500 text-white flex items-center justify-center rounded-md font-bold text-sm tracking-wider">
        {currentPage}/{totalPages || 1}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Trang sau"
      >
        <FontAwesomeIcon icon={faChevronRight} className="text-base" />
      </button>
    </div>
  );
};

export default Pagination;
