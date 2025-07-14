import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import AdminLayout from "../components/admin/layouts/Layout";
import MemberPage from "../pages/admin/MemberPage";
import ProductPage from "../pages/admin/ProductPage";
import CategoryPage from "../pages/admin/CategoryPage";
import WarehousePage from "../pages/admin/WarehousePage";
import OverviewPage from "../pages/admin/OverviewPage";
import StatsPage from "../pages/admin/StatsPage";
import OrderPage from "../pages/admin/OrderPage";
import SupplierPage from "../pages/admin/SupplierPage";
import ProductImagePage from "../pages/admin/ProductImagePage";
import FeatureProductPage from "../pages/admin/FeatureProductPage";
import FeedbackPage from "../pages/admin/FeedbackPage";
import BannerPage from "../pages/admin/BannerPage";
import FaqPage from "../pages/admin/FaqPage";

import CustomerLayout from "../components/customer/layouts/Layout";
import HomePage from "../pages/customer/HomePage";
import ShopPage from "../pages/customer/ShopPage";
import CartPage from "../pages/customer/CartPage";
import DetailProductPage from "../pages/customer/DetailProductPage";
import OrderDetailPage from "../pages/customer/OrderDetailPage";
import AboutPage from "../pages/customer/AboutPage";
import ContactPage from "../pages/customer/ContactPage";
import CheckoutPage from "../pages/customer/CheckoutPage";
import PaymentResultPage from "../pages/customer/PaymentResultPage";
import CustomerAccountPage from "../pages/customer/CustomerAccountPage";

// Component bảo vệ route theo role
const RoleRoute = ({ element, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated === null) return null; // đang load xác thực
  if (!isAuthenticated || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }
  return element;
};

const MainRoutes = () => {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated === null) return null; // đang load xác thực

  return (
    <Router>
      <Routes>
        {/* Trang login */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : role === "admin" || role === "staff" ? (
              <Navigate to="/members" />
            ) : (
              <Navigate to="/home" />
            )
          }
        />
        <Route path="/register" element={<RegisterPage />} />

        {/* Redirect gốc "/" → luôn về /home (public) */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Admin/Staff routes */}
        <Route element={<AdminLayout />}>
          <Route
            path="/members"
            element={
              <RoleRoute
                allowedRoles={["admin", "staff"]}
                element={<MemberPage />}
              />
            }
          />
          <Route
            path="/products"
            element={
              <RoleRoute
                allowedRoles={["admin", "staff"]}
                element={<ProductPage />}
              />
            }
          />
          <Route
            path="/product-categories"
            element={
              <RoleRoute
                allowedRoles={["admin", "staff"]}
                element={<CategoryPage />}
              />
            }
          />
          <Route
            path="/product-images"
            element={
              <RoleRoute
                allowedRoles={["admin", "staff"]}
                element={<ProductImagePage />}
              />
            }
          />
          <Route
            path="/product-features"
            element={
              <RoleRoute
                allowedRoles={["admin", "staff"]}
                element={<FeatureProductPage />}
              />
            }
          />
          <Route
            path="/product_warehouse"
            element={
              <RoleRoute
                allowedRoles={["admin", "staff"]}
                element={<WarehousePage />}
              />
            }
          />
          <Route
            path="/warehouse_overview"
            element={
              <RoleRoute
                allowedRoles={["admin", "staff"]}
                element={<OverviewPage />}
              />
            }
          />
          <Route
            path="/orders"
            element={
              <RoleRoute
                allowedRoles={["admin", "staff"]}
                element={<OrderPage />}
              />
            }
          />
          <Route
            path="/suppliers"
            element={
              <RoleRoute
                allowedRoles={["admin", "staff"]}
                element={<SupplierPage />}
              />
            }
          />
          <Route
            path="/feedbacks"
            element={
              <RoleRoute
                allowedRoles={["admin", "staff"]}
                element={<FeedbackPage />}
              />
            }
          />
          <Route
            path="/faqs"
            element={
              <RoleRoute
                allowedRoles={["admin", "staff"]}
                element={<FaqPage />}
              />
            }
          />
          <Route
            path="/banners"
            element={
              <RoleRoute
                allowedRoles={["admin", "staff"]}
                element={<BannerPage />}
              />
            }
          />
          <Route
            path="/stats"
            element={
              <RoleRoute
                allowedRoles={["admin", "staff"]}
                element={<StatsPage />}
              />
            }
          />
        </Route>

        {/* Customer routes - public */}
        <Route element={<CustomerLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/check-out" element={<CheckoutPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/product-detail/:id" element={<DetailProductPage />} />
          <Route path="/payment-result" element={<PaymentResultPage />} />
          <Route path="/order-detail/:id" element={<OrderDetailPage />} />
          <Route
            path="/cart"
            element={
              <RoleRoute
                allowedRoles={["admin", "staff", "client"]}
                element={<CartPage />}
              />
            }
          />
          <Route
            path="/customer-account"
            element={
              <RoleRoute
                allowedRoles={["admin", "staff", "client"]}
                element={<CustomerAccountPage />}
              />
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default MainRoutes;
