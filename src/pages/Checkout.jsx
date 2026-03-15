import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { placeOrder } from '../api/order.api';
import { formatPrice } from '../utils/formatPrice';
import { DELIVERY_FEES } from '../utils/constants';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [form, setForm] = useState({
    fullName: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
    phone:    '',
    address:  '',
    city:     '',
    state:    '',
    country:  'Nigeria',
  });
  const [orderPlaced, setOrderPlaced] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const subTotal    = getTotalPrice();
  const deliveryFee = DELIVERY_FEES[deliveryMethod];
  const grandTotal  = subTotal + deliveryFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setLoading(true);
    try {
      const orderData = {
        orderItems: items.map((item) => ({
          product:  item.product._id,
          quantity: item.quantity,
          size:     item.size,
          color:    item.color,
        })),
        shippingAddress: form,
        deliveryMethod,
      };
      const res = await placeOrder(orderData);
      clearCart();
      setOrderPlaced(res.data.data);
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  // ── Order Success Screen ───────────────────────────────────────────────────
  if (orderPlaced) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-tight mb-3">
            Order Placed!
          </h1>
          <p className="text-gray-400 mb-2">
            Order Number: <span className="text-brand-gold font-bold">{orderPlaced.orderNumber}</span>
          </p>
          <p className="text-gray-400 mb-8 text-sm">
            Please transfer <span className="text-white font-semibold">{formatPrice(orderPlaced.grandTotal)}</span> to:
          </p>

          {/* Bank Details */}
          <div className="bg-gray-900 border border-brand-gold p-6 mb-8 text-left">
            <h3 className="text-brand-gold font-bold uppercase tracking-wider text-sm mb-4">
              Bank Transfer Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Bank Name</span>
                <span className="text-white font-semibold">{orderPlaced.bankDetails?.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Account Number</span>
                <span className="text-white font-bold text-lg">{orderPlaced.bankDetails?.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Account Name</span>
                <span className="text-white font-semibold">{orderPlaced.bankDetails?.accountName}</span>
              </div>
              <div className="flex justify-between border-t border-gray-700 pt-3">
                <span className="text-gray-400 text-sm">Amount to Transfer</span>
                <span className="text-brand-gold font-bold text-xl">{formatPrice(orderPlaced.grandTotal)}</span>
              </div>
            </div>
          </div>

          <p className="text-gray-500 text-xs mb-8">
            After transfer, your order will be confirmed within 24 hours.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              to="/my-orders"
              className="bg-brand-gold text-black px-6 py-3 uppercase tracking-wider font-bold text-sm hover:bg-yellow-400 transition-colors"
            >
              View My Orders
            </Link>
            <Link
              to="/shop"
              className="border border-gray-600 text-white px-6 py-3 uppercase tracking-wider text-sm hover:border-brand-gold transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // ── Empty Cart ─────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <p className="text-6xl mb-6">🛒</p>
          <h2 className="text-2xl font-bold text-white uppercase mb-3">Your cart is empty</h2>
          <p className="text-gray-400 mb-8 text-sm">Add some products before checking out.</p>
          <Link
            to="/shop"
            className="bg-brand-gold text-black px-8 py-3 uppercase tracking-widest font-bold text-sm hover:bg-yellow-400 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 text-sm transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── Left — Shipping Form ─────────────────────────────────────── */}
          <form onSubmit={handlePlaceOrder} className="space-y-6">

            {/* Shipping Address */}
            <div className="bg-gray-900 border border-gray-800 p-6">
              <h2 className="text-white font-bold uppercase tracking-wider text-sm mb-5">
                Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Full Name</label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Phone</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                    placeholder="08012345678"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Address</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                    placeholder="12 Victoria Street"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">City</label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                      placeholder="Lagos"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">State</label>
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                      placeholder="Lagos"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-gray-900 border border-gray-800 p-6">
              <h2 className="text-white font-bold uppercase tracking-wider text-sm mb-5">
                Delivery Method
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'standard', label: 'Standard Delivery', duration: '3-5 days', fee: DELIVERY_FEES.standard },
                  { value: 'express',  label: 'Express Delivery',  duration: '1-2 days', fee: DELIVERY_FEES.express  },
                  { value: 'pickup',   label: 'Pickup',            duration: 'Same day',  fee: DELIVERY_FEES.pickup   },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                      deliveryMethod === method.value
                        ? 'border-brand-gold bg-yellow-900/10'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value={method.value}
                        checked={deliveryMethod === method.value}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="accent-yellow-500"
                      />
                      <div>
                        <p className="text-white text-sm font-semibold">{method.label}</p>
                        <p className="text-gray-400 text-xs">{method.duration}</p>
                      </div>
                    </div>
                    <span className="text-brand-gold font-semibold text-sm">
                      {method.fee === 0 ? 'Free' : formatPrice(method.fee)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-gold text-black py-4 uppercase tracking-widest font-bold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : `Place Order — ${formatPrice(grandTotal)}`}
            </button>
          </form>

          {/* ── Right — Order Summary ──────────────────────────────────────── */}
          <div>
            <div className="bg-gray-900 border border-gray-800 p-6 sticky top-24">
              <h2 className="text-white font-bold uppercase tracking-wider text-sm mb-5">
                Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    {/* Image */}
                    <div className="w-16 h-16 bg-gray-800 shrink-0 overflow-hidden">
                      {item.product.images?.[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate uppercase">
                        {item.product.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && ' · '}
                        {item.color && `Color: ${item.color}`}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.size, item.color, Math.max(1, item.quantity - 1))}
                          className="text-gray-400 hover:text-white w-5 h-5 flex items-center justify-center border border-gray-700 text-xs"
                        >−</button>
                        <span className="text-white text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity + 1)}
                          className="text-gray-400 hover:text-white w-5 h-5 flex items-center justify-center border border-gray-700 text-xs"
                        >+</button>
                      </div>
                    </div>

                    {/* Price + Remove */}
                    <div className="text-right shrink-0">
                      <p className="text-brand-gold text-sm font-semibold">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem(item.product._id, item.size, item.color)}
                        className="text-gray-600 hover:text-red-400 mt-1 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-800 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">{formatPrice(subTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Delivery</span>
                  <span className="text-white">
                    {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-gray-800">
                  <span className="text-white">Total</span>
                  <span className="text-brand-gold text-lg">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;