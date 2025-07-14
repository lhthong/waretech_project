import { useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import moment from "moment";
import {
  Tag,
  Button,
  Select,
  Modal,
  Input,
  Divider,
  Card,
  Statistic,
  DatePicker,
  message,
} from "antd";
import {
  SearchOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import Pagination from "../../components/admin/buttons/Pagination";
import {
  getAllOrders,
  getOrdersByStatus,
  updateOrderStatus,
  exportOrdersToExcel,
} from "../../services/OrderApi";
import OrderTable from "../../components/admin/tables/OrderTable";

const { RangePicker } = DatePicker;
const { Option } = Select;

const OrderPage = () => {
  // === State ===
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // === Fetch Data ===
  const fetchOrders = async (status = null) => {
    setLoading(true);
    try {
      const data = status
        ? await getOrdersByStatus(status)
        : await getAllOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách đơn hàng");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // === Filtering ===
  useEffect(() => {
    let result = [...orders];

    if (statusFilter !== "all") {
      result = result.filter((o) => o.trang_thai === statusFilter);
    }

    if (dateRange?.length === 2) {
      const [start, end] = [
        dateRange[0].startOf("day"),
        dateRange[1].endOf("day"),
      ];
      result = result.filter((o) =>
        moment(o.created_at).isBetween(start, end, null, "[]")
      );
    }

    if (searchText) {
      const text = searchText.toLowerCase();
      result = result.filter(
        (o) =>
          o.ma_don_hang.toLowerCase().includes(text) ||
          o.users?.fullname.toLowerCase().includes(text) ||
          o.users?.phone.includes(text)
      );
    }

    setFilteredOrders(result);
  }, [orders, statusFilter, dateRange, searchText]);

  // === Pagination ===
  const indexOfLastItem = currentPage * itemsPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // === Order Actions ===
  const handleUpdateStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      message.success("Cập nhật trạng thái thành công");
      fetchOrders();
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái");
      console.error(error);
    }
  };

  const handleExportToExcel = async () => {
    try {
      await exportOrdersToExcel();
      message.success("Xuất file Excel thành công");
    } catch (error) {
      message.error("Lỗi khi xuất Excel");
      console.error(error);
    }
  };

  const exportToPDF = async () => {
    try {
      const modalContent = document.querySelector(".ant-modal-body");
      if (!modalContent)
        return message.error("Không tìm thấy nội dung hóa đơn");

      message.loading({ content: "Đang tạo PDF...", key: "pdf" });

      const dataUrl = await toPng(modalContent, { quality: 1, pixelRatio: 2 });
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`HoaDon_${selectedOrder.ma_don_hang}.pdf`);
      message.success({ content: "Xuất PDF thành công", key: "pdf" });
    } catch (error) {
      message.error({ content: "Lỗi khi xuất PDF", key: "pdf" });
      console.error(error);
    }
  };

  // === Thống kê ===
  const stats = [
    ["Tổng Đơn Hàng", orders.length],
    [
      "Chờ Xác Nhận",
      orders.filter((o) => o.trang_thai === "choxacnhan").length,
    ],
    ["Đã Xác Nhận", orders.filter((o) => o.trang_thai === "daxacnhan").length],
    ["Đang Giao", orders.filter((o) => o.trang_thai === "danggiao").length],
    ["Hoàn Thành", orders.filter((o) => o.trang_thai === "hoanthanh").length],
    ["Đã Hủy", orders.filter((o) => o.trang_thai === "dahuy").length],
  ];

  // === Render ===
  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-[#012970] text-lg font-semibold">
          <FontAwesomeIcon icon={faRegularStar} />
          <h2>Quản Lý Đơn Hàng</h2>
        </div>
        <Button icon={<SyncOutlined />} onClick={() => fetchOrders()}>
          Làm mới
        </Button>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-4 mb-6">
        {stats.map(([label, value], i) => {
          const colorClasses = [
            "text-blue-600 border-blue-500",
            "text-yellow-600 border-yellow-500",
            "text-green-600 border-green-500",
            "text-purple-600 border-purple-500",
            "text-pink-600 border-pink-500",
            "text-red-600 border-red-500",
          ];
          const color = colorClasses[i % colorClasses.length];
          return (
            <Card
              key={i}
              className={`rounded-2xl border-2 shadow-md ${color.split(" ")[1]}`}
              bodyStyle={{
                paddingTop: "24px",
                paddingBottom: "24px",
                paddingRight: "0px",
                paddingLeft: "0px",
              }}
            >
              <Statistic
                title={
                  <span
                    className={`text-sm sm:text-base font-medium whitespace-nowrap  ${color.split(" ")[0]}`}
                  >
                    {label}
                  </span>
                }
                value={value}
                valueStyle={{ fontSize: "24px" }}
                className="text-center"
              />
            </Card>
          );
        })}
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm mã đơn, tên KH, SĐT..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-48 sm:w-full xl:w-72"
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-32"
        >
          <Option value="all">Tất cả</Option>
          <Option value="choxacnhan">Chờ xác nhận</Option>
          <Option value="daxacnhan">Đã xác nhận</Option>
          <Option value="danggiao">Đang giao</Option>
          <Option value="hoanthanh">Hoàn thành</Option>
          <Option value="dahuy">Đã hủy</Option>
        </Select>
        <RangePicker onChange={setDateRange} className="w-52 sm:w-60" />
        <Button icon={<FileExcelOutlined />} onClick={handleExportToExcel}>
          Xuất Excel
        </Button>
      </div>
      <div className="overflow-x-auto">
        {/* Bảng đơn hàng */}
        <OrderTable
          orders={currentOrders}
          loading={loading}
          onView={(record) => {
            setSelectedOrder(record);
            setIsModalVisible(true);
          }}
          onUpdateStatus={handleUpdateStatus}
          currentPage={currentPage}
          totalPages={totalPages}
          PaginationComponent={Pagination}
          onPageChange={handlePageChange}
        />
      </div>
      {/* Modal chi tiết đơn hàng */}
      <Modal
        title={`CHI TIẾT ĐƠN HÀNG ${selectedOrder?.ma_don_hang}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
        style={{ top: 60 }}
      >
        {selectedOrder && (
          <div className="max-h-[70vh] overflow-y-auto space-y-4 scrollbar-hide">
            <div>
              <h3 className="font-semibold">Thông tin khách hàng</h3>
              <p>
                <b>Tên:</b> {selectedOrder.users?.fullname || "Không có"}
              </p>
              <p>
                <b>SĐT:</b> {selectedOrder.users?.phone || "Không có"}
              </p>
              <p>
                <b>Email:</b> {selectedOrder.users?.username || "Không có"}
              </p>
              <p>
                <b>Địa chỉ:</b> {selectedOrder.users?.address || "Không có"}
              </p>
            </div>
            <Divider />
            <div>
              <h3 className="font-semibold">Sản phẩm đã đặt</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left">Tên</th>
                    <th>Giá</th>
                    <th>SL</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.order_details?.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td>{item.products?.product_name}</td>
                      <td>{item.products?.sell_price.toLocaleString()}đ</td>
                      <td>{item.so_luong}</td>
                      <td>
                        {(
                          item.products?.sell_price * item.so_luong
                        ).toLocaleString()}
                        đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Divider />
            <div>
              <b>Tổng cộng:</b> {selectedOrder.tong_tien.toLocaleString()}đ
            </div>
            <Divider />
            <div>
              <b>Trạng thái:</b> <Tag>{selectedOrder.trang_thai}</Tag>
            </div>
            <div className="text-right space-x-2">
              <Button
                icon={<FilePdfOutlined />}
                onClick={exportToPDF}
                type="primary"
              >
                Xuất PDF
              </Button>
              {selectedOrder.trang_thai === "choxacnhan" && (
                <>
                  <Button
                    danger
                    onClick={() => {
                      handleUpdateStatus(selectedOrder.id, "dahuy");
                      setIsModalVisible(false);
                    }}
                  >
                    Hủy đơn
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      handleUpdateStatus(selectedOrder.id, "daxacnhan");
                      setIsModalVisible(false);
                    }}
                  >
                    Xác nhận
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderPage;
