import { Table, Tag, Space, Button, Select } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

const OrderTable = ({
  orders,
  loading,
  onView,
  onUpdateStatus,
  currentPage,
  totalPages,
  PaginationComponent,
  onPageChange,
}) => {
  const columns = [
    {
      title: "Mã Đơn",
      dataIndex: "ma_don_hang",
      className: "whitespace-nowrap",
      width: 150,
      sorter: (a, b) => a.ma_don_hang.localeCompare(b.ma_don_hang),
    },
    {
      title: "Khách Hàng",
      width: 150,
      className: "whitespace-nowrap",
      render: (_, record) => (
        <>
          <div>{record.users?.fullname || "Không có"}</div>
          <div className="text-gray-500">
            {record.users?.phone || "Không có"}
          </div>
        </>
      ),
    },
    {
      title: "Ngày Đặt",
      dataIndex: "created_at",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: "Tổng Tiền",
      dataIndex: "tong_tien",
      render: (amount) => `${amount.toLocaleString()}đ`,
      sorter: (a, b) => a.tong_tien - b.tong_tien,
    },
    {
      title: "Trạng Thái",
      dataIndex: "trang_thai",
      render: (status) => {
        const statusMap = {
          choxacnhan: ["gold", "Chờ xác nhận"],
          daxacnhan: ["blue", "Đã xác nhận"],
          danggiao: ["purple", "Đang giao"],
          hoanthanh: ["green", "Hoàn thành"],
          dahuy: ["red", "Đã hủy"],
        };
        const [color, label] = statusMap[status] || ["gray", status];
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: <div className="text-center">Thao Tác</div>,
      width: 220,
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => onView(record)} />
          <Select
            value={record.trang_thai}
            onChange={(value) => onUpdateStatus(record.id, value)}
            style={{ width: 110 }}
            disabled={["dahuy", "hoanthanh"].includes(record.trang_thai)}
          >
            <Option value="choxacnhan">Chờ</Option>
            <Option value="daxacnhan">Đã xác nhận</Option>
            <Option value="danggiao">Đang giao</Option>
            <Option value="hoanthanh">Hoàn thành</Option>
          </Select>
          {record.trang_thai === "choxacnhan" && (
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => onUpdateStatus(record.id, "dahuy")}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="border border-[#074EE8] p-4 rounded-lg">
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ x: "max-content" }}
        tableLayout="fixed"
      />
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default OrderTable;
