import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminGetAllOrders, adminUpdateOrderStatus, adminUpdatePaymentStatus } from '../../api/admin.api';
import { formatPrice, formatDate } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

const statusColors = {
  pending:    'bg-yellow-900/30 text-yellow-400 border-yellow-800',
  confirmed:  'bg-blue-900/30 text-blue-400 border-blue-800',
  processing: 'bg-purple-900/30 text-purple-400 border-purple-800',
  shipped:    'bg-orange-900/30 text-orange-400 border-orange-800',
  delivered:  'bg-green-900/30 text-green-400 border-green-800',
  cancelled:  'bg-red-900/30 text-red-400 border-red-800',
};

const Orders = () => {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]     = useState('');

  const fetchOrders = async () => {
    try {
      const params = filter ? { orderStatus: filter } : {};
      const res = await adminGetAllOrders(params);
      setOrders(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const handleStatusUpdate = async (orderId, orderStatus) => {
    try {
      await adminUpdateOrderStatus(orderId, { orderStatus });
      toast.success(`Order updated to ${orderStatus}`);
      fetchOrders();
      setSelected(null);
    } catch (err) {
      toast.error('Failed to update order');
    }
  };

  const handlePaymentUpdate = async (orderId, paymentStatus) => {
    try {
      await adminUpdatePaymentStatus(orderId, { paymentStatus });
      toast.success('Payment status updated');
      fetchOrders();
      setSelected(null);
    } catch (err) {
      toast.error('Failed to update payment');
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <p className="text-brand-gold uppercase tracking-widest text-sm mb-1">Management</p>
        <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Orders</h1>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 text-xs uppercase tracking-wider border transition-colors ${
              filter === s
                ? 'bg-brand-gold text-black border-brand-gold'
                : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 p-4 h-16 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No orders found.</div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-800">
                <tr>
                  {['Order', 'Customer', 'Date', 'Items', 'Total', 'Payment', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-gray-400 text-xs uppercase tracking-wider text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 text-brand-gold font-semibold">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-white">
                      {order.user?.firstName} {order.user?.lastName}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3 text-gray-300">{order.orderItems?.length}</td>
                    <td className="px-4 py-3 text-white font-semibold">{formatPrice(order.grandTotal)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full uppercase ${
                        order.paymentStatus === 'payment_confirmed'
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-yellow-900/30 text-yellow-400'
                      }`}>
                        {order.paymentStatus === 'payment_confirmed' ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs border rounded-full uppercase ${statusColors[order.orderStatus]}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(order)}
                        className="text-brand-gold text-xs hover:text-yellow-400 transition-colors uppercase tracking-wider"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Order Detail Modal ─────────────────────────────────────────── */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-white font-bold uppercase">{selected.orderNumber}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>

            <div className="p-6 space-y-4">
              {/* Customer */}
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Customer</p>
                <p className="text-white">{selected.user?.firstName} {selected.user?.lastName}</p>
                <p className="text-gray-400 text-sm">{selected.user?.email}</p>
              </div>

              {/* Shipping */}
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Shipping Address</p>
                <p className="text-white text-sm">
                  {selected.shippingAddress?.fullName}<br />
                  {selected.shippingAddress?.address}, {selected.shippingAddress?.city}<br />
                  {selected.shippingAddress?.state}, {selected.shippingAddress?.country}<br />
                  {selected.shippingAddress?.phone}
                </p>
              </div>

              {/* Items */}
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Items</p>
                {selected.orderItems?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-800">
                    <span className="text-white">{item.name} × {item.quantity}</span>
                    <span className="text-brand-gold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm pt-2 font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-brand-gold">{formatPrice(selected.grandTotal)}</span>
                </div>
              </div>

              {/* Confirm Payment */}
              {selected.paymentStatus !== 'payment_confirmed' && (
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Payment</p>
                  <button
                    onClick={() => handlePaymentUpdate(selected._id, 'payment_confirmed')}
                    className="w-full bg-green-700 hover:bg-green-600 text-white py-2 text-sm uppercase tracking-wider transition-colors"
                  >
                    ✓ Confirm Payment Received
                  </button>
                </div>
              )}

              {/* Update Status */}
              {selected.orderStatus !== 'delivered' && selected.orderStatus !== 'cancelled' && (
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Update Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusUpdate(selected._id, s)}
                        disabled={selected.orderStatus === s}
                        className={`py-2 text-xs uppercase tracking-wider border transition-colors disabled:opacity-30 ${
                          s === 'cancelled'
                            ? 'border-red-700 text-red-400 hover:bg-red-900/20'
                            : 'border-gray-700 text-gray-300 hover:border-brand-gold hover:text-brand-gold'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Orders;