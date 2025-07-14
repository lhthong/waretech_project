import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const MemberForm = ({
  formData,
  handleChange,
  showPassword,
  selectedMember,
  setShowPassword,
  handleAdd,
  handleDelete,
  handleUpdate,
  resetForm,
}) => {
  return (
    <form className="border border-[#074EE8] p-4 sm:p-6 rounded-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* Username */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4 md:mb-0">
          <label className="text-left text-sm md:text-base font-medium text-gray-700 md:w-32 lg:w-36">
            Tài khoản*
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="border p-2 md:p-3 border-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 text-sm md:text-base"
          />
        </div>

        {/* Fullname */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4 md:mb-0">
          <label className="text-left text-sm md:text-base font-medium text-gray-700 md:w-32 lg:w-36">
            Họ và tên*
          </label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            required
            className="border p-2 md:p-3 border-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 text-sm md:text-base"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4 md:mb-0 relative">
          <label className="text-left text-sm md:text-base font-medium text-gray-700 md:w-32 lg:w-36">
            Mật khẩu*
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={selectedMember ? "********" : formData.password}
              onChange={handleChange}
              disabled={!!selectedMember}
              required={!selectedMember}
              className="border p-2 md:p-3 border-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm md:text-base"
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="absolute right-3 top-2.5 md:top-3.5 cursor-pointer text-gray-500 hover:text-gray-700 text-sm md:text-base"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4 md:mb-0">
          <label className="text-left text-sm md:text-base font-medium text-gray-700 md:w-32 lg:w-36">
            Địa chỉ
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="border p-2 md:p-3 border-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 text-sm md:text-base"
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4 md:mb-0">
          <label className="text-left text-sm md:text-base font-medium text-gray-700 md:w-32 lg:w-36">
            Giới tính
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="border p-2 md:p-3 border-gray-400 rounded-lg w-full appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 text-sm md:text-base"
          >
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>

        {/* Phone */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4 md:mb-0">
          <label className="text-left text-sm md:text-base font-medium text-gray-700 md:w-32 lg:w-36">
            Điện thoại
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="border p-2 md:p-3 border-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 text-sm md:text-base"
          />
        </div>

        {/* Permission */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4 md:mb-0">
          <label className="text-left text-sm md:text-base font-medium text-gray-700 md:w-32 lg:w-36">
            Quyền*
          </label>
          <select
            name="permission"
            value={formData.permission}
            onChange={handleChange}
            required
            className="border p-2 md:p-3 border-gray-400 rounded-lg w-full appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 text-sm md:text-base"
          >
            <option value="">Chọn quyền</option>
            <option value="admin">Quản trị viên</option>
            <option value="staff">Nhân viên</option>
          </select>
        </div>
      </div>

      <div className="flex flex-nowrap gap-1 md:gap-3 justify-center md:justify-start">
        <button
          type="button"
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg min-w-[70px] md:min-w-[100px] text-xs md:text-base"
        >
          Thêm
        </button>

        <button
          type="button"
          onClick={() => selectedMember && handleDelete(selectedMember.iduser)}
          className={`bg-red-500 hover:bg-red-600 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg min-w-[70px] md:min-w-[100px] text-xs md:text-base ${
            !selectedMember ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!selectedMember}
        >
          Xóa
        </button>

        <button
          type="button"
          onClick={handleUpdate}
          className={`bg-blue-500 hover:bg-blue-600 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg min-w-[70px] md:min-w-[100px] text-xs md:text-base ${
            !selectedMember ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!selectedMember}
        >
          Cập nhật
        </button>

        <button
          type="button"
          onClick={resetForm}
          className="bg-gray-500 hover:bg-gray-600 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg min-w-[70px] md:min-w-[100px] text-xs md:text-base"
        >
          Làm lại
        </button>
      </div>
    </form>
  );
};

export default MemberForm;
