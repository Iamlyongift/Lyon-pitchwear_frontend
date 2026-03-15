import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { submitReview } from "../../api/review.api";
import { getMyOrders } from "../../api/order.api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const { token, isAdmin } = useAuthStore();
  const [eligibleOrder, setEligibleOrder] = useState(null);
  const [checking, setChecking] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [form, setForm] = useState({
    rating: 0,
    title: "",
    body: "",
  });

  // Check if user has a delivered order with this product
  useEffect(() => {
    if (!token || isAdmin) {
      setChecking(false);
      return;
    }
    const checkEligibility = async () => {
      try {
        const res = await getMyOrders();
        const orders = res.data.data || [];
        // Find a delivered order that contains this product
        const eligible = orders.find(
          (order) =>
            order.orderStatus === "delivered" &&
            order.orderItems.some((item) => item.product === productId),
        );
        setEligibleOrder(eligible || null);
      } catch (err) {
        console.error(err);
      } finally {
        setChecking(false);
      }
    };
    checkEligibility();
  }, [token, productId, isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    setLoading(true);
    try {
      await submitReview({
        product: productId,
        order: eligibleOrder._id,
        rating: form.rating,
        title: form.title,
        body: form.body,
      });
      toast.success("Review submitted successfully!");
      setSubmitted(true);
      onReviewSubmitted();
    } catch (err) {
      const msg = err.response?.data?.message;
      toast.error(
        Array.isArray(msg) ? msg[0] : msg || "Failed to submit review",
      );
    } finally {
      setLoading(false);
    }
  };

  // Not logged in
  if (!token) {
    return (
      <div className="bg-gray-900 border border-gray-800 p-6 text-center">
        <p className="text-gray-400 mb-3 text-sm">Want to leave a review?</p>
        <Link
          to="/login"
          className="bg-brand-gold text-black px-6 py-2 text-sm uppercase tracking-wider font-bold hover:bg-yellow-400 transition-colors"
        >
          Sign In to Review
        </Link>
      </div>
    );
  }

  // Still checking eligibility
  if (checking) {
    return (
      <div className="bg-gray-900 border border-gray-800 p-6">
        <div className="animate-pulse h-4 bg-gray-800 rounded w-1/2" />
      </div>
    );
  }

  // Not eligible — no delivered order with this product
  if (!eligibleOrder) {
    return (
      <div className="bg-gray-900 border border-gray-800 p-6 text-center">
        <p className="text-gray-500 text-sm">
          You can only review products from delivered orders.
        </p>
      </div>
    );
  }

  // Already submitted
  if (submitted) {
    return (
      <div className="bg-gray-900 border border-green-800 p-6 text-center">
        <p className="text-green-400 text-sm">
          ✓ Your review has been submitted. Thank you!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 p-6">
      <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-5">
        Write a Review
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">
            Rating *
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setForm({ ...form, rating: star })}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={28}
                  className={
                    star <= (hoveredStar || form.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-600"
                  }
                />
              </button>
            ))}
            {form.rating > 0 && (
              <span className="text-gray-400 text-sm ml-2 self-center">
                {
                  ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                    form.rating
                  ]
                }
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">
            Review Title *
          </label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
            placeholder="Summarize your experience"
          />
        </div>

        {/* Body */}
        <div>
          <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">
            Review *
          </label>
          <textarea
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            required
            rows={4}
            className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors resize-none"
            placeholder="Share your experience with this product..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-gold text-black py-3 uppercase tracking-widest font-bold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
