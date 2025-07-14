import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { register } from "../../services/AuthApi";
import logo from "../../assets/images/WaretechLogo.png";
import "react-toastify/dist/ReactToastify.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await register(formData);
      if (data.token && data.user?.role) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        toast.success("Đăng ký thành công!");
        navigate("/login");
      } else {
        toast.error(data.message || "Đăng ký thất bại");
      }
    } catch {
      toast.error("Lỗi hệ thống khi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Phần hình ảnh - Hiển thị trên màn hình lớn */}
      <div
        className="w-1/2 hidden md:flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${logo})` }}
      ></div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-r from-blue-500 to-orange-500 rounded-tl-3xl rounded-bl-3xl ">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header màu xanh */}
          <div className="bg-blue-600 py-5 px-6">
            <h2 className="text-2xl font-bold text-white text-center">
              Đăng ký tài khoản
            </h2>
          </div>
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ tên
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập họ tên"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                  loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
              >
                {loading ? "Đang đăng ký..." : "Đăng ký"}
              </button>

              <p className="text-gray-500 text-sm mt-4 text-center">
                Đã có tài khoản?{" "}
                <Link to="/login" className="text-orange-500 hover:underline">
                  Đăng nhập ngay
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
