import { useState, useEffect } from 'react';
import { Star, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminGetAllReviews, adminModerateReview, adminDeleteReview } from '../../api/admin.api';
import { formatDate } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('');

  const fetchReviews = async () => {
    try {
      const params = filter ? { status: filter } : {};
      const res = await adminGetAllReviews(params);
      setReviews(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [filter]);

  const handleModerate = async (id, status) => {
    try {
      await adminModerateReview(id, { status });
      toast.success(`Review ${status}`);
      fetchReviews();
    } catch (err) {
      toast.error('Failed to update review');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await adminDeleteReview(id);
      toast.success('Review deleted');
      fetchReviews();
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <p className="text-brand-gold uppercase tracking-widest text-sm mb-1">Management</p>
        <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Reviews</h1>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['', 'pending', 'approved', 'rejected'].map((s) => (
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

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 p-6 h-24 animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No reviews found.</div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-gray-900 border border-gray-800 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Product + User */}
                  <div className="flex items-center gap-3 mb-2">
                    {review.product?.images?.[0] && (
                      <img
                        src={review.product.images[0]}
                        alt=""
                        className="w-8 h-8 object-cover"
                      />
                    )}
                    <div>
                      <p className="text-white text-sm font-semibold uppercase">
                        {review.product?.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        by {review.user?.firstName} {review.user?.lastName} · {review.user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex mb-2">
                    {[1,2,3,4,5].map((star) => (
                      <Star
                        key={star}
                        size={12}
                        className={star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                      />
                    ))}
                  </div>

                  {/* Review content */}
                  <p className="text-brand-gold text-sm font-semibold mb-1">{review.title}</p>
                  <p className="text-gray-400 text-sm">{review.body}</p>
                  <p className="text-gray-600 text-xs mt-2">{formatDate(review.createdAt)}</p>
                </div>

                {/* Status + Actions */}
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <span className={`px-2 py-1 text-xs rounded-full uppercase ${
                    review.status === 'approved' ? 'bg-green-900/30 text-green-400' :
                    review.status === 'rejected' ? 'bg-red-900/30 text-red-400' :
                    'bg-yellow-900/30 text-yellow-400'
                  }`}>
                    {review.status}
                  </span>

                  <div className="flex gap-2">
                    {review.status !== 'approved' && (
                      <button
                        onClick={() => handleModerate(review._id, 'approved')}
                        className="text-xs text-green-400 hover:text-green-300 border border-green-800 px-2 py-1 transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    {review.status !== 'rejected' && (
                      <button
                        onClick={() => handleModerate(review._id, 'rejected')}
                        className="text-xs text-red-400 hover:text-red-300 border border-red-800 px-2 py-1 transition-colors"
                      >
                        Reject
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default Reviews;