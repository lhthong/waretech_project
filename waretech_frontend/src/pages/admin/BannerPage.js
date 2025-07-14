import { useState, useEffect } from "react";
import {
  Card,
  Switch,
  Upload,
  Button,
  List,
  message,
  Modal,
  Select,
  Segmented,
  Tooltip,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EyeOutlined,
  AppstoreOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import {
  getBanners,
  addBanner,
  deleteBanner,
  toggleBannerActive,
} from "../../services/BannerApi";
import { getImageUrl } from "../../services/ProductImageApi";
import Pagination from "../../components/admin/buttons/Pagination";

const BannerPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [previewImage, setPreviewImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

  const gridPageSize = 8;
  const listPageSize = 5;
  const pageSize = viewMode === "grid" ? gridPageSize : listPageSize;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getBanners();
        setBanners(data);
      } catch (err) {
        message.error("Không thể tải danh sách banner");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggle = async (id, currentStatus) => {
    try {
      const updated = await toggleBannerActive(id, !currentStatus);
      setBanners((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, is_active: updated.banner.is_active } : b
        )
      );
      message.success("Cập nhật trạng thái thành công");
    } catch (err) {
      message.error("Lỗi khi cập nhật trạng thái");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBanner(id);
      setBanners((prev) => prev.filter((b) => b.id !== id));
      message.success("Đã xóa banner");
    } catch (err) {
      message.error("Lỗi khi xóa banner");
    }
  };

  const handleBeforeUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setUploadPreview(reader.result);
      setUploadFile(file);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const filteredBanners = banners.filter((b) => {
    if (filter === "active") return b.is_active;
    if (filter === "inactive") return !b.is_active;
    return true;
  });

  const totalPages = Math.ceil(filteredBanners.length / pageSize);
  const paginatedBanners = filteredBanners.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const renderBannerCard = (item) => (
    <Card
      cover={
        <img
          alt="banner"
          src={getImageUrl(item.image_url)}
          className="h-40 object-cover cursor-pointer"
          onClick={() => setPreviewImage(getImageUrl(item.image_url))}
          style={{ minHeight: "160px" }}
        />
      }
      actions={[
        <Tooltip title={item.is_active ? "Tắt banner" : "Bật banner"}>
          <Switch
            checked={item.is_active}
            onChange={() => handleToggle(item.id, item.is_active)}
            className="hover:scale-110 transition-transform"
          />
        </Tooltip>,
        <Tooltip title="Xem toàn màn hình">
          <Button
            icon={<EyeOutlined />}
            onClick={() => setPreviewImage(getImageUrl(item.image_url))}
          />
        </Tooltip>,
        <Tooltip title="Xóa banner">
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(item.id)}
          />
        </Tooltip>,
      ]}
      className="w-full"
    >
      <Card.Meta
        description={`Trạng thái: ${item.is_active ? "Đang hiển thị" : "Đã tắt"}`}
      />
    </Card>
  );

  return (
    <div className="w-full bg-white p-2 sm:p-6 rounded-lg shadow-md">
      <div className="flex">
        <FontAwesomeIcon
          icon={faRegularStar}
          className="mt-1 mr-2 text-[#012970] text-lg"
        />
        <h2 className="mb-5">Quản lý Banner</h2>
      </div>
      <hr className="mb-5 border-t-2 border-gray-300" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Upload
          showUploadList={false}
          accept="image/*"
          beforeUpload={handleBeforeUpload}
          customRequest={async ({ file, onSuccess, onError }) => {
            const formData = new FormData();
            formData.append("image", file);

            try {
              const res = await addBanner(formData);
              setBanners((prev) => [res.banner, ...prev]);
              message.success("Tải ảnh thành công");
              onSuccess("ok");
            } catch (err) {
              message.error("Lỗi khi tải ảnh");
              onError(err);
            }
          }}
        >
          <Button
            type="primary"
            icon={<UploadOutlined />}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            Tải ảnh mới
          </Button>
        </Upload>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Select
            value={filter}
            onChange={(value) => {
              setFilter(value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-40"
            options={[
              { label: "Tất cả banner", value: "all" },
              { label: "Đang hiển thị", value: "active" },
              { label: "Đã tắt", value: "inactive" },
            ]}
          />

          <Segmented
            options={[
              { label: <AppstoreOutlined />, value: "grid" },
              { label: <BarsOutlined />, value: "list" },
            ]}
            value={viewMode}
            onChange={(value) => {
              setViewMode(value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      {viewMode === "grid" ? (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 4,
          }}
          dataSource={paginatedBanners}
          loading={loading}
          renderItem={(item) => <List.Item>{renderBannerCard(item)}</List.Item>}
        />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={paginatedBanners}
          loading={loading}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Tooltip title={item.is_active ? "Tắt banner" : "Bật banner"}>
                  <Switch
                    checked={item.is_active}
                    onChange={() => handleToggle(item.id, item.is_active)}
                    className="hover:scale-105 transition-transform"
                  />
                </Tooltip>,
                <Tooltip title="Xóa banner">
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(item.id)}
                  />
                </Tooltip>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <img
                    src={getImageUrl(item.image_url)}
                    alt="banner"
                    className="w-28 h-16 object-cover"
                    onClick={() => setPreviewImage(getImageUrl(item.image_url))}
                  />
                }
                title={`Banner ID: ${item.id}`}
                description={`Trạng thái: ${item.is_active ? "Đang hiển thị" : "Đã tắt"}`}
              />
            </List.Item>
          )}
        />
      )}

      <div className="mt-6 text-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <Modal
        open={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage(null)}
        width="auto"
        style={{ maxWidth: "95vw" }}
        centered
        className="[&_.ant-modal-content]:p-0"
      >
        <div className="p-4">
          <img
            alt="preview"
            src={previewImage}
            className="w-full h-auto max-h-[70vh] object-contain mx-auto"
          />
          <div className="mt-3 text-center text-sm text-gray-500">
            Nhấp bên ngoài để đóng
          </div>
        </div>
      </Modal>

      <Modal
        open={!!uploadPreview}
        onCancel={() => {
          setUploadPreview(null);
          setUploadFile(null);
        }}
        onOk={async () => {
          const formData = new FormData();
          formData.append("image", uploadFile);

          try {
            const res = await addBanner(formData);
            setBanners((prev) => [res.banner, ...prev]);
            message.success("Tải ảnh thành công");
          } catch (err) {
            message.error("Lỗi khi tải ảnh");
          } finally {
            setUploadPreview(null);
            setUploadFile(null);
          }
        }}
        okText="Xác nhận upload"
        cancelText="Huỷ"
        width={360}
        centered
        style={{ maxWidth: "90vw" }}
      >
        <img
          src={uploadPreview}
          alt="preview-upload"
          className="w-full h-auto object-contain rounded"
        />
      </Modal>
    </div>
  );
};

export default BannerPage;
