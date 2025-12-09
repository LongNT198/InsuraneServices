import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  ArrowUp, 
  ArrowDown,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const stats = [
  { 
    title: 'Total Users', 
    value: '12,458', 
    change: '+12.5%', 
    trend: 'up', 
    icon: Users,
    color: 'bg-blue-500'
  },
  { 
    title: 'Active Policies', 
    value: '3,842', 
    change: '+8.2%', 
    trend: 'up', 
    icon: FileText,
    color: 'bg-green-500'
  },
  { 
    title: 'This Month Revenue', 
    value: '$2.4M', 
    change: '+23.1%', 
    trend: 'up', 
    icon: DollarSign,
    color: 'bg-purple-500'
  },
  { 
    title: 'Growth Rate', 
    value: '18.6%', 
    change: '-2.4%', 
    trend: 'down', 
    icon: TrendingUp,
    color: 'bg-orange-500'
  },
];

const revenueData = [
  { month: 'T1', revenue: 1.2, policies: 280 },
  { month: 'T2', revenue: 1.5, policies: 320 },
  { month: 'T3', revenue: 1.8, policies: 380 },
  { month: 'T4', revenue: 1.6, policies: 340 },
  { month: 'T5', revenue: 2.1, policies: 420 },
  { month: 'T6', revenue: 2.4, policies: 480 },
];

const policyTypeData = [
  { name: 'Life', value: 45, color: '#3b82f6' },
  { name: 'Health', value: 30, color: '#10b981' },
  { name: 'Auto', value: 15, color: '#f59e0b' },
  { name: 'Home', value: 10, color: '#8b5cf6' },
];

const recentClaims = [
  { id: 'CLM-001', user: 'John Smith', type: 'Health', amount: '$25,000', status: 'pending', date: '2025-12-01' },
  { id: 'CLM-002', user: 'Jane Doe', type: 'Auto', amount: '$15,000', status: 'approved', date: '2025-11-30' },
  { id: 'CLM-003', user: 'Mike Johnson', type: 'Life', amount: '$50,000', status: 'pending', date: '2025-11-29' },
  { id: 'CLM-004', user: 'Sarah Wilson', type: 'Home', amount: '$30,000', status: 'rejected', date: '2025-11-28' },
  { id: 'CLM-005', user: 'Tom Brown', type: 'Health', amount: '$12,000', status: 'approved', date: '2025-11-27' },
];

export function Overview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your insurance system.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue & Policies (6 Months)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Revenue (Million $)"
              />
              <Line 
                type="monotone" 
                dataKey="policies" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Policies"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Policy Types Pie Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Policy Types Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={policyTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {policyTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Claims Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Claims</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{claim.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{claim.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{claim.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {claim.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3" />
                        Processing
                      </span>
                    )}
                    {claim.status === 'approved' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3" />
                        Approved
                      </span>
                    )}
                    {claim.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3" />
                        Rejected
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{claim.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
