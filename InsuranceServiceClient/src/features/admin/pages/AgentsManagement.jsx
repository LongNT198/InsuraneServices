import { useState, useEffect } from "react";
import {
  Search,
  UserPlus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Star,
  TrendingUp,
  AlertCircle,
  Loader,
} from "lucide-react";
import adminService from "../../shared/api/services/adminService";

export function AgentsManagement() {
  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getAllAgents();
      setAgents(response.data || []);
    } catch (err) {
      console.error("Error fetching agents:", err);
      setError(err.message || "Failed to load agents");
      setAgents(getMockAgents());
    } finally {
      setLoading(false);
    }
  };

  const getMockAgents = () => [
    {
      id: "AGT-001",
      name: "Nguyễn Minh A",
      email: "minha@agency.com",
      phone: "0911234567",
      location: "Hà Nội",
      clients: 45,
      policies: 128,
      revenue: "450,000,000",
      rating: 4.8,
      status: "active",
      joinDate: "2023-01-15",
    },
    {
      id: "AGT-002",
      name: "Trần Văn B",
      email: "vanb@agency.com",
      phone: "0912345678",
      location: "Hồ Chí Minh",
      clients: 52,
      policies: 145,
      revenue: "520,000,000",
      rating: 4.9,
      status: "active",
      joinDate: "2023-02-20",
    },
    {
      id: "AGT-003",
      name: "Lê Thị C",
      email: "thic@agency.com",
      phone: "0913456789",
      location: "Đà Nẵng",
      clients: 38,
      policies: 95,
      revenue: "380,000,000",
      rating: 4.6,
      status: "active",
      joinDate: "2023-03-10",
    },
    {
      id: "AGT-004",
      name: "Phạm Văn D",
      email: "vand@agency.com",
      phone: "0914567890",
      location: "Hải Phòng",
      clients: 25,
      policies: 68,
      revenue: "250,000,000",
      rating: 4.4,
      status: "inactive",
      joinDate: "2023-05-12",
    },
    {
      id: "AGT-005",
      name: "Hoàng Thị E",
      email: "thie@agency.com",
      phone: "0915678901",
      location: "Cần Thơ",
      clients: 42,
      policies: 112,
      revenue: "420,000,000",
      rating: 4.7,
      status: "active",
      joinDate: "2023-06-18",
    },
  ];

  const handleDeactivateAgent = async (agentId) => {
    if (window.confirm("Are you sure you want to deactivate this agent?")) {
      setActionLoading(true);
      try {
        // Implement deactivation API call
        await fetchAgents();
        setSelectedAgent(null);
      } catch (err) {
        console.error("Error deactivating agent:", err);
        setAgents((prev) =>
          prev.map((a) => (a.id === agentId ? { ...a, status: "inactive" } : a))
        );
      } finally {
        setActionLoading(false);
      }
    }
  };

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: agents.length,
    active: agents.filter((a) => a.status === "active").length,
    totalClients: agents.reduce((sum, a) => sum + a.clients, 0),
    totalRevenue: agents.reduce(
      (sum, a) => sum + parseInt(a.revenue.replace(/,/g, "")),
      0
    ),
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <p className="text-red-800 font-medium">Error Loading Data</p>
            <p className="text-red-600 text-sm">{error}</p>
            <p className="text-red-600 text-sm">Showing temporary data...</p>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 mb-2">Agents Management</h1>
              <p className="text-gray-600">
                Manage agent team and their performance
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <UserPlus className="w-5 h-5" />
              Add New Agent
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Total Agents</p>
              <p className="text-2xl text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl text-green-600 mt-1">{stats.active}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Total Clients</p>
              <p className="text-2xl text-blue-600 mt-1">
                {stats.totalClients}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl text-purple-600 mt-1">
                {(stats.totalRevenue / 1000000000).toFixed(1)}B VNĐ
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search agents by name, email or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No agents found</p>
              </div>
            ) : (
              filteredAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-gray-900">{agent.name}</h3>
                        <p className="text-xs text-gray-500">{agent.id}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setSelectedAgent(
                            selectedAgent === agent.id ? null : agent.id
                          )
                        }
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                      {selectedAgent === agent.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10">
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="text-gray-400">📧</span>
                      {agent.email}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="text-gray-400">📱</span>
                      {agent.phone}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="text-gray-400">📍</span>
                      {agent.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(agent.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      {agent.rating}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Khách Hàng</p>
                      <p className="text-gray-900">{agent.clients}</p>
                    </div>
                    <div className="text-center border-x border-gray-200">
                      <p className="text-sm text-gray-600">Chính Sách</p>
                      <p className="text-gray-900">{agent.policies}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Doanh Thu</p>
                      <p className="text-gray-900">
                        {(
                          parseInt(agent.revenue.replace(/,/g, "")) / 1000000
                        ).toFixed(0)}
                        M
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        agent.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {agent.status === "active"
                        ? "Active"
                        : "Inactive"}
                    </span>
                    <p className="text-xs text-gray-500">
                      Joined: {agent.joinDate}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h2 className="text-gray-900">Top Performers This Month</h2>
            </div>
            <div className="space-y-4">
              {agents
                .sort(
                  (a, b) =>
                    parseInt(b.revenue.replace(/,/g, "")) -
                    parseInt(a.revenue.replace(/,/g, ""))
                )
                .slice(0, 3)
                .map((agent, index) => (
                  <div
                    key={agent.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : "bg-orange-400"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{agent.name}</p>
                      <p className="text-sm text-gray-600">{agent.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900">{agent.revenue} VN Đ</p>
                      <p className="text-sm text-gray-600">
                        {agent.clients} clients
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
