import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import Layout from "../../components/layout/Layout";
import { getMyOrders } from "../../api/order.api";
import { formatPrice, formatDate } from "../../utils/formatPrice";

const statusColors = {
  pending: "bg-yellow-900/30 text-yellow-400 border-yellow-800",
  confirmed: "bg-blue-900/30 text-blue-400 border-blue-800",
  processing: "bg-purple-900/30 text-purple-400 border-purple-800",
  shipped: "bg-orange-900/30 text-orange-400 border-orange-800",
  delivered: "bg-green-900/30 text-green-400 border-green-800",
  cancelled: "bg-red-900/30 text-red-400 border-red-800",
};

// Human-readable status messages shown to customer
const statusMessages = {
  pending: "Order received. Awaiting your payment.",
  confirmed: "Payment confirmed! We are preparing your order.",
  processing: "Your order is being processed.",
  shipped: "Your order is on its way!",
  delivered: "Order delivered. Enjoy your gear!",
  cancelled: "This order was cancelled.",
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // useCallback so fetchOrders can be called both on mount and on refresh button click
  const fetchOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await getMyOrders();
      setOrders(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header — now has refresh button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-brand-gold uppercase tracking-widest text-sm mb-1">
              Account
            </p>
            <h1 className="text-3xl font-bold text-white uppercase tracking-tight">
              My Orders
            </h1>
          </div>
          {/* Refresh button — customer clicks this to check for status updates */}
          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="flex items-center gap-2 text-brand-gold text-xs uppercase tracking-wider hover:text-yellow-400 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-900 border border-gray-800 p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-800 rounded w-1/4 mb-3" />
                <div className="h-4 bg-gray-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">📦</p>
            <p className="text-gray-400 mb-6">
              You haven't placed any orders yet.
            </p>
            <Link
              to="/shop"
              className="bg-brand-gold text-black px-6 py-3 uppercase tracking-wider font-bold text-sm hover:bg-yellow-400 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-900 border border-gray-800 p-6 hover:border-gray-700 transition-colors"
              >
                {/* Order Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-brand-gold font-bold tracking-wider">
                      {order.orderNumber}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span
                      className={`px-3 py-1 text-xs border rounded-full uppercase tracking-wider ${statusColors[order.orderStatus]}`}
                    >
                      {order.orderStatus}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs border rounded-full uppercase tracking-wider ${
                        order.paymentStatus === "payment_confirmed"
                          ? "bg-green-900/30 text-green-400 border-green-800"
                          : "bg-yellow-900/30 text-yellow-400 border-yellow-800"
                      }`}
                    >
                      {order.paymentStatus.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                {/* Status Message — tells customer what's happening in plain English */}
                <p className="text-gray-400 text-xs mb-4 italic">
                  {statusMessages[order.orderStatus]}
                </p>

                {/* Order Items */}
                <div className="space-y-2 mb-4">
                  {order.orderItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-800 shrink-0 overflow-hidden">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate uppercase">
                          {item.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Qty: {item.quantity}
                          {item.size && ` · Size: ${item.size}`}
                          {item.color && ` · Color: ${item.color}`}
                        </p>
                      </div>
                      <p className="text-brand-gold text-sm font-semibold shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                  <p className="text-gray-400 text-xs capitalize">
                    Delivery: {order.deliveryMethod}
                  </p>
                  <p className="text-white font-bold">
                    Total:{" "}
                    <span className="text-brand-gold">
                      {formatPrice(order.grandTotal)}
                    </span>
                  </p>
                </div>

                {/* Payment Pending — show bank details */}
                {order.paymentStatus === "awaiting_payment" && (
                  <div className="mt-4 bg-yellow-900/10 border border-yellow-800/50 p-4">
                    <p className="text-yellow-400 text-xs uppercase tracking-wider mb-2">
                      ⚠ Payment Pending
                    </p>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Transfer{" "}
                      <span className="text-white font-bold">
                        {formatPrice(order.grandTotal)}
                      </span>{" "}
                      to{" "}
                      <span className="text-white font-bold">
                        {order.bankDetails?.accountNumber}
                      </span>{" "}
                      ({order.bankDetails?.bankName} —{" "}
                      {order.bankDetails?.accountName})
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      After transfer, click{" "}
                      <span className="text-brand-gold">Refresh</span> above to
                      check your payment status.
                    </p>
                  </div>
                )}

                {/* Delivered — prompt to leave a review */}
                {order.orderStatus === "delivered" && (
                  <div className="mt-4 bg-green-900/10 border border-green-800/50 p-4">
                    <p className="text-green-400 text-xs uppercase tracking-wider mb-2">
                      ✓ Order Delivered
                    </p>
                    <p className="text-gray-400 text-xs mb-3">
                      Enjoying your gear? Leave a review on the product page!
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {order.orderItems.map((item, i) => (
                        <Link
                          key={i}
                          to={`/products/${item.product}`}
                          className="text-xs text-brand-gold border border-brand-gold px-3 py-1 hover:bg-brand-gold hover:text-black transition-colors uppercase tracking-wider"
                        >
                          Review {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyOrders;
