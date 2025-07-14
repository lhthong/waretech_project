import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as faRegularStar,
  faFilePdf,
} from "@fortawesome/free-regular-svg-icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  getDailyProfit,
  getDailyRevenue,
  getDailyOrders,
  getDailySoldProducts,
  getTotalInventory,
  getRevenueByDay,
  getRevenueByMonth,
  getRevenueByYear,
  getBestSellingProducts,
  getTopInventoryProducts,
  exportStatsToPDF,
} from "../../services/StatsApi";

const StatsPage = () => {
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];
  const isMobile = useMediaQuery({ maxWidth: 640 });

  const [cardsData, setCardsData] = useState({
    profit: 0,
    revenue: 0,
    orders: 0,
    sold: 0,
    inventory: 0,
  });
  const [activeIndex, setActiveIndex] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [bestSelling, setBestSelling] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [timeRange, setTimeRange] = useState("month");
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [yearRangeStart, setYearRangeStart] = useState(
    new Date().getFullYear() - 4
  );
  const [yearRangeEnd, setYearRangeEnd] = useState(new Date().getFullYear());
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Thêm state loading

  const getLast5Years = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i).reverse();
  };

  useEffect(() => {
    // Lấy dữ liệu thẻ thống kê
    const fetchCardsData = async () => {
      try {
        const [profit, revenue, orders, sold, inventory] = await Promise.all([
          getDailyProfit(),
          getDailyRevenue(),
          getDailyOrders(),
          getDailySoldProducts(),
          getTotalInventory(),
        ]);
        setCardsData({ profit, revenue, orders, sold, inventory });
      } catch (err) {
        setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại.");
      }
    };

    // Lấy dữ liệu doanh thu
    const fetchRevenueData = async () => {
      try {
        let data;
        if (timeRange === "day") {
          data = await getRevenueByDay(selectedMonth, selectedYear);
        } else if (timeRange === "month") {
          data = await getRevenueByMonth(selectedYear);
        } else {
          data = await getRevenueByYear(yearRangeStart, yearRangeEnd);
        }
        setRevenueData(data);
      } catch (err) {
        setError("Không thể tải dữ liệu doanh thu. Vui lòng thử lại.");
      }
    };

    // Lấy sản phẩm bán chạy
    const fetchBestSelling = async () => {
      try {
        const data = await getBestSellingProducts();
        setBestSelling(data);
      } catch (err) {
        setError("Không thể tải dữ liệu sản phẩm bán chạy. Vui lòng thử lại.");
      }
    };

    // Lấy sản phẩm tồn kho
    const fetchInventory = async () => {
      try {
        const data = await getTopInventoryProducts();
        setInventory(data);
      } catch (err) {
        setError("Không thể tải dữ liệu tồn kho. Vui lòng thử.");
      }
    };

    fetchCardsData();
    fetchRevenueData();
    fetchBestSelling();
    fetchInventory();
  }, [timeRange, selectedMonth, selectedYear, yearRangeStart, yearRangeEnd]);

  // Hàm xử lý xuất PDF
  const handleExportPDF = async () => {
    try {
      setLoading(true);
      setError(null);
      const blob = await exportStatsToPDF(
        timeRange,
        timeRange === "day" ? selectedMonth : undefined, // Chỉ gửi selectedMonth nếu timeRange=day
        selectedYear,
        timeRange === "year" ? yearRangeStart : undefined, // Chỉ gửi yearRangeStart nếu timeRange=year
        timeRange === "year" ? yearRangeEnd : undefined // Chỉ gửi yearRangeEnd nếu timeRange=year
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bao-cao-thong-ke-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Không thể xuất báo cáo PDF. Vui lòng thử lại.");
      console.error("Lỗi xuất PDF:", err);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (
      active &&
      payload &&
      payload.length &&
      (payload[0].payload.revenue > 0 ||
        payload[0].payload.sold > 0 ||
        payload[0].payload.stock > 0)
    ) {
      const { name, revenue, sold, stock } = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <p style={{ margin: 0 }}>{name}</p>
          {revenue > 0 && (
            <p style={{ margin: 0 }}>
              Doanh thu: {revenue.toLocaleString()} VNĐ
            </p>
          )}
          {sold > 0 && <p style={{ margin: 0 }}>Số lượng bán: {sold}</p>}
          {stock > 0 && <p style={{ margin: 0 }}>Tồn kho: {stock}</p>}
        </div>
      );
    }
    return null;
  };

  const renderActiveLabelPie = ({ cx, cy, index }) => {
    if (activeIndex === index) {
      return (
        <text
          x={cx}
          y={cy}
          fill={COLORS[index % COLORS.length]}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={isMobile ? 16 : 20}
          fontWeight="bold"
        >
          {inventory[index].stock}
        </text>
      );
    }
    return null;
  };

  const renderActiveBar = (props) => {
    const { fill, x, y, width, height } = props;
    return (
      <rect
        x={x - 3}
        y={y - 5}
        width={width + 6}
        height={height + 5}
        fill={fill}
        style={{ transition: "all 0.2s ease-out" }}
        rx={10}
        ry={10}
      />
    );
  };

  return (
    <div className="p-4 space-y-8 w-full bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <FontAwesomeIcon
            icon={faRegularStar}
            className="mt-1 mr-2 text-[#012970] text-lg"
          />
          <h2 className="">Dashboard Thống kê</h2>
        </div>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleExportPDF}
          disabled={loading}
        >
          <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
          {loading ? "Đang xuất PDF..." : "Xuất PDF"}
        </button>
      </div>

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-2xl">{error}</div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="bg-orange-100 rounded-2xl p-4 shadow flex flex-col items-center">
          <span className="font-semibold text-orange-700">
            Tiền lời hôm nay
          </span>
          <strong className="mt-2 text-center text-xl">
            {cardsData.profit.toLocaleString()}
            <br />
            <span className="text-base font-normal">VNĐ</span>
          </strong>
        </div>
        <div className="bg-blue-100 rounded-2xl p-4 shadow flex flex-col items-center">
          <span className="font-semibold text-blue-800">Doanh thu hôm nay</span>
          <strong className="mt-2 text-center text-xl">
            {cardsData.revenue.toLocaleString()}
            <br />
            <span className="text-base font-normal">VNĐ</span>
          </strong>
        </div>
        <div className="bg-green-100 rounded-2xl p-4 shadow flex flex-col items-center">
          <span className="font-semibold text-green-800">Đơn hàng hôm nay</span>
          <strong className="mt-2 text-center text-xl">
            {cardsData.orders}
            <br />
            <span className="text-base font-normal">đơn</span>
          </strong>
        </div>
        <div className="bg-yellow-100 rounded-2xl p-4 shadow flex flex-col items-center">
          <span className="font-semibold text-yellow-800">Sản phẩm đã bán</span>
          <strong className="mt-2 text-center text-xl">
            {cardsData.sold}
            <br />
            <span className="text-base font-normal">sản phẩm</span>
          </strong>
        </div>
        <div className="bg-red-100 rounded-2xl p-4 shadow flex flex-col items-center">
          <span className="font-semibold text-pink-800">Sản phẩm tồn kho</span>
          <strong className="mt-2 text-center text-xl">
            {cardsData.inventory}
            <br />
            <span className="text-base font-normal">sản phẩm</span>
          </strong>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-300 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="">📊 Doanh thu</h2>
          <div className="flex gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="day">Theo ngày</option>
              <option value="month">Theo tháng</option>
              <option value="year">Theo năm</option>
            </select>

            {timeRange === "day" && (
              <>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      Tháng {i + 1}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  {getLast5Years().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </>
            )}

            {timeRange === "month" && (
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {getLast5Years().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            )}

            {timeRange === "year" && (
              <>
                <select
                  value={yearRangeStart}
                  onChange={(e) => setYearRangeStart(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  {getLast5Years().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <span className="px-1">–</span>
                <select
                  value={yearRangeEnd}
                  onChange={(e) => setYearRangeEnd(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  {getLast5Years().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid stroke="none" />
            <XAxis dataKey="name" tickLine={false} />
            <YAxis
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              tick={{ fill: "#6b7280" }}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Legend />
            <Bar
              dataKey="revenue"
              fill="#8884d8"
              radius={[10, 10, 10, 10]}
              barSize={35}
              activeBar={renderActiveBar}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Best Selling Products */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Biểu đồ BarChart */}
        <div className="w-full xl:w-1/2">
          <div className="bg-white rounded-2xl shadow-lg border border-t-gray-300 p-4 aspect-[16/10]">
            <h2 className="mb-5">🔥 Sản phẩm bán chạy</h2>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={bestSelling}>
                <CartesianGrid stroke="none" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" hide />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Bar
                  dataKey="sold"
                  fill="#ff914d"
                  radius={[5, 5, 5, 5]}
                  activeBar={renderActiveBar}
                  barSize={25}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bảng thông tin */}
        <div className="w-full xl:w-1/2">
          <div className="bg-orange-200 rounded-2xl shadow-lg max-h-[360px] overflow-auto scrollbar-hide">
            <h2 className="text-center pt-4 pb-6 border-b">
              📋 Bảng thông tin
            </h2>
            <table className="w-full text-sm text-left">
              <thead>
                <tr>
                  <th className="p-2">Tên sản phẩm</th>
                  <th className="p-2">SL bán</th>
                  <th className="p-2">Giá bán (VNĐ)</th>
                </tr>
              </thead>
              <tbody>
                {bestSelling.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-orange-300">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.sold}</td>
                    <td className="p-2">{item.price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Bảng thông tin */}
        <div className="w-full xl:w-1/2">
          <div className="bg-orange-200 rounded-2xl shadow-lg max-h-[360px] overflow-auto scrollbar-hidden">
            <h2 className="text-center pt-4 pb-4 border-b">
              📋 Bảng thông tin
            </h2>
            <table className="w-full text-sm text-left">
              <thead>
                <tr>
                  <th className="p-2">Tên sản phẩm</th>
                  <th className="p-2">Tồn kho</th>
                  <th className="p-2">Danh mục</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-orange-300">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.stock}</td>
                    <td className="p-2">{item.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Biểu đồ PieChart */}
        <div className="w-full xl:w-1/2">
          <div className="bg-white rounded-2xl shadow-lg border border-t-gray-300 p-4 aspect-[16/9]">
            <h2 className="mb-2">📦 Sản phẩm tồn kho nhiều</h2>
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 200}>
              <PieChart>
                <Pie
                  data={inventory}
                  dataKey="stock"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={isMobile ? 60 : 70}
                  innerRadius={isMobile ? 20 : 30}
                  paddingAngle={5}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  label={renderActiveLabelPie}
                  labelLine={false}
                >
                  {inventory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{
                    paddingTop: isMobile ? "5px" : "10px",
                    fontSize: isMobile ? "9px" : "11px",
                    width: "100%",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
