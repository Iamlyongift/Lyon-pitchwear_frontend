import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useAuthStore } from '../../store/authStore';
import { updateMyProfile, changePassword } from '../../api/auth.api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, setAuth, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    phone:     user?.phone     || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword:     '',
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateMyProfile(profileForm);
      setAuth(res.data.data, token, false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await changePassword(passwordForm);
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <p className="text-brand-gold uppercase tracking-widest text-sm mb-1">Account</p>
          <h1 className="text-3xl font-bold text-white uppercase tracking-tight">My Profile</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-gray-800">
          {['profile', 'password', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? 'text-brand-gold border-b-2 border-brand-gold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'orders' ? 'My Orders' : tab}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="bg-gray-900 border border-gray-800 p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">First Name</label>
                <input
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Last Name</label>
                <input
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Email</label>
              <input
                value={user?.email || ''}
                disabled
                className="w-full bg-gray-800/50 border border-gray-700 text-gray-500 px-4 py-3 text-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Phone</label>
              <input
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                placeholder="08012345678"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-gold text-black py-3 uppercase tracking-widest font-bold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="bg-gray-900 border border-gray-800 p-6 space-y-5">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                placeholder="Min 8 chars, uppercase, number, special char"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-gold text-black py-3 uppercase tracking-widest font-bold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="text-center py-10">
            <p className="text-gray-400 mb-4">View and track all your orders.</p>
            <Link
              to="/my-orders"
              className="bg-brand-gold text-black px-6 py-3 uppercase tracking-wider font-bold text-sm hover:bg-yellow-400 transition-colors"
            >
              View My Orders
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;