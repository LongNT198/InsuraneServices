import { useEffect, useState } from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  ArrowUp,
  ArrowDown,
  Loader,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import adminService from "../../shared/api/services/adminService";

const mockMonthlyGrowth = [
  { month: "T1", users: 850, policies: 210, revenue: 180 },
  { month: "T2", users: 920, policies: 245, revenue: 220 },
  { month: "T3", users: 1050, policies: 290, revenue: 265 },
  { month: "T4", users: 1180, policies: 325, revenue: 295 },
  { month: "T5", users: 1350, policies: 380, revenue: 340 },
  { month: "T6", users: 1520, policies: 450, revenue: 410 },
];

const mockPolicyDistribution = [
  { name: "Life", value: 45, color: "#3b82f6" },
  { name: "Health", value: 30, color: "#10b981" },
  { name: "Auto", value: 15, color: "#f59e0b" },
  { name: "Home", value: 10, color: "#8b5cf6" },
];

const mockAgeDistribution = [
  { range: "18-25", count: 280 },
  { range: "26-35", count: 520 },
  { range: "36-45", count: 680 },
  { range: "46-55", count: 420 },
  { range: "56+", count: 180 },
];

const mockClaimsByMonth = [
  { month: "T1", claims: 45, approved: 38, rejected: 7 },
  { month: "T2", claims: 52, approved: 44, rejected: 8 },
  { month: "T3", claims: 48, approved: 41, rejected: 7 },
  { month: "T4", claims: 61, approved: 52, rejected: 9 },
  { month: "T5", claims: 55, approved: 47, rejected: 8 },
  { month: "T6", claims: 58, approved: 50, rejected: 8 },
];

export function Analytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [monthlyGrowth, setMonthlyGrowth] = useState(mockMonthlyGrowth);
  const [policyDistribution, setPolicyDistribution] = useState(
    mockPolicyDistribution
  );
  const [ageDistribution, setAgeDistribution] = useState(mockAgeDistribution);
  const [claimsByMonth, setClaimsByMonth] = useState(mockClaimsByMonth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch analytics data
      const response = await adminService.getDashboardData();
      const data = response.data || response;
      setAnalyticsData(data);

      // Update charts with real data if available
      if (data.monthlyGrowth && data.monthlyGrowth.length > 0) {
        setMonthlyGrowth(data.monthlyGrowth);
      }
      if (data.policyDistribution && data.policyDistribution.length > 0) {
        setPolicyDistribution(data.policyDistribution);
      }
      if (data.ageDistribution && data.ageDistribution.length > 0) {
        setAgeDistribution(data.ageDistribution);
      }
      if (data.claimsByMonth && data.claimsByMonth.length > 0) {
        setClaimsByMonth(data.claimsByMonth);
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(err.message);
      // Keep using mock data
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error && !analyticsData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-red-800 font-semibold">
            Error loading analytics
          </h3>
          <p className="text-red-700 text-sm mt-1">{error}</p>
          <p className="text-red-600 text-sm mt-2">Displaying sample data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Analytics & Reports</h1>
        <p className="text-gray-600">
          Detailed statistics on performance and business trends
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <ArrowUp className="w-4 h-4" />
              <span>+15.3%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">Tăng Trưởng Người Dùng</p>
          <p className="text-2xl text-gray-900 mt-1">1,520</p>
          <p className="text-xs text-gray-500 mt-1">So với tháng trước</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <ArrowUp className="w-4 h-4" />
              <span>+18.5%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">Chính Sách Mới</p>
          <p className="text-2xl text-gray-900 mt-1">450</p>
          <p className="text-xs text-gray-500 mt-1">Tháng này</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <ArrowUp className="w-4 h-4" />
              <span>+20.6%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">Doanh Thu</p>
          <p className="text-2xl text-gray-900 mt-1">410M VNĐ</p>
          <p className="text-xs text-gray-500 mt-1">Tháng này</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex items-center gap-1 text-red-600 text-sm">
              <ArrowDown className="w-4 h-4" />
              <span>-3.2%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">Tỷ Lệ Chuyển Đổi</p>
          <p className="text-2xl text-gray-900 mt-1">24.8%</p>
          <p className="text-xs text-gray-500 mt-1">So với tháng trước</p>
        </div>
      </div>

      {/* Growth Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-gray-900 mb-6">Xu Hướng Tăng Trưởng 6 Tháng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="users"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
                name="Người Dùng"
              />
              <Area
                type="monotone"
                dataKey="policies"
                stackId="2"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
                name="Chính Sách"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-gray-900 mb-6">Doanh Thu Theo Tháng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8b5cf6"
                strokeWidth={3}
                name="Doanh Thu (Triệu VNĐ)"
                dot={{ fill: "#8b5cf6", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-gray-900 mb-6">Phân Bổ Loại Chính Sách</h2>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={policyDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {policyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {policyDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">
                  {item.name}: {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-gray-900 mb-6">Phân Bổ Theo Độ Tuổi</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="range" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Số Lượng Khách Hàng" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Claims Analysis */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-gray-900 mb-6">Phân Tích Yêu Cầu Bồi Thường</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={claimsByMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Legend />
            <Bar dataKey="claims" fill="#6b7280" name="Tổng Yêu Cầu" />
            <Bar dataKey="approved" fill="#10b981" name="Đã Duyệt" />
            <Bar dataKey="rejected" fill="#ef4444" name="Từ Chối" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <p className="text-blue-100">Tổng Khách Hàng</p>
          <p className="text-3xl mt-2">1,520</p>
          <p className="text-sm text-blue-100 mt-2">+228 trong tháng này</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl">
          <p className="text-green-100">Tổng Chính Sách</p>
          <p className="text-3xl mt-2">3,842</p>
          <p className="text-sm text-green-100 mt-2">+450 trong tháng này</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl">
          <p className="text-purple-100">Tổng Doanh Thu</p>
          <p className="text-3xl mt-2">2.4B VNĐ</p>
          <p className="text-sm text-purple-100 mt-2">+410M trong tháng này</p>
        </div>
      </div>
    </div>
  );
}
