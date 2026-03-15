import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminGetAllUsers, adminToggleUserStatus } from '../../api/admin.api';
import { formatDate } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

const Customers = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await adminGetAllUsers();
      console.log('Users response:', res.data);
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleStatus = async (id, currentStatus, name) => {
    const action = currentStatus === 'active' ? 'suspend' : 'activate';
    if (!window.confirm(`${action} ${name}?`)) return;
    try {
      await adminToggleUserStatus(id);
      toast.success(`User ${action}d successfully`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <p className="text-brand-gold uppercase tracking-widest text-sm mb-1">Management</p>
        <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Customers</h1>
        <p className="text-gray-400 text-sm mt-1">{users.length} total customers</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 p-4 h-16 animate-pulse" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No customers yet.</div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-800">
                <tr>
                  {['Customer', 'Email', 'Joined', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-gray-400 text-xs uppercase tracking-wider text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-800/30 transition-colors">
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-gold/20 rounded-full flex items-center justify-center text-brand-gold font-bold text-sm">
                          {user.firstName?.[0]}
                        </div>
                        <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3 text-gray-400">{user.email}</td>

                    {/* Joined */}
                    <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(user.createdAt)}</td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full uppercase ${
                        user.status === 'active'
                          ? 'bg-green-900/30 text-green-400'
                          : user.status === 'suspended'
                          ? 'bg-red-900/30 text-red-400'
                          : 'bg-yellow-900/30 text-yellow-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(user._id, user.status, `${user.firstName} ${user.lastName}`)}
                        className={`text-xs uppercase tracking-wider transition-colors ${
                          user.status === 'active'
                            ? 'text-red-400 hover:text-red-300'
                            : 'text-green-400 hover:text-green-300'
                        }`}
                      >
                        {user.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Customers;