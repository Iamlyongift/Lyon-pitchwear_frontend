import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, ShoppingBag, Package, 
  Users, Clock, CheckCircle 
} from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { getDashboardStats } from '../../api/admin.api';
import { formatPrice, formatDate } from '../../utils/formatPrice';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-gray-900 border border-gray-800 p-6 hover:border-gray-700 transition-colors">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{label}</p>
        <p className={`text-3xl font-bold ${color || 'text-white'}`}>{value}</p>
      </div>
      <div className={`p-3 rounded-lg bg-gray-800 ${color || 'text-gray-400'}`}>
        <Icon size={20} />
      </div>
    </div>
  </div>
);

const statusColors = {
  pending:    'bg-yellow-900/30 text-yellow-400',
  confirmed:  'bg-blue-900/30 text-blue-400',
  processing: 'bg-purple-900/30 text-purple-400',
  shipped:    'bg-orange-900/30 text-orange-400',
  delivered:  'bg-green-900/30 text-green-400',
  cancelled:  'bg-red-900/30 text-red-400',
};

const Dashboard = () => {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 p-6 h-28" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  const { overview, recentOrders, topProducts, ordersByStatus } = stats || {};

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <p className="text-brand-gold uppercase tracking-widest text-sm mb-1">Overview</p>
        <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Dashboard</h1>
      </div>

      {/* ── Stats Grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Revenue"
          value={formatPrice(overview?.totalRevenue || 0)}
          icon={TrendingUp}
          color="text-brand-gold"
        />
        <StatCard
          label="Total Orders"
          value={overview?.totalOrders || 0}
          icon={ShoppingBag}
          color="text-blue-400"
        />
        <StatCard
          label="Total Products"
          value={overview?.totalProducts || 0}
          icon={Package}
          color="text-purple-400"
        />
        <StatCard
          label="Total Customers"
          value={overview?.totalCustomers || 0}
          icon={Users}
          color="text-green-400"
        />
        <StatCard
          label="Pending Orders"
          value={overview?.pendingOrders || 0}
          icon={Clock}
          color="text-yellow-400"
        />
        <StatCard
          label="Delivered Orders"
          value={overview?.deliveredOrders || 0}
          icon={CheckCircle}
          color="text-emerald-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* ── Orders by Status ──────────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 p-6">
          <h2 className="text-white font-bold uppercase tracking-wider text-sm mb-5">
            Orders by Status
          </h2>
          <div className="space-y-3">
            {ordersByStatus?.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <span className={`px-3 py-1 text-xs rounded-full uppercase tracking-wider ${statusColors[item.status]}`}>
                  {item.status}
                </span>
                <span className="text-white font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Top Products ──────────────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 p-6">
          <h2 className="text-white font-bold uppercase tracking-wider text-sm mb-5">
            Top Selling Products
          </h2>
          {topProducts?.length > 0 ? (
            <div className="space-y-4">
              {topProducts.map((product, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-800 shrink-0 overflow-hidden">
                    {product.image && (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate uppercase">{product.name}</p>
                    <p className="text-gray-400 text-xs">{product.totalSold} sold</p>
                  </div>
                  <p className="text-brand-gold text-sm font-semibold shrink-0">
                    {formatPrice(product.revenue)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No sales data yet.</p>
          )}
        </div>
      </div>

      {/* ── Recent Orders ─────────────────────────────────────────────── */}
      <div className="bg-gray-900 border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold uppercase tracking-wider text-sm">Recent Orders</h2>
          <Link to="/admin/orders" className="text-brand-gold text-xs hover:text-yellow-400 transition-colors uppercase tracking-wider">
            View All →
          </Link>
        </div>

        {recentOrders?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-gray-400 text-xs uppercase tracking-wider text-left pb-3">Order</th>
                  <th className="text-gray-400 text-xs uppercase tracking-wider text-left pb-3">Customer</th>
                  <th className="text-gray-400 text-xs uppercase tracking-wider text-left pb-3">Date</th>
                  <th className="text-gray-400 text-xs uppercase tracking-wider text-left pb-3">Status</th>
                  <th className="text-gray-400 text-xs uppercase tracking-wider text-right pb-3">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 text-brand-gold font-semibold">{order.orderNumber}</td>
                    <td className="py-3 text-white">
                      {order.user?.firstName} {order.user?.lastName}
                    </td>
                    <td className="py-3 text-gray-400">{formatDate(order.createdAt)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full uppercase ${statusColors[order.orderStatus]}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 text-white text-right font-semibold">
                      {formatPrice(order.grandTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No orders yet.</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;