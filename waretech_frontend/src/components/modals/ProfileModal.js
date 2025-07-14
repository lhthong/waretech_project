import { useState, useEffect } from "react";
import { Modal, Input, Select, Button, Upload, message } from "antd";
import {
  UserOutlined,
  CameraOutlined,
  EditOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { getCurrentUser, updateUser } from "../../services/AuthApi";
import { getImageUrl } from "../../services/ProductImageApi";

const { TextArea } = Input;

const ProfileModal = ({ isOpen, onClose }) => {
  const [editMode, setEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [employeeInfo, setEmployeeInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    role: "",
    avatar: null,
  });

  const [tempInfo, setTempInfo] = useState({ ...employeeInfo });

  useEffect(() => {
    if (isOpen) {
      const fetchUserData = async () => {
        try {
          const userData = await getCurrentUser();
          if (userData) {
            const newUserInfo = {
              name: userData.fullname || "",
              email: userData.username || "",
              phone: userData.phone || "",
              address: userData.address || "",
              gender: userData.gender || "",
              role: userData.permission || "",
              avatar: userData.avatar || null,
            };
            setEmployeeInfo(newUserInfo);
            setTempInfo({ ...newUserInfo });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          message.error("Không thể tải thông tin người dùng!");
        }
      };
      fetchUserData();
    }
  }, [isOpen]);

  const handleAvatarChange = (info) => {
    const file = info.file.originFileObj;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
        setAvatarFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const formData = new FormData();
      if (tempInfo.name) formData.append("fullname", tempInfo.name);
      if (tempInfo.phone) formData.append("phone", tempInfo.phone);
      if (tempInfo.gender) formData.append("gender", tempInfo.gender);
      if (tempInfo.address) formData.append("address", tempInfo.address);
      if (avatarFile) formData.append("avatar", avatarFile);

      const updatedUser = await updateUser(formData);

      const newUserInfo = {
        name: updatedUser.user.fullname || tempInfo.name,
        email: updatedUser.user.username || tempInfo.email,
        phone: updatedUser.user.phone || tempInfo.phone,
        address: updatedUser.user.address || tempInfo.address,
        gender: updatedUser.user.gender || tempInfo.gender,
        role: updatedUser.user.permission || tempInfo.role,
        avatar: updatedUser.user.avatar || tempInfo.avatar,
      };

      setEmployeeInfo(newUserInfo);
      setTempInfo(newUserInfo);
      setAvatarPreview(null);
      setAvatarFile(null);
      setEditMode(false);
      message.success("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Lỗi khi cập nhật thông tin, vui lòng thử lại!");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setTempInfo(employeeInfo);
    setAvatarPreview(null);
    setAvatarFile(null);
    setEditMode(false);
  };

  return (
    <Modal
      title={
        <div className="text-xl font-bold text-gray-800 flex items-center justify-center">
          <UserOutlined className="mr-2 text-blue-500" />
          Thông Tin Nhân Viên
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={450}
      className="rounded-lg shadow-xl"
      bodyStyle={{
        padding: "16px",
        background: "linear-gradient(145deg, #f9fafb, #e5e7eb)",
      }}
      centered
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-200 bg-white flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-105">
            {avatarPreview || employeeInfo.avatar ? (
              <img
                src={avatarPreview || getImageUrl(employeeInfo.avatar)}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserOutlined className="text-4xl text-blue-500" />
            )}
          </div>
          {editMode && (
            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleAvatarChange}
            >
              <Button
                size="small"
                icon={<CameraOutlined />}
                className="absolute bottom-1 right-1 bg-blue-500 text-white border-none rounded-full shadow-md hover:bg-blue-600 transition-colors duration-200"
              />
            </Upload>
          )}
        </div>

        {/* Form or Display Section */}
        {editMode ? (
          <div className="w-full grid grid-cols-1 gap-3 bg-white p-4 rounded-xl shadow-sm">
            <Input
              placeholder="Họ tên"
              value={tempInfo.name}
              onChange={(e) =>
                setTempInfo({ ...tempInfo, name: e.target.value })
              }
              className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 text-sm"
              prefix={<UserOutlined className="text-gray-400" />}
            />
            <Input
              placeholder="Số điện thoại"
              value={tempInfo.phone}
              onChange={(e) =>
                setTempInfo({ ...tempInfo, phone: e.target.value })
              }
              className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 text-sm"
              prefix={<PhoneOutlined className="text-gray-400" />}
            />
            <Input
              disabled
              value={tempInfo.email}
              className="rounded-md border-gray-300 bg-gray-100 text-gray-500 text-sm"
              prefix={<MailOutlined className="text-gray-400" />}
            />
            <Select
              value={tempInfo.gender}
              onChange={(value) => setTempInfo({ ...tempInfo, gender: value })}
              className="rounded-md text-sm"
              dropdownClassName="rounded-md"
            >
              <Select.Option value="male">Nam</Select.Option>
              <Select.Option value="female">Nữ</Select.Option>
            </Select>
            <TextArea
              rows={2}
              placeholder="Địa chỉ"
              value={tempInfo.address}
              onChange={(e) =>
                setTempInfo({ ...tempInfo, address: e.target.value })
              }
              className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 text-sm"
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </div>
        ) : (
          <div className="w-full bg-white p-4 rounded-xl shadow-sm space-y-2 text-left">
            <div className="flex items-center gap-2">
              <span className="text-blue-500 font-medium w-20 text-sm">
                Họ tên:
              </span>
              <span className="text-gray-800 text-sm">{employeeInfo.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-500 font-medium w-20 text-sm">
                Điện thoại:
              </span>
              <span className="text-gray-800 text-sm">
                {employeeInfo.phone}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-500 font-medium w-20 text-sm">
                Email:
              </span>
              <span className="text-gray-800 text-sm">
                {employeeInfo.email}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-500 font-medium w-20 text-sm">
                Giới tính:
              </span>
              <span className="text-gray-800 text-sm">
                {employeeInfo.gender === "male" ? "Nam" : "Nữ"}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-medium w-20 text-sm">
                Địa chỉ:
              </span>
              <span className="text-gray-800 text-sm flex-1 break-words">
                {employeeInfo.address}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end w-full gap-2 pt-2">
          {editMode ? (
            <>
              <Button
                onClick={handleCancel}
                className="rounded-md border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 text-sm"
              >
                Hủy
              </Button>
              <Button
                type="primary"
                onClick={handleSave}
                loading={isUpdating}
                className="rounded-md bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-sm"
              >
                Lưu
              </Button>
            </>
          ) : (
            <Button
              icon={<EditOutlined />}
              type="primary"
              onClick={() => setEditMode(true)}
              className="rounded-md bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-sm"
            >
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal;
