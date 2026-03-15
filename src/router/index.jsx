import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "../store/authStore";

// Pages
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import ProductDetail from "../pages/ProductDetail";
import Checkout from "../pages/Checkout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Profile from "../pages/user/Profile";
import MyOrders from "../pages/user/MyOrders";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminProducts from "../pages/admin/Products";
import AdminOrders from "../pages/admin/Orders";
import AdminCustomers from "../pages/admin/Customers";
import AdminReviews from "../pages/admin/Reviews";
import AdminLogin from "../pages/admin/Login";
import ResetPassword from "../pages/auth/ResetPassword";
import ProductForm from "../pages/admin/ProductForm";
import VerifyEmail from "../pages/auth/VerifyEmail";

// Protected Route — redirects to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// Admin Route — redirects to login if not admin
const AdminRoute = ({ children }) => {
  const { token, isAdmin } = useAuthStore();
  if (!token || !isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
};

const router = createBrowserRouter([
  // Public routes
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/", element: <Home /> },
  { path: "/shop", element: <Shop /> },
  { path: "/products/:id", element: <ProductDetail /> },

  // Auth routes
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/verify-email", element: <VerifyEmail /> },
  // Protected user routes
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-orders",
    element: (
      <ProtectedRoute>
        <MyOrders />
      </ProtectedRoute>
    ),
  },
  {
    path: "/checkout",
    element: (
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    ),
  },

  // Admin routes
  {
    path: "/admin/dashboard",
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/products",
    element: (
      <AdminRoute>
        <AdminProducts />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/products/new",
    element: (
      <AdminRoute>
        <ProductForm />
      </AdminRoute>
    ),
  },

  {
    path: "/admin/products/edit/:id",
    element: (
      <AdminRoute>
        <ProductForm />
      </AdminRoute>
    ),
  },

  {
    path: "/admin/orders",
    element: (
      <AdminRoute>
        <AdminOrders />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/customers",
    element: (
      <AdminRoute>
        <AdminCustomers />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/reviews",
    element: (
      <AdminRoute>
        <AdminReviews />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/products/new",
    element: (
      <AdminRoute>
        <ProductForm />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/products/edit/:id",
    element: (
      <AdminRoute>
        <ProductForm />
      </AdminRoute>
    ),
  },

  // 404
  { path: "*", element: <Navigate to="/" replace /> },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
