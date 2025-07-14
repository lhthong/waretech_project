import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { format, subMonths, startOfMonth } from "date-fns";
import {
  getYearlyStats,
  getWarehouseOverview,
  getStockByCategory,
} from "../../services/OverviewApi";
import OverviewTable from "../../components/admin/tables/OverviewTable";

const YearSelect = ({ selectedYear, onChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <select
      value={selectedYear}
      onChange={(e) => onChange(Number(e.target.value))}
      className="border border-gray-300 rounded-lg py-1 px-3 text-sm w-full sm:w-auto"
    >
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
};

const generateRecentMonths = () => {
  const months = [];
  const now = new Date();
  for (let i = 3; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    months.push({
      name: `Tháng ${format(monthDate, "M")}`,
      key: format(monthDate, "yyyy-MM"),
      date: startOfMonth(monthDate),
    });
  }
  return months;
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
      <p className="font-semibold text-gray-800">{label}</p>
      <p className="text-indigo-500">
        Nhập kho:{" "}
        <span className="font-medium">{payload[0].value} sản phẩm</span>
      </p>
      <p className="text-pink-500">
        Xuất kho:{" "}
        <span className="font-medium">{payload[1].value} sản phẩm</span>
      </p>
      <p className="text-green-500">
        Tồn kho:{" "}
        <span className="font-medium">{payload[2]?.value || 0} sản phẩm</span>
      </p>
    </div>
  );
};

const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
      <p className="font-semibold text-gray-800">{data.name}</p>
      <p className="text-gray-600">
        Tổng: <span className="font-medium">{data.quantity}</span>
      </p>
      <p className="text-gray-600">
        Tỷ lệ: <span className="font-medium">{data.value}%</span>
      </p>
    </div>
  );
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-semibold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const OverviewPage = () => {
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [activePieIndex, setActivePieIndex] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [historyData, setHistoryData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API biểu đồ cột
        const yearlyData = await getYearlyStats(selectedYear);
        const recentMonths = generateRecentMonths();

        const mapped = recentMonths.map((monthObj) => {
          const m = monthObj.date.getMonth(); // 0-based
          const match = yearlyData.find((d) => d.month === m + 1);
          return {
            ...monthObj,
            NhapKho: match?.total_import || 0,
            XuatKho: match?.total_export || 0,
            TonKho: match?.total_stock || 0,
          };
        });

        setBarData(mapped);

        const stockData = await getStockByCategory();
        // Sắp xếp theo số lượng giảm dần
        const sortedData = [...stockData].sort(
          (a, b) => b.quantity - a.quantity
        );
        // Lấy 4 danh mục đầu tiên (nhiều nhất)
        const topCategories = sortedData.slice(0, 4);
        // Tính tổng các danh mục còn lại
        const otherCategories = sortedData.slice(4);
        const otherTotal = otherCategories.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const otherPercentage = otherCategories.reduce(
          (sum, item) => sum + item.percentage,
          0
        );
        // Màu sắc cố định
        const colors = ["#8B5CF6", "#EC4899", "#06B6D4", "#F59E0B", "#10B981"];
        // Tạo mảng dữ liệu cho biểu đồ
        const pieFormatted = [
          ...topCategories.map((item, index) => ({
            name: item.category,
            value: item.percentage,
            quantity: item.quantity,
            color: colors[index],
          })),
          ...(otherTotal > 0
            ? [
                {
                  name: "Khác",
                  value: otherPercentage,
                  quantity: otherTotal,
                  color: colors[4],
                },
              ]
            : []),
        ];

        setPieData(pieFormatted);

        // Gọi API bảng lịch sử
        const warehouses = await getWarehouseOverview();
        const formatted = warehouses.map((entry, index) => ({
          id: index + 1,
          code: entry.products?.product_code || "N/A",
          name: entry.products?.product_name || "Không rõ",
          type: entry.type,
          quantity: entry.so_luong,
          user: entry.users?.fullname || "Chưa rõ",
          date: format(new Date(entry.created_at), "dd/MM/yyyy"),
        }));

        setHistoryData(formatted);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu tổng quan:", error);
      }
    };

    fetchData();
  }, [selectedYear]);

  const filteredHistory = historyData.filter((item) => {
    const matchesFilter =
      filter === "" ||
      (filter === "import" && item.type.toLowerCase() === "nhập kho") ||
      (filter === "export" && item.type.toLowerCase() === "xuất kho");

    const matchesSearch =
      search === "" ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.user.toLowerCase().includes(search.toLowerCase());

    const itemDate = new Date(item.date.split("/").reverse().join("-")); // Chuyển từ dd/MM/yyyy → yyyy-MM-dd

    const matchesDate =
      (!startDate || itemDate >= new Date(startDate)) &&
      (!endDate || itemDate <= new Date(endDate));

    return matchesFilter && matchesSearch && matchesDate;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    hover: { y: -5, transition: { duration: 0.2 } },
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md">
      {/* Biểu đồ */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8"
      >
        {/* BarChart */}
        <motion.div
          variants={itemVariants}
          whileHover="hover"
          className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-30 rounded-2xl"></div>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 relative z-10 gap-2">
            <h3 className="text-gray-700 text-lg font-semibold">
              Nhập/Xuất kho ({selectedYear})
            </h3>
            <YearSelect
              selectedYear={selectedYear}
              onChange={setSelectedYear}
            />
          </div>
          <div className="h-[280px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                onMouseMove={(state) => setHoveredBar(state.activeTooltipIndex)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280" }}
                  label={{
                    value: "Số lượng (sản phẩm)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#6b7280",
                    style: { textAnchor: "middle" },
                  }}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend />
                <Bar
                  dataKey="NhapKho"
                  name="Nhập kho"
                  fill="#6366F1"
                  radius={[4, 4, 0, 0]}
                >
                  {barData.map((_, index) => (
                    <Cell
                      key={`cell-nhap-${index}`}
                      fill={hoveredBar === index ? "#4F46E5" : "#6366F1"}
                    />
                  ))}
                </Bar>
                <Bar
                  dataKey="XuatKho"
                  name="Xuất kho"
                  fill="#F472B6"
                  radius={[4, 4, 0, 0]}
                >
                  {barData.map((_, index) => (
                    <Cell
                      key={`cell-xuat-${index}`}
                      fill={hoveredBar === index ? "#EC4899" : "#F472B6"}
                    />
                  ))}
                </Bar>
                <Bar
                  dataKey="TonKho"
                  name="Tồn kho"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* PieChart */}
        <motion.div
          variants={itemVariants}
          whileHover="hover"
          className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 opacity-30 rounded-2xl"></div>
          <h3 className="text-gray-700 text-lg font-semibold mb-4 relative z-10">
            Tồn kho theo nhóm sản phẩm
          </h3>
          <div className="flex flex-col md:flex-row items-center relative z-10">
            <div className="h-[240px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    innerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    animationDuration={1200}
                    onMouseEnter={(_, index) => setActivePieIndex(index)}
                    onMouseLeave={() => setActivePieIndex(null)}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#fff"
                        strokeWidth={1}
                        opacity={
                          activePieIndex === null || activePieIndex === index
                            ? 1
                            : 0.5
                        }
                        style={{ transition: "opacity 0.3s ease" }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2">
              <ul className="space-y-3">
                {pieData.map((entry, index) => (
                  <motion.li
                    key={`${entry.name}-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onMouseEnter={() => setActivePieIndex(index)}
                    onMouseLeave={() => setActivePieIndex(null)}
                    className="flex items-center space-x-3 p-2 rounded-lg transition-all hover:bg-gray-50"
                  >
                    <span
                      className={`w-4 h-4 rounded-full transition-all ${activePieIndex === index ? "ring-2 ring-offset-2 ring-gray-400" : ""}`}
                      style={{ backgroundColor: entry.color }}
                    ></span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">
                          {entry.name}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {entry.value.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                        <div
                          className="h-1.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${entry.value}%`,
                            backgroundColor: entry.color,
                            opacity:
                              activePieIndex === null ||
                              activePieIndex === index
                                ? 1
                                : 0.5,
                          }}
                        ></div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <OverviewTable
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        currentItems={currentItems}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default OverviewPage;
