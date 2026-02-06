import { useState, useEffect } from 'react';
import { colors } from '../theme/colors';
import apiClient from '../utils/api';

const AdminDashboard = ({ token }) => {
  const [allOTs, setAllOTs] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    teamId: '',
    userId: '',
  });
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchAdminStats();
    fetchTeams();
    fetchUsers();
    fetchAllOTs();
  }, []);

  useEffect(() => {
    fetchAllOTs();
  }, [filters]);

  const fetchAdminStats = async () => {
    try {
      const response = await apiClient.get('/ot-requests/admin/stats');
      setAdminStats(response.data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await apiClient.get('/ot-requests/teams/list');
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/ot-requests/users/list');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAllOTs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.teamId) params.append('teamId', filters.teamId);
      if (filters.userId) params.append('userId', filters.userId);

      const response = await apiClient.get(
        `/ot-requests/admin/all?${params.toString()}`
      );
      setAllOTs(response.data);
    } catch (error) {
      console.error('Error fetching OTs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      OPEN: '#FF9800',
      IN_PROGRESS: '#E91E63',
      CLOSED: '#4CAF50',
      REJECTED: '#F44336',
    };
    return colors[status] || '#9E9E9E';
  };

  return (
    <div className="w-full">
      {/* Stats Cards */}
      {adminStats && (
        <div className="mb-8 p-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.secondary[500] }}>
            Global Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-md">
              <p className="text-sm text-gray-600 font-semibold">Total OTs</p>
              <p className="text-3xl font-bold" style={{ color: colors.secondary[500] }}>
                {adminStats.global.total}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <p className="text-sm text-gray-600 font-semibold">Open</p>
              <p className="text-3xl font-bold text-orange-600">{adminStats.global.open}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <p className="text-sm text-gray-600 font-semibold">In Progress</p>
              <p className="text-3xl font-bold text-pink-600">{adminStats.global.inProgress}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <p className="text-sm text-gray-600 font-semibold">Closed</p>
              <p className="text-3xl font-bold text-green-600">{adminStats.global.closed}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <p className="text-sm text-gray-600 font-semibold">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{adminStats.global.rejected}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 p-4 rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="p-2 border rounded-lg"
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CLOSED">Closed</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={filters.teamId}
            onChange={(e) => setFilters({ ...filters, teamId: e.target.value })}
            className="p-2 border rounded-lg"
          >
            <option value="">All Teams</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          <select
            value={filters.userId}
            onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
            className="p-2 border rounded-lg"
          >
            <option value="">All Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* OTs List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          All OTs ({allOTs.length})
        </h3>
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : allOTs.length === 0 ? (
          <p className="text-center text-gray-600">No OTs found</p>
        ) : (
          <div className="space-y-3">
            {allOTs.map((ot) => (
              <div
                key={ot.id}
                className="p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{ot.title}</h4>
                    <p className="text-sm text-gray-600">
                      Lot: <span className="font-mono">{ot.lotNumber}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Creator: {ot.creator?.name} ({ot.creator?.team?.name})
                    </p>
                  </div>
                  <span
                    className="px-4 py-1 rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: getStatusBadgeColor(ot.status) }}
                  >
                    {ot.status}
                  </span>
                </div>
                {ot.comment && <p className="text-sm text-gray-700 italic mb-2">"{ot.comment}"</p>}
                <div className="flex gap-2 flex-wrap text-xs text-gray-500">
                  <span>Created: {new Date(ot.createdAt).toLocaleDateString()}</span>
                  {ot.intervenants?.length > 0 && (
                    <span>
                      Intervenants: {ot.intervenants.map((i) => i.user?.name).join(', ')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
